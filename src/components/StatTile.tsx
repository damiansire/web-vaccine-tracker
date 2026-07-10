import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: string | undefined;
  className?: string;
}

/** KPI chico: figura en mono tabular + etiqueta. Única forma de mostrar un
 * número destacado en toda la app — no inventar una variante por página. */
export function StatTile({ label, value, hint, className }: StatTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border border-border bg-surface/60 px-4 py-3",
        className,
      )}
    >
      <span className="text-xs tracking-wide text-muted-foreground uppercase">{label}</span>
      <span className="tabular text-2xl leading-none font-medium text-foreground">{value}</span>
      {hint ? <span className="text-xs text-ink-muted">{hint}</span> : null}
    </div>
  );
}
