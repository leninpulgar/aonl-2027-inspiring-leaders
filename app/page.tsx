"use client";
import { useRouter } from "next/navigation";

export default function TemplateSelector() {
  const router = useRouter();

  const templates = [
    {
      id: "attending",
      title: "Attending",
      description: "Create and share your attendee badge for LinkedIn",
      badgeColor: "bg-[#00577a]",
      buttonClass: "bg-[#00577a] hover:bg-[#004460]",
      borderHover: "hover:border-[#00577a]",
      tag: "Attendee",
    },
    {
      id: "speaking",
      title: "Speaking",
      description: "Showcase your speaking session and leadership role",
      badgeColor: "bg-[#661c33]",
      buttonClass: "bg-[#661c33] hover:bg-[#521628]",
      borderHover: "hover:border-[#661c33]",
      tag: "Speaker",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#f8fafc] to-[#eef2f6]">
      <div className="max-w-3xl w-full text-center space-y-3 mb-10">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#d6b129]/20 text-[#856b0d]">
          AONL 2027 • Inspiring Leaders
        </span>
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#003852] tracking-tight">
          Select Your Badge Template
        </h1>
        <p className="text-gray-600 font-sans max-w-lg mx-auto text-base">
          Personalize your event badge to celebrate and share on LinkedIn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => router.push(`/templates/${tpl.id}`)}
            className={`group bg-white rounded-2xl p-6 border-2 border-gray-100 ${tpl.borderHover} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between text-left`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`w-3.5 h-3.5 rounded-full ${tpl.badgeColor}`}
                />
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {tpl.tag}
                </span>
              </div>
              <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2 group-hover:text-[#00577a] transition-colors">
                {tpl.title}
              </h2>
              <p className="text-sm text-gray-500 font-sans leading-relaxed">
                {tpl.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm font-semibold font-sans text-gray-700 group-hover:translate-x-1 transition-transform">
                Generate Badge →
              </span>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${tpl.buttonClass}`}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}