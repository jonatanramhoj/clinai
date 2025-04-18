"use client";

import { useEffect, useState } from "react";

const ClinicsMap = ({ clinicType }: { clinicType: string }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  // need to make a geo code request to get my location city name based on lat lng

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error("Geolocation error:", err);
      }
    );
  }, []);

  if (!location) return <p>Loading map...</p>;

  // const { lat, lng } = location;
  const encodedQuery = encodeURIComponent(clinicType);

  console.log("encodedQuery", encodedQuery);
  //   const embedUrl = `https://www.google.com/maps/embed/v1/search?q=${query}&center=${lat},${lng}&zoom=14&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
  const embedUrl = `https://www.google.com/maps/embed/v1/search?q=${encodedQuery}+uppsala&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&zoom=14`;

  return (
    <iframe
      width="100%"
      height="350"
      style={{ border: 0, borderRadius: 8 }}
      loading="lazy"
      allowFullScreen
      src={embedUrl}
    />
  );
};

export default ClinicsMap;
