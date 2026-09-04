import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  LogIn,
  MapPinned,
  Menu,
  PhoneCall,
  UserPlus,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import { HOTLINE_ITEMS, NAV_ITEMS, SITE } from "@/data/site";
import { classNames } from "@/lib/utils";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <header className="sticky top-0 z-50">
      {/* Utility strip */}
      <div className="hidden bg-deepsea-900 text-teal-50 md:block">
        <div className="site-container flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <a
              href={`tel:${HOTLINE_ITEMS[0].digits}`}
              className="inline-flex items-center gap-1.5 rounded-sm font-semibold text-amber-300 hover:text-amber-200"
            >
              <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
              জাতীয় জরুরি সেবা: {HOTLINE_ITEMS[0].value}
            </a>
            <span className="hidden text-teal-100/60 lg:inline">|</span>
            <span className="hidden items-center gap-1.5 text-teal-100/90 lg:inline-flex">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              দুর্যোগ নিয়ন্ত্রণ কক্ষ ২৪/৭ খোলা
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-teal-100/90">
            <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
            ১১টি উপকূলীয় জেলা জুড়ে সক্রিয়
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-black/5 bg-white/90 backdrop-blur-md">
        <div className="site-container flex h-[68px] items-center justify-between gap-3">
          <Link
            to="/"
            aria-label={`${SITE.name} হোম`}
            className="shrink-0 rounded-lg"
          >
            <Logo />
          </Link>

          <nav
            className="hidden items-center gap-0.5 xl:flex"
            aria-label="প্রধান নেভিগেশন"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  classNames(
                    "rounded-full px-2.5 py-2 text-[13.5px] font-medium transition-colors",
                    isActive
                      ? "bg-teal-50 font-semibold text-teal-800 ring-1 ring-teal-600/20 ring-inset"
                      : "text-ink-700 hover:bg-sand-100 hover:text-teal-800",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 xl:flex">
            <Link to="/login" className="btn btn-outline !px-4 !py-2">
              <LogIn className="h-4 w-4" aria-hidden="true" />
              লগইন
            </Link>
            <Link to="/register" className="btn btn-primary !px-4 !py-2">
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              নিবন্ধন করুন
            </Link>
          </div>

          <button
            type="button"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-xl border border-stone-200 bg-white text-ink-700 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={classNames(
          "absolute inset-x-0 top-full z-40 max-h-[calc(100vh-80px)] origin-top overflow-y-auto border-b border-stone-200 bg-white shadow-xl transition-all duration-200 xl:hidden",
          open
            ? "pointer-events-auto visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0",
        )}
      >
        <nav
          className="site-container grid gap-1 py-4"
          aria-label="মোবাইল নেভিগেশন"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                classNames(
                  "flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-medium",
                  isActive
                    ? "bg-teal-50 font-semibold text-teal-800"
                    : "text-ink-700 hover:bg-sand-100",
                )
              }
            >
              {item.label}
              <ChevronRight
                className="h-4 w-4 text-ink-300"
                aria-hidden="true"
              />
            </NavLink>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-stone-100 pt-3">
            <Link to="/login" className="btn btn-outline">
              <LogIn className="h-4 w-4" aria-hidden="true" />
              লগইন
            </Link>
            <Link to="/register" className="btn btn-primary">
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              নিবন্ধন করুন
            </Link>
          </div>
          <a
            href={`tel:${HOTLINE_ITEMS[0].digits}`}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 ring-1 ring-red-200 ring-inset"
          >
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            জরুরি সেবা: {HOTLINE_ITEMS[0].value}
          </a>
        </nav>
      </div>
    </header>
  );
}
