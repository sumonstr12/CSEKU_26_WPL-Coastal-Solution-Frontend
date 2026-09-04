import {
  CheckCircle2,
  ClipboardCheck,
  Info,
  PhoneCall,
  Siren,
} from "lucide-react";
import EmergencyCard from "@/components/EmergencyCard";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { CONTROL_ROOMS, RESCUE_SERVICES, RESCUE_TIPS } from "@/data/rescue";
import { HOTLINE_ITEMS } from "@/data/site";
import rescueImg from "@/assets/rescue.jpg";
export default function Rescue() {
  return (
    <>
      <PageHeader
        eyebrow="জরুরি সেবা ডিরেক্টরি"
        title="সহায়তা ও উদ্ধার"
        description="উপকূলীয় অঞ্চলে কাজ করা উদ্ধার দল, ফায়ার সার্ভিস, চিকিৎসা ও নৌযান সহায়তার যোগাযোগ তথ্য — জরুরি ও সাধারণ সেবা আলাদা চিহ্নিত।"
      >
        <p className="chip border-red-200 bg-red-50 text-red-700">
          <Siren className="h-3.5 w-3.5" aria-hidden="true" />
          প্রাণঘাতী জরুরি: {HOTLINE_ITEMS[0].value}
        </p>
      </PageHeader>

      <div className="site-container space-y-10 py-8 md:py-10">
        {/* Emergency banner */}
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm md:grid-cols-[1.35fr_1fr]">
            <div className="relative p-6 sm:p-8">
              <span
                className="absolute inset-y-0 left-0 w-1.5 bg-red-600"
                aria-hidden="true"
              />
              <p className="chip border-red-200 bg-red-50 text-red-700">
                জরুরি পরিস্থিতি হলে
              </p>
              <h2 className="font-display mt-3 text-2xl leading-snug font-bold text-ink-950 sm:text-[27px]">
                এখনই কল করুন — দেরি করবেন না
              </h2>
              <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-ink-500">
                কেউ পানিবন্দী, নিখোঁজ বা গুরুতর আহত অবস্থায় থাকলে নিচের
                নম্বরগুলোতে কল করুন। কল করার সময় অবস্থান (জেলা, উপজেলা, ইউনিয়ন
                ও ল্যান্ডমার্ক) স্পষ্টভাবে বলুন।
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <a
                  href={`tel:${HOTLINE_ITEMS[0].digits}`}
                  className="btn btn-danger !px-5"
                >
                  <PhoneCall className="h-4.5 w-4.5" aria-hidden="true" />
                  {HOTLINE_ITEMS[0].label} — {HOTLINE_ITEMS[0].value}
                </a>
                <a
                  href={`tel:${HOTLINE_ITEMS[1].digits}`}
                  className="btn btn-outline !px-5"
                >
                  <PhoneCall className="h-4.5 w-4.5" aria-hidden="true" />
                  {HOTLINE_ITEMS[1].label} — {HOTLINE_ITEMS[1].value}
                </a>
              </div>
            </div>
            <div className="relative min-h-[190px]">
              <img
                src={rescueImg}
                alt="বন্যার পানিতে নৌকায় করে জরুরি উদ্ধারকর্মীরা পরিবারকে নিরাপদ স্থানে নিয়ে যাচ্ছে"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent md:bg-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </Reveal>

        {/* Services */}
        <section aria-labelledby="services-title">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  id="services-title"
                  className="font-display text-[24px] font-bold text-ink-950"
                >
                  জরুরি সেবাসমূহ
                </h2>
                <p className="mt-1.5 text-[13.5px] text-ink-500">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-red-700">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-red-600"
                      aria-hidden="true"
                    />
                    লাল চিহ্ন
                  </span>{" "}
                  জরুরি নম্বর, আর{" "}
                  <span className="inline-flex items-center gap-1.5 font-semibold text-ink-700">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-stone-400"
                      aria-hidden="true"
                    />
                    ধূসর চিহ্ন
                  </span>{" "}
                  সাধারণ তথ্য — প্রয়োজন বুঝে কল করুন।
                </p>
              </div>
            </div>
          </Reveal>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {RESCUE_SERVICES.map((service, i) => (
              <Reveal
                key={service.id}
                delay={Math.min(i, 5) * 60}
                className="h-full"
              >
                <EmergencyCard service={service} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* Control rooms table */}
        <section aria-labelledby="control-rooms-title">
          <Reveal>
            <h2
              id="control-rooms-title"
              className="font-display text-[24px] font-bold text-ink-950"
            >
              জেলাভিত্তিক নিয়ন্ত্রণ কক্ষ
            </h2>
            <p className="mt-1.5 text-[13.5px] text-ink-500">
              প্রতিটি উপকূলীয় জেলায় দুর্যোগ ব্যবস্থাপনা নিয়ন্ত্রণ কক্ষ ২৪/৭
              চালু থাকে।
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="card mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-[13.5px]">
                <thead>
                  <tr className="border-b border-stone-200 bg-sand-50 text-[12.5px] font-bold tracking-wide text-ink-700">
                    <th scope="col" className="px-5 py-3.5">
                      জেলা
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      নিয়ন্ত্রণ কক্ষ
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      ফায়ার সার্ভিস
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      চিকিৎসা সহায়তা
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CONTROL_ROOMS.map((room) => (
                    <tr
                      key={room.district}
                      className="border-b border-stone-100 last:border-0 hover:bg-sand-25"
                    >
                      <th
                        scope="row"
                        className="px-5 py-3.5 font-bold text-ink-900"
                      >
                        {room.district}
                      </th>
                      <td className="px-5 py-3.5">
                        <a
                          href={`tel:${room.room.replace(/[^0-9]/g, "")}`}
                          className="font-semibold text-teal-800 hover:underline"
                        >
                          {room.room}
                        </a>
                      </td>
                      <td className="px-5 py-3.5">
                        <a
                          href={`tel:${room.fire.replace(/[^0-9]/g, "")}`}
                          className="font-semibold text-teal-800 hover:underline"
                        >
                          {room.fire}
                        </a>
                      </td>
                      <td className="px-5 py-3.5">
                        <a
                          href={`tel:${room.medical.replace(/[^0-9]/g, "")}`}
                          className="font-semibold text-teal-800 hover:underline"
                        >
                          {room.medical}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </section>

        {/* Tips */}
        <Reveal>
          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-[16px] font-bold text-sky-900">
                <Info className="h-5 w-5" aria-hidden="true" />
                ঝুঁকিতে থাকা অবস্থায় যোগাযোগের নিয়ম
              </h2>
              <p className="mt-2 text-[13.5px] leading-relaxed text-sky-900/80">
                সিগন্যাল দুর্বল বা নেটওয়ার্ক ডাউন হলে নিচের নিয়মগুলো মেনে চললে
                সহায়তা দ্রুত পৌঁছাবে।
              </p>
              <p className="mt-4 rounded-xl bg-white/70 p-3.5 text-[13px] leading-relaxed font-medium text-ink-700">
                মনে রাখুন: যদি শুধু একটি এসএমএস যাওয়া সম্ভব হয় — লিখুন{" "}
                <span className="font-mono font-bold text-sky-900">
                  SOS &lt;ইউনিয়ন&gt; &lt;আটকে থাকা সংখ্যা&gt;
                </span>{" "}
                এবং পাঠান ১০৯০ নম্বরে।
              </p>
            </div>
            <div className="card p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-[16px] font-bold text-ink-950">
                <ClipboardCheck
                  className="h-5 w-5 text-teal-700"
                  aria-hidden="true"
                />
                ছয়টি কাজ আগে থেকে করে রাখুন
              </h2>
              <ul className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
                {RESCUE_TIPS.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-700"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-4 w-4 shrink-0 text-teal-700"
                      aria-hidden="true"
                    />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
