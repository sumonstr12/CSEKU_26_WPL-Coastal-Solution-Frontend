import { Link } from "react-router-dom";
import { Compass, House, WavesHorizontal } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mist px-6 text-center">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-lagoon-500 to-lagoon-700 text-white shadow-lift">
        <WavesHorizontal size={30} />
      </span>
      <p className="mt-6 text-5xl font-black text-lagoon-900/15">৪০৪</p>
      <h1 className="-mt-4 text-xl font-bold text-slate-800">পাতাটি পাওয়া যায়নি</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">আপনি যে পাতাটি খুঁজছেন সেটি সরানো হয়েছে অথবা ঠিকানাটি ভুল।</p>
      <div className="mt-7 flex gap-3">
        <Link to="/" className="btn-primary">
          <House size={15} />
          হোমে ফিরুন
        </Link>
        <Link to="/dashboard" className="btn-secondary">
          <Compass size={15} />
          ড্যাশবোর্ড
        </Link>
      </div>
    </div>
  );
}
