import Link from "next/link";

type Clinic = {
  name: string;
  formatted_address: string;
  formatted_phone_number: string;
  url: string;
  opening_hours?: string;
};

const ClinicDetails = ({ clinic }: { clinic: Clinic }) => {
  return (
    <div>
      <h3 className="font-bold text-xl mb-2">{clinic.name}</h3>
      <ul className="mb-8">
        <li>{clinic.formatted_address}</li>
      </ul>
      <div className="flex items-center justify-center">
        <Link
          href={`tel:${clinic.formatted_phone_number}`}
          className="mr-8 min-w-40 text-sm font-bold rounded-xl p-4 bg-white cursor-pointer hover:bg-white/80 ease-in-out duration-200 text-gray-700 text-center"
        >
          Call
        </Link>
        <Link
          href={clinic.url}
          target="_blank"
          className="min-w-40 text-sm font-bold rounded-xl p-4 bg-white cursor-pointer hover:bg-white/80 ease-in-out duration-200 text-gray-700 text-center"
        >
          Directions
        </Link>
      </div>
    </div>
  );
};

export default ClinicDetails;
