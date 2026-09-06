import { CircleAlert, RefreshCw } from "lucide-react";
import { cn } from "../../utils/cn.js";

/** API failure state — never crashes the whole dashboard */
export default function ErrorState({ title = "তথ্য লোড করা যায়নি", message = "দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।", onRetry, className, fullPage }) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", fullPage && "min-h-[60vh]", className)}>
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-400">
        <CircleAlert size={30} strokeWidth={1.8} />
      </span>
      <h3 className="mt-4 text-[15px] font-bold text-slate-700">{title}</h3>
      <p className="mt-1 max-w-sm text-[13px] text-slate-400">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-5">
          <RefreshCw size={15} />
          আবার চেষ্টা করুন
        </button>
      )}
    </div>
  );
}
