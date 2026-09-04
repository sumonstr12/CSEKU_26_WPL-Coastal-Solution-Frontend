import { Shield, Waves } from "lucide-react";
import { SITE } from "@/data/site";
import { classNames } from "@/lib/utils";
export default function Logo({ light = false, compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-700 text-white shadow-sm">
        <Waves className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
        <span className="absolute -right-1 -bottom-1 grid h-4 w-4 place-items-center rounded-full bg-white ring-2 ring-white">
          <Shield
            className="h-2.5 w-2.5 text-amber-600"
            strokeWidth={3}
            aria-hidden="true"
          />
        </span>
      </span>
      <span className="leading-tight">
        <span
          className={classNames(
            "block text-[17px] font-bold tracking-tight",
            light ? "text-white" : "text-ink-900",
          )}
        >
          {SITE.name.split(" ")[0]}
          <span className="text-teal-600 dark:text-amber-400"> </span>
          <span className={light ? "text-amber-300" : "text-teal-700"}>BD</span>
        </span>
        {!compact && (
          <span
            className={classNames(
              "block text-[10.5px] font-medium",
              light ? "text-teal-100/80" : "text-ink-500",
            )}
          >
            উপকূলীয় দুর্যোগ ব্যবস্থাপনা প্ল্যাটফর্ম
          </span>
        )}
      </span>
    </span>
  );
}
