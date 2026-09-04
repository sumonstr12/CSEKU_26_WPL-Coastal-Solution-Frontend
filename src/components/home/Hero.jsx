import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Megaphone,
  ShieldCheck,
  Tent,
  TriangleAlert,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import heroImg from "@/assets/hero.jpg";
import { COMMUNITY_STATS, CURRENT_ALERT } from "@/data/site";
export default function Hero() {
  const sheltersStat = COMMUNITY_STATS.find((s) => s.id === "shelters");
  const volunteersStat = COMMUNITY_STATS.find((s) => s.id === "volunteers");
  return (
    <section className="bg-waves-pattern relative overflow-hidden">
      {/* soft colour wash */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55rem_30rem_at_85%_-10%,rgba(15,118,110,0.09),transparent),radial-gradient(40rem_24rem_at_-10%_110%,rgba(217,119,6,0.06),transparent)]"
        aria-hidden="true"
      />
      <div className="site-container relative grid items-center gap-12 py-12 md:py-18 lg:grid-cols-[1.03fr_0.97fr] lg:py-24">
        {/* Copy */}
        <Reveal>
          <p className="chip border-teal-600/25 bg-white text-teal-800 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            সরকারি-কমিউনিটি যৌথ উদ্যোগ • ১১টি উপকূলীয় জেলা
          </p>
          <h1 className="font-display mt-5 text-[38px] leading-[1.15] font-bold text-ink-950 sm:text-5xl lg:text-[56px]">
            দুর্যোগের সময় <span className="text-teal-700">তথ্যই শক্তি</span>
          </h1>
          <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-ink-500">
            বাংলাদেশের উপকূলীয় জনগোষ্ঠীর জন্য দ্রুত দুর্যোগ রিপোর্টিং, সতর্কতা,
            আশ্রয়কেন্দ্র ও জরুরি সহায়তার একটি সমন্বিত প্ল্যাটফর্ম।
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/report"
              className="btn btn-primary px-6 py-3.5 text-[15px]"
            >
              <Megaphone className="h-4.5 w-4.5" aria-hidden="true" />
              দুর্যোগ রিপোর্ট করুন
            </Link>
            <Link
              to="/shelters"
              className="btn btn-outline px-6 py-3.5 text-[15px]"
            >
              <Tent className="h-4.5 w-4.5" aria-hidden="true" />
              নিকটস্থ আশ্রয়কেন্দ্র খুঁজুন
            </Link>
          </div>

          <div
            className="mt-9 flex max-w-md items-stretch justify-between gap-4 border-t border-stone-200 pt-6"
            role="list"
          >
            {[
              {
                value: sheltersStat?.value ?? "৩২০+",
                label: "সক্রিয় আশ্রয়কেন্দ্র",
              },
              {
                value: volunteersStat?.value ?? "৮৫০+",
                label: "প্রশিক্ষিত স্বেচ্ছাসেবক",
              },
              {
                value: "২৪/৭",
                label: "পরিস্থিতি মনিটরিং",
              },
            ].map((item, i) => (
              <div
                key={item.label}
                role="listitem"
                className={i > 0 ? "border-l border-stone-200 pl-4" : ""}
              >
                <p className="font-display text-xl font-bold text-ink-950 sm:text-2xl">
                  {item.value}
                </p>
                <p className="mt-1 text-[11.5px] leading-tight font-medium text-ink-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Visual */}
        <Reveal delay={120} className="relative">
          <div className="relative">
            <img
              src={heroImg}
              alt="বাংলাদেশের উপকূলীয় গ্রাম — নদীর তীরে নৌকা, বেড়িবাঁধ ও সবুজ ধানক্ষেত, স্বেচ্ছাসেবকরা টহলে"
              className="h-[360px] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-black/10 sm:h-[420px] lg:h-[470px]"
            />
            {/* live alert card */}
            <div className="animate-floaty absolute bottom-4 left-3 max-w-[260px] rounded-2xl bg-white/95 p-3.5 shadow-xl ring-1 ring-black/5 backdrop-blur sm:left-5">
              <p className="flex items-center gap-2 text-[13px] font-bold text-ink-950">
                <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
                </span>
                {CURRENT_ALERT.title}
              </p>
              <p className="mt-1 inline-flex items-start gap-1.5 text-[12px] leading-snug text-ink-500">
                <TriangleAlert
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600"
                  aria-hidden="true"
                />
                {CURRENT_ALERT.areas.join(" • ")} উপকূলে সতর্ক অবস্থা
              </p>
              <Link
                to="/disasters"
                className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-bold text-teal-700 hover:text-teal-900"
              >
                বিস্তারিত খবর
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
            {/* shelter chip */}
            <div className="animate-floaty-late absolute top-4 right-4 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-black/5 backdrop-blur">
              <Tent className="h-4 w-4 text-teal-700" aria-hidden="true" />
              <p className="text-[12px] leading-tight">
                <span className="block font-bold text-ink-950">
                  {sheltersStat?.value ?? "৩২০+"} আশ্রয়কেন্দ্র
                </span>
                <span className="block text-[11px] text-ink-500">
                  সার্চ সক্ষম
                </span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
