"use client";
import ClinicDetails from "@/components/ClinicDetails";
import Modal from "@/components/Dialog";
import ArrowLeft from "@/icons/ArrowLeft";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Clinic } from "@/models/Types";

const mockResponse =
  "Sounds like a mild cold. You may want to visit a general practictioner.";

const clinics = [
  {
    id: 1,
    name: "Familjeläkarna Centrum",
    address: "Bredgränd 18, 753 20 Uppsala (600m)",
    hours: "Closed - opens 9 am Mon",
  },
  {
    id: 2,
    name: "Fålhagens health center",
    address: "B, Stationsgatan 26, 753 23 Uppsala (1.1km)",
    hours: "Closed - opens 9 am Mon",
  },
  {
    id: 3,
    name: "Meliva vårdcentral Kungshörnet",
    address: "Kungsgatan 115, 753 18 Uppsala (1.6km)",
    hours: "Closed - opens 9 am Mon",
  },
];

export default function HistoryDetails() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState({});

  const handleSelectClinic = (
    clinic: Clinic | google.maps.places.PlaceResult
  ) => {
    setSelectedClinic(clinic);
    setIsOpen(!isOpen);
  };

  return (
    <div className="max-w-[600px] m-auto px-4">
      <div className="flex justify-between mb-12">
        <Link href="/history" className="flex">
          <ArrowLeft /> <span className="ml-2 font-bold">Back</span>
        </Link>
        <h2 className="font-bold">Checkup</h2>
      </div>
      {/* CHAT convo */}
      <div className="w-full justify-items-end">
        <div className="bg-[#2f2f2f] rounded-3xl py-3 px-5 my-6 self-end">
          <p>Soar throat and tired</p>
        </div>
      </div>
      <div>
        <p className="mb-4">{mockResponse}</p>
        <h3 className="font-bold mb-2">General practictioners</h3>
        <div className="mb-4">
          <Image
            src="/clinics-nearby.png"
            width={700}
            height={300}
            alt=""
            className="rounded-3xl h-[300px] object-cover"
          />
        </div>
        <ul>
          {clinics.map((clinic) => (
            <li
              key={clinic.id}
              className="mb-2 pb-2 border-b border-gray-500 last-of-type:border-0 cursor-pointer"
              onClick={() => handleSelectClinic(clinic)}
            >
              <h3 className="text-gray-300 font-bold text-lg">{clinic.name}</h3>
              <p className="text-gray-300">{clinic.address}</p>
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
