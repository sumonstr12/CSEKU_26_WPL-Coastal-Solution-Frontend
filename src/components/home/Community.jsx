import { Link } from "react-router-dom";
import { HandHeart, Quote } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Statistics from "@/components/Statistics";
import volunteersImg from "@/assets/volunteers.jpg";
import { COMMUNITY_STATS } from "@/data/site";
export default function Community() {
  return (
    <section className="py-14 md:py-20">
      <div className="site-container grid items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            eyebrow="সম্প্রদায়ের অংশগ্রহণ"
            title="আপনার একটি রিপোর্ট একটি জীবন বাঁচাতে পারে"
            description="স্থানীয় মানুষের কাছ থেকে পাওয়া দ্রুত ও নির্ভরযোগ্য তথ্য দুর্যোগ মোকাবিলায় গুরুত্বপূর্ণ ভূমিকা রাখে। আপনার এলাকার ছবি বা খবর পাঠালে কর্তৃপক্ষ দ্রুত সিদ্ধান্ত নিতে পারে।"
          />
          <Statistics items={COMMUNITY_STATS} className="mt-7 sm:grid-cols-2" />
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/report" className="btn btn-primary">
              এখনই রিপোর্ট করুন
            </Link>
            <Link to="/register" className="btn btn-outline">
              <HandHeart className="h-4 w-4" aria-hidden="true" />
              স্বেচ্ছাসেবক হিসেবে যুক্ত হোন
            </Link>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative">
          <img
            src={volunteersImg}
            alt="কমলা লাইফ জ্যাকেট পরা কমিউনিটি স্বেচ্ছাসেবকরা উদ্ধার নৌকার পাশে প্রস্তুতি নিচ্ছে"
            className="h-[340px] w-full rounded-3xl object-cover shadow-2xl ring-1 ring-black/10 sm:h-[420px]"
            loading="lazy"
          />
          <figure className="absolute right-3 bottom-4 left-3 rounded-2xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur sm:right-6 sm:left-8">
            <Quote className="h-5 w-5 text-teal-700" aria-hidden="true" />
            <blockquote className="mt-1.5 text-[13.5px] leading-relaxed font-medium text-ink-700">
              "গত বর্ষায় স্থানীয়দের রিপোর্টে আমরা ৪০০-এর বেশি পরিবারকে বন্যার
              পানি ওঠার আগেই আশ্রয়কেন্দ্রে সরিয়ে নিতে পেরেছি।"
            </blockquote>
            <figcaption className="mt-2 text-[12px] font-bold text-ink-500">
              শ্যামল মণ্ডল — স্বেচ্ছাসেবক দলনেতা, কয়রা, খুলনা
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
