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
