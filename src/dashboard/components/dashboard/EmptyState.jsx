import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { cn } from "../../utils/cn.js";

/** Friendly empty state with optional call-to-action */
export default function EmptyState({ icon: Icon = Search, title, message, actionLabel, actionTo, onAction, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-lagoon-50 text-lagoon-400">
        <Icon size={30} strokeWidth={1.6} />
      </span>
      <h3 className="mt-4 text-[15px] font-bold text-slate-700">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-slate-400">{message}</p>}
      {actionLabel && (actionTo ? (
        <Link to={actionTo} className="btn-primary mt-5">{actionLabel}</Link>
      ) : (
        <button onClick={onAction} className="btn-primary mt-5">{actionLabel}</button>
      ))}
    </div>
  );
}
