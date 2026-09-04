import {
  CheckCircle2,
  ClipboardList,
  PhoneCall,
  ShieldCheck,
  Siren,
  TriangleAlert,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ReportForm from "@/components/ReportForm";
import Reveal from "@/components/Reveal";
import { HOTLINE_ITEMS } from "@/data/site";
const CHECKLIST = [
  "ঘটনাস্থল ও সময় যতটা সম্ভব নির্ভুল লিখুন",
  "নিজে না দেখা গুজব বা শোনা খবর জমা দেবেন না",
  "ছবি/ভিডিও থাকলে যুক্ত করুন — যাচাই দ্রুত হয়",
  "ঝুঁকি এড়িয়ে নিরাপদ দূরত্ব থেকে ছবি তুলুন",
  "একই ঘটনার পূর্ববর্তী রিপোর্ট থাকলেও নতুন তথ্য যুক্ত করুন",
];
const VERIFY_STEPS = [
  {
    title: "রিপোর্ট জমা",
    text: "ফর্মটি পূরণ করে জমা দিলেই তা যাচাই সারিতে যোগ হয়",
  },
  {
    title: "স্বেচ্ছাসেবক যাচাই",
    text: "স্থানীয় প্রশিক্ষিত দল ঘটনার সত্যতা নিশ্চিত করে",
  },
  {
    title: "কর্মপরিকল্পনা",
    text: "ঝুঁকি মূল্যায়ন করে দুর্যোগ ব্যবস্থাপনা কর্তৃপক্ষকে জানানো হয়",
  },
];
export default function ReportDisaster() {
  return (
    <>
      <PageHeader
        eyebrow="নাগরিক অংশগ্রহণ"
        title="দুর্যোগ রিপোর্ট করুন"
        description="আপনার এলাকায় ঘূর্ণিঝড়, জলোচ্ছ্বাস, বন্যা, নদীভাঙন বা অন্য কোনো দুর্যোগের লক্ষণ দেখলে নিচের ফর্মে জানান। প্রতিটি সঠিক তথ্য কারও জীবন বাঁচাতে পারে।"
      />

      {/* urgent notice */}
      <div className="border-b border-red-100 bg-red-50/70">
        <div className="site-container flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center">
          <p className="flex items-start gap-2.5 text-[13.5px] font-semibold text-red-800">
            <TriangleAlert
              className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
              aria-hidden="true"
            />
            প্রাণহানির জরুরি অবস্থা চললে ফর্মে সময় নষ্ট করবেন না — আগে জাতীয়
            জরুরি সেবায় কল করুন।
          </p>
          <a
            href={`tel:${HOTLINE_ITEMS[0].digits}`}
            className="btn btn-danger !px-4 !py-2 !text-[13px] sm:ml-auto"
          >
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            {HOTLINE_ITEMS[0].value} কল করুন
          </a>
        </div>
      </div>

      <div className="site-container grid gap-6 py-8 md:py-10 lg:grid-cols-[1fr_330px]">
        <Reveal>
          <ReportForm />
        </Reveal>

        <aside className="space-y-4">
          <Reveal delay={80}>
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink-950">
                <ClipboardList
                  className="h-4.5 w-4.5 text-teal-700"
                  aria-hidden="true"
                />
                রিপোর্ট করার আগে মনে রাখুন
              </h3>
              <ul className="mt-3.5 space-y-2.5">
                {CHECKLIST.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-700"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-teal-700"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="card p-5">
              <h3 className="flex items-center gap-2 text-[15px] font-bold text-ink-950">
                <ShieldCheck
                  className="h-4.5 w-4.5 text-teal-700"
                  aria-hidden="true"
                />
                জমা দেওয়ার পর কী হয়?
              </h3>
              <ol className="mt-3.5 space-y-3.5">
                {VERIFY_STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex flex-col items-center">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-teal-700 text-[11px] font-bold text-white">
                        {["১", "২", "৩"][i]}
                      </span>
                      {i < VERIFY_STEPS.length - 1 && (
                        <span
                          className="mt-1 w-px flex-1 bg-teal-700/20"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <div className="pb-1">
                      <p className="text-[13.5px] font-bold text-ink-900">
                        {step.title}
                      </p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-500">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="rounded-2xl bg-deepsea-900 p-5 text-white">
              <h3 className="flex items-center gap-2 text-[15px] font-bold">
                <Siren
                  className="h-4.5 w-4.5 text-amber-300"
                  aria-hidden="true"
                />
                ফর্ম ছাড়াও জানাতে পারেন
              </h3>
              <ul className="mt-3 space-y-2.5 text-[13px]">
                {HOTLINE_ITEMS.map((h) => (
                  <li
                    key={h.value}
                    className="flex items-center justify-between gap-2 border-b border-white/10 pb-2 last:border-0 last:pb-0"
                  >
                    <span className="text-teal-100/80">{h.label}</span>
                    <a
                      href={`tel:${h.digits}`}
                      className="font-bold text-amber-300 hover:text-amber-200"
                    >
                      {h.value}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11.5px] leading-relaxed text-teal-100/60">
                এসএমএসেও রিপোর্ট করা যায়:{" "}
                <span className="font-mono">CG &lt;জেলা&gt; &lt;ধরন&gt;</span>{" "}
                লিখে পাঠান ১০৯০ নম্বরে।
              </p>
            </div>
          </Reveal>
        </aside>
      </div>
    </>
  );
}
