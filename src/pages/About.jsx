import { Link } from "react-router-dom";
import {
  Database,
  HeartHandshake,
  Hourglass,
  LifeBuoy,
  Megaphone,
  MountainSnow,
  Network,
  Satellite,
  ShieldCheck,
  Smartphone,
  UserPlus,
  WifiOff,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Statistics from "@/components/Statistics";
import { TONE_BOX } from "@/components/statTones";
import { COMMUNITY_STATS } from "@/data/site";
import shelterImg from "@/assets/shelter.jpg";
import communityImg from "@/assets/community.jpg";
const CHALLENGES = [
  {
    title: "প্রত্যন্ত উপকূলীয় জনপদ",
    description:
      "হাজার কিলোমিটার উপকূল জুড়ে ছড়িয়ে থাকা গ্রাম-চর — যেখানে সরকারি বার্তা পৌঁছাতে সময় লাগে।",
    icon: MountainSnow,
    tone: "teal",
  },
  {
    title: "দ্রুত তথ্যের অভাব",
    description:
      "দুর্যোগের প্রথম কয়েক ঘণ্টায় স্থানীয় চিত্র না জানায় সহায়তা পৌঁছাতে দেরি হয়।",
    icon: Hourglass,
    tone: "amber",
  },
  {
    title: "যোগাযোগ বিচ্ছিন্নতা",
    description:
      "ঝড়ে নেটওয়ার্ক ও বিদ্যুৎ বিচ্ছিন্ন হয়ে পড়লে নাগরিক ও কর্তৃপক্ষের সংযোগ কেটে যায়।",
    icon: WifiOff,
    tone: "red",
  },
  {
    title: "সমন্বয়ের জটিলতা",
    description:
      "আশ্রয়কেন্দ্র, উদ্ধার দল ও ত্রাণ — একাধিক সংস্থার সমন্বয় ছাড়া কার্যকর সহায়তা কঠিন।",
    icon: Network,
    tone: "sky",
  },
];
const FEATURES = [
  {
    title: "নাগরিক রিপোর্টিং",
    description:
      "যে কেউ মোবাইল বা কম্পিউটার থেকে ছবি-ভিডিওসহ ঘটনার তথ্য পাঠাতে পারেন — বাংলায়, সহজ ফর্মে।",
    icon: Megaphone,
    tone: "teal",
  },
  {
    title: "স্বেচ্ছাসেবক নেটওয়ার্ক",
    description:
      "প্রতিটি উপজেলার প্রশিক্ষিত স্বেচ্ছাসেবকরা তথ্য যাচাই ও স্থানীয় সহায়তা সমন্বয় করেন।",
    icon: HeartHandshake,
    tone: "orange",
  },
  {
    title: "জিআইএস দুর্যোগ মানচিত্র",
    description:
      "ঝুঁকিঅঞ্চল, আশ্রয়কেন্দ্র ও উদ্ধার দলের অবস্থান ইন্টারঅ্যাকটিভ মানচিত্রে দেখা যায়।",
    icon: Satellite,
    tone: "sky",
  },
  {
    title: "জরুরি সমন্বয়",
    description:
      "জেলা নিয়ন্ত্রণ কক্ষ, উদ্ধার দল ও সরকারি হটলাইনের তথ্য এক জায়গায় সাজানো।",
    icon: LifeBuoy,
    tone: "red",
  },
];
const TECH = [
  {
    title: "যাচাইকৃত তথ্য",
    description:
      "স্থানীয় স্বেচ্ছাসেবক ও কর্তৃপক্ষের যাচাই ছাড়া কোনো রিপোর্ট প্রকাশ হয় না — গুজব রোধে এটি জরুরি।",
    icon: ShieldCheck,
    tone: "green",
  },
  {
    title: "মোবাইল-ফার্স্ট ডিজাইন",
    description:
      "ধীর নেটওয়ার্ক ও সাধারণ স্মার্টফোনেও যেন মসৃণভাবে চলে — সেভাবেই প্ল্যাটফর্মটি তৈরি।",
    icon: Smartphone,
    tone: "teal",
  },
  {
    title: "উন্মুক্ত ডেটা",
    description:
      "অ-ব্যক্তিগত ঘটনা ও আশ্রয়কেন্দ্রের ডেটা গবেষক ও উন্নয়ন সংস্থার জন্য উন্মুক্ত।",
    icon: Database,
    tone: "sky",
  },
];
export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="পরিচিতি"
        title="আমাদের সম্পর্কে"
        description="CoastalGuard BD বাংলাদেশের উপকূলীয় জনগোষ্ঠীকে দুর্যোগের তথ্য ও সহায়তার সাথে সংযুক্ত করার একটি সরকারি-কমিউনিটি উদ্যোগ।"
      />

      <div className="site-container space-y-14 py-10 md:py-14">
        {/* Mission */}
        <Reveal>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="কেন এই প্ল্যাটফর্ম"
                title="উপকূলবাসীর পাশে, প্রযুক্তির ভাষায়"
                description="বাংলাদেশ বিশ্বের অন্যতম দুর্যোগপ্রবণ দেশ। জলবায়ু পরিবর্তনের কারণে ঘূর্ণিঝড়, জলোচ্ছ্বাস ও লবণাক্ততার তীব্রতা বাড়ছে — কিন্তু দুর্যোগের মুহূর্তে সবচেয়ে দুর্বল কড়ি হলো তথ্যের অভাব। মাটি থেকে পাওয়া দ্রুত ও নির্ভরযোগ্য তথ্যই সিদ্ধান্তকে করে তোলে কার্যকর।"
              />
              <p className="mt-4 text-[14.5px] leading-relaxed text-ink-700">
                CoastalGuard BD-এর লক্ষ্য সরল:{" "}
                <strong className="font-bold text-ink-950">
                  উপকূলের সাধারণ মানুষের দেখা-জানাকে
                </strong>{" "}
                জাতীয় দুর্যোগ মোকাবিলার অংশ করে তোলা। একজন কৃষকের পাঠানো
                বাঁধভাঙনের ছবি, একজন শিক্ষকের পাঠানো বন্যার খবর — সবই মিলে গড়ে
                তোলে প্রাণ বাঁচানোর একটি নেটওয়ার্ক।
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Link to="/register" className="btn btn-primary">
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                  অংশগ্রহণ করুন
                </Link>
                <Link to="/report" className="btn btn-outline">
                  কীভাবে রিপোর্ট করবেন
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={shelterImg}
                alt="উপকূলীয় বহুমুখী আশ্রয়কেন্দ্র — উঁচু সিঁড়ি দিয়ে মানুষ ভেতরে প্রবেশ করছে"
                className="h-[320px] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-black/10 sm:h-[400px]"
                loading="lazy"
              />
              <div className="absolute -bottom-5 left-5 max-w-[280px] rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur">
                <p className="text-[13px] leading-relaxed font-semibold text-ink-900">
                  "দুর্যোগ মোকাবিলায় প্রযুক্তি তখনই কাজ করে, যখন তা মাটির
                  মানুষের ভাষা বোঝে।"
                </p>
                <p className="mt-1.5 text-[11.5px] font-bold text-teal-700">
                  — প্ল্যাটফর্ম পরিকল্পনা দল
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Challenges */}
        <Reveal>
          <section aria-labelledby="challenges-title">
            <SectionHeading
              eyebrow="যে চ্যালেঞ্জগুলোর সমাধান চাই"
              title="উপকূলীয় বাংলাদেশের বাস্তবতা"
              description="কেন এমন একটি প্ল্যাটফর্ম দরকার, তা বোঝাতে উপকূলের চারটি মূল চ্যালেঞ্জ তুলে ধরলাম।"
              className="[&_h2]:text-[26px]"
            />
            <span id="challenges-title" className="sr-only">
              চ্যালেঞ্জসমূহ
            </span>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {CHALLENGES.map((block) => {
                const Icon = block.icon;
                return (
                  <div key={block.title} className="card h-full p-5">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-xl ring-1 ring-inset ${TONE_BOX[block.tone]}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3.5 text-[15.5px] font-bold text-ink-950">
                      {block.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
                      {block.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </Reveal>

        {/* What we do */}
        <Reveal>
          <section
            aria-labelledby="features-title"
            className="card overflow-hidden"
          >
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-[260px] lg:min-h-full">
                <img
                  src={communityImg}
                  alt="গ্রাম প্রাঙ্গণে দুর্যোগ প্রস্তুতি বিষয়ে কমিউনিটি সচেতনতা সভা"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="bg-waves-pattern p-6 sm:p-8">
                <SectionHeading
                  eyebrow="আমরা যা করি"
                  title="তথ্য থেকে ব্যবস্থা — সম্পূর্ণ চক্র"
                  className="[&_h2]:text-[24px]"
                />
                <span id="features-title" className="sr-only">
                  মূল সেবাসমূহ
                </span>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <div
                        key={feature.title}
                        className="rounded-xl bg-white p-4 ring-1 ring-black/5 ring-inset"
                      >
                        <span
                          className={`grid h-10 w-10 place-items-center rounded-lg ring-1 ring-inset ${TONE_BOX[feature.tone]}`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <h3 className="mt-3 text-[15px] font-bold text-ink-950">
                          {feature.title}
                        </h3>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-ink-500">
                          {feature.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Technology */}
        <Reveal>
          <section aria-labelledby="tech-title">
            <div className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
              <div>
                <SectionHeading
                  eyebrow="প্রযুক্তি ও ডেটা"
                  title="সহজ প্রযুক্তি, শক্ত নীতি"
                  description="নাগরিকের কাছে প্ল্যাটফর্মটি একটি সহজ বাংলা ওয়েবসাইট; তার পেছনে কাজ করে সতর্ক ডেটা-নীতি ও অংশীদারিত্বের কাঠামো।"
                  className="[&_h2]:text-[24px]"
                />
              </div>
              <div className="grid gap-3">
                {TECH.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="card flex items-start gap-4 p-5"
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ring-1 ring-inset ${TONE_BOX[item.tone]}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-bold text-ink-950">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </Reveal>

        {/* Stats band */}
        <Reveal>
          <section
            aria-labelledby="stats-title"
            className="rounded-3xl border border-black/5 bg-white p-6 sm:p-8"
          >
            <SectionHeading
              align="center"
              eyebrow="এক নজরে"
              title="প্ল্যাটফর্মের বর্তমান চিত্র"
              className="[&_h2]:text-[24px]"
            />
            <span id="stats-title" className="sr-only">
              পরিসংখ্যান
            </span>
            <Statistics
              items={COMMUNITY_STATS}
              className="mx-auto mt-7 max-w-3xl sm:grid-cols-4"
            />
          </section>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <div className="bg-waves-pattern-light flex flex-col items-center gap-4 rounded-3xl bg-deepsea-900 px-6 py-10 text-center text-white">
            <h2 className="font-display max-w-2xl text-[26px] leading-snug font-bold">
              উদ্যোগটির অংশ হোন — নিজ এলাকার তথ্য আপনিই সবার আগে জানতে পারেন
            </h2>
            <p className="max-w-xl text-[14px] leading-relaxed text-teal-100/80">
              সাধারণ নাগরিক, স্বেচ্ছাসেবক, শিক্ষক বা স্থানীয় সংগঠন — আপনার সময়
              ও তথ্যই এই নেটওয়ার্কের শক্তি।
            </p>
            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Link to="/register" className="btn btn-amber">
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                নিবন্ধন করুন
              </Link>
              <Link
                to="/awareness"
                className="btn border border-white/35 text-white hover:bg-white/10"
              >
                সচেতনতা সামগ্রী দেখুন
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
