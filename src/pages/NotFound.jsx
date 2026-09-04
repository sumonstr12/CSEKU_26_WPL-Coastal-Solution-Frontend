import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";
import Logo from "@/components/Logo";
export default function NotFound() {
  return (
    <div className="site-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Logo />
      <p className="font-display mt-8 text-7xl font-extrabold text-teal-700/90">
        ৪০৪
      </p>
      <h1 className="font-display mt-3 text-2xl font-bold text-ink-950">
        পৃষ্ঠাটি পাওয়া যায়নি
      </h1>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ink-500">
        আপনি যে ঠিকানাটি খোঁজছেন সেটি সরানো বা পরিবর্তন করা হয়েছে। নিচের লিংক
        থেকে অনুসন্ধান চালিয়ে যান।
      </p>
      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
        <Link to="/" className="btn btn-primary">
          <Home className="h-4 w-4" aria-hidden="true" />
          হোমে ফিরে যান
        </Link>
        <Link to="/disasters" className="btn btn-outline">
          <Compass className="h-4 w-4" aria-hidden="true" />
          সর্বশেষ দুর্যোগের খবর
        </Link>
      </div>
    </div>
  );
}
