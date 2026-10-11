import { Fragment, useState } from "react";
import { BadgeCheck, ChevronDown, MapPin, Users, CircleCheck, Pencil, Trash2 } from "lucide-react";
import { disasterType } from "../../config/disasterTypes";
import { SeverityPill, StatusPill } from "../ui/Badge";
import EmptyState from "./EmptyState";
import { bnNum, clockBn } from "../../utils/format";
import { cn } from "../../utils/cn.js";

const isPendingStatus = (status) => {
  const s = String(status || "").toUpperCase();
  return s === "PENDING" || s === "SUBMITTED" || s === "UNDER_REVIEW";
};

/**
 * Reusable disaster report table — responsive (table ≥ sm, cards on mobile),
 * expandable rows, optional verify/reject actions (always visible when pending).
 */
export default function ReportTable({
  items,
  showReporter = false,
  expandable = true,
  onVerify,
  verifyBusy,
  onEdit,
  onDelete,
  actionBusy,
  onRowClick,
  empty = {},
}) {
  const [openId, setOpenId] = useState(null);
  const CATEGORY_TYPE = {
    1: "cyclone",
    2: "surge",
    3: "flood",
    4: "erosion",
    5: "rainfall",
    6: "salinity",
    7: "waterlogging",
  };

  const VALID_TYPES = new Set([
    "cyclone",
    "surge",
    "flood",
    "erosion",
    "rainfall",
    "salinity",
    "waterlogging",
  ]);

  const getReportType = (r) => {
    if (r.type && VALID_TYPES.has(r.type)) return r.type;
    if (r.category?.id && CATEGORY_TYPE[r.category.id]) return CATEGORY_TYPE[r.category.id];
    return "flood";
  };

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

  const handleRowClick = (r) => {
    if (onRowClick) {
      onRowClick(r);
      return;
    }
    toggle(r.id);
  };

  const VerifyActions = ({ r, stopPropagation }) => {
    if (!onVerify) return null;
    // Editable anytime — not only pending
    return (
      <div
        className="flex flex-wrap items-center gap-2"
        onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      >
        <select
          className="input !py-1 !text-xs"
          disabled={verifyBusy === r.id}
          defaultValue=""
          onChange={(e) => {
            const v = e.target.value;
            if (v) onVerify(r.id, v);
            e.target.value = "";
          }}
        >
          <option value="">স্ট্যাটাস…</option>
          <option value="PENDING">অপেক্ষমাণ</option>
          <option value="UNDER_REVIEW">পর্যালোচনা</option>
          <option value="VERIFY">যাচাই (সত্য)</option>
          <option value="REJECT">প্রত্যাখ্যান (মিথ্যা)</option>
          <option value="RESOLVED">সমাধানকৃত</option>
        </select>
      </div>
    );
  };

  const OwnerActions = ({ r, stopPropagation }) => {
    const canEdit = onEdit && (r.canEdit !== false) && isPendingStatus(r.status);
    const canDelete = onDelete && (r.canDelete !== false) && isPendingStatus(r.status);
    if (!canEdit && !canDelete) return null;
    return (
      <div
        className="flex flex-wrap items-center gap-2"
        onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
      >
        {canEdit && (
          <button
            type="button"
            disabled={actionBusy === r.id}
            onClick={() => onEdit(r)}
            className="btn bg-white px-3 py-1.5 text-xs font-bold text-lagoon-700 ring-1 ring-lagoon-200 hover:bg-lagoon-50 active:scale-[0.97] disabled:opacity-60"
          >
            <Pencil size={13} />
            সম্পাদনা
          </button>
        )}
        {canDelete && (
          <button
            type="button"
            disabled={actionBusy === r.id}
            onClick={() => onDelete(r)}
            className="btn bg-white px-3 py-1.5 text-xs font-bold text-red-600 ring-1 ring-red-200 hover:bg-red-50 active:scale-[0.97] disabled:opacity-60"
          >
            <Trash2 size={13} />
            মুছুন
          </button>
        )}
      </div>
    );
  };

  const showActionCol = Boolean(onVerify || onEdit || onDelete);

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
          {(r.place || r.upazila) && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={12} /> লোকেশন: <b className="text-slate-600">{r.place || `${r.upazila}, ${r.district}`}</b>
            </span>
          )}
        </div>
      </div>
      <VerifyActions r={r} />
    </div>
  );

  const colSpan = 5 + (showActionCol ? 1 : 0) + (expandable ? 1 : 0);

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
              {showActionCol && <th className="px-4 py-3 text-right">অ্যাকশন</th>}
              {expandable && <th className="w-8 px-2 py-3" />}
            </tr>
          </thead>
          <tbody>
            {items.map((r) => {
              const reportType = getReportType(r);
              const Icon = disasterType(reportType).icon;
              const open = openId === r.id;
              return (
                <Fragment key={r.id}>
                  <tr
                    onClick={() => handleRowClick(r)}
                    className={cn(
                      "border-b border-slate-50 transition",
                      (expandable || onRowClick) && "cursor-pointer hover:bg-lagoon-50/40",
                      open && "bg-lagoon-50/50"
                    )}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", disasterType(reportType).iconBox)}>
                          <Icon size={17} />
                        </span>
                        <div className="min-w-0">
                          <p className="max-w-[280px] truncate font-semibold text-slate-700">{r.title}</p>
                          <p className="text-[11px] text-slate-400">{r.id} • {disasterType(reportType).label}</p>
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
                    <td className="whitespace-nowrap px-4 py-3.5 text-right text-xs text-slate-400">{clockBn(r.incident_time || r.time)}</td>
                    {showActionCol && (
                      <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col items-end gap-2">
                          <VerifyActions r={r} stopPropagation />
                          <OwnerActions r={r} stopPropagation />
                        </div>
                      </td>
                    )}
                    {expandable && (
                      <td className="px-2 py-3.5 text-slate-300">
                        <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
                      </td>
                    )}
                  </tr>
                  {open && (
                    <tr className="border-b border-slate-100">
                      <td colSpan={colSpan} className="bg-white px-4 py-3">
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
          const reportType = getReportType(r);
          const Icon = disasterType(reportType).icon;
          const open = openId === r.id;
          return (
            <div key={r.id} className="rounded-xl border border-slate-100 bg-white p-3.5">
              <div className="flex items-start gap-3" onClick={() => handleRowClick(r)}>
                <span className={cn("inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", disasterType(reportType).iconBox)}>
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold leading-snug text-slate-700">{r.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {r.id} • {r.upazila}, {r.district} • {clockBn(r.incident_time || r.time)}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <SeverityPill severity={r.severity} />
                <StatusPill status={r.status} />
                {expandable && (
                  <button type="button" className="ml-auto text-slate-300" onClick={() => toggle(r.id)}>
                    <ChevronDown size={15} className={cn("transition-transform", open && "rotate-180")} />
                  </button>
                )}
              </div>
              {showActionCol && (
                <div className="mt-3 flex flex-col gap-2">
                  <VerifyActions r={r} />
                  <OwnerActions r={r} />
                </div>
              )}
              {open && <div className="mt-3">{detail(r)}</div>}
            </div>
          );
        })}
      </div>
    </>
  );
}