import { useState } from "react";
import { CirclePlus, MapPin, X } from "lucide-react";
import { ADMINISTRATIVE_AREAS, findAreaNode } from "@/components/profiles/data/administrativeAreas";
import { areaLeafName, areaPath } from "@/components/profiles/lib/fields";
import { cn } from "@/components/profiles/lib/utils";
import { ChevronDown } from "lucide-react";
const selectCls =
  "w-full appearance-none truncate rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-sm font-medium text-slate-800 shadow-[0_1px_1px_rgba(15,23,42,0.04)] outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";
function sameArea(a, b) {
  return (
    a.division === b.division &&
    a.district === b.district &&
    (a.upazila ?? "") === (b.upazila ?? "") &&
    (a.union ?? "") === (b.union ?? "")
  );
}

/**
 * Many-to-many style selector for responder assigned areas.
 * Chips with remove + cascading selector + "এলাকা যোগ করুন".
 */
export default function MultiAreaSelect({
  value,
  onChange,
  idPrefix = "multi-area",
}) {
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const divisions = ADMINISTRATIVE_AREAS;
  const districts = findAreaNode(divisions, division)?.children ?? [];
  const upazilas = findAreaNode(districts, district)?.children ?? [];
  const resetDraft = () => {
    setDivision("");
    setDistrict("");
    setUpazila("");
  };
  const addArea = () => {
    if (!division || !district) return;
    const next = {
      division,
      district,
      ...(upazila
        ? {
            upazila,
          }
        : {}),
    };
    if (value.some((existing) => sameArea(existing, next))) {
      resetDraft();
      return;
    }
    onChange([...value, next]);
    resetDraft();
  };
  const removeArea = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };
  return (
    <div>
      {value.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((area, index) => (
            <span
              key={`${areaPath(area).join("/")}-${index}`}
              title={areaPath(area).join(" → ")}
              className="group inline-flex items-center gap-1.5 rounded-full border border-cyan-200/90 bg-cyan-50 py-1 pl-3 pr-1.5 text-xs font-semibold text-cyan-800"
            >
              <MapPin className="size-3 text-cyan-600" strokeWidth={2.4} />
              {areaLeafName(area)}
              <button
                type="button"
                onClick={() => removeArea(index)}
                aria-label={`${areaLeafName(area)} সরান`}
                className="flex size-4.5 items-center justify-center rounded-full text-cyan-500 transition-colors hover:bg-rose-100 hover:text-rose-600"
              >
                <X className="size-3.5" strokeWidth={2.6} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-3.5">
        <div className="grid gap-2.5 sm:grid-cols-3">
          {[
            {
              label: "বিভাগ",
              val: division,
              setVal: (v) => {
                setDivision(v);
                setDistrict("");
                setUpazila("");
              },
              options: divisions,
              disabled: false,
            },
            {
              label: "জেলা",
              val: district,
              setVal: (v) => {
                setDistrict(v);
                setUpazila("");
              },
              options: districts,
              disabled: !division,
            },
            {
              label: "উপজেলা (ঐচ্ছিক)",
              val: upazila,
              setVal: setUpazila,
              options: upazilas,
              disabled: !district || upazilas.length === 0,
            },
          ].map(({ label, val, setVal, options, disabled }) => (
            <div key={label} className="relative min-w-0">
              <select
                value={val}
                disabled={disabled}
                onChange={(event) => setVal(event.target.value)}
                aria-label={label}
                className={cn(selectCls, !val && "text-slate-400")}
                id={`${idPrefix}-${label}`}
              >
                <option value="">{label}</option>
                {options.map((node) => (
                  <option key={node.name} value={node.name}>
                    {node.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addArea}
          disabled={!division || !district}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-[13px] font-semibold text-teal-700 transition-colors hover:bg-teal-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
        >
          <CirclePlus className="size-4" strokeWidth={2.3} />
          এলাকা যোগ করুন
        </button>
      </div>
    </div>
  );
}
