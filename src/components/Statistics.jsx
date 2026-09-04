import { TONE_BOX } from "@/components/statTones";
import { classNames } from "@/lib/utils";
export default function Statistics({ items, className }) {
  return (
    <div
      className={classNames("grid grid-cols-2 gap-3", className)}
      role="list"
    >
      {items.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            role="listitem"
            className="card flex items-center gap-3 p-4"
          >
            <span
              className={classNames(
                "grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ring-inset",
                TONE_BOX[stat.tone],
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="font-display block text-[22px] leading-none font-bold text-ink-950">
                {stat.value}
              </span>
              <span className="mt-1 block text-[12px] leading-snug font-medium text-ink-500">
                {stat.label}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
