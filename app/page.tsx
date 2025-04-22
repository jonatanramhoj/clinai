"use client";
import { useState, ChangeEvent, useEffect, useCallback } from "react";
import Loader from "@/components/Loader";
import Modal from "@/components/Dialog";
import ArrowUp from "@/icons/ArrowUp";
import ClinicDetails from "@/components/ClinicDetails";
import Map from "@/components/Map";
import { Clinic } from "@/models/Clinics";

export default function Home() {
  const [userQuery, setUserQuery] = useState("");
  const [userSymptom, setUserSymptom] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState({});
  const [response, setResponse] = useState("");
  const [clinicType, setClinicType] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
          {
            role: "system",
            content: `You are a helpful and empathetic health assistant. Respond in the **same language** as the user's input. Avoid medical jargon. Keep it friendly and easy to understand. Based on the user's symptoms, respond with a JSON object like:
          {
            "diagnosis": "A brief human-readable explanation of the likely condition, including possible causes and what the user should do next.",
            "clinicType": "The type of doctor or clinic they should consult (e.g. ENT clinic, Urgent Care, Dermatologist)."
          }`,
          },
          { role: "user", content: userQuery },
        ],
      }),
    });

    const data = await response.json();

    const parsedResponse = JSON.parse(data.message.content);
    const diagnosis = parsedResponse.diagnosis ?? "No diagnosis found";
    const clinicType = parsedResponse.clinicType ?? "No clinic type found";
    console.log("clinicType", clinicType);

    setResponse(diagnosis);
    setClinicType(clinicType);
    setIsLoading(false);
  }, [userQuery]);

  const resetChat = () => {
    setUserQuery("");
    setUserSymptom("");
    setResponse("");
  };

  const handleSelectClinic = (
    clinic: Clinic | google.maps.places.PlaceResult
  ) => {
    setSelectedClinic(clinic);
    setIsOpen(!isOpen);
  };

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

        <p className="dark:text-gray-300 mb-4">
          Share your symptoms with us, and we’ll suggest a possible diagnosis,
          plus show you nearby clinics that can help.{" "}
        </p>
        {hasSubmittedPrompt && (
          <button
            onClick={resetChat}
            className="text-sm font-bold w-full rounded-xl p-4 border border-gray-200 hover:bg-gray-50 dark:bg-white cursor-pointer dark:hover:bg-white/80 ease-in-out duration-200 dark:text-gray-700"
          >
            New Checkup
          </button>
        )}
        {!hasSubmittedPrompt && !isLoading && (
          <div className="relative">
            <input
              type="search"
              placeholder="Describe your symptoms"
              className="dark:bg-[#2f2f2f] border border-gray-300 dark:border-0 p-4 w-full outline-0 rounded-md shadow-xl"
              onChange={handleChange}
              value={userQuery}
              autoFocus
            />
            <button
              onClick={handleSubmit}
              className="w-8 h-8 rounded-full flex justify-center items-center bg-[#2f2f2f] dark:bg-white absolute right-4 top-3 cursor-pointer hover:opacity-80"
            >
              <ArrowUp />
            </button>
          </div>
        )}
        {/* CHAT convo */}
        {hasSubmittedPrompt && (
          <div className="w-full justify-items-end">
            <div className="bg-gray-100 dark:bg-[#2f2f2f] rounded-3xl py-3 px-5 my-6 self-end">
              <p>{userSymptom}</p>
            </div>
          </div>
        )}

        {isLoading && <Loader />}

        {hasSubmittedPrompt && !isLoading && (
          <div>
            <p className="mb-4">
              <span className="font-bold block">Suggested diagnosis</span>
              {response}
            </p>
            <h3 className="mb-2">
              <span className="font-bold block">Suggested clinics</span>
            </h3>
            <div className="mb-4">
              <Map
                clinicType={clinicType}
                handleSelectClinic={handleSelectClinic}
              />
            </div>
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
