import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { BrandMark } from "../dashboard/Sidebar";
import { cn } from "../../utils/cn.js";

const LINKS = [
  { to: "/", label: "হোম", end: true },
  { to: "/#news", label: "দুর্যোগের খবর", anchor: "news" },
  { to: "/#report", label: "রিপোর্ট করুন", anchor: "report" },
  { to: "/#shelters", label: "আশ্রয়কেন্দ্র", anchor: "shelters" },
  { to: "/#map", label: "মানচিত্র", anchor: "map" },
  { to: "/#awareness", label: "সচেতনতা", anchor: "awareness" },
  { to: "/#about", label: "আমাদের সম্পর্কে", anchor: "about" },
];

/** Public website navbar — shown ONLY outside the dashboard */
export default function PublicNavbar({ onAnchor }) {
  const [open, setOpen] = useState(false);
  const { isAuthed } = useAuth();
  const navigate = useNavigate();

  const go = (anchor) => (e) => {
    if (anchor) {
      e.preventDefault();
      setOpen(false);
      onAnchor?.(anchor);
    } else {
      setOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <BrandMark />

        <nav className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((l) =>
            l.anchor ? (
              <a key={l.label} href={`#${l.anchor}`} onClick={go(l.anchor)} className="rounded-lg px-3 py-2 text-[13.5px] font-semibold text-slate-600 transition hover:bg-lagoon-50 hover:text-lagoon-700">
                {l.label}
              </a>
            ) : (
              <NavLink key={l.label} to={l.to} end className={({ isActive }) => cn("rounded-lg px-3 py-2 text-[13.5px] font-semibold transition", isActive ? "bg-lagoon-100/70 text-lagoon-800" : "text-slate-600 hover:bg-lagoon-50 hover:text-lagoon-700")}>
                {l.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthed ? (
            <button onClick={() => navigate("/dashboard")} className="btn-primary py-2!">
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">ড্যাশবোর্ড</span>
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-ghost hidden py-2! font-semibold sm:inline-flex">
                লগইন
              </Link>
              <Link to="/register" className="btn-primary py-2!">
                নিবন্ধন করুন
              </Link>
            </>
          )}
          <button onClick={() => setOpen((v) => !v)} className="btn-icon lg:hidden" aria-label="মেনু">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="animate-fade-in border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          {LINKS.map((l) =>
            l.anchor ? (
              <a key={l.label} href={`#${l.anchor}`} onClick={go(l.anchor)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-lagoon-50">
                {l.label}
              </a>
            ) : (
              <NavLink key={l.label} to={l.to} end onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-lagoon-50">
                {l.label}
              </NavLink>
            )
          )}
          {!isAuthed && (
            <Link to="/login" onClick={() => setOpen(false)} className="mt-1 block rounded-lg bg-lagoon-600 px-3 py-2.5 text-center text-sm font-bold text-white">
              লগইন
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
