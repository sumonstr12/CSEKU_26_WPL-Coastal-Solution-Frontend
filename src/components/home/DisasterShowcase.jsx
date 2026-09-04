import { Link } from "react-router-dom";
import {
  ArrowRight,
  Droplets,
  LandPlot,
  Sprout,
  Tornado,
  Waves,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import cycloneImg from "@/assets/cyclone.jpg";
import surgeImg from "@/assets/surge.jpg";
import erosionImg from "@/assets/erosion.jpg";
import floodImg from "@/assets/flood.jpg";
import salinityImg from "@/assets/salinity.jpg";
import { TONE_BOX } from "@/components/statTones";
const ITEMS = [
  {
    title: "ঘূর্ণিঝড়",
    description:
      "এপ্রিল-মে ও অক্টোবর-নভেম্বরে বঙ্গোপসাগর থেকে আসা শক্তিশালী ঘূর্ণিঝড় উপকূলে সবচেয়ে বড় প্রাণঘাতী হুমকি।",
    image: cycloneImg,
    alt: "ঘূর্ণিঝড়ের ঘন কালো মেঘের নিচে উপকূলীয় গ্রাম ও বাঁকা তালগাছ",
    icon: Tornado,
    tone: "sky",
  },
  {
    title: "জলোচ্ছ্বাস",
    description:
      "ঘূর্ণিঝড়ের দমকা হাওয়ায় সাগরের পানি স্বাভাবিকের চেয়ে কয়েক মিটার উঁচু হয়ে উপকূল ও দ্বীপাঞ্চল ডেকে যায়।",
    image: surgeImg,
    alt: "উপকূলীয় বেড়িবাঁধ টপকে ফসলি জমিতে ঢুকছে ঘোলা জোয়ারের পানি",
    icon: Waves,
    tone: "teal",
  },
  {
    title: "নদীভাঙন",
    description:
      "পদ্মা-মেঘনা অববাহিকায় প্রতি বছর হাজার হাজার মানুষ নদীগর্ভে ঘর-জমি ও জীবিকা হারায়।",
    image: erosionImg,
    alt: "ভেঙে পড়া নদীতীর, মাটি খসে নদীতে পড়ে যাওয়া তালগাছ",
    icon: LandPlot,
    tone: "orange",
  },
  {
    title: "বন্যা",
    description:
      "মৌসুমি টানা বর্ষণ ও উজানের ঢলে নদ-নদীর পানি বেড়ে নিচু জনপদ প্লাবিত হয়, জীবনযাত্রা বিপর্যস্ত হয়।",
    image: floodImg,
    alt: "কোমরসমান বন্যার পানিতে মাথায় মালপত্র নিয়ে চলছে গ্রামের মানুষ",
    icon: Droplets,
    tone: "sky",
  },
  {
    title: "লবণাক্ততা",
    description:
      "সাগরের লবণাক্ত পানি ভেতরে ঢুকে ধানচাষ, পানীয় জল ও জনস্বাস্থ্যকে দীর্ঘমেয়াদে প্রভাবিত করছে।",
    image: salinityImg,
    alt: "লবণে ফাটা ধরা কৃষিজমি ও লবণপানির ঘের, দূরে পানি আনতে যাওয়া গ্রামীণ নারী",
    icon: Sprout,
    tone: "green",
  },
];
export default function DisasterShowcase() {
  return (
    <section className="py-14 md:py-20">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            eyebrow="দুর্যোগ পরিচিতি"
            title="বাংলাদেশের উপকূলীয় দুর্যোগ"
            description="উপকূলবাসীর জীবন-জীবিকা সবচেয়ে বেশি যে দুর্যোগগুলোর মুখোমুখি হয়, সেগুলোকে চেনা ও প্রস্তুত থাকাই মোকাবিলার প্রথম শর্ত।"
          >
            <Link to="/awareness" className="btn btn-ghost !px-3 text-teal-700">
              সব সচেতনতা সামগ্রী
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </SectionHeading>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 70} className="h-full">
                <article className="card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                    />
                    <span
                      className={`absolute bottom-2.5 left-2.5 grid h-9 w-9 place-items-center rounded-lg ring-1 shadow-md ring-inset ${TONE_BOX[item.tone]}`}
                    >
                      <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-[16px] font-bold text-ink-950">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-ink-500">
                      {item.description}
                    </p>
                    <Link
                      to="/awareness"
                      className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-teal-700 transition-colors hover:text-teal-900"
                      aria-label={`${item.title} সম্পর্কে বিস্তারিত জানুন`}
                    >
                      বিস্তারিত জানুন
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
