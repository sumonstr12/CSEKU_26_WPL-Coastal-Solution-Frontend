import { Link } from "react-router-dom";
import { ArrowRight, Clock, Landmark, TriangleAlert } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Statistics from "@/components/Statistics";
import { CURRENT_ALERT, LIVE_STATS } from "@/data/site";
export default function LiveStatus() {
  return (
    <section className="pb-14 md:pb-20">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            eyebrow="লাইভ পরিস্থিতি"
            title="বর্তমান দুর্যোগ পরিস্থিতি"
            description="প্ল্যাটফর্মে জমা হওয়া যাচাইকৃত রিপোর্ট ও সরকারি তথ্যসূত্র অনুযায়ী গত ২৪ ঘণ্টার সার্বিক চিত্র।"
          >
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-ink-500 ring-1 ring-black/5 ring-inset">
              <span
                className="h-2 w-2 animate-pulse-dot rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              হালনাগাদ: আজ সকাল ১০টা
            </p>
          </SectionHeading>
        </Reveal>

        <Reveal delay={80} className="mt-7">
          <Statistics
            items={LIVE_STATS}
            className="sm:grid-cols-3 xl:grid-cols-5"
          />
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-amber-300/70 bg-amber-50 p-5 md:flex-row md:items-center">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-400/25 text-amber-800 ring-1 ring-amber-500/30 ring-inset">
              <TriangleAlert className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[16px] font-bold text-ink-950">
                {CURRENT_ALERT.title}{" "}
                <span className="ml-1 align-middle text-[12px] font-bold text-amber-800">
                  — সতর্কতা জারি
                </span>
              </h3>
              <p className="mt-1 text-[13.5px] text-ink-700">
                <span className="font-semibold">এলাকা: </span>
                {CURRENT_ALERT.areas.map((area, i) => (
                  <span key={area}>
                    <span className="font-bold text-amber-900">{area}</span>
                    {i < CURRENT_ALERT.areas.length - 1 && (
                      <span className="text-amber-900/60">, </span>
                    )}
                  </span>
                ))}
                <span className="text-ink-500"> উপকূল ও দ্বীপাঞ্চল</span>
              </p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-medium text-amber-900/70">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  হালনাগাদ: {CURRENT_ALERT.updated}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
                  সূত্র: {CURRENT_ALERT.source}
                </span>
              </p>
            </div>
            <Link
              to="/disasters"
              className="btn shrink-0 border border-amber-500/60 bg-white text-amber-900 hover:bg-amber-100"
            >
              সম্পর্কিত খবর দেখুন
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
