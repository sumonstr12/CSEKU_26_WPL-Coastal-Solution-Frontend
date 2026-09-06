import { RESPONDER_STATUS_UI, VOLUNTEER_STATUS_UI } from "@/components/profiles/config/roleConfig";
import { cn } from "@/components/profiles/lib/utils";
/** Availability badge — color + text (never color alone). */
export default function StatusBadge({ status, role, size = "md", className }) {
  const ui =
    role === "RESPONDER"
      ? RESPONDER_STATUS_UI[status]
      : VOLUNTEER_STATUS_UI[status];
  if (!ui) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-slate-100 font-semibold text-slate-600 ring-1 ring-inset ring-slate-200",
          size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
          className,
        )}
      >
        <span className="size-1.5 rounded-full bg-slate-400" />
        {status}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset",
        ui.classes,
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", ui.dot)} />
      {ui.label}
    </span>
  );
}
