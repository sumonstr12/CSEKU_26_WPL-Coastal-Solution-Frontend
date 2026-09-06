import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CircleCheck,
  CloudSun,
  LifeBuoy,
  MapPin,
  Megaphone,
  Phone,
  Search,
  ShieldCheck,
  Siren,
  TriangleAlert,
  Users,
  Warehouse,
  WavesHorizontal,
} from "lucide-react";
import heroCoast from "../assets/hero-coast.jpg";
import reliefTeam from "../assets/relief-team.jpg";
import PublicNavbar from "../components/layout/PublicNavbar";
import Footer from "../components/layout/Footer";
import SchematicMap from "../components/dashboard/SchematicMap";
import QuickActions from "../components/dashboard/QuickActions";
import { Meter } from "../components/dashboard/Charts";
import { SeverityPill } from "../components/ui/Badge";
import { dashboardService } from "../services/dashboardService";
import { useDashboard } from "../hooks/useDashboard";
import { disasterType } from "../config/disasterTypes";
import { bn, bnNum, clockBn } from "../utils/format";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  const { data } = useDashboard(() => dashboardService.getPublicOverview(), []);
  const { isAuthed } = useAuth();

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const stats = data?.stats || { activeDisasters: 4, shelters: 118, volunteers: 312, reportsToday: 48 };
  const alert = data?.alert;

  const statCards = [
    { label: "সক্রিয় দুর্যোগ", value: stats.activeDisasters, icon: TriangleAlert, box: "bg-orange-50 text-orange-600" },
    { label: "নিবন্ধিত আশ্রয়কেন্দ্র", value: stats.shelters, icon: Warehouse, box: "bg-sky-50 text-sky-600" },
    { label: "সক্রিয় স্বেচ্ছাসেবক", value: stats.volunteers, icon: Users, box: "bg-emerald-50 text-emerald-600" },
    { label: "আজকের রিপোর্ট", value: stats.reportsToday, icon: Megaphone, box: "bg-lagoon-50 text-lagoon-600" },
  ];

  const steps = [
    { icon: Megaphone, title: "১. রিপোর্ট করুন", desc: "ঘূর্ণিঝড়, জলোচ্ছ্বাস, নদীভাঙন বা বন্যা — যেকোনো দুর্যোগের ছবিসহ তথ্য পাঠান মাত্র ২ মিনিটে।" },
    { icon: ShieldCheck, title: "২. যাচাই ও সমন্বয়", desc: "স্থানীয় স্বেচ্ছাসেবক ও প্রশাসন রিপোর্ট যাচাই করে ঝুঁকি অনুযায়ী অগ্রাধিকার নির্ধারণ করে।" },
    { icon: LifeBuoy, title: "৩. দ্রুত সাড়া", desc: "উদ্ধারকারী দল ও আশ্রয়কেন্দ্র স্বয়ংক্রিয়ভাবে অবহিত হয় — সহায়তা পৌঁছে যায় দ্রুততম পথে।" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar onAnchor={scrollTo} />

      {/* live alert ticker */}
      {alert && (
        <Link to={isAuthed ? "/dashboard/map" : "/login"} className="block bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2.5 px-4 py-2 text-center text-[12.5px] font-bold sm:px-6">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute h-full w-full animate-ping-soft rounded-full bg-white" />
              <span className="relative h-2 w-2 rounded-full bg-white" />
            </span>
            <span className="truncate">
              {alert.title} — {(alert.areas || []).join(", ")} {alert.signal ? `• ${alert.signal}` : ""}
            </span>
            <ArrowRight size={14} className="shrink-0" />
          </div>
        </Link>
      )}

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-lagoon-50/80 via-white to-white">
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-lagoon-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:pb-20 lg:pt-16">
          <div className="animate-fade-up">
            <span className="chip bg-lagoon-100/80 text-lagoon-700 ring-1 ring-lagoon-200">
              <WavesHorizontal size={12} />
              বাংলাদেশ উপকূলীয় দুর্যোগ নেটওয়ার্ক
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-[1.25] text-slate-800 sm:text-4xl lg:text-[42px] lg:leading-[1.2]">
              উপকূলের সুরক্ষায়, <span className="bg-gradient-to-r from-lagoon-600 to-sky-600 bg-clip-text text-transparent">আপনার একটি রিপোর্টই</span> হতে পারে সবচেয়ে বড় সাহায্য
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-slate-500">
              ঘূর্ণিঝড়, জলোচ্ছ্বাস, বন্যা বা নদীভাঙন — দেখুন, রিপোর্ট করুন, জানুন নিকটস্থ আশ্রয়কেন্দ্র। নাগরিক, স্বেচ্ছাসেবক, উদ্ধারকারী ও প্রশাসন — সবাই এক প্ল্যাটফর্মে।
            </p>

            <div className="mt-7">
              <QuickActions
                title=""
                actions={[
                  { to: isAuthed ? "/dashboard/report-disaster" : "/register", icon: Megaphone, label: "দুর্যোগ রিপোর্ট করুন", desc: "মাত্র ২ মিনিটে", tone: "primary" },
                  { to: isAuthed ? "/dashboard/shelters" : "/login", icon: Warehouse, label: "আশ্রয়কেন্দ্র খুঁজুন", desc: "নিকটস্থ তালিকা", tone: "soft" },
                  { to: "/#map", icon: Search, label: "লাইভ মানচিত্র", desc: "পরিস্থিতি দেখুন", tone: "soft" },
                ]}
              />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {statCards.map((s) => (
                <div key={s.label} className="rounded-2xl border border-slate-100 bg-white p-3.5 shadow-card">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${s.box}`}>
                    <s.icon size={16} />
                  </span>
                  <p className="mt-2 text-xl font-bold text-slate-800">{bnNum(s.value)}</p>
                  <p className="text-[11px] font-medium text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* hero media */}
          <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-lift">
              <img src={heroCoast} alt="বাংলাদেশের উপকূলীয় বদ্বীপ" className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-lagoon-950/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                <div>
                  <p className="text-[11px] font-medium text-white/70">সুন্দরবন ডেল্টা, খুলনা উপকূল</p>
                  <p className="text-sm font-bold">১৯টি উপকূলীয় জেলা — এক নজরে</p>
                </div>
                <span className="chip bg-white/15 text-white backdrop-blur">
                  <CloudSun size={11} /> মৌসুম: বর্ষা
                </span>
              </div>
            </div>

            {/* floating cards */}
            <div className="absolute -left-3 top-6 hidden animate-pop-in rounded-2xl border border-slate-100 bg-white/95 p-3.5 shadow-lift backdrop-blur sm:block" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <Siren size={18} />
                </span>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">সক্রিয় সতর্কতা</p>
                  <p className="text-[13px] font-bold text-slate-700">বিপৎ সংকেত ৬ জারি</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 right-6 hidden animate-pop-in rounded-2xl border border-slate-100 bg-white/95 p-3.5 shadow-lift backdrop-blur sm:block" style={{ animationDelay: "550ms" }}>
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CircleCheck size={18} />
                </span>
                <div>
                  <p className="text-[11px] font-medium text-slate-400">সর্বশেষ ২৪ ঘণ্টায়</p>
                  <p className="text-[13px] font-bold text-slate-700">{bnNum(216)} জন উদ্ধার হয়েছেন</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ NEWS / LATEST REPORTS ============ */}
      <section id="news" className="scroll-mt-20 border-y border-slate-100 bg-mist/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-lagoon-600">সর্বশেষ আপডেট</p>
              <h2 className="mt-1.5 text-2xl font-bold text-slate-800">দুর্যোগের খবর</h2>
            </div>
            <Link to={isAuthed ? "/dashboard/map" : "/login"} className="btn-soft !py-2 text-[13px]">
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {(data?.reports || []).slice(0, 6).map((r) => {
              const t = disasterType(r.type);
              return (
                <Link key={r.id} to={isAuthed ? "/dashboard/map" : "/login"} className="card group flex items-start gap-3.5 p-4 transition hover:-translate-y-0.5 hover:shadow-lift">
                  <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${t.iconBox}`}>
                    <t.icon size={19} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-bold text-slate-700 group-hover:text-lagoon-700">{r.title}</p>
                    <p className="mt-1 flex items-center gap-1 text-[11.5px] text-slate-400">
                      <MapPin size={11} /> {r.upazila}, {r.district} • {clockBn(r.time)}
                    </p>
                    <div className="mt-2">
                      <SeverityPill severity={r.severity} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS / REPORT ============ */}
      <section id="report" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mx-auto mb-10 max-w-xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-lagoon-600">কীভাবে কাজ করে</p>
            <h2 className="mt-1.5 text-2xl font-bold text-slate-800">তিন ধাপে জরুরি সাড়া</h2>
            <p className="mt-2 text-sm text-slate-500">মাঠের তথ্য থেকে সমন্বিত উদ্ধার — সম্পূর্ণ চক্রটি স্বচ্ছ ও দ্রুত।</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="card group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-lift">
                <span className="absolute -right-4 top-3 text-7xl font-black text-lagoon-50 transition group-hover:text-lagoon-100/70">{bn(i + 1)}</span>
                <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-lagoon-500 to-lagoon-700 text-white shadow-md shadow-lagoon-600/25">
                  <s.icon size={22} />
                </span>
                <h3 className="relative mt-4 text-base font-bold text-slate-800">{s.title}</h3>
                <p className="relative mt-2 text-[13px] leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link to={isAuthed ? "/dashboard/report-disaster" : "/register"} className="btn-primary px-6 py-3 text-base">
              <Megaphone size={18} />
              এখনই রিপোর্ট করুন
            </Link>
          </div>
        </div>
      </section>

      {/* ============ SHELTERS ============ */}
      <section id="shelters" className="scroll-mt-20 border-y border-slate-100 bg-mist/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-lagoon-600">নিরাপদ আশ্রয়</p>
              <h2 className="mt-1.5 text-2xl font-bold text-slate-800">আশ্রয়কেন্দ্রসমূহ</h2>
            </div>
            <Link to={isAuthed ? "/dashboard/shelters" : "/login"} className="btn-soft !py-2 text-[13px]">
              সব আশ্রয়কেন্দ্র <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {(data?.shelters || []).map((s) => (
              <div key={s.id} className="card p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Warehouse size={19} />
                  </span>
                  <span className="chip bg-sky-50 text-sky-700">{s.distance}</span>
                </div>
                <h3 className="mt-3 line-clamp-2 min-h-[40px] text-sm font-bold text-slate-800">{s.name}</h3>
                <p className="mt-1 text-xs text-slate-400">
                  {s.upazila}, {s.district}
                </p>
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-[11.5px] font-medium text-slate-500">
                    <span>ধারণক্ষমতা {bnNum(s.capacity)}</span>
                    <span>আশ্রিত {bnNum(s.occupied)}</span>
                  </div>
                  <Meter value={s.occupied} max={s.capacity} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MAP ============ */}
      <section id="map" className="scroll-mt-20 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[380px_1fr] lg:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-lagoon-600">লাইভ পরিস্থিতি</p>
            <h2 className="mt-1.5 text-2xl font-bold text-slate-800">দুর্যোগ মানচিত্র</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              উপকূলীয় জেলাগুলোর সর্বশেষ ঘটনা, ঝুঁকিপূর্ণ এলাকা ও আশ্রয়কেন্দ্রের অবস্থান এক নজরে। ড্যাশবোর্ডে লগইন করে বিস্তারিত ফিল্টার ও রিয়েলটাইম তথ্য দেখুন।
            </p>
            <ul className="mt-5 space-y-2.5">
              {["জেলাভিত্তিক ঝুঁকি সূচক", "সক্রিয় রিপোর্টের গুরুত্ব-চিহ্ন", "আশ্রয়কেন্দ্রের অবস্থান ও ধারণক্ষমতা"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm font-medium text-slate-600">
                  <CircleCheck size={16} className="text-emerald-500" />
                  {t}
                </li>
              ))}
            </ul>
            <Link to={isAuthed ? "/dashboard/map" : "/login"} className="btn-primary mt-6">
              পূর্ণ মানচিত্র দেখুন
              <ArrowRight size={16} />
            </Link>
          </div>
          <SchematicMap reports={data?.reports || []} shelters={data?.shelters || []} districts={data?.mapDistricts || []} compact={false} className="mx-auto max-w-md shadow-card" />
        </div>
      </section>

      {/* ============ AWARENESS ============ */}
      <section id="awareness" className="scroll-mt-20 border-y border-slate-100 bg-mist/60">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-3xl border-4 border-white shadow-lift">
              <img src={reliefTeam} alt="উদ্ধারকারী দল ত্রাণ বিতরণ করছে" className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-2 hidden rounded-2xl border border-slate-100 bg-white p-3.5 shadow-lift sm:block">
              <p className="flex items-center gap-2 text-[13px] font-bold text-slate-700">
                <Users size={15} className="text-emerald-500" />
                {bnNum(12400)}+ প্রশিক্ষিত স্বেচ্ছাসেবক
              </p>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-xs font-bold uppercase tracking-widest text-lagoon-600">প্রস্তুতিই রক্ষা</p>
            <h2 className="mt-1.5 text-2xl font-bold text-slate-800">সচেতনতা ও প্রস্তুতি নির্দেশিকা</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              দুর্যোগের আগে-পরে করণীয় জানা থাকলে প্রাণ ও সম্পদ রক্ষা করা যায়। পারিবারিক প্রস্তুতি পরিকল্পনা তৈরি করুন আজই।
            </p>
            <div className="mt-6 space-y-3">
              {[
                { icon: WavesHorizontal, title: "ঘূর্ণিঝড় প্রস্তুতি তালিকা", desc: "পরিবারের জরুরি ব্যাগে কী কী রাখবেন" },
                { icon: BookOpen, title: "আশ্রয়কেন্দ্র নির্দেশিকা", desc: "কখন ও কীভাবে আশ্রয় নেবেন" },
                { icon: Phone, title: "জরুরি যোগাযোগ তালিকা", desc: "সব হটলাইন এক জায়গায়" },
              ].map((a) => (
                <Link key={a.title} to={isAuthed ? "/dashboard/awareness" : "/login"} className="card group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:shadow-lift">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lagoon-50 text-lagoon-600">
                    <a.icon size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-700 group-hover:text-lagoon-700">{a.title}</p>
                    <p className="text-xs text-slate-400">{a.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-lagoon-500" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT / CTA ============ */}
      <section id="about" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lagoon-700 via-lagoon-800 to-lagoon-900 px-6 py-12 text-center text-white sm:px-12">
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-lagoon-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-sky-400/20 blur-3xl" />
            <WavesHorizontal size={36} className="mx-auto text-lagoon-300" />
            <h2 className="relative mx-auto mt-4 max-w-2xl text-2xl font-bold leading-snug sm:text-3xl">
              একসাথে থাকলেই উপকূল নিরাপদ
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-relaxed text-lagoon-100/85">
              CoastalGuard BD নাগরিক, স্বেচ্ছাসেবক, উদ্ধারকারী, স্থানীয় প্রশাসন ও দুর্যোগ ব্যবস্থাপনা কর্মকর্তাদের একই প্ল্যাটফর্মে যুক্ত করে — যাতে প্রতিটি সেকেন্ড কাজে লাগে।
            </p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/register" className="btn bg-white px-5 py-2.5 font-bold text-lagoon-800 hover:bg-lagoon-50 active:scale-[0.98]">
                নিবন্ধন করুন — বিনামূল্যে
              </Link>
              <Link to="/login" className="btn border border-white/30 px-5 py-2.5 font-bold text-white hover:bg-white/10 active:scale-[0.98]">
                লগইন
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
