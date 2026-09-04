import { classNames } from "@/lib/utils";
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  children,
}) {
  return (
    <div
      className={classNames(
        "flex flex-wrap items-end justify-between gap-4",
        align === "center" && "flex-col items-center text-center",
        className,
      )}
    >
      <div
        className={classNames(
          "max-w-2xl",
          align === "center" && "flex flex-col items-center",
        )}
      >
        {eyebrow && (
          <p className="mb-2 inline-flex items-center gap-2 text-[13px] font-bold tracking-wide text-teal-700">
            <span className="h-px w-6 bg-teal-600" aria-hidden="true" />
            {eyebrow}
            {align === "center" && (
              <span className="h-px w-6 bg-teal-600" aria-hidden="true" />
            )}
          </p>
        )}
        <h2 className="font-display text-[26px] leading-snug font-bold text-ink-950 md:text-[30px]">
          {title}
        </h2>
        {description && (
          <p className="mt-2.5 text-[15px] leading-relaxed text-ink-500">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
