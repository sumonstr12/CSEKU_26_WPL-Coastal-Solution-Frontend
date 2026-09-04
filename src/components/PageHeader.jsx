import Reveal from "@/components/Reveal";
import { classNames } from "@/lib/utils";
export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
  className,
}) {
  return (
    <div
      className={classNames(
        "bg-waves-pattern border-b border-black/5 bg-white",
        className,
      )}
    >
      <div className="site-container flex flex-col gap-6 py-10 md:flex-row md:items-end md:justify-between md:py-12">
        <Reveal className="max-w-2xl">
          <p className="mb-2 inline-flex items-center gap-2 text-[13px] font-bold tracking-wide text-teal-700">
            <span className="h-px w-6 bg-teal-600" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="font-display text-3xl leading-tight font-bold text-ink-950 md:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
              {description}
            </p>
          )}
        </Reveal>
        {children && (
          <Reveal delay={100} className="shrink-0">
            {children}
          </Reveal>
        )}
      </div>
    </div>
  );
}
