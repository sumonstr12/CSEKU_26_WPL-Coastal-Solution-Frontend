import { Link } from "react-router-dom";
import {
  Accessibility,
  Baby,
  Droplets,
  MapPin,
  Navigation,
  PhoneCall,
  Stethoscope,
  Users,
} from "lucide-react";
import { SHELTER_STATUS_META } from "@/data/shelters";
import { bn, classNames } from "@/lib/utils";
function Feature({ ok, label, icon: Icon }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11.5px] font-semibold ring-1 ring-inset",
        ok
          ? "bg-teal-50 text-teal-800 ring-teal-600/15"
          : "bg-stone-50 text-ink-300 ring-stone-200",
      )}
      title={ok ? `${label} — আছে` : `${label} — নেই`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
      <span aria-hidden="true">{ok ? "✓" : "—"}</span>
    </span>
  );
}
export default function ShelterCard({ shelter, distanceKm }) {
  const meta = SHELTER_STATUS_META[shelter.status];
  const percent = Math.min(
    100,
    Math.round((shelter.occupied / shelter.capacity) * 100),
  );
  const available = shelter.capacity - shelter.occupied;
  return (
    <article className="card flex h-full flex-col p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15.5px] leading-snug font-bold text-ink-950">
          {shelter.name}
        </h3>
        <span
          className={classNames("chip shrink-0", meta.className)}
          title={meta.note}
        >
          <span
            className={classNames("h-1.5 w-1.5 rounded-full", meta.dot)}
            aria-hidden="true"
          />
          {shelter.status}
        </span>
      </div>

      <div className="mt-2.5 space-y-1.5 text-[13px] text-ink-500">
        <p className="inline-flex items-center gap-1.5">
          <MapPin
            className="h-3.5 w-3.5 shrink-0 text-teal-700"
            aria-hidden="true"
          />
          <span className="font-semibold text-ink-700">{shelter.district}</span>
          &nbsp;•&nbsp;{shelter.upazila}
        </p>
        <p className="leading-relaxed">{shelter.address}</p>
      </div>

      {typeof distanceKm === "number" && (
        <p className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-orange-50 px-2.5 py-1 text-[12px] font-bold text-orange-700 ring-1 ring-orange-200 ring-inset">
          <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
          আনুমানিক {bn(distanceKm.toFixed(1))} কি.মি. দূরে
        </p>
      )}

      {/* Capacity */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[12px] font-semibold">
          <span className="inline-flex items-center gap-1.5 text-ink-700">
            <Users className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
            ধারণক্ষমতা {bn(shelter.capacity.toLocaleString("en-IN"))} জন
          </span>
          <span className={percent > 75 ? "text-red-700" : "text-teal-800"}>
            {shelter.occupied === 0
              ? "খালি"
              : `${bn(available.toLocaleString("en-IN"))} জনের জায়গা`}
          </span>
        </div>
        <div
          className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label={`দখলকৃত ${bn(percent)} শতাংশ`}
        >
          <div
            className={classNames(
              "h-full rounded-full transition-all",
              percent > 75
                ? "bg-red-500"
                : percent > 40
                  ? "bg-amber-500"
                  : "bg-teal-600",
            )}
            style={{
              width: `${Math.max(percent, 2)}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Feature ok={shelter.womenChildren} label="নারী ও শিশু" icon={Baby} />
        <Feature
          ok={shelter.accessible}
          label="প্রতিবন্ধীবান্ধব"
          icon={Accessibility}
        />
        <Feature
          ok={shelter.drinkingWater}
          label="খাবার পানি"
          icon={Droplets}
        />
        <Feature
          ok={shelter.medicalCorner}
          label="চিকিৎসা"
          icon={Stethoscope}
        />
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-stone-100 pt-4">
        <a
          href={`tel:${shelter.contact}`}
          className="btn btn-primary flex-1 !px-3 !py-2.5 !text-[13px]"
          aria-label={`${shelter.name} এ কল করুন`}
        >
          <PhoneCall className="h-4 w-4" aria-hidden="true" />
          {bn(shelter.contact.replace(/(\d{5})(\d+)/, "$1-$2"))}
        </a>
        <Link
          to="/map"
          className="btn btn-outline !px-3 !py-2.5 !text-[13px]"
          aria-label={`${shelter.name} মানচিত্রে দেখুন`}
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
          মানচিত্রে
        </Link>
      </div>
    </article>
  );
}
