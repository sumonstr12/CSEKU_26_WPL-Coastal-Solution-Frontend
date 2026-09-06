import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  SquarePen,
  X,
} from "lucide-react";
import { useProfile } from "@/components/profiles/hooks/useProfile";
import { EDIT_FIELDS, FIELD_META, ROLE_CONFIG } from "@/components/profiles/config/roleConfig";
import { formatPhoneBn } from "@/components/profiles/lib/bn";
import { cn } from "@/components/profiles/lib/utils";
import AdministrativeAreaSelector from "./AdministrativeAreaSelector";
import MultiAreaSelect from "./MultiAreaSelect";
import RoleBadge from "./RoleBadge";
const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 shadow-[0_1px_1px_rgba(15,23,42,0.04)] outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";
function FieldShell({ config, children, id }) {
  return (
    <div className={cn("min-w-0", config.fullWidth && "sm:col-span-2")}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-semibold text-slate-600"
      >
        {FIELD_META[config.key].label}
        {config.key === "full_name" && (
          <span className="ml-1 text-rose-500">*</span>
        )}
      </label>
      {children}
    </div>
  );
}
export default function ProfileEditModal() {
  const { profile, editOpen, closeEdit, saveProfile, saving } = useProfile();
  const [form, setForm] = useState(null);
  const role = profile?.role;
  const fields = useMemo(() => (role ? EDIT_FIELDS[role] : []), [role]);
  const sections = useMemo(
    () => ({
      personal: fields.filter((f) => f.section === "personal"),
      role: fields.filter((f) => f.section === "role"),
    }),
    [fields],
  );

  // Initialize form when the modal opens
  useEffect(() => {
    if (editOpen && profile) {
      setForm({
        full_name: profile.full_name ?? "",
        email: profile.email ?? "",
        date_of_birth: profile.date_of_birth ?? "",
        district: profile.district ?? "",
        address: profile.address ?? "",
        organization: profile.profile?.organization ?? "",
        designation: profile.profile?.designation ?? "",
        responder_type: profile.profile?.responder_type ?? "",
        availability_status: profile.profile?.availability_status ?? "",
        administrative_area: profile.profile?.administrative_area ?? null,
        administrative_areas: profile.profile?.administrative_areas ?? [],
      });
    }
  }, [editOpen, profile]);

  // Lock page scroll + close on Escape
  useEffect(() => {
    if (!editOpen) return;
    document.documentElement.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape" && !saving) closeEdit();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [editOpen, saving, closeEdit]);
  if (!editOpen || !profile || !form || !role) return null;
  const config = ROLE_CONFIG[role];
  const update = (patch) =>
    setForm((prev) =>
      prev
        ? {
            ...prev,
            ...patch,
          }
        : prev,
    );
  const hasField = (key) => fields.some((f) => f.key === key);
  const nameValid = form.full_name.trim().length > 0;
  const getString = (key) => form[key] ?? "";
  const buildPayload = () => {
    const payload = {
      full_name: form.full_name.trim(),
      email: form.email.trim() || null,
      date_of_birth: form.date_of_birth || null,
      district: form.district || null,
      address: form.address.trim() || null,
      profile: {},
    };
    if (hasField("organization"))
      payload.profile.organization = form.organization.trim() || null;
    if (hasField("designation"))
      payload.profile.designation = form.designation.trim() || null;
    if (hasField("responder_type"))
      payload.profile.responder_type = form.responder_type || null;
    if (hasField("availability_status"))
      payload.profile.availability_status = form.availability_status || null;
    if (hasField("administrative_area"))
      payload.profile.administrative_area = form.administrative_area;
    if (hasField("administrative_areas"))
      payload.profile.administrative_areas = form.administrative_areas;
    return payload;
  };
  const handleSubmit = async () => {
    if (!nameValid || saving) return;
    await saveProfile(buildPayload());
  };
  const renderField = (field) => {
    const id = `edit-${field.key}`;
    switch (field.type) {
      case "text":
      case "email":
      case "date":
        return (
          <FieldShell key={field.key} config={field} id={id}>
            <input
              id={id}
              type={field.type}
              value={getString(field.key)}
              placeholder={field.placeholder}
              onChange={(event) =>
                update({
                  [field.key]: event.target.value,
                })
              }
              className={inputCls}
            />
          </FieldShell>
        );
      case "textarea":
        return (
          <FieldShell key={field.key} config={field} id={id}>
            <textarea
              id={id}
              rows={3}
              value={getString(field.key)}
              placeholder={field.placeholder}
              onChange={(event) =>
                update({
                  [field.key]: event.target.value,
                })
              }
              className={cn(inputCls, "resize-none leading-relaxed")}
            />
          </FieldShell>
        );
      case "select":
        return (
          <FieldShell key={field.key} config={field} id={id}>
            <div className="relative">
              <select
                id={id}
                value={getString(field.key)}
                onChange={(event) =>
                  update({
                    [field.key]: event.target.value,
                  })
                }
                className={cn(
                  inputCls,
                  "appearance-none pr-9",
                  !getString(field.key) && "text-slate-400",
                )}
              >
                <option value="">{field.placeholder ?? "নির্বাচন করুন"}</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          </FieldShell>
        );
      case "area":
        return (
          <FieldShell key={field.key} config={field} id={id}>
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-3.5">
              <AdministrativeAreaSelector
                value={form.administrative_area}
                onChange={(area) =>
                  update({
                    administrative_area: area,
                  })
                }
                idPrefix="edit-area"
              />
            </div>
          </FieldShell>
        );
      case "multi-area":
        return (
          <FieldShell key={field.key} config={field} id={id}>
            <MultiAreaSelect
              value={form.administrative_areas}
              onChange={(areas) =>
                update({
                  administrative_areas: areas,
                })
              }
            />
          </FieldShell>
        );
      default:
        return null;
    }
  };
  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="প্রোফাইল সম্পাদনা"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="বন্ধ করুন"
        onClick={() => !saving && closeEdit()}
        className="animate-fade-in absolute inset-0 cursor-default bg-slate-900/50 backdrop-blur-[2px]"
      />

      {/* Sheet / dialog */}
      <div className="animate-modal-in relative flex h-dvh w-full flex-col overflow-hidden border-slate-200/80 bg-[#F7FAFA] shadow-2xl sm:h-auto sm:max-h-[88vh] sm:max-w-2xl sm:rounded-3xl sm:border">
        <div className="h-1 w-full bg-linear-to-r from-teal-500 via-cyan-500 to-blue-600" />

        {/* Header */}
        <div className="flex items-center gap-3.5 border-b border-slate-200/70 bg-white px-5 py-4 sm:px-7">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100">
            <SquarePen className="size-5" strokeWidth={2.1} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold text-slate-800 sm:text-lg">
              প্রোফাইল সম্পাদনা
            </h2>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="truncate text-xs text-slate-500">
                {profile.full_name}
              </span>
              <RoleBadge role={role} size="sm" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => !saving && closeEdit()}
            aria-label="বন্ধ করুন"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="size-5" strokeWidth={2.2} />
          </button>
        </div>

        {/* Body */}
        <form
          className="cg-scroll flex-1 overflow-y-auto px-5 py-6 sm:px-7"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          {/* Read-only fields */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <LockKeyhole
                className="size-3.5 text-slate-400"
                strokeWidth={2.3}
              />
              নিচের তথ্যগুলো পরিবর্তন করা যাবে না
            </p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              {[
                {
                  label: "মোবাইল নম্বর",
                  value: formatPhoneBn(profile.phone_number) ?? "",
                },
                {
                  label: "ইউজারনেম",
                  value: profile.username,
                },
                {
                  label: "ভূমিকা",
                  value: config.label,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5"
                >
                  <p className="flex items-center justify-between gap-1 text-[11px] font-medium text-slate-400">
                    {item.label}
                    <LockKeyhole className="size-3 text-slate-300" />
                  </p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-slate-500">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Personal section */}
          {sections.personal.length > 0 && (
            <fieldset className="mt-7">
              <legend className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
                <span className="flex size-6 items-center justify-center rounded-lg bg-teal-100 text-[11px] font-bold text-teal-700">
                  ১
                </span>
                ব্যক্তিগত তথ্য
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                {sections.personal.map(renderField)}
              </div>
            </fieldset>
          )}

          {/* Role-specific section */}
          {sections.role.length > 0 && (
            <fieldset className="mt-8">
              <legend className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
                <span className="flex size-6 items-center justify-center rounded-lg bg-teal-100 text-[11px] font-bold text-teal-700">
                  ২
                </span>
                {config.roleCardTitle}
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                {sections.role.map(renderField)}
              </div>
            </fieldset>
          )}
        </form>

        {/* Footer */}
        <div className="flex flex-col gap-3 border-t border-slate-200/70 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <ShieldCheck className="size-3.5 text-teal-500" />
            আপনার তথ্য নিরাপদে সংরক্ষিত হয় এবং শুধু অনুমোদিত কর্তৃপক্ষ দেখতে
            পায়।
          </p>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => !saving && closeEdit()}
              disabled={saving}
              className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60 sm:flex-none"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!nameValid || saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-teal-600 to-cyan-700 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-700/25 transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none sm:flex-none"
            >
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                "পরিবর্তন সংরক্ষণ করুন"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
