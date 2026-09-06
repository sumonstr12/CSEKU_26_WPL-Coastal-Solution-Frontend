import { cn } from "../../utils/cn.js";

/* ---- Shimmer skeletons for every dashboard loading state ---- */

export function StatCardSkeleton() {
  return (
    <div className="card flex flex-col gap-3 p-4">
      <div className="skeleton h-10 w-10 rounded-xl" />
      <div className="space-y-2">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-7 w-16" />
      </div>
      <div className="skeleton h-3 w-32" />
    </div>
  );
}

export function StatGridSkeleton({ count = 4, className }) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function AlertSkeleton() {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className="skeleton h-12 w-12 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-56" />
        <div className="skeleton h-3 w-80 max-w-full" />
      </div>
      <div className="skeleton h-9 w-28 rounded-xl" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="skeleton h-5 w-44" />
      </div>
      <div className="space-y-0 px-5 py-3">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 border-b border-slate-50 py-3.5 last:border-0">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className={cn("skeleton h-4", c === 0 ? "w-10 rounded-lg" : "flex-1 max-w-[140px]")} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PanelSkeleton({ lines = 4 }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4">
        <div className="skeleton h-8 w-8 rounded-lg" />
        <div className="skeleton h-5 w-40" />
      </div>
      <div className="space-y-3 p-5">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="skeleton h-9 w-9 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Full overview-page loading state */
export function DashboardSkeleton({ statCount = 4 }) {
  return (
    <div className="space-y-5">
      <div className="space-y-2 py-1">
        <div className="skeleton h-7 w-72 max-w-full" />
        <div className="skeleton h-4 w-96 max-w-full" />
      </div>
      <StatGridSkeleton count={statCount} />
      <AlertSkeleton />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TableSkeleton rows={4} />
        </div>
        <PanelSkeleton />
      </div>
    </div>
  );
}
