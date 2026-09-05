import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Clock,
  LogIn,
  LogOut,
  MapPinned,
  Menu,
  PhoneCall,
  User,
  UserPlus,
  X,
} from "lucide-react";
import Logo from "@/components/Logo";
import { HOTLINE_ITEMS, NAV_ITEMS, SITE } from "@/data/site";
import { classNames } from "@/lib/utils";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // ইউজার লগইন স্টেট চেক (token, full_name এবং user চেক করা হচ্ছে)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const fullName = localStorage.getItem("full_name");
      const storedUser = localStorage.getItem("user");

      if (token || fullName || storedUser) {
        let userData = {};
        if (storedUser) {
          try {
            userData = JSON.parse(storedUser);
          } catch (e) {
            userData = {};
          }
        }

        const name = fullName || userData.full_name || userData.username || "ইউজার";
        
        setUser({
          full_name: name,
          email: userData.email || userData.phone_number || "",
          ...userData,
        });
      } else {
        setUser(null);
      }
    };

    checkAuth();
  }, [location.pathname]);

  // রাউট পরিবর্তন হলে নেভবার এবং প্রোফাইল ড্রপডাউন বন্ধ করা
  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // বাইরে ক্লিক করলে ড্রপডাউন মেনু বন্ধ করা
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // মোবাইল মেনু খোলা থাকলে পেজ স্ক্রল বন্ধ রাখা
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // লগআউট হ্যান্ডলার (সব লোকাল স্টোরেজ কী মুছে ফেলা)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("full_name");
    localStorage.removeItem("user");
    setUser(null);
    setProfileOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Utility strip */}
      <div className="hidden bg-deepsea-900 text-teal-50 md:block">
        <div className="site-container flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <a
              href={`tel:${HOTLINE_ITEMS[0].digits}`}
              className="inline-flex items-center gap-1.5 font-semibold text-amber-300 hover:text-amber-200"
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
        <div className="site-container flex h-17 items-center justify-between gap-3">
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

          {/* Desktop Auth / Profile Section */}
          <div className="hidden items-center gap-2 xl:flex">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-full border border-stone-200 bg-stone-50 p-1.5 pr-3 text-sm font-semibold text-ink-800 transition-colors hover:bg-stone-100 cursor-pointer"
                >
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-teal-700 text-white font-bold text-xs">
                    {user.full_name
                      ? user.full_name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <span className="max-w-30 truncate text-xs">
                    {user.full_name}
                  </span>
                  <ChevronDown
                    className={classNames(
                      "h-4 w-4 text-stone-500 transition-transform duration-200",
                      profileOpen ? "rotate-180" : "",
                    )}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-stone-100 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50">
                    <div className="px-3 py-2 border-b border-stone-100">
                      <p className="text-xs font-semibold text-ink-900 truncate">
                        {user.full_name}
                      </p>
                      {user.email && (
                        <p className="text-[11px] text-stone-500 truncate">
                          {user.email}
                        </p>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-ink-700 hover:bg-teal-50 hover:text-teal-800"
                      >
                        <User className="h-4 w-4 text-stone-500" />
                        আমার প্রোফাইল
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 text-red-500" />
                        লগআউট
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline px-4! py-2!">
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  লগইন
                </Link>
                <Link to="/register" className="btn btn-primary px-4! py-2!">
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                  নিবন্ধন করুন
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
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

          {/* Mobile Auth / Profile Section */}
          {user ? (
            <div className="mt-3 border-t border-stone-100 pt-3 grid gap-2">
              <div className="flex items-center gap-3 px-3 py-2 bg-stone-50 rounded-xl">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-700 text-white font-bold text-sm">
                  {user.full_name
                    ? user.full_name.charAt(0).toUpperCase()
                    : "U"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-ink-900 truncate">
                    {user.full_name}
                  </p>
                  {user.email && (
                    <p className="text-xs text-stone-500 truncate">
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              <Link
                to="/profile"
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-ink-700 hover:bg-stone-100"
              >
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-stone-500" />
                  আমার প্রোফাইল
                </span>
                <ChevronRight className="h-4 w-4 text-ink-300" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="h-4 w-4 text-red-500" />
                  লগআউট
                </span>
              </button>
            </div>
          ) : (
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
          )}

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