export type ClinicDetails = {
  name: string;
  formatted_address: string;
  formatted_phone_number: string;
  url: string;
  opening_hours?: {
    isOpen: (date?: Date) => boolean | undefined;
  };
  rating: number;
};

export type MapClinicMarker = {
  name?: string;
  address?: string;
  placeId?: string;
  rating?: number;
  userRatingsTotal?: number;
  types?: string[];
  icon?: string;
  lat: number;
  lng: number;
};

export type Diagnosis = {
  id?: string;
  symptom: string;
  diagnosis: string;
  clinics: MapClinicMarker[];
  center: google.maps.LatLngLiteral | null;
  zoom: number;
  date: Date;
};
