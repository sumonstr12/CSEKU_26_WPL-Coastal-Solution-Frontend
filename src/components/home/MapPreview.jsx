import { Link } from "react-router-dom";
import { ArrowRight, Layers3, ShieldCheck } from "lucide-react";
import MapView from "@/components/MapView";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { DISASTER_REPORTS, riskLevelLabel } from "@/data/disasters";
import { RESCUE_TEAMS, RISK_ZONES } from "@/data/map";
import { SHELTERS } from "@/data/shelters";
const LEVEL_ORDER = ["critical", "high", "moderate", "low"];
const DOT = {
  critical: "bg-red-600",
  high: "bg-orange-600",
  moderate: "bg-amber-500",
  low: "bg-emerald-600",
};
export default function MapPreview() {
  const activeReports = DISASTER_REPORTS.filter(
    (r) => r.status === "active",
  ).length;
  return (
    <section className="border-y border-black/5 bg-white py-14 md:py-20">
      <div className="site-container grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
        <Reveal className="order-2 lg:order-1">
          <div className="card overflow-hidden p-2 shadow-lg">
            <MapView
              className="h-[340px] w-full overflow-hidden rounded-2xl sm:h-[420px]"
              scrollWheelZoom={false}
              reports={DISASTER_REPORTS}
              shelters={SHELTERS}
              rescues={RESCUE_TEAMS}
              zones={RISK_ZONES}
            />
          </div>
        </Reveal>

        <Reveal delay={120} className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="জিআইএস মানচিত্র"
            title="আপনার এলাকার দুর্যোগ পরিস্থিতি দেখুন"
            description="জেলাভিত্তিক ঝুঁকিঅঞ্চল, সক্রিয় ঘটনা, আশ্রয়কেন্দ্র ও উদ্ধার দলের অবস্থান এক মানচিত্রে — ফিল্টার করে নিজ এলাকার চিত্র জানুন।"
          />

          <ul className="mt-6 space-y-3" aria-label="ঝুঁকির মাত্রার ব্যাখ্যা">
            {LEVEL_ORDER.map((level) => {
              const districts = RISK_ZONES.filter((z) => z.risk === level).map(
                (z) => z.district,
              );
              if (districts.length === 0) return null;
              return (
                <li
                  key={level}
                  className="flex items-start gap-2.5 text-[13.5px]"
                >
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${DOT[level]}`}
                    aria-hidden="true"
                  />
                  <span>
                    <span className="font-bold text-ink-900">
                      {riskLevelLabel(level)}
                    </span>
                    <span className="text-ink-500">
                      {" "}
                      — {districts.join(", ")}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 flex items-center gap-2 text-[12.5px] font-medium text-ink-500">
            <Layers3 className="h-4 w-4 text-teal-700" aria-hidden="true" />
            {activeReports}টি সক্রিয় ঘটনা • {SHELTERS.length}টি আশ্রয়কেন্দ্র •{" "}
            {RESCUE_TEAMS.length}টি উদ্ধার ইউনিট চিহ্নিত
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/map" className="btn btn-primary">
              সম্পূর্ণ মানচিত্র দেখুন
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-300">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              ডেটা সূত্র: যাচাইকৃত নাগরিক রিপোর্ট ও সরকারি বুলেটিন
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
