import { LogOut, TriangleAlert } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { cn } from "../../utils/cn.js";

/** Compact modal confirmation — used for logout & destructive actions */
export default function ConfirmDialog({ open, title, message, confirmLabel = "নিশ্চিত করুন", cancelLabel = "বাতিল", tone = "danger", onConfirm, onCancel }) {
  const ref = useClickOutside(onCancel, open);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
      <div className="absolute inset-0 animate-fade-in bg-lagoon-950/40 backdrop-blur-[3px]" onClick={onCancel} />
      <div ref={ref} className="relative w-full max-w-sm animate-pop-in rounded-2xl border border-slate-200 bg-white p-6 shadow-lift">
        <div className="flex items-start gap-4">
          <span className={cn("inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", tone === "danger" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600")}>
            {tone === "danger" ? <LogOut size={20} /> : <TriangleAlert size={20} />}
          </span>
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-slate-800">{title}</h3>
            {message && <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{message}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button onClick={onCancel} className="btn-secondary px-4 py-2">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={cn("btn px-4 py-2 text-white shadow-sm active:scale-[0.98]", tone === "danger" ? "bg-red-500 hover:bg-red-600 shadow-red-500/25" : "bg-amber-500 hover:bg-amber-600")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
