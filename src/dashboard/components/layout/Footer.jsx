import { Link } from "react-router-dom";
import { LifeBuoy, Mail, MapPin, Phone, WavesHorizontal } from "lucide-react";

/** Public site footer — Bangladesh coastal disaster context */
export default function Footer() {
  return (
    <footer className="border-t border-lagoon-900/10 bg-lagoon-950 text-slate-300">
      {/* hotline strip */}
      <div className="border-b border-white/10 bg-white/[0.03]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-4 sm:px-6">
          {[
            { label: "জাতীয় জরুরি সেবা", number: "৯৯৯" },
            { label: "দুর্যোগ পূর্বাভাস", number: "১০৯০" },
            { label: "স্বাস্থ্য বাতায়ন", number: "১৬২৬৩" },
          ].map((h) => (
            <a key={h.number} href={`tel:${h.number}`} className="group flex items-center gap-2.5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15 text-red-300 transition group-hover:bg-red-500/25">
                <Phone size={14} />
              </span>
              <span>
                <span className="block text-[11px] text-slate-400">{h.label}</span>
                <span className="block text-sm font-bold text-white">{h.number}</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lagoon-400 to-lagoon-600 text-white">
              <WavesHorizontal size={22} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-white">
                CoastalGuard <span className="text-lagoon-300">BD</span>
              </p>
              <p className="text-[10.5px] text-slate-400">উপকূলীয় দুর্যোগ ব্যবস্থাপনা</p>
            </div>
          </div>
          <p className="mt-4 text-[13px] leading-relaxed text-slate-400">
            বাংলাদেশের উপকূলীয় জনপদের জন্য একটি সমন্বিত দুর্যোগ রিপোর্টিং, সতর্কতা ও সংকট ব্যবস্থাপনা প্ল্যাটফর্ম।
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold text-white">দ্রুত লিংক</h4>
          <ul className="space-y-2.5 text-[13px]">
            {[
              ["দুর্যোগ রিপোর্ট করুন", "/register"],
              ["আশ্রয়কেন্দ্র খুঁজুন", "/login"],
              ["স্বেচ্ছাসেবক হোন", "/register"],
              ["সচেতনতা নির্দেশিকা", "/#awareness"],
            ].map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="transition hover:text-lagoon-300">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold text-white">অঞ্চলসমূহ</h4>
          <ul className="space-y-2.5 text-[13px] text-slate-400">
            <li className="flex items-center gap-2"><MapPin size={13} className="text-lagoon-400" /> খুলনা উপকূলীয় অঞ্চল</li>
            <li className="flex items-center gap-2"><MapPin size={13} className="text-lagoon-400" /> বরিশাল উপকূলীয় অঞ্চল</li>
            <li className="flex items-center gap-2"><MapPin size={13} className="text-lagoon-400" /> চট্টগ্রাম উপকূলীয় অঞ্চল</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold text-white">যোগাযোগ</h4>
          <ul className="space-y-2.5 text-[13px] text-slate-400">
            <li className="flex items-center gap-2"><Phone size={13} className="text-lagoon-400" /> ০৯৬১২-৩৪৫৬৭৮</li>
            <li className="flex items-center gap-2"><Mail size={13} className="text-lagoon-400" /> info@coastalguard.example.gov.bd</li>
            <li className="flex items-center gap-2"><LifeBuoy size={13} className="text-lagoon-400" /> ২৪/৭ জরুরি নিয়ন্ত্রণ কক্ষ</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-[12px] text-slate-500 sm:px-6">
          <p>© ২০২৬ CoastalGuard BD — সর্বস্বত্ব সংরক্ষিত</p>
          <p>পরীক্ষামূলক ডেমো সংস্করণ — প্রকৃত তথ্যের জন্য সরকারি সূত্র দেখুন</p>
        </div>
      </div>
    </footer>
  );
}
