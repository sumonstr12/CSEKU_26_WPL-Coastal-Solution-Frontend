import { ChevronDown } from "lucide-react";
import {
  ADMINISTRATIVE_AREAS,
  AREA_LEVEL_LABELS,
  findAreaNode,
} from "@/components/profiles/data/administrativeAreas";
import { cn } from "@/components/profiles/lib/utils";
function LevelSelect({ level, value, options, disabled, onSelect, idPrefix }) {
  const inputId = `${idPrefix}-${level}`;
  return (
    <div className="min-w-0">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-xs font-semibold text-slate-500"
      >
        {AREA_LEVEL_LABELS[level]}
      </label>
      <div className="relative">
        <select
          id={inputId}
          value={value}
          disabled={disabled}
          onChange={(event) => onSelect(event.target.value)}
          className={cn(
            "w-full appearance-none truncate rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-9 text-sm font-medium text-slate-800 shadow-[0_1px_1px_rgba(15,23,42,0.04)] outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10",
            disabled && "cursor-not-allowed bg-slate-50 text-slate-400",
            !value && "text-slate-400",
          )}
        >
          <option value="">{`${AREA_LEVEL_LABELS[level]} নির্বাচন করুন`}</option>
          {options.map((node) => (
            <option key={node.name} value={node.name}>
              {node.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}

/**
 * Cascading administrative area selector:
 *   বিভাগ → জেলা → উপজেলা → ইউনিয়ন
 * Selecting a parent filters children and resets deeper levels.
 */
export default function AdministrativeAreaSelector({
  value,
  onChange,
  columns = 2,
  idPrefix = "area",
}) {
  const divisions = ADMINISTRATIVE_AREAS;
  const districts = findAreaNode(divisions, value?.division)?.children ?? [];
  const upazilas = findAreaNode(districts, value?.district)?.children ?? [];
  const unions = findAreaNode(upazilas, value?.upazila)?.children ?? [];
  const showUnion = Boolean(value?.upazila) && unions.length > 0;
  const handle = (level) => (name) => {
    if (level === "division")
      onChange({
        division: name || undefined,
      });
    if (level === "district")
      onChange({
        division: value?.division,
        district: name || undefined,
      });
    if (level === "upazila")
      onChange({
        division: value?.division,
        district: value?.district,
        upazila: name || undefined,
      });
    if (level === "union")
      onChange({
        division: value?.division,
        district: value?.district,
        upazila: value?.upazila,
        union: name || undefined,
      });
    void 0;
  };
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 4 ? "sm:grid-cols-4" : "sm:grid-cols-2",
      )}
    >
      <LevelSelect
        level="division"
        value={value?.division ?? ""}
        options={divisions}
        disabled={false}
        onSelect={handle("division")}
        idPrefix={idPrefix}
      />
      <LevelSelect
        level="district"
        value={value?.district ?? ""}
        options={districts}
        disabled={!value?.division}
        onSelect={handle("district")}
        idPrefix={idPrefix}
      />
      <LevelSelect
        level="upazila"
        value={value?.upazila ?? ""}
        options={upazilas}
        disabled={!value?.district}
        onSelect={handle("upazila")}
        idPrefix={idPrefix}
      />
      {showUnion ? (
        <LevelSelect
          level="union"
          value={value?.union ?? ""}
          options={unions}
          disabled={!value?.upazila}
          onSelect={handle("union")}
          idPrefix={idPrefix}
        />
      ) : null}
    </div>
  );
}
