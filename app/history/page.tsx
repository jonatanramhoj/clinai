"use client";
import useFirebase from "@/hooks/useFirebase";
import Link from "next/link";
import useSWR from "swr";
import Loader from "@/components/Loader";

export default function History() {
  const { getAllDiagnosis, user } = useFirebase();

  const { data, isLoading } = useSWR(
    !!user?.uid ? `history-${user?.uid}` : null,
    () => getAllDiagnosis()
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="max-w-[600px] m-auto px-4">
      <h1 className="font-bold text-3xl mb-4">Diagnosis History</h1>
      <ul>
        {!data?.length && (
          <p className="text-gray-500 text-2xl mt-8">
            Your diagnosis history will be displayed here
          </p>
        )}
        {data?.map((item) => (
          <li key={item.id} className="mb-4">
            <Link
              href={`/history/${item.id}`}
              className="w-full block bg-gray-200 hover:bg-gray-100 dark:bg-[#2f2f2f] dark:hover:bg-[#2f2f2f]/80 ease-in-out duration-200 p-4 rounded-lg text-sm cursor-pointer"
            >
              <h3 className="font-bold text-lg mb-2">
                📅{" "}
                {item.date.toLocaleString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h3>
              <p className="mb-2">💬 {item.symptom}</p>
              <p className="mb-2 line-clamp-2">🧠 {item.diagnosis}</p>
              <p>📍 Clinics nearby: {item.clinics.length} found</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
