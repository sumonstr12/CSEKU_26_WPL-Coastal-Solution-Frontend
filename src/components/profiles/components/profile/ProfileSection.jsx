import { cn } from "@/components/profiles/lib/utils";
const TONES = {
  teal: "bg-teal-50 text-teal-700 ring-teal-100",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
};
export default function ProfileSection({
  title,
  icon: Icon,
  description,
  tone = "teal",
  children,
  className,
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(13,148,136,0.18)]",
        className,
      )}
    >
      <header className="flex items-center gap-3.5 border-b border-slate-100 px-5 py-4 sm:px-7 sm:py-5">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
            TONES[tone],
          )}
        >
          <Icon className="size-5" strokeWidth={2.1} />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-slate-800 sm:text-lg">
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-[13px]">
              {description}
            </p>
          ) : null}
        </div>
      </header>
      <div className="px-5 py-5 sm:px-7 sm:py-6">{children}</div>
    </section>
  );
}
