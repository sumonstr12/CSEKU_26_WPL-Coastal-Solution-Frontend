import { Link } from "react-router-dom";
import { ArrowRight, LifeBuoy, MapPinned, Megaphone, Tent } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { TONE_BOX } from "@/components/statTones";
const ACTIONS = [
  {
    title: "দুর্যোগ রিপোর্ট করুন",
    description: "আপনার এলাকার দুর্যোগের তথ্য দ্রুত জানান",
    path: "/report",
    icon: Megaphone,
    tone: "red",
  },
  {
    title: "আশ্রয়কেন্দ্র খুঁজুন",
    description: "নিকটস্থ নিরাপদ আশ্রয়কেন্দ্র খুঁজে নিন",
    path: "/shelters",
    icon: Tent,
    tone: "teal",
  },
  {
    title: "জরুরি সহায়তা",
    description: "জরুরি প্রয়োজনে সহায়তার তথ্য পান",
    path: "/rescue",
    icon: LifeBuoy,
    tone: "amber",
  },
  {
    title: "দুর্যোগ মানচিত্র",
    description: "আপনার এলাকার বর্তমান ঝুঁকি দেখুন",
    path: "/map",
    icon: MapPinned,
    tone: "sky",
  },
];
export default function QuickActions() {
  return (
    <section className="border-y border-black/5 bg-white py-14 md:py-18">
      <div className="site-container">
        <Reveal>
          <SectionHeading
            eyebrow="দ্রুত পদক্ষেপ"
            title="এক ক্লিকে যা পাবেন"
            description="দুর্যোগকালে প্রতি মুহূর্ত গুরুত্বপূর্ণ — সবচেয়ে বেশি প্রয়োজন হওয়া চারটি সেবা সামনে রাখা হয়েছে।"
          />
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((action, i) => {
            const Icon = action.icon;
            return (
              <Reveal key={action.title} delay={i * 70} className="h-full">
                <Link
                  to={action.path}
                  className="card group flex h-full flex-col border-2 border-transparent p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-700/20 hover:shadow-xl"
                >
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-xl ring-1 ring-inset ${TONE_BOX[action.tone]}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-[16.5px] font-bold text-ink-950">
                    {action.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-ink-500">
                    {action.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-teal-700">
                    এগিয়ে যান
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
