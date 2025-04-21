import Link from "next/link";
import { Clinic } from "@/models/clinics";

const StarRating = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <span className="text-white font-medium">
      {"★".repeat(fullStars)}
      {hasHalfStar && "☆"} {/* optional: use "⯪" or half-star icon */}
      {"☆".repeat(emptyStars)}
      <span className="text-gray-300 ml-1">({rating.toFixed(1)})</span>
    </span>
  );
};

const ClinicDetails = ({ clinic }: { clinic: Clinic }) => {
  return (
    <div>
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
