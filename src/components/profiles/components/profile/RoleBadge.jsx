import { ROLE_CONFIG } from "@/components/profiles/config/roleConfig";
import { cn } from "@/components/profiles/lib/utils";
export default function RoleBadge({ role, size = "md", className }) {
  const config = ROLE_CONFIG[role];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold ring-1 ring-inset",
        config.badge,
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        className,
      )}
    >
      <Icon
        className={size === "sm" ? "size-3" : "size-3.5"}
        strokeWidth={2.3}
      />
      {config.label}
    </span>
  );
}
