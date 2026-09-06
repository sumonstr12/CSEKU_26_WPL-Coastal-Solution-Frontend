import { CircleCheck, WavesHorizontal } from "lucide-react";
import heroCoast from "../../assets/hero-coast.jpg";
import { ROLES } from "../../config/roleConfig";

/** Shared branded side panel for login / register */
export default function AuthAside() {
  return (
    <div className="relative hidden overflow-hidden lg:flex lg:flex-col">
      <img src={heroCoast} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-b from-lagoon-950/75 via-lagoon-950/55 to-lagoon-950/85" />
      <div className="relative flex h-full flex-col justify-between p-10 text-white">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <WavesHorizontal size={22} />
          </span>
          <div>
            <p className="text-[15px] font-bold">
              CoastalGuard <span className="text-lagoon-300">BD</span>
            </p>
            <p className="text-[10.5px] text-white/60">উপকূলীয় দুর্যোগ ব্যবস্থাপনা</p>
          </div>
        </div>

        <div>
          <h2 className="max-w-md text-2xl font-bold leading-snug">
            উপকূলজুড়ে প্রতিটি ভূমিকার জন্য একটি নিরাপদ কর্মপরিবেশ
          </h2>
          <ul className="mt-6 space-y-3.5">
            {Object.values(ROLES).map((r) => (
              <li key={r.key} className="flex items-center gap-3 text-sm text-white/85">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br ${r.avatar} shadow-md`}>
                  <r.icon size={15} />
                </span>
                {r.label}
                <CircleCheck size={14} className="ml-auto text-lagoon-300/70" />
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[11.5px] leading-relaxed text-white/50">
          নিরাপত্তা নোট: প্রকৃত অনুমোদন প্রক্রিয়া সার্ভারে (Django REST Framework) সম্পন্ন হয় — এই ডেমোতে ফ্রন্টএন্ড সুরক্ষা স্তরটি দেখানো হয়েছে।
        </p>
      </div>
    </div>
  );
}
