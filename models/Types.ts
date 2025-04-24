export type Clinic = {
  name: string;
  formatted_address: string;
  formatted_phone_number: string;
  url: string;
  opening_hours?: {
    isOpen: (date?: Date) => boolean | undefined;
  };
  rating: number;
};

export type Diagnosis = {
  id?: string; // optional when saving
  symptom: string;
  diagnosis: string;
  clinics: SimplifiedClinic[]; // instead of full PlaceResult
  date: Date;
};

export type SimplifiedClinic = {
  name?: string;
  address?: string;
  placeId?: string;
  rating?: number;
  userRatingsTotal?: number;
  types?: string[];
  icon?: string;
  lat?: number;
  lng?: number;
};
