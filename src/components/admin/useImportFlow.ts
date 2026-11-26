"use client";

import { useCallback, useRef, useState } from "react";
import {
  buildErrorWorkbook,
  downloadWorkbook,
  readImportWorkbook,
  type FailedRow,
  type ImportConfig,
} from "@/lib/excel-import";
import {
  issueFromServerError,
  validateRows,
  type RegionOption,
  type ValidatedRow,
} from "@/lib/import-validation";

export type ImportStage = "idle" | "reading" | "review" | "importing" | "done";

export interface ImportState {
  stage: ImportStage;
  fileName: string;
  totalRows: number;
  valid: ValidatedRow[];
  invalid: ValidatedRow[];
  serverFailed: FailedRow[];
  /** Problems with the file as a whole (wrong template, no rows...). The import cannot go ahead. */
  blocking: string;
  notes: string[];
  progress: { done: number; total: number };
  imported: number;
}

const EMPTY: ImportState = {
  stage: "idle",
  fileName: "",
  totalRows: 0,
  valid: [],
  invalid: [],
  serverFailed: [],
  blocking: "",
  notes: [],
  progress: { done: 0, total: 0 },
  imported: 0,
};

interface Options {
  /** Built lazily so it always reflects the regions loaded by now. */
  getConfig: () => ImportConfig;
  regions?: RegionOption[];
  /** Used for the name of the error file. */
  fileLabel: string;
  /** Rows sent per request. Each returned entry is an error message, or null when that row was saved. */
  batchSize: number;
  submit: (batch: ValidatedRow[]) => Promise<(string | null)[]>;
  onFinished?: () => void;
}

/** Read -> check every cell -> import the good rows -> hand back an Excel file with the bad ones. */
export function useImportFlow(options: Options) {
  const [state, setState] = useState<ImportState>(EMPTY);
  const optionsRef = useRef(options);
  optionsRef.current = options;
  // Latest state for callbacks that run after awaits.
  const stateRef = useRef(state);
  stateRef.current = state;

  const close = useCallback(() => setState(EMPTY), []);

  const openFile = useCallback(async (file: File) => {
    const { getConfig, regions } = optionsRef.current;
    setState({ ...EMPTY, stage: "reading", fileName: file.name });
    try {
      if (!/\.xlsx$/i.test(file.name)) {
        throw new Error("Please upload an Excel .xlsx file. Use the Template button to get the right one.");
      }
      const config = getConfig();
      const read = await readImportWorkbook(await file.arrayBuffer(), config);
      const notes: string[] = [];
      if (read.ignoredHeaders.length) notes.push(`Ignored columns that are not part of the template: ${read.ignoredHeaders.join(", ")}.`);
      if (read.truncated) notes.push("Only the first 2000 rows were read. Import the rest in a second file.");

      let blocking = "";
      if (read.missingRequired.length) {
        blocking = `The file has no "${read.missingRequired.join('", "')}" column. Download the latest Template and copy your data into it.`;
      } else if (read.rows.length === 0) {
        blocking = "No data rows found. Fill in the template starting from row 2.";
      }

      const checked = blocking ? [] : validateRows(config.columns, read.rows, { regions });
      setState({
        ...EMPTY,
        stage: "review",
        fileName: file.name,
        totalRows: read.rows.length,
        valid: checked.filter((r) => r.issues.length === 0),
        invalid: checked.filter((r) => r.issues.length > 0),
        blocking,
        notes,
      });
    } catch (err: any) {
      setState({ ...EMPTY, stage: "review", fileName: file.name, blocking: err?.message || "Could not read this file." });
    }
  }, []);

  const downloadErrors = useCallback(async (extra?: Partial<Pick<ImportState, "invalid" | "serverFailed" | "fileName">>) => {
    const { getConfig, fileLabel } = optionsRef.current;
    const current = extra ? { ...stateRef.current, ...extra } : stateRef.current;
    const failed: FailedRow[] = [
      ...current.invalid.map((r) => ({ row: r.row, issues: r.issues })),
      ...current.serverFailed,
    ].sort((a, b) => a.row.rowNumber - b.row.rowNumber);
    if (failed.length === 0) return;
    const wb = await buildErrorWorkbook(getConfig(), failed);
    const base = (current.fileName || fileLabel).replace(/\.xlsx$/i, "");
    await downloadWorkbook(wb, `${base}_errors.xlsx`);
  }, []);

  const importValid = useCallback(async () => {
    const { getConfig, batchSize, submit, onFinished } = optionsRef.current;
    const config = getConfig();
    const toSend = stateRef.current.valid;
    if (toSend.length === 0) return;

    setState((s) => ({ ...s, stage: "importing", progress: { done: 0, total: toSend.length }, imported: 0 }));
    const serverFailed: FailedRow[] = [];
    let imported = 0;

    for (let i = 0; i < toSend.length; i += batchSize) {
      const batch = toSend.slice(i, i + batchSize);
      let outcome: (string | null)[];
      try {
        outcome = await submit(batch);
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.response?.data?.error || (typeof err?.response?.data === "string" ? err.response.data : "") || err?.message || "Import failed.";
        outcome = batch.map(() => String(msg));
      }
      batch.forEach((item, idx) => {
        const message = outcome[idx];
        if (message) serverFailed.push({ row: item.row, issues: [issueFromServerError(config.columns, message)] });
        else imported += 1;
      });
      setState((s) => ({ ...s, progress: { done: Math.min(i + batch.length, toSend.length), total: toSend.length }, imported }));
    }

    const finalState = { ...stateRef.current, stage: "done" as ImportStage, serverFailed, imported, valid: [] as ValidatedRow[] };
    setState(finalState);
    onFinished?.();
    if (finalState.invalid.length + serverFailed.length > 0) {
      try {
        await downloadErrors({ serverFailed, invalid: finalState.invalid });
      } catch (err) {
        console.error("Could not build the error file", err);
      }
    }
  }, [downloadErrors]);

  return { state, openFile, importValid, downloadErrors, close };
}
