import { useEffect } from "react";
import { X } from "lucide-react";
import { classNames } from "@/lib/utils";
export default function Modal({
  open,
  onClose,
  children,
  label,
  wide = false,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        type="button"
        aria-label="মোডাল বন্ধ করুন"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink-950/45 backdrop-blur-[3px]"
      />
      <div
        className={classNames(
          "relative z-10 max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:m-4 sm:rounded-2xl",
          wide ? "sm:max-w-3xl" : "sm:max-w-xl",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="বন্ধ করুন"
          className="absolute top-3 right-3 z-20 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white text-ink-700 shadow-md ring-1 ring-black/5 transition hover:bg-sand-100"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
