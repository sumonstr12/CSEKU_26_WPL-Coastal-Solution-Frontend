import { CircleCheck, FileText, LifeBuoy, Server, TriangleAlert, Warehouse } from "lucide-react";

/**
 * বিজ্ঞপ্তির আইকন ও রং।
 * নতুন kind যোগ করতে এখানে এক লাইন বাড়ালেই
 * টপবার ড্রপডাউন আর বিজ্ঞপ্তি পেজ দুটোতেই বসবে।
 * না মিললে system ব্যবহার হয়।
 */
export const NOTIFICATION_KINDS = {
  alert: { icon: TriangleAlert, box: "bg-amber-50 text-amber-600" },
  report: { icon: FileText, box: "bg-lagoon-50 text-lagoon-600" },
  shelter: { icon: Warehouse, box: "bg-sky-50 text-sky-600" },
  mission: { icon: LifeBuoy, box: "bg-orange-50 text-orange-600" },
  verification: { icon: CircleCheck, box: "bg-emerald-50 text-emerald-600" },
  system: { icon: Server, box: "bg-slate-100 text-slate-500" },
};

export const kindOf = (kind) => NOTIFICATION_KINDS[kind] || NOTIFICATION_KINDS.system;
