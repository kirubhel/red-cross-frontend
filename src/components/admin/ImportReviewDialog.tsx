"use client";

import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ImportState } from "./useImportFlow";

interface Props {
  state: ImportState;
  /** "members" / "volunteers", used in button text. */
  noun: string;
  onImportValid: () => void;
  onDownloadErrors: () => void;
  onClose: () => void;
}

const MAX_LISTED = 40;

function Stat({ value, label, tone }: { value: number; label: string; tone: "neutral" | "good" | "bad" }) {
  const tones = {
    neutral: "bg-gray-50 border-gray-200 text-gray-900",
    good: "bg-green-50 border-green-200 text-green-800",
    bad: "bg-red-50 border-red-200 text-red-800",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 ${tones[tone]}`}>
      <div className="text-2xl font-black leading-none">{value}</div>
      <div className="mt-1 text-[11px] font-bold uppercase tracking-wider opacity-70">{label}</div>
    </div>
  );
}

export function ImportReviewDialog({ state, noun, onImportValid, onDownloadErrors, onClose }: Props) {
  if (state.stage === "idle") return null;

  const { stage, valid, invalid, serverFailed, blocking } = state;
  const failedCount = invalid.length + serverFailed.length;
  const busy = stage === "reading" || stage === "importing";

  // One list for what to fix: the checks run before importing, then anything the server refused.
  const problems = [
    ...invalid.map((r) => ({ rowNumber: r.row.rowNumber, issues: r.issues })),
    ...serverFailed.map((r) => ({ rowNumber: r.row.rowNumber, issues: r.issues })),
  ].sort((a, b) => a.rowNumber - b.rowNumber);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="import-title">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-[#ED1C24]">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 id="import-title" className="text-lg font-black text-black">
                {stage === "done" ? "Import finished" : `Import ${noun}`}
              </h2>
              <p className="max-w-[320px] truncate text-xs font-semibold text-gray-500">{state.fileName}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={stage === "importing"} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-gray-50 disabled:opacity-40">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto p-5">
          {stage === "reading" && (
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" /> Reading and checking the file...
            </div>
          )}

          {blocking && (
            <div role="alert" className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{blocking}</span>
            </div>
          )}

          {!blocking && stage !== "reading" && (
            <div className="grid grid-cols-3 gap-3">
              <Stat value={state.totalRows} label="Rows read" tone="neutral" />
              <Stat value={stage === "done" ? state.imported : valid.length} label={stage === "done" ? "Imported" : "Ready to import"} tone="good" />
              <Stat value={failedCount} label="Need fixing" tone={failedCount ? "bad" : "neutral"} />
            </div>
          )}

          {stage === "importing" && (
            <div aria-live="polite">
              <div className="mb-1 flex justify-between text-xs font-bold text-gray-600">
                <span>Importing...</span>
                <span>
                  {state.progress.done} / {state.progress.total}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-[#ED1C24] transition-all" style={{ width: `${state.progress.total ? (state.progress.done / state.progress.total) * 100 : 0}%` }} />
              </div>
            </div>
          )}

          {stage === "done" && failedCount === 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-800">
              <CheckCircle2 className="h-4 w-4" /> All {state.imported} {noun} were imported.
            </div>
          )}

          {stage === "done" && failedCount > 0 && (
            <p className="text-sm font-semibold text-gray-700">
              An Excel file with the {failedCount} failed {failedCount === 1 ? "row" : "rows"} was downloaded. The wrong cells are shaded red and the reason is written next to each row. Fix them and upload that file again; the {state.imported} rows that worked are not in it.
            </p>
          )}

          {stage === "review" && !blocking && failedCount > 0 && (
            <p className="text-sm font-semibold text-gray-700">
              These rows have problems and will not be imported. Download the error file to see the wrong cells highlighted.
            </p>
          )}

          {problems.length > 0 && (
            <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 text-sm" aria-label="Rows to fix">
              {problems.slice(0, MAX_LISTED).map((p) => (
                <li key={p.rowNumber} className="flex gap-3 bg-white px-3 py-2.5">
                  <span className="mt-0.5 w-14 shrink-0 text-xs font-black uppercase tracking-wide text-[#ED1C24]">Row {p.rowNumber}</span>
                  <ul className="min-w-0 space-y-0.5">
                    {p.issues.map((issue, i) => (
                      <li key={i} className="text-gray-800">
                        {issue.column && <span className="font-bold">{issue.column}: </span>}
                        {issue.message}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
              {problems.length > MAX_LISTED && (
                <li className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-600">
                  + {problems.length - MAX_LISTED} more rows. All of them are in the error file.
                </li>
              )}
            </ul>
          )}

          {state.notes.map((note) => (
            <p key={note} className="text-xs font-semibold text-gray-500">
              {note}
            </p>
          ))}
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-gray-100 bg-gray-50/60 p-4">
          {failedCount > 0 && stage !== "reading" && stage !== "importing" && (
            <Button variant="outline" onClick={onDownloadErrors} className="h-10 gap-1.5 rounded-xl border-gray-200 text-xs font-bold">
              <Download className="h-3.5 w-3.5" /> Download error file
            </Button>
          )}
          {stage === "review" && !blocking && valid.length > 0 && (
            <Button onClick={onImportValid} disabled={busy} className="h-10 rounded-xl bg-[#ED1C24] text-xs font-bold text-white hover:bg-[#c8161d]">
              Import {valid.length} valid {valid.length === 1 ? "row" : "rows"}
            </Button>
          )}
          <Button variant="outline" onClick={onClose} disabled={stage === "importing"} className="h-10 rounded-xl border-gray-200 text-xs font-bold">
            {stage === "done" ? "Close" : "Cancel"}
          </Button>
        </div>
      </div>
    </div>
  );
}
