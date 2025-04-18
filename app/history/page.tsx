import Link from "next/link";

const diagnosisHistory = [
  {
    id: 1,
    date: "🗓️ Apr 12, 2025 – 08:24 AM",
    symptom: "🤒 Symptom: Severe headache and dizziness",
    suggestion:
      "→ Suggestion: This sounds like stress and overwhelm, consider contacting...",
    clinics: "📍 Clinics nearby: 4 found",
  },
  {
    id: 2,
    date: "🗓️ Apr 10, 2025 – 05:02 PM",
    symptom: "🤒 Symptom: Persistent stomach pain after eating",
    suggestion:
      "→ Suggestion: Could be related to digestion or food intolerance...",
    clinics: "📍 Clinics nearby: 2 found",
  },
  {
    id: 3,
    date: "🗓️ Apr 9, 2025 – 11:18 AM",
    symptom: "🤒 Symptom: Rash and itching on arms",
    suggestion: "→ Suggestion: Might be an allergic reaction or eczema...",
    clinics: "📍 Clinics nearby: 5 found",
  },
  {
    id: 4,
    date: "🗓️ Apr 8, 2025 – 09:00 AM",
    symptom: "🤒 Symptom: Tight chest and shortness of breath",
    suggestion:
      "→ Suggestion: Please consider seeking urgent care if symptoms persist...",
    clinics: "📍 Clinics nearby: 3 found",
  },
  {
    id: 5,
    date: "🗓️ Apr 6, 2025 – 07:47 PM",
    symptom: "🤒 Symptom: Fatigue and joint pain",
    suggestion:
      "→ Suggestion: These symptoms can be caused by viral infections or inflammation...",
    clinics: "📍 Clinics nearby: 4 found",
  },
  {
    id: 6,
    date: "🗓️ Apr 5, 2025 – 01:22 PM",
    symptom: "🤒 Symptom: Blurry vision and nausea",
    suggestion: "→ Suggestion: Could be related to migraine or vertigo...",
    clinics: "📍 Clinics nearby: 2 found",
  },
  {
    id: 7,
    date: "🗓️ Apr 3, 2025 – 10:13 AM",
    symptom: "🤒 Symptom: Sore throat and mild fever",
    suggestion:
      "→ Suggestion: Most likely a mild viral infection. Stay hydrated and rest...",
    clinics: "📍 Clinics nearby: 6 found",
  },
];

export default function History() {
  return (
    <div className="max-w-[600px] m-auto px-4">
      <h1 className="font-bold text-3xl mb-4">Diagnosis History</h1>
      <ul>
        {diagnosisHistory.map((item) => (
          <li key={item.date} className="mb-4">
            <Link
              href={`/history/${item.id}`}
              className="w-full block bg-[#2f2f2f] hover:bg-[#2f2f2f]/80 ease-in-out duration-200 p-4 rounded-lg text-sm cursor-pointer"
            >
              <h3 className="font-bold text-lg mb-2">{item.date}</h3>
              <p className="mb-1">{item.symptom}</p>
              <p className="mb-1">{item.suggestion}</p>
              <p>{item.clinics}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
