"use client";
import ClinicDetails from "@/components/ClinicDetails";
import Modal from "@/components/Dialog";
import ArrowLeft from "@/icons/ArrowLeft";
// import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Clinic, Diagnosis } from "@/models/Types";
import { useParams } from "next/navigation";
import useFirebase from "@/hooks/useFirebase";
import useSWR from "swr";
import Loader from "@/components/Loader";

export default function HistoryDetails() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState({});
  const { id } = useParams();
  const { getDiagnosis, user } = useFirebase();

  const { data, isLoading, error } = useSWR<Diagnosis | null>(
    !!user?.uid ? `diagnosis-${id}` : null,
    () => getDiagnosis(id as string)
  );

  console.log("error", error);
  console.log("data", data);

  // const handleClinicSelection = (clinic: Clinic) => {
  //   setIsOpen(!isOpen);
  //   setSelectedClinic(clinic);
  // };

  if (isLoading) {
    return <Loader />;
  }

  if (!data) return null;

  return (
    <div className="max-w-[600px] m-auto px-4">
      <div className="flex justify-between mb-12">
        <Link href="/history" className="flex">
          <ArrowLeft /> <span className="ml-2 font-bold">Back</span>
        </Link>
        <h2 className="font-bold">Checkup: {data.id}</h2>
      </div>
      {/* CHAT convo */}
      <div className="w-full justify-items-end">
        <div className="bg-[#2f2f2f] rounded-3xl py-3 px-5 my-6 self-end">
          <p>{data.symptom}</p>
        </div>
      </div>
      <div>
        <p className="font-bold mb-2">Suggested diagnosis</p>
        <p className="mb-4">{data.diagnosis}</p>
        <p className="font-bold mb-2">Suggested clinics</p>
        <ul>
          {data?.clinics.map((clinic) => (
            <li
              // onClick={() => handleClinicSelection(clinic as Clinic)}
              key={clinic.placeId}
              className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-500 cursor-pointer last-of-type:border-b-0"
            >
              <p>{clinic.name}</p>
              <p>{clinic.address}</p>
            </li>
          ))}
        </ul>
      </div>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        content={<ClinicDetails clinic={selectedClinic as Clinic} />}
      />
    </div>
  );
}
