import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn.js";

/** Section wrapper — consistent card chrome for every dashboard block */
export default function Panel({ title, subtitle, icon: Icon, action, children, className, bodyClassName, noPadding }) {
  return (
    <section className={cn("card overflow-hidden", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {Icon && (
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lagoon-50 text-lagoon-600">
                <Icon size={17} />
              </span>
            )}
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-bold text-slate-800">{title}</h3>
              {subtitle && <p className="truncate text-xs text-slate-400">{subtitle}</p>}
            </div>
          </div>
          {action}
        </header>
      )}
      <div className={cn(noPadding ? "" : "p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/** Dashboard page heading block */
export function PageHeader({ title, subtitle, children, crumbs }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {crumbs && <p className="mb-1 text-xs font-medium text-slate-400">{crumbs}</p>}
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

/** Small "see all" link for panel headers */
export function SeeAllLink({ to, label = "সব দেখুন", onClick }) {
  const cls = "group inline-flex items-center gap-1 text-xs font-semibold text-lagoon-600 hover:text-lagoon-700";
  const inner = (
    <>
      {label}
      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
    </>
  );
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  return (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
