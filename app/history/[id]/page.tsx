"use client";
// import ClinicDetails from "@/components/ClinicDetails";
// import Modal from "@/components/Dialog";
import ArrowLeft from "@/icons/ArrowLeft";
// import Image from "next/image";
import Link from "next/link";
import { Diagnosis } from "@/models/Types";
import { useParams } from "next/navigation";
import useFirebase from "@/hooks/useFirebase";
import useSWR from "swr";
import Loader from "@/components/Loader";
// import MapWithClinics from "@/components/Map";

export default function HistoryDetails() {
  // const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const { getDiagnosis, user } = useFirebase();

  const { data, isLoading, error } = useSWR<Diagnosis | null>(
    !!user?.uid ? `diagnosis-${id}` : null,
    () => getDiagnosis(id as string)
  );

  console.log("error", error);
  console.log("data", data);

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
        <h2 className="font-bold line-clamp-1 max-w-[250px]">{data.symptom}</h2>
      </div>
      {/* CHAT convo */}
      <div className="w-full justify-items-end">
        <div className="bg-gray-100 dark:bg-[#2f2f2f] rounded-3xl py-3 px-5 my-6 self-end">
          <p>{data.symptom}</p>
        </div>
      </div>
      <div>
        <p className="font-bold mb-2">Suggested diagnosis</p>
        <p className="mb-4">{data.diagnosis}</p>
        <p className="font-bold mb-2">Suggested clinics</p>
        {/* Reuse the map here */}
        {/* <MapWithClinics
          clinicType={clinicType}
          handleSelectClinic={handleSelectClinic}
          clinics={clinics}
          setClinics={setClinics}
          mapZoom={mapZoom}
          setMapCenter={setMapCenter}
          mapCenter={mapCenter}
        /> */}
      </div>
      {/* <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        content={<ClinicDetails clinic={selectedClinic as MapClinicMarker} />}
      /> */}
    </div>
  );
}
