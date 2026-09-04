import { Link } from "react-router-dom";
import { LifeBuoy, Megaphone, PhoneCall, Siren, Tent } from "lucide-react";
import Reveal from "@/components/Reveal";
import { HOTLINE_ITEMS, SITE } from "@/data/site";
export default function EmergencyCTA() {
  return (
    <section className="pb-16 md:pb-24">
      <div className="site-container">
        <Reveal>
          <div className="bg-waves-pattern-light relative overflow-hidden rounded-[28px] bg-deepsea-900 px-6 py-10 text-white shadow-2xl sm:px-10 sm:py-12 lg:px-14">
            <div
              className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <p className="chip border-amber-300/30 bg-amber-400/10 text-amber-300">
                  <Siren className="h-3.5 w-3.5" aria-hidden="true" />
                  জরুরি প্রস্তুতি
                </p>
                <h2 className="font-display mt-4 max-w-md text-[27px] leading-snug font-bold text-white sm:text-[32px]">
                  জরুরি পরিস্থিতিতে দ্রুত সিদ্ধান্ত নিন
                </h2>
                <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-teal-100/80">
                  ঝুঁকি বাড়লে দেরি না করে নিরাপদ স্থানে চলে যান। নিকটস্থ
                  আশ্রয়কেন্দ্র, উদ্ধার দল বা জরুরি নিয়ন্ত্রণ কক্ষ — সব এক
                  ক্লিক দূরে।
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    to="/shelters"
                    className="btn bg-white !text-deepsea-950 shadow-md hover:bg-teal-50"
                  >
                    <Tent
                      className="h-4.5 w-4.5 text-teal-700"
                      aria-hidden="true"
                    />
                    নিকটস্থ আশ্রয়কেন্দ্র
                  </Link>
                  <Link to="/rescue" className="btn btn-amber">
                    <LifeBuoy className="h-4.5 w-4.5" aria-hidden="true" />
                    জরুরি সহায়তা
                  </Link>
                  <Link
                    to="/report"
                    className="btn border border-white/35 text-white hover:bg-white/10"
                  >
                    <Megaphone className="h-4.5 w-4.5" aria-hidden="true" />
                    দুর্যোগ রিপোর্ট করুন
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/15 ring-inset backdrop-blur">
                <p className="text-[12.5px] font-semibold text-teal-100/75">
                  জাতীয় জরুরি হটলাইন
                </p>
                <p className="font-display mt-1 text-6xl leading-none font-extrabold text-amber-300">
                  {SITE.emergencyBn}
                </p>
                <p className="mt-2 text-[12.5px] text-teal-100/75">
                  টোল-ফ্রি • ২৪/৭ • সব অপারেটর থেকে
                </p>
                <a
                  href={`tel:${SITE.emergencyDigits}`}
                  className="btn btn-amber mt-5 w-full"
                >
                  <PhoneCall className="h-4.5 w-4.5" aria-hidden="true" />
                  এখনই কল করুন
                </a>
                <p className="mt-3 text-center text-[12px] text-teal-100/70">
                  {HOTLINE_ITEMS[1].label}:{" "}
                  <span className="font-bold text-teal-50">
                    {HOTLINE_ITEMS[1].value}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
