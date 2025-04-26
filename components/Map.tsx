"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
};

export default function MapWithClinics({
  clinicType,
  handleSelectClinic,
  clinics,
  setClinics,
  setMapCenter,
  mapCenter,
  mapZoom,
}: {
  clinicType: string;
  handleSelectClinic: (place: google.maps.places.PlaceResult) => void;
  clinics: google.maps.places.PlaceResult[];
  setClinics: (clinic: google.maps.places.PlaceResult[]) => void;
  setMapCenter: (center: google.maps.LatLngLiteral | null) => void;
  mapCenter: google.maps.LatLngLiteral | null;
  mapZoom: number;
}) {
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);

  // set map ref on load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);
  }, []);

  // get user geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setMapCenter(pos);
      },
      (error) => {
        console.error("Error getting location", error);
      }
    );
  }, [setMapCenter]);

  // do the google maps search
  useEffect(() => {
    if (!mapCenter || !mapRef.current || !clinicType) return;

    const service = new google.maps.places.PlacesService(mapRef.current);
    const request: google.maps.places.PlaceSearchRequest = {
      location: mapCenter,
      // radius: 5000,
      rankBy: google.maps.places.RankBy.DISTANCE, // replaces `radius`
      keyword: clinicType, // use keyword instead of query for nearbySearch
      type: "doctor",
    };

    service.nearbySearch(request, (results, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results &&
        results.length > 2
      ) {
        const sorted = results
          .filter((place) => place.rating !== null)
          .sort((a, b) => b.rating! - a.rating!);
        setClinics(sorted);
      } else {
        console.warn(
          "Nearby search sparse or failed. Falling back to textSearch."
        );
        const fallbackRequest: google.maps.places.TextSearchRequest = {
          location: mapCenter,
          radius: 5000,
          query: clinicType,
        };
        service.textSearch(fallbackRequest, (textResults, textStatus) => {
          if (
            textStatus === google.maps.places.PlacesServiceStatus.OK &&
            textResults
          ) {
            const sorted = textResults
              .filter((place) => place.rating !== null)
              .sort((a, b) => b.rating! - a.rating!);
            setClinics(sorted);
          } else {
            console.warn("Text search also failed:", textStatus);
          }
        });
      }
    });
  }, [mapCenter, clinicType, mapLoaded, setClinics]);

  const getPlaceDetails = (
    placeId: string,
    callback: (place: google.maps.places.PlaceResult) => void
  ) => {
    if (!mapRef.current) return;
    const service = new google.maps.places.PlacesService(mapRef.current);

    const request: google.maps.places.PlaceDetailsRequest = {
      placeId,
      fields: [
        "name",
        "formatted_address",
        "formatted_phone_number",
        "opening_hours",
        "geometry",
        "url", // directions link
        "rating",
      ],
    };

    service.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        callback(place);
      } else {
        console.warn("Failed to fetch details for", placeId, status);
      }
    });
  };

  const handleMarkerClick = (place: google.maps.places.PlaceResult) => {
    if (place.place_id) {
      getPlaceDetails(place.place_id, (placeDetails) => {
        handleSelectClinic(placeDetails);
      });
    }
  };

  const StarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className="dark:text-white font-medium">
        {"★".repeat(fullStars)}
        {hasHalfStar && "☆"} {/* optional: use "⯪" or half-star icon */}
        {"☆".repeat(emptyStars)}
        <span className="dark:text-gray-300 ml-1">({rating.toFixed(1)})</span>
      </span>
    );
  };

  if (!mapCenter) return <p>Loading map...</p>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={mapZoom}
        center={mapCenter}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: true,
          keyboardShortcuts: false,
        }}
      >
        <>
          {clinics.map((place, index) => {
            const lat = place.geometry?.location?.lat();
            const lng = place.geometry?.location?.lng();

            if (lat == null || lng == null) return null; // skip if coords are invalid

            return (
              <Marker
                key={index}
                position={{ lat, lng }}
                onClick={() => handleMarkerClick(place)}
              />
            );
          })}
        </>
      </GoogleMap>
      {/* <div className="relative my-4 w-full justify-items-end">
        <button className="self-end px-4 py-2 bg-white text-sm font-bold rounded-lg cursor-pointer hover:bg-white/80 ease-in-out duration-200 text-gray-700">
          Filter clinics
        </button>
      </div> */}
      <ul className="my-4">
        {clinics
          .filter((place) => place.rating !== null)
          .sort((a, b) => b.rating! - a.rating!)
          .map((place) => {
            const lat = place.geometry?.location?.lat();
            const lng = place.geometry?.location?.lng();

            if (lat == null || lng == null) return null; // skip if coords are invalid

            return (
              <li
                key={place.place_id}
                className="mb-2 pb-2 border-b border-gray-200 dark:border-gray-500 cursor-pointer last-of-type:border-b-0"
                onClick={() => handleMarkerClick(place)}
              >
                <h3 className="dark:text-gray-300 font-bold text-lg">
                  {place.name}
                </h3>
                <p className="dark:text-gray-300">
                  {place.formatted_address || place.vicinity}
                </p>
                <p>
                  {place.rating && place.rating > 0
                    ? StarRating(place.rating)
                    : null}
                </p>
                <p>
                  {place.opening_hours && place.opening_hours.isOpen
                    ? place.opening_hours.isOpen()
                      ? "Open now"
                      : "Closed"
                    : "Opening hours unavailable"}
                </p>
              </li>
            );
          })}
      </ul>
    </>
  );
}
