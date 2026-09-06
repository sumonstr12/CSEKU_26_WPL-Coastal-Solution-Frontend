import { CircleCheck, ClipboardCheck, Plus } from "lucide-react";
import { FIELD_META, ROLE_CONFIG } from "@/components/profiles/config/roleConfig";
import { useProfile } from "@/components/profiles/hooks/useProfile";
import { isFieldEmpty, resolveFieldValue } from "@/components/profiles/lib/fields";
import { toBanglaDigits } from "@/components/profiles/lib/bn";
import { cn } from "@/components/profiles/lib/utils";
export default function ProfileCompletion({ user }) {
  const { openEdit } = useProfile();
  const fields = ROLE_CONFIG[user.role].completionFields;
  const missing = fields.filter((key) =>
    isFieldEmpty(key, resolveFieldValue(user, key)),
  );
  const filled = fields.length - missing.length;
  const percent =
    fields.length === 0 ? 100 : Math.round((filled / fields.length) * 100);
  const complete = percent >= 100;
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_30px_-16px_rgba(13,148,136,0.18)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
          <ClipboardCheck className="size-5 text-teal-600" strokeWidth={2.1} />
          প্রোফাইল সম্পূর্ণতা
        </h2>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset",
            complete
              ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
              : "bg-teal-50 text-teal-700 ring-teal-200",
          )}
        >
          {toBanglaDigits(percent)}%
        </span>
      </div>

      <div
        className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            complete
              ? "bg-linear-to-r from-emerald-500 to-teal-500"
              : "bg-linear-to-r from-teal-500 via-cyan-500 to-blue-600",
          )}
          style={{
            width: `${percent}%`,
          }}
        />
      </div>

      {complete ? (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50/80 px-3.5 py-3 text-[13px] font-medium leading-relaxed text-emerald-800 ring-1 ring-inset ring-emerald-100">
          <CircleCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          আপনার প্রোফাইল সম্পূর্ণ হয়েছে। ধন্যবাদ!
        </p>
      ) : (
        <>
          <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
            আপনার প্রোফাইলে আরও কিছু তথ্য যোগ করুন — সম্পূর্ণ প্রোফাইল জরুরি
            মুহূর্তে দ্রুত সমন্বয়ে সাহায্য করে।
          </p>
          <ul className="mt-3 space-y-2">
            {missing.slice(0, 3).map((key) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={openEdit}
                  className="group flex w-full items-center gap-2 rounded-xl border border-dashed border-slate-200 px-3 py-2 text-left text-[13px] font-medium text-slate-600 transition-colors hover:border-teal-300 hover:bg-teal-50/60 hover:text-teal-800"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-teal-100 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                    <Plus className="size-3" strokeWidth={2.6} />
                  </span>
                  {FIELD_META[key].label} যোগ করুন
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
