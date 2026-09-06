import { MapPin } from "lucide-react";
import {
  ACCOUNT_STATUS_UI,
  FIELD_META,
  RESPONDER_TYPE_LABELS,
  WIDE_FIELDS,
} from "@/components/profiles/config/roleConfig";
import { formatDateBn, formatPhoneBn, formatRelativeBn } from "@/components/profiles/lib/bn";
import {
  areaLeafName,
  areaPath,
  isFieldEmpty,
  resolveFieldValue,
} from "@/components/profiles/lib/fields";
import { cn } from "@/components/profiles/lib/utils";
import AdministrativeAreaDisplay from "./AdministrativeAreaDisplay";
import RoleBadge from "./RoleBadge";
import StatusBadge from "./StatusBadge";
export function renderFieldValue(fieldKey, raw, user) {
  switch (fieldKey) {
    case "date_of_birth":
    case "date_joined":
      return formatDateBn(String(raw));
    case "last_login":
      return formatRelativeBn(String(raw));
    case "phone_number":
      return formatPhoneBn(String(raw));
    case "availability_status":
      return <StatusBadge role={user.role} status={String(raw)} />;
    case "account_status": {
      const ui = ACCOUNT_STATUS_UI[String(raw)];
      if (!ui) return String(raw);
      return (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
            ui.classes,
          )}
        >
          <span className={cn("size-1.5 rounded-full", ui.dot)} />
          {ui.label}
        </span>
      );
    }
    case "role":
      return <RoleBadge role={user.role} />;
    case "responder_type":
      return RESPONDER_TYPE_LABELS[String(raw)] ?? String(raw);
    case "administrative_area":
      return <AdministrativeAreaDisplay area={raw} variant="breadcrumb" />;
    case "administrative_areas": {
      const areas = raw.filter(Boolean);
      if (areas.length === 0) return null;
      return (
        <div className="flex flex-wrap gap-2">
          {areas.map((area, index) => (
            <span
              key={`${areaPath(area).join("/")}-${index}`}
              title={areaPath(area).join(" → ")}
              className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200/80 bg-cyan-50/80 px-3 py-1 text-xs font-semibold text-cyan-800"
            >
              <MapPin className="size-3 text-cyan-600" strokeWidth={2.4} />
              {areaLeafName(area)}
            </span>
          ))}
        </div>
      );
    }
    default:
      return String(raw);
  }
}

/**
 * One definition-style field (icon + label + value).
 * Renders nothing when the value is empty — keeps the profile clean.
 */
export default function ProfileField({ fieldKey, user, className }) {
  const meta = FIELD_META[fieldKey];
  const raw = resolveFieldValue(user, fieldKey);
  if (isFieldEmpty(fieldKey, raw)) return null;
  const Icon = meta.icon;
  return (
    <div
      className={cn(
        "min-w-0",
        WIDE_FIELDS.has(fieldKey) && "sm:col-span-2",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500">
        <Icon
          className="size-3.5 shrink-0 text-teal-600/80"
          strokeWidth={2.2}
        />
        <span>{meta.label}</span>
      </div>
      <div className="mt-1.5 wrap-break-word text-sm font-medium text-slate-800 sm:text-[15px]">
        {renderFieldValue(fieldKey, raw, user)}
      </div>
    </div>
  );
}

/** Build a clean grid of profile fields from a list of keys. */
export function ProfileFieldGrid({ user, keys }) {
  return (
    <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
      {keys.map((key) => (
        <ProfileField key={key} fieldKey={key} user={user} />
      ))}
    </dl>
  );
}
