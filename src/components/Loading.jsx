import { Loader2 } from "lucide-react";
import { classNames } from "@/lib/utils";
export default function Loading({
  label = "লোড হচ্ছে…",
  size = "md",
  className,
}) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-2 text-ink-500",
        className,
      )}
      role="status"
    >
      <Loader2
        className={classNames(
          "animate-spin",
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
        )}
        aria-hidden="true"
      />
      <span className={size === "sm" ? "text-sm" : "text-[15px]"}>{label}</span>
    </span>
  );
}
