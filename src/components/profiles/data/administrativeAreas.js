/**
 * Hierarchical administrative areas of Bangladesh (coastal-belt focused demo set).
 * বিভাগ → জেলা → উপজেলা → ইউনিয়ন
 */

export const AREA_ORDER = ["division", "district", "upazila", "union"];
export const AREA_LEVEL_LABELS = {
  division: "বিভাগ",
  district: "জেলা",
  upazila: "উপজেলা",
  union: "ইউনিয়ন",
};
export const ADMINISTRATIVE_AREAS = [
  {
    name: "খুলনা",
    children: [
      {
        name: "খুলনা",
        children: [
          {
            name: "কয়রা",
            children: [
              {
                name: "মহারাজপুর",
              },
              {
                name: "উত্তর বেদকাশী",
              },
              {
                name: "দক্ষিণ বেদকাশী",
              },
              {
                name: "কয়রা সদর",
              },
              {
                name: "মহেশ্বরীপুর",
              },
            ],
          },
          {
            name: "দাকোপ",
            children: [
              {
                name: "সুতারখালী",
              },
              {
                name: "লাউডোব",
              },
              {
                name: "বৈনতলা",
              },
            ],
          },
          {
            name: "পাইকগাছা",
            children: [
              {
                name: "গদাইপুর",
              },
              {
                name: "লতা",
              },
              {
                name: "হরিঢালী",
              },
            ],
          },
          {
            name: "ডুমুরিয়া",
          },
          {
            name: "বটিয়াঘাটা",
          },
        ],
      },
      {
        name: "সাতক্ষীরা",
        children: [
          {
            name: "শ্যামনগর",
            children: [
              {
                name: "বুরীগোয়ালিনী",
              },
              {
                name: "গাবুরা",
              },
              {
                name: "মুন্সিগঞ্জ",
              },
              {
                name: "রমজাননগর",
              },
            ],
          },
          {
            name: "আশাশুনি",
          },
          {
            name: "কলারোয়া",
          },
          {
            name: "দেবহাটা",
          },
        ],
      },
      {
        name: "বাগেরহাট",
        children: [
          {
            name: "মোংলা",
          },
          {
            name: "শরণখোলা",
          },
          {
            name: "মোরেলগঞ্জ",
          },
        ],
      },
      {
        name: "যশোর",
        children: [
          {
            name: "অভয়নগর",
          },
          {
            name: "কেশবপুর",
          },
        ],
      },
    ],
  },
  {
    name: "বরিশাল",
    children: [
      {
        name: "বরগুনা",
        children: [
          {
            name: "পাথরঘাটা",
            children: [
              {
                name: "কাকচিরা",
              },
              {
                name: "রায়হানপুর",
              },
              {
                name: "নাচনাপাড়া",
              },
            ],
          },
          {
            name: "আমতলী",
          },
          {
            name: "বামনা",
          },
          {
            name: "বেতাগী",
          },
        ],
      },
      {
        name: "পটুয়াখালী",
        children: [
          {
            name: "কলাপাড়া",
            children: [
              {
                name: "লালুয়া",
              },
              {
                name: "মহিপুর",
              },
              {
                name: "টিয়াখালী",
              },
            ],
          },
          {
            name: "গলাচিপা",
          },
          {
            name: "বাউফল",
          },
          {
            name: "দশমিনা",
          },
        ],
      },
      {
        name: "ভোলা",
        children: [
          {
            name: "চরফ্যাশন",
          },
          {
            name: "মনপুরা",
          },
          {
            name: "বোরহানউদ্দিন",
          },
        ],
      },
      {
        name: "বরিশাল",
        children: [
          {
            name: "বাকেরগঞ্জ",
          },
          {
            name: "মেহেন্দিগঞ্জ",
          },
          {
            name: "মুলাদী",
          },
        ],
      },
      {
        name: "পিরোজপুর",
        children: [
          {
            name: "মঠবাড়িয়া",
          },
          {
            name: "নাজিরপুর",
          },
        ],
      },
    ],
  },
  {
    name: "চট্টগ্রাম",
    children: [
      {
        name: "কক্সবাজার",
        children: [
          {
            name: "টেকনাফ",
          },
          {
            name: "উখিয়া",
          },
          {
            name: "মহেশখালী",
          },
          {
            name: "কুতুবদিয়া",
          },
          {
            name: "চকরিয়া",
          },
        ],
      },
      {
        name: "চট্টগ্রাম",
        children: [
          {
            name: "সন্দ্বীপ",
          },
          {
            name: "মীরসরাই",
          },
          {
            name: "সীতাকুণ্ড",
          },
          {
            name: "আনোয়ারা",
          },
          {
            name: "বাঁশখালী",
          },
        ],
      },
      {
        name: "নোয়াখালী",
        children: [
          {
            name: "হাতিয়া",
          },
          {
            name: "সুবর্ণচর",
          },
          {
            name: "কোম্পানীগঞ্জ",
          },
        ],
      },
      {
        name: "লক্ষ্মীপুর",
        children: [
          {
            name: "রামগতি",
          },
          {
            name: "কমলনগর",
          },
        ],
      },
      {
        name: "ফেনী",
        children: [
          {
            name: "সোনাগাজী",
          },
          {
            name: "ছাগলনাইয়া",
          },
        ],
      },
    ],
  },
  {
    name: "ঢাকা",
    children: [
      {
        name: "ঢাকা",
        children: [
          {
            name: "ঢাকা সদর",
          },
          {
            name: "সাভার",
          },
          {
            name: "ধামরাই",
          },
        ],
      },
      {
        name: "শরীয়তপুর",
        children: [
          {
            name: "নড়িয়া",
          },
          {
            name: "ভেদরগঞ্জ",
          },
        ],
      },
      {
        name: "মাদারীপুর",
        children: [
          {
            name: "শিবচর",
          },
          {
            name: "রাজৈর",
          },
        ],
      },
    ],
  },
];

/** Flat list of all district names (for district select dropdowns). */
export const ALL_DISTRICTS = ADMINISTRATIVE_AREAS.flatMap((division) =>
  (division.children ?? []).map((district) => district.name),
);
export function findAreaNode(children, name) {
  if (!children || !name) return undefined;
  return children.find((c) => c.name === name);
}
