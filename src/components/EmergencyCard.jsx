import { Clock, PhoneCall } from "lucide-react";
import { classNames } from "@/lib/utils";
const TONE = {
  red: "bg-red-50 text-red-700 ring-red-600/15",
  teal: "bg-teal-50 text-teal-700 ring-teal-600/15",
  sky: "bg-sky-50 text-sky-700 ring-sky-600/15",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
};
export default function EmergencyCard({ service }) {
  const Icon = service.icon;
  return (
    <article className="card relative flex h-full flex-col overflow-hidden p-5 transition-shadow duration-300 hover:shadow-md">
      {service.emergency && (
        <span
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-600 to-red-400"
          aria-hidden="true"
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <span
          className={classNames(
            "grid h-11 w-11 place-items-center rounded-xl ring-1 ring-inset",
            TONE[service.tone],
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span
          className={classNames(
            "chip",
            service.emergency
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-stone-200 bg-stone-50 text-ink-500",
          )}
        >
          {service.emergency ? "জরুরি সেবা" : "সাধারণ তথ্য"}
        </span>
      </div>

      <h3 className="mt-3.5 text-[16px] font-bold text-ink-950">
        {service.title}
      </h3>
      <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-ink-500">
        {service.description}
      </p>

      <div className="mt-4 space-y-2">
        {service.contacts.map((c) => (
          <div
            key={c.value}
            className="flex items-center justify-between gap-2 rounded-xl border border-stone-200 bg-sand-25 px-3 py-2"
          >
            <span className="min-w-0 text-[12.5px] text-ink-500">
              <span className="block truncate font-medium">{c.label}</span>
              <span className="block text-[11px] text-ink-300">
                {service.availability}
              </span>
            </span>
            <a
              href={`tel:${c.digits}`}
              className={classNames(
                "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[14px] font-bold ring-1 ring-inset transition",
                service.emergency
                  ? "bg-red-600 text-white ring-red-600 hover:bg-red-700"
                  : "bg-white text-teal-800 ring-teal-600/30 hover:bg-teal-50",
              )}
              aria-label={`${c.label} এ কল করুন — ${c.value}`}
            >
              <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
              {c.value}
            </a>
          </div>
        ))}
      </div>

      <p className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-ink-300">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        সেবার সময়: {service.availability}
      </p>
    </article>
  );
}
