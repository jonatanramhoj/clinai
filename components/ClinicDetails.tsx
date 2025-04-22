import Link from "next/link";
import { Clinic } from "@/models/Clinics";

const StarRating = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <span className="dark:text-white font-medium">
      {"★".repeat(fullStars)}
      {hasHalfStar && "☆"}
      {"☆".repeat(emptyStars)}
      <span className="dark:text-gray-300 ml-1">({rating.toFixed(1)})</span>
    </span>
  );
};

const ClinicDetails = ({ clinic }: { clinic: Clinic }) => {
  return (
    <div className="p-4">
      <h3 className="font-bold text-xl mb-4">{clinic.name}</h3>
      <ul className="mb-8">
        <li className="mb-2">{clinic.formatted_address}</li>
        <li>{clinic.rating && StarRating(clinic.rating)}</li>
        <li>
          {clinic.opening_hours && clinic.opening_hours.isOpen
            ? clinic.opening_hours.isOpen()
              ? "Open now"
              : "Closed"
            : "Opening hours unavailable"}
        </li>
      </ul>
      <div className="flex items-center justify-center">
        <Link
          href={`tel:${clinic.formatted_phone_number}`}
          className="w-1/2 mr-4 text-sm font-bold rounded-xl p-4 border border-gray-200 dark:border-0 hover:bg-gray-50 dark:bg-white cursor-pointer dark:hover:bg-white/80 ease-in-out duration-200 text-gray-700 text-center"
        >
          Call
        </Link>
        <Link
          href={clinic.url}
          target="_blank"
          className="w-1/2 text-sm font-bold rounded-xl p-4 border border-gray-200 dark:border-0 hover:bg-gray-50 dark:bg-white cursor-pointer dark:hover:bg-white/80 ease-in-out duration-200 text-gray-700 text-center"
        >
          Directions
        </Link>
      </div>
    </div>
  );
};

export default ClinicDetails;
