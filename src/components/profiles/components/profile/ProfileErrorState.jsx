import { CloudOff, RefreshCw } from "lucide-react";
import { useProfile } from "@/components/profiles/hooks/useProfile";

/** Clean error state with retry when the profile request fails. */
export default function ProfileErrorState() {
  const { reload } = useProfile();
  return (
    <div className="animate-rise-in flex justify-center py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white px-6 py-12 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-20px_rgba(244,63,94,0.2)]">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 ring-1 ring-inset ring-rose-100">
          <CloudOff className="size-7" strokeWidth={1.9} />
        </span>
        <h2 className="mt-5 text-lg font-bold text-slate-800">
          প্রোফাইল তথ্য লোড করা যায়নি
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
          সংযোগে সাময়িক সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।
        </p>
        <button
          type="button"
          onClick={reload}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-teal-600 to-cyan-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-700/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/30"
        >
          <RefreshCw className="size-4" strokeWidth={2.3} />
          আবার চেষ্টা করুন
        </button>
      </div>
    </div>
  );
}
