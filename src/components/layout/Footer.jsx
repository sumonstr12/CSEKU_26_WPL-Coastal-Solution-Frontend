import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, PhoneCall, Siren } from "lucide-react";
import Logo from "@/components/Logo";
import { HOTLINE_ITEMS, SITE } from "@/data/site";
const QUICK_LINKS = [
  {
    label: "হোম",
    path: "/",
  },
  {
    label: "দুর্যোগের খবর",
    path: "/disasters",
  },
  {
    label: "রিপোর্ট করুন",
    path: "/report",
  },
  {
    label: "আশ্রয়কেন্দ্র",
    path: "/shelters",
  },
  {
    label: "মানচিত্র",
    path: "/map",
  },
];
const EMERGENCY_LINKS = [
  {
    label: "দুর্যোগ ব্যবস্থাপনা",
    path: "/about",
  },
  {
    label: "আশ্রয়কেন্দ্র",
    path: "/shelters",
  },
  {
    label: "উদ্ধার সহায়তা",
    path: "/rescue",
  },
  {
    label: "সচেতনতা",
    path: "/awareness",
  },
];
export default function Footer() {
  return (
    <footer className="bg-deepsea-900 text-stone-300">
      <div className="site-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Brand */}
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-teal-100/75">
            {SITE.mission}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {HOTLINE_ITEMS.map((h) => (
              <a
                key={h.value}
                href={`tel:${h.digits}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-teal-50 ring-1 ring-white/10 ring-inset transition hover:bg-white/10"
              >
                <Siren
                  className="h-3.5 w-3.5 text-amber-300"
                  aria-hidden="true"
                />
                {h.label}: <span className="text-amber-300">{h.value}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="দ্রুত লিংক">
          <h3 className="text-sm font-bold tracking-wide text-white">
            দ্রুত লিংক
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.path + l.label}>
                <Link
                  to={l.path}
                  className="group inline-flex items-center gap-1.5 text-teal-100/75 transition hover:text-white"
                >
                  <ArrowUpRight
                    className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Emergency info */}
        <nav aria-label="জরুরি তথ্য">
          <h3 className="text-sm font-bold tracking-wide text-white">
            জরুরি তথ্য
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {EMERGENCY_LINKS.map((l) => (
              <li key={l.path + l.label}>
                <Link
                  to={l.path}
                  className="group inline-flex items-center gap-1.5 text-teal-100/75 transition hover:text-white"
                >
                  <ArrowUpRight
                    className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100"
                    aria-hidden="true"
                  />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-bold tracking-wide text-white">
            যোগাযোগ
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2.5 text-teal-100/75 transition hover:text-white"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 ring-inset">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                {SITE.email}
              </a>
            </li>
            <li>
              <a
                href="tel:+880241040100"
                className="flex items-center gap-2.5 text-teal-100/75 transition hover:text-white"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 ring-inset">
                  <PhoneCall className="h-4 w-4" aria-hidden="true" />
                </span>
                ফোন: {SITE.phoneBn}
              </a>
            </li>
            <li>
              <a
                href={`tel:${SITE.emergencyDigits}`}
                className="flex items-center gap-2.5 font-semibold text-amber-300 transition hover:text-amber-200"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-400/15 ring-1 ring-amber-300/30 ring-inset">
                  <Siren className="h-4 w-4" aria-hidden="true" />
                </span>
                জরুরি: {SITE.emergencyBn} (টোল-ফ্রি)
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="site-container flex flex-col items-center justify-between gap-3 py-5 text-xs text-teal-100/60 sm:flex-row">
          <p>© ২০২৬ CoastalGuard BD. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span>গোপনীয়তা নীতিমালা</span>
            <span>ব্যবহারের শর্তাবলী</span>
            <span>উপকূলীয় জনগণের জন্য নির্মিত</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
