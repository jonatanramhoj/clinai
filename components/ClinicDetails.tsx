type Clinic = {
  id: number;
  name: string;
  address: string;
  hours: string;
};

const ClinicDetails = ({ clinic }: { clinic: Clinic }) => {
  return (
    <div>
      <h3 className="font-bold text-xl mb-2">{clinic.name}</h3>
      <ul className="mb-8">
        <li>{clinic.address}</li>
        <li>{clinic.hours}</li>
      </ul>
      <div className="flex items-center justify-center">
        <button className="mr-8 min-w-40 text-sm font-bold rounded-xl p-4 bg-white cursor-pointer hover:bg-white/80 ease-in-out duration-200 text-gray-700">
          Call
        </button>
        <button className="min-w-40 text-sm font-bold rounded-xl p-4 bg-white cursor-pointer hover:bg-white/80 ease-in-out duration-200 text-gray-700">
          Directions
        </button>
      </div>
    </div>
  );
};

export default ClinicDetails;
