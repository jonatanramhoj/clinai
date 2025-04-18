"use client";
import { useState, ChangeEvent, useEffect, useCallback } from "react";
import Loader from "@/components/Loader";
import Modal from "@/components/Dialog";
import ArrowUp from "@/icons/ArrowUp";
import ClinicDetails from "@/components/ClinicDetails";
import ClinicsMap from "@/components/ClinicsMap";

type Clinic = {
  id: number;
  name: string;
  address: string;
  hours: string;
};

// const mockResponse =
//   "Sounds like a mild cold. You may want to visit a general practictioner.";

// const clinics = [
//   {
//     id: 1,
//     name: "Familjeläkarna Centrum",
//     address: "Bredgränd 18, 753 20 Uppsala (600m)",
//     hours: "Closed - opens 9 am Mon",
//   },
//   {
//     id: 2,
//     name: "Fålhagens health center",
//     address: "B, Stationsgatan 26, 753 23 Uppsala (1.1km)",
//     hours: "Closed - opens 9 am Mon",
//   },
//   {
//     id: 3,
//     name: "Meliva vårdcentral Kungshörnet",
//     address: "Kungsgatan 115, 753 18 Uppsala (1.6km)",
//     hours: "Closed - opens 9 am Mon",
//   },
// ];

export default function Home() {
  const [userQuery, setUserQuery] = useState("");
  const [userSymptom, setUserSymptom] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState({});
  const [response, setResponse] = useState("");
  const [clinic, setClinic] = useState();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e", e.target.value);
    setUserQuery(e.target.value);
  };

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setUserSymptom(userQuery);
    setUserQuery("");

    // post to the chatGPT api
    const response = await fetch("/api/chatgpt", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          //     {
          //       role: "system",
          //       content: `You are a helpful health assistant. Always reply with a short, clear possible diagnosis in one sentence.
          // Your response should help a user find the right type of clinic or doctor nearby. Don't provide detailed medical explanations.
          // Only include the condition and what type of doctor or clinic they should look for.`,
          //     },
          {
            role: "system",
            content:
              "You are a helpful health assistant. Include the condition and what type of doctor or clinic they should look for. Respond with a JSON object containing 'diagnosis' and 'clinicType', based on the user's symptoms.",
          },

          { role: "user", content: userQuery },
        ],
      }),
    });

    const data = await response.json();
    // console.log("data", data);
    // console.log("");

    const parsedResponse = JSON.parse(data.message.content);
    const diagnosis = parsedResponse.diagnosis ?? "No diagnosis found";
    const clinicType = parsedResponse.clinicType ?? "No clinic type found";

    setResponse(diagnosis);
    setClinic(clinicType);
    setIsLoading(false);
  }, [userQuery]);

  const resetChat = () => {
    setUserQuery("");
    setUserSymptom("");
    setResponse("");
  };

  // const handleSelectClinic = (clinic: Clinic) => {
  //   setSelectedClinic(clinic);
  //   setIsOpen(!isOpen);
  // };

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        handleSubmit();
      }
    };

    document.addEventListener("keypress", handleEnter);

    return () => {
      document.removeEventListener("keypress", handleEnter);
    };
  }, [handleSubmit]);

  const hasSubmittedPrompt = userSymptom && userSymptom.length > 0;

  return (
    <>
      <div className="max-w-[600px] m-auto px-4">
        <h1 className="font-bold text-3xl mb-4">Feeling unwell?</h1>

        <p className="text-gray-300 mb-4">
          Share your symptoms with us, and we’ll suggest a possible diagnosis,
          plus show you nearby clinics that can help.{" "}
        </p>
        {hasSubmittedPrompt && (
          <button
            onClick={resetChat}
            className="text-sm font-bold w-full rounded-xl p-4 bg-white cursor-pointer hover:bg-white/80 ease-in-out duration-200 text-gray-700"
          >
            New Checkup
          </button>
        )}
        {!hasSubmittedPrompt && !isLoading && (
          <div className="relative">
            <input
              type="search"
              placeholder="Describe your symptoms"
              className="bg-[#2f2f2f] rounded-md border-0 p-4 w-full outline-0"
              onChange={handleChange}
              value={userQuery}
            />
            <button
              onClick={handleSubmit}
              className="w-8 h-8 rounded-full flex justify-center items-center bg-white absolute right-4 top-3 cursor-pointer hover:opacity-80"
            >
              <ArrowUp />
            </button>
          </div>
        )}
        {/* CHAT convo */}
        {hasSubmittedPrompt && (
          <div className="w-full justify-items-end">
            <div className="bg-[#2f2f2f] rounded-3xl py-3 px-5 my-6 self-end">
              <p>{userSymptom}</p>
            </div>
          </div>
        )}

        {isLoading && <Loader />}

        {hasSubmittedPrompt && !isLoading && (
          <div>
            <p className="mb-4">{response}</p>
            <h3 className="font-bold mb-2">{clinic}</h3>
            <div className="mb-4">
              <ClinicsMap clinicType="General clinic" />
            </div>
            <ul>
              {/* {clinics.map((clinic) => (
                <li
                  key={clinic.id}
                  className="mb-2 pb-2 border-b border-gray-500 last-of-type:border-0 cursor-pointer"
                  onClick={() => handleSelectClinic(clinic)}
                >
                  <h3 className="text-gray-300 font-bold text-lg">
                    {clinic.name}
                  </h3>
                  <p className="text-gray-300">{clinic.address}</p>
                </li>
              ))} */}
            </ul>
          </div>
        )}
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          content={<ClinicDetails clinic={selectedClinic as Clinic} />}
        />
      </div>
    </>
  );
}
