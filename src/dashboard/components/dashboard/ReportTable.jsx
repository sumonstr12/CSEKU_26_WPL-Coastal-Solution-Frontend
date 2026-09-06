import { Fragment, useState } from "react";
import { BadgeCheck, ChevronDown, MapPin, Users, CircleCheck } from "lucide-react";
import { disasterType } from "../../config/disasterTypes";
import { SeverityPill, StatusPill } from "../ui/Badge";
import EmptyState from "./EmptyState";
import { bnNum, clockBn } from "../../utils/format";
import { cn } from "../../utils/cn.js";

/**
 * Reusable disaster report table — responsive (table ≥ sm, cards on mobile),
 * expandable rows, optional verify/reject actions.
 */
export default function ReportTable({ items, showReporter = false, expandable = true, onVerify, verifyBusy, empty = {} }) {
  const [openId, setOpenId] = useState(null);
  const TypeIcon = (t) => disasterType(t).icon;

  if (!items?.length) {
    return (
      <EmptyState
        title={empty.title || "কোনো রিপোর্ট পাওয়া যায়নি"}
        message={empty.message || "এই মুহূর্তে দেখানোর মতো কোনো রিপোর্ট নেই।"}
        actionLabel={empty.actionLabel}
        actionTo={empty.actionTo}
      />
    );
  }

  const toggle = (id) => expandable && setOpenId((v) => (v === id ? null : id));

  const detail = (r) => (
    <div className="grid gap-3 rounded-xl bg-sand-50/70 p-4 text-[13px] sm:grid-cols-[1fr_auto]">
      <div className="space-y-2">
        <p className="leading-relaxed text-slate-600">{r.description}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
          {r.affected != null && (
            <span className="inline-flex items-center gap-1">
              <Users size={12} /> ক্ষতিগ্রস্ত: <b className="text-slate-600">{bnNum(r.affected)} জন</b>
            </span>
          )}
          {r.verifiedBy && (
            <span className="inline-flex items-center gap-1">
              <CircleCheck size={12} className="text-emerald-500" /> যাচাই: <b className="text-slate-600">{r.verifiedBy}</b>
            </span>
          )}
          {showReporter && r.reporter && (
            <span className="inline-flex items-center gap-1">
              রিপোর্ট করেছেন: <b className="text-slate-600">{r.reporter.name}</b>
            </span>
          )}
        </div>
      </div>
      {onVerify && r.status === "PENDING" && (
        <div className="flex items-start gap-2">
          <button disabled={verifyBusy === r.id} onClick={() => onVerify(r.id, "VERIFY")} className="btn bg-emerald-500 px-3.5 py-2 text-xs text-white hover:bg-emerald-600 active:scale-[0.97]">
            <BadgeCheck size={14} />
            যাচাই করুন
          </button>
          <button disabled={verifyBusy === r.id} onClick={() => onVerify(r.id, "REJECT")} className="btn bg-white px-3.5 py-2 text-xs text-slate-500 ring-1 ring-slate-200 hover:text-red-600 hover:ring-red-200 active:scale-[0.97]">
            বাতিল
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* desktop / tablet table */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3">রিপোর্ট</th>
              <th className="px-4 py-3">এলাকা</th>
              <th className="px-4 py-3">গুরুত্ব</th>
              <th className="px-4 py-3">অবস্থা</th>
              <th className="px-4 py-3 text-right">সময়</th>
              {expandable && <th className="w-8 px-2 py-3" />}
            </tr>
          </thead>
          <tbody>
            {items.map((r) => {
              const Icon = TypeIcon(r.type);
              const open = openId === r.id;
              return (
                <Fragment key={r.id}>
                  <tr
                    onClick={() => toggle(r.id)}
                    className={cn("border-b border-slate-50 transition", expandable && "cursor-pointer hover:bg-lagoon-50/40", open && "bg-lagoon-50/50")}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", disasterType(r.type).iconBox)}>
                          <Icon size={17} />
                        </span>
                        <div className="min-w-0">
                          <p className="max-w-[280px] truncate font-semibold text-slate-700">{r.title}</p>
                          <p className="text-[11px] text-slate-400">{r.id} • {disasterType(r.type).label}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 whitespace-nowrap text-[13px] text-slate-500">
                        <MapPin size={12} className="text-slate-300" />
                        {r.upazila}, {r.district}
                      </span>
                    </td>
                    <td className="px-4 py-3.5"><SeverityPill severity={r.severity} /></td>
                    <td className="px-4 py-3.5"><StatusPill status={r.status} /></td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-right text-xs text-slate-400">{clockBn(r.time)}</td>
                    {expandable && (
                      <td className="px-2 py-3.5 text-slate-300">
                        <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
                      </td>
                    )}
                  </tr>
                  {open && (
                    <tr className="border-b border-slate-100">
                      <td colSpan={6} className="bg-white px-4 py-3">
                        {detail(r)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className="space-y-2.5 sm:hidden">
        {items.map((r) => {
          const Icon = TypeIcon(r.type);
          const open = openId === r.id;
          return (
            <div key={r.id} className="rounded-xl border border-slate-100 bg-white p-3.5" onClick={() => toggle(r.id)}>
              <div className="flex items-start gap-3">
                <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", disasterType(r.type).iconBox)}>
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold leading-snug text-slate-700">{r.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {r.id} • {r.upazila}, {r.district} • {clockBn(r.time)}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <SeverityPill severity={r.severity} />
                <StatusPill status={r.status} />
                {expandable && <ChevronDown size={15} className={cn("ml-auto text-slate-300 transition-transform", open && "rotate-180")} />}
              </div>
              {open && <div className="mt-3">{detail(r)}</div>}
            </div>
          );
        })}
      </div>
    </>
  );
}
