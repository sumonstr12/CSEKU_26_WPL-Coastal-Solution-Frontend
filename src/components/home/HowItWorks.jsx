import { Activity, LifeBuoy, Megaphone, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { TONE_BOX } from "@/components/statTones";
const STEPS = [
  {
    number: "০১",
    title: "রিপোর্ট করুন",
    description:
      "নাগরিকরা ঘটনাস্থল থেকে ছবি-ভিডিওসহ ঘটনার তথ্য সহজ ফর্মে পাঠান।",
    icon: Megaphone,
    tone: "teal",
  },
  {
    number: "০২",
    title: "তথ্য যাচাই",
    description:
      "প্রশিক্ষিত স্বেচ্ছাসেবক ও স্থানীয় যাচাই দল তথ্যের সত্যতা নিশ্চিত করে।",
    icon: ShieldCheck,
    tone: "sky",
  },
  {
    number: "০৩",
    title: "ঝুঁকি বিশ্লেষণ",
    description:
      "জেলা ও উপজেলাভিত্তিক ঝুঁকির মাত্রা নির্ধারণ করে অগ্রাধিকার ঠিক করা হয়।",
    icon: Activity,
    tone: "amber",
  },
  {
    number: "০৪",
    title: "দ্রুত সহায়তা",
    description:
      "উদ্ধার দল, আশ্রয়কেন্দ্র ও ত্রাণ সহায়তা ঝুঁকিপূর্ণ জনগোষ্ঠীর কাছে পৌঁছায়।",
    icon: LifeBuoy,
    tone: "red",
  },
];
export default function HowItWorks() {
  return (
    <section className="py-14 md:py-20">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow="কর্মপ্রবাহের ধারা"
            title="কীভাবে কাজ করে?"
            description="ঘটনাস্থলের তথ্য থেকে সহায়তা পৌঁছে দেওয়া পর্যন্ত — প্রতিটি ধাপ স্বচ্ছ ও দ্রুত।"
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.number} delay={i * 80} className="h-full">
                <div className="card relative h-full overflow-hidden p-5">
                  <span
                    className="font-display absolute top-3 right-4 text-5xl font-extrabold text-teal-700/12 select-none"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ring-inset ${TONE_BOX[step.tone]}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-[11px] font-bold tracking-widest text-ink-300">
                    ধাপ {step.number}
                  </p>
                  <h3 className="mt-1 text-[17px] font-bold text-ink-950">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
                    {step.description}
                  </p>
                  {i < STEPS.length - 1 && (
                    <span
                      className="absolute top-1/2 -right-3 hidden h-px w-6 border-t-2 border-dashed border-teal-700/25 lg:block"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
