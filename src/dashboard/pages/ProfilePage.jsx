import { useState } from "react";
import { AtSign, CalendarDays, CircleCheck, KeyRound, Landmark, LoaderCircle, MapPin, NotebookPen, Pencil, Phone, ShieldCheck, UserRound } from "lucide-react";
import ErrorState from "../components/dashboard/ErrorState";
import Panel, { PageHeader } from "../components/dashboard/Panel";
import RecentActivity from "../components/dashboard/RecentActivity";
import { PanelSkeleton, StatGridSkeleton } from "../components/dashboard/Skeletons";
import { StatGrid } from "../components/dashboard/StatCard";
import { AvailabilityPill } from "../components/ui/Badge";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../hooks/useDashboard";
import { roleOf } from "../config/roleConfig";
import { dashboardService } from "../services/dashboardService";
import { dateBn } from "../utils/format";
import { cn } from "../utils/cn.js";

const ROLE_DUTIES = {
  CITIZEN: ["দুর্যোগ রিপোর্ট জমা দেওয়া", "আশ্রয়কেন্দ্র ও সতর্কতার তথ্য দেখা", "নিজ এলাকার ঘটনা অনুসরণ"],
  COMMUNITY_VOLUNTEER: ["কমিউনিটি রিপোর্ট প্রাথমিক তদন্ত সহায়তা", "আশ্রয়কেন্দ্র ও ত্রাণ কার্যক্রমে সহায়তা", "এলাকায় সচেতনতা কার্যক্রম"],
  RESPONDER: ["জরুরি উদ্ধার মিশনে অংশগ্রহণ", "জরুরি অনুরোধে সাড়া প্রদান", "মাঠ পরিস্থিতি তাৎক্ষণিক জানানো"],
  LOCAL_AUTHORITY: ["নাগরিক রিপোর্ট যাচাই", "স্থানীয় আশ্রয়কেন্দ্র তত্ত্বাবধান", "উদ্ধার কার্যক্রম সমন্বয়"],
  DISASTER_MANAGEMENT_OFFICER: ["আঞ্চলিক দুর্যোগ পর্যবেক্ষণ", "ঝুঁকি বিশ্লেষণ ও পূর্বাভাস", "বহু-জেলা সমন্বিত সাড়াদান"],
  SYSTEM_ADMINISTRATOR: ["ব্যবহারকারী ও ভূমিকা ব্যবস্থাপনা", "সিস্টেম স্বাস্থ্য নজরদারি", "প্রশাসনিক কাঠামো হালনাগাদ"],
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const role = roleOf(user.role);
  const { data, loading, error, refetch } = useDashboard(() => dashboardService.getProfileData(user), [user.role]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email || "", district: user.district, upazila: user.upazila });
  const [saving, setSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    updateUser({ ...form });
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* identity banner */}
      <div className="relative mb-6 overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-lagoon-700 via-lagoon-600 to-sky-700" />
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center gap-5 p-6 text-white">
          <span className={cn("inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl font-bold shadow-lg ring-4 ring-white/20", role.avatar)}>
            {user.name.slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-bold sm:text-2xl">{user.name}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="chip bg-white/15 text-white backdrop-blur">
                <role.icon size={11} />
                {role.label}
              </span>
              {user.availability && <AvailabilityPill status={user.availability} />}
            </div>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-lagoon-50/85">
              {user.organization && <span className="inline-flex items-center gap-1"><Landmark size={11} />{user.organization}</span>}
              <span className="inline-flex items-center gap-1"><MapPin size={11} />{user.upazila}, {user.district}</span>
              <span className="inline-flex items-center gap-1"><CalendarDays size={11} />যুক্ত হয়েছেন {dateBn(user.joinedAt)}</span>
            </p>
          </div>
          <button onClick={() => setEditing((v) => !v)} className="btn bg-white/15 px-3.5 py-2 text-[13px] font-bold text-white backdrop-blur hover:bg-white/25 active:scale-95">
            <Pencil size={13} />
            {editing ? "বাতিল" : "সম্পাদনা"}
          </button>
        </div>
      </div>

      {/* stats */}
      {loading ? (
        <StatGridSkeleton count={3} />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <StatGrid stats={data.stats} columns={3} />
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* personal info */}
        <Panel title="ব্যক্তিগত তথ্য" icon={UserRound} subtitle="আপনার অ্যাকাউন্টের প্রাথমিক তথ্য">
          <div className="space-y-4">
            {[
              { key: "name", label: "পূর্ণ নাম", icon: UserRound, editable: true },
              { key: "phone", label: "মোবাইল নম্বর", icon: Phone, value: user.phone, editable: false, note: "যাচাইকৃত" },
              { key: "email", label: "ইমেইল", icon: AtSign, editable: true },
              { key: "upazila", label: "উপজেলা", icon: MapPin, editable: true },
              { key: "district", label: "জেলা", icon: MapPin, editable: true },
            ].map((f) => {
              const value = f.key === "name" ? form.name : f.key === "email" ? form.email : f.key === "upazila" ? form.upazila : f.key === "district" ? form.district : f.value;
              return (
                <div key={f.key} className="flex items-center gap-3.5">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                    <f.icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {f.label}
                      {f.note && <span className="chip bg-emerald-50 !px-1.5 !py-0 !text-[9px] text-emerald-600">{f.note}</span>}
                    </p>
                    {editing && f.editable ? (
                      <input className="input mt-1 !py-1.5 text-[13px]" value={value || ""} onChange={(e) => setForm((x) => ({ ...x, [f.key]: e.target.value }))} />
                    ) : (
                      <p className="truncate text-sm font-bold text-slate-700">{value || "—"}</p>
                    )}
                  </div>
                </div>
              );
            })}
            {editing && (
              <button onClick={saveProfile} disabled={saving} className="btn-primary w-full">
                {saving ? <LoaderCircle size={15} className="animate-spin" /> : <CircleCheck size={15} />}
                পরিবর্তন সংরক্ষণ করুন
              </button>
            )}
          </div>
        </Panel>

        <div className="space-y-6">
          {/* role & duties */}
          <Panel title="ভূমিকা ও দায়িত্ব" icon={role.icon} subtitle={`${role.labelEn} হিসেবে আপনার অনুমতিসমূহ`}>
            <ul className="space-y-2.5">
              {ROLE_DUTIES[user.role].map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-[13px] text-slate-600">
                  <CircleCheck size={15} className="mt-0.5 shrink-0 text-emerald-500" />
                  {d}
                </li>
              ))}
            </ul>
            {user.designation && (
              <p className="mt-4 rounded-xl bg-lagoon-50/70 px-4 py-3 text-[12.5px] text-lagoon-800">
                <b>পদবি:</b> {user.designation}
              </p>
            )}
          </Panel>

          {/* security — never exposes secrets */}
          <Panel title="অ্যাকাউন্ট নিরাপত্তা" icon={ShieldCheck}>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                    <KeyRound size={16} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-slate-700">পাসওয়ার্ড</p>
                    <p className="text-[11px] text-slate-400">•••••••••• — সর্বশেষ পরিবর্তন ৩ মাস আগে</p>
                  </div>
                </div>
                <button onClick={() => { setPwSaved(true); setTimeout(() => setPwSaved(false), 3500); }} className="btn-secondary !px-3 !py-1.5 text-[12px]">
                  পরিবর্তন করুন
                </button>
              </div>
              {pwSaved && (
                <p className="chip animate-fade-in bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                  <CircleCheck size={12} />
                  নতুন পাসওয়ার্ডের লিংক আপনার মোবাইলে পাঠানো হয়েছে
                </p>
              )}
              <div className="rounded-xl bg-sand-50 px-4 py-3 text-[12px] leading-relaxed text-sand-700">
                <NotebookPen size={13} className="mr-1.5 inline-block text-sand-500" />
                নিরাপত্তার স্বার্থে আপনার পাসওয়ার্ড, OTP বা সেশন-টোকেন কখনোই এই পাতায় প্রদর্শিত হয় না।
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* recent activity */}
      <div className="mt-6">
        <Panel title="সাম্প্রতিক কার্যক্রম" subtitle="আপনার অ্যাকাউন্টের সর্বশেষ ঘটনা">
          {loading ? <PanelSkeleton lines={3} /> : <RecentActivity items={data?.activities || []} />}
        </Panel>
      </div>
    </div>
  );
}
