import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared page furniture for every /admin screen, so titles, cards and tables
 * read the same wherever the user lands.
 */

/** Page title row: one h1, one line of context, actions on the right. */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between print:hidden", className)}>
      <div className="min-w-0 max-w-3xl">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">{actions}</div>}
    </header>
  );
}

/** The one card surface. Pass a title for a headed card, or none for a bare surface. */
export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-gray-100 bg-white p-5 shadow-sm", className)}>
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h2 className="text-base font-bold tracking-tight text-gray-900">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

/**
 * Surface for a table. Header (title, search, filters) sits above the rows and
 * is separated from them by a hairline; the table scrolls inside the card.
 */
export function TableCard({
  title,
  description,
  actions,
  children,
  footer,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm", className)}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-base font-bold tracking-tight text-gray-900">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
      {footer && <div className="border-t border-gray-100 px-5 py-3">{footer}</div>}
    </section>
  );
}

/** Class strings for plain <table> markup that cannot use components/ui/table. */
export const tableClass = "w-full text-left text-sm";
export const theadClass = "bg-gray-50/70";
export const thClass = "h-11 px-4 text-left align-middle text-[11px] font-bold uppercase tracking-wider text-gray-500 whitespace-nowrap";
export const trClass = "border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50/60";
export const tdClass = "px-4 py-3 align-middle text-sm text-gray-700";
