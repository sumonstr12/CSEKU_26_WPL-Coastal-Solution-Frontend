import { Link } from "react-router-dom";
import {
  Backpack,
  CheckCircle2,
  Flag,
  GraduationCap,
  Megaphone,
  Tent,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import {
  AWARENESS_SECTIONS,
  EMERGENCY_BAG,
  SIGNAL_GUIDE,
} from "@/data/awareness";
import { classNames } from "@/lib/utils";
import communityImg from "@/assets/community.jpg";
const TONE_BAR = {
  teal: "bg-teal-50 text-teal-700 ring-teal-600/15",
  orange: "bg-orange-50 text-orange-700 ring-orange-600/15",
  sky: "bg-sky-50 text-sky-700 ring-sky-600/15",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
};
const SIGNAL_TONE = {
  amber: "border-amber-200 bg-amber-50",
  orange: "border-orange-200 bg-orange-50",
  red: "border-red-200 bg-red-50",
  slate: "border-stone-200 bg-stone-50",
};
const SIGNAL_FLAG = {
  amber: "text-amber-600",
  orange: "text-orange-600",
  red: "text-red-600",
  slate: "text-stone-500",
};
export default function Awareness() {
  return (
    <>
      <PageHeader
        eyebrow="জানলেই প্রস্তুতি"
        title="দুর্যোগ সচেতনতা"
        description="ঘূর্ণিঝড়, বন্যা ও জলোচ্ছ্বাসের আগে-সময়-পরে কী করবেন — পরিবার ও প্রতিবেশীকে শেখানোর মতো সহজ ভাষায় নির্দেশনা।"
      >
        <Link to="/shelters" className="btn btn-primary">
          <Tent className="h-4 w-4" aria-hidden="true" />
          আশ্রয়কেন্দ্র খুঁজুন
        </Link>
      </PageHeader>

      <div className="site-container space-y-12 py-8 md:py-12">
        {/* Intro with image */}
        <Reveal>
          <div className="card grid items-center overflow-hidden md:grid-cols-[1.15fr_1fr]">
            <div className="p-6 sm:p-8">
              <p className="chip border-teal-600/20 bg-teal-50 text-teal-800">
                <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                পরিবারের সবাইকে জানান
              </p>
              <h2 className="font-display mt-3 text-2xl leading-snug font-bold text-ink-950">
                প্রস্তুতি এক দিনের কাজ নয় — অভ্যাসের বিষয়
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-500">
                উপকূলের প্রতিটি পরিবারের উচিত বছরে অন্তত একবার এই নির্দেশনাগুলো
                পর্যালোচনা করা, জরুরি ব্যাগ হালনাগাদ করা এবং আশ্রয়কেন্দ্রে
                যাওয়ার পথ চর্চা করা। স্কুল, মসজিদ ও ইউনিয়ন পরিষদে স্থানীয়
                সচেতনতা সভায় নিয়মিত অংশ নিন।
              </p>
            </div>
            <img
              src={communityImg}
              alt="স্কুল প্রাঙ্গণে গাছতলায় দুর্যোগ সচেতনতা প্রশিক্ষণ — মেগাফোন হাতে প্রশিক্ষক, মানুষ মনোযোগ দিয়ে শুনছেন"
              className="h-full max-h-[300px] w-full object-cover md:max-h-none"
              loading="lazy"
            />
          </div>
        </Reveal>

        {/* Core sections */}
        <section aria-label="করণীয় তালিকা">
          <div className="grid gap-4 md:grid-cols-2">
            {AWARENESS_SECTIONS.map((section, i) => {
              const Icon = section.icon;
              return (
                <Reveal
                  key={section.id}
                  delay={Math.min(i, 4) * 60}
                  className="h-full"
                >
                  <article className="card flex h-full flex-col p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={classNames(
                          "grid h-11 w-11 place-items-center rounded-xl ring-1 ring-inset",
                          TONE_BAR[section.tone],
                        )}
                      >
                        <Icon className="h-5.5 w-5.5" aria-hidden="true" />
                      </span>
                      <h2 className="text-[17px] font-bold text-ink-950">
                        {section.title}
                      </h2>
                    </div>
                    <ul className="mt-4 flex-1 space-y-2.5">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-700"
                        >
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-teal-700"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              );
            })}

            {/* Emergency bag */}
            <Reveal delay={300} className="h-full">
              <article className="card relative flex h-full flex-col overflow-hidden border-2 border-emerald-600/25 p-5 sm:p-6">
                <span
                  className="absolute inset-x-0 top-0 h-1 bg-emerald-600"
                  aria-hidden="true"
                />
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/15 ring-inset">
                    <Backpack className="h-5.5 w-5.5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-[17px] font-bold text-ink-950">
                      জরুরি ব্যাগে কী রাখবেন?
                    </h2>
                    <p className="text-[12px] text-ink-500">
                      প্রতি পরিবারে একটি প্রস্তুত ব্যাগ রাখুন
                    </p>
                  </div>
                </div>
                <ul className="mt-4 grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                  {EMERGENCY_BAG.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li
                        key={item.label}
                        className="flex items-start gap-2.5 rounded-xl bg-emerald-50/60 px-3 py-2.5 ring-1 ring-emerald-600/10 ring-inset"
                      >
                        <Icon
                          className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-700"
                          aria-hidden="true"
                        />
                        <span>
                          <span className="block text-[13px] font-bold text-ink-900">
                            {item.label}
                          </span>
                          <span className="block text-[11.5px] leading-snug text-ink-500">
                            {item.note}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            </Reveal>
          </div>
        </section>

        {/* Signal guide */}
        <Reveal>
          <section aria-labelledby="signal-title" className="card p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2
                  id="signal-title"
                  className="font-display text-[24px] font-bold text-ink-950"
                >
                  সাগর-বন্দরের বিপদ সংকেত বুঝুন
                </h2>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-500">
                  বাংলাদেশের সমুদ্রবন্দরগুলোতে ঘূর্ণিঝড়ের জন্য ১ থেকে ১১ নম্বর
                  সংকেত দেখানো হয়। সংকেত বাড়ার সাথে সাথে আপনার প্রস্তুতিও ধাপে
                  ধাপে বাড়াতে হবে।
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {SIGNAL_GUIDE.map((signal) => (
                <div
                  key={signal.range}
                  className={classNames(
                    "rounded-xl border p-4",
                    SIGNAL_TONE[signal.tone],
                  )}
                >
                  <p className="flex items-center gap-2 text-[13px] font-bold text-ink-900">
                    <Flag
                      className={classNames(
                        "h-4 w-4",
                        SIGNAL_FLAG[signal.tone],
                      )}
                      aria-hidden="true"
                    />
                    {signal.range}
                  </p>
                  <h3 className="mt-1.5 text-[15px] font-bold text-ink-950">
                    {signal.title}
                  </h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-700">
                    {signal.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-deepsea-900 px-6 py-8 text-center text-white">
            <Megaphone className="h-8 w-8 text-amber-300" aria-hidden="true" />
            <h2 className="font-display max-w-xl text-2xl font-bold">
              জানা তথ্য প্রতিবেশীর সাথে ভাগ করুন — সচেতন সম্প্রদায়ই নিরাপদ
              সম্প্রদায়
            </h2>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link to="/report" className="btn btn-amber">
                দুর্যোগ রিপোর্ট করুন
              </Link>
              <Link
                to="/rescue"
                className="btn border border-white/35 text-white hover:bg-white/10"
              >
                জরুরি সহায়তার তথ্য
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
