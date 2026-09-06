function Line({ className }) {
  return (
    <span
      className={`block animate-pulse rounded-full bg-slate-200 ${className}`}
    />
  );
}
function SkeletonCard({ rows = 4 }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
      <div className="flex items-center gap-3.5 border-b border-slate-100 px-5 py-4 sm:px-7 sm:py-5">
        <span className="size-10 animate-pulse rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <Line className="h-3.5 w-36" />
          <Line className="h-2.5 w-52 bg-slate-200/70" />
        </div>
      </div>
      <div className="grid gap-x-6 gap-y-6 px-5 py-5 sm:grid-cols-2 sm:px-7 sm:py-6">
        {Array.from({
          length: rows,
        }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Line className="h-2.5 w-20 bg-slate-200/80" />
            <Line className="h-3.5 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Placeholder layout shown while the profile request is in flight. */
export default function ProfileSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="প্রোফাইল লোড হচ্ছে"
      className="animate-fade-in"
    >
      {/* Header skeleton */}
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white">
        <div className="relative h-32 animate-pulse bg-linear-to-r from-slate-200 via-slate-200/80 to-slate-200 sm:h-40" />
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end">
            <span className="size-24 shrink-0 animate-pulse rounded-full bg-slate-200 ring-4 ring-white sm:size-28" />
            <div className="flex-1 space-y-2.5 pb-1">
              <Line className="h-5 w-48" />
              <div className="flex gap-2">
                <Line className="h-5 w-28 rounded-full" />
                <Line className="h-5 w-24 rounded-full" />
              </div>
              <Line className="h-3 w-36 bg-slate-200/70" />
            </div>
            <Line className="h-11 w-40 rounded-2xl" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SkeletonCard rows={4} />
          <SkeletonCard rows={2} />
          <SkeletonCard rows={2} />
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <Line className="h-4 w-36" />
              <Line className="h-6 w-12 rounded-full" />
            </div>
            <Line className="mt-4 h-2.5 w-full" />
            <div className="mt-4 space-y-2.5">
              <Line className="h-9 w-full rounded-xl bg-slate-200/70" />
              <Line className="h-9 w-full rounded-xl bg-slate-200/70" />
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6">
            <Line className="h-4 w-32" />
            <div className="mt-4 space-y-2.5">
              <Line className="h-3 w-full bg-slate-200/70" />
              <Line className="h-3 w-5/6 bg-slate-200/70" />
              <Line className="h-3 w-4/6 bg-slate-200/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
