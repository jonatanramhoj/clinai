"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  Libraries,
} from "@react-google-maps/api";

const libraries: Libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
};

export default function MapWithClinics({
  clinicType,
  handleSelectClinic,
}: {
  clinicType: string;
  handleSelectClinic: (place: google.maps.places.PlaceResult) => void;
}) {
  const [center, setCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [markers, setMarkers] = useState<google.maps.places.PlaceResult[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

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
        setCenter(pos);
        console.log("position", pos);
      },
      (error) => {
        console.error("Error getting location", error);
      }
    );
  }, []);

  // do the google maps search
  useEffect(() => {
    if (!center || !mapRef.current || !clinicType) return;

    const service = new google.maps.places.PlacesService(mapRef.current);
    const request: google.maps.places.PlaceSearchRequest = {
      location: center,
      radius: 5000,
      keyword: clinicType, // use keyword instead of query for nearbySearch
      type: "doctor",
    };

    service.nearbySearch(request, (results, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results &&
        results.length > 2
      ) {
        setMarkers(results);
      } else {
        console.warn(
          "Nearby search sparse or failed. Falling back to textSearch."
        );
        const fallbackRequest: google.maps.places.TextSearchRequest = {
          location: center,
          radius: 5000,
          query: clinicType,
        };
        service.textSearch(fallbackRequest, (textResults, textStatus) => {
          if (
            textStatus === google.maps.places.PlacesServiceStatus.OK &&
            textResults
          ) {
            setMarkers(textResults);
          } else {
            console.warn("Text search also failed:", textStatus);
          }
        });
      }
    });
  }, [center, clinicType, mapLoaded]);

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

  if (!isLoaded || !center) return <p>Loading map...</p>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: true,
          keyboardShortcuts: false,
        }}
      >
        <>
          {markers.map((place, index) => {
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
      <ul className="my-4">
        {markers.map((place) => {
          console.log("place", place);
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          if (lat == null || lng == null) return null; // skip if coords are invalid

          return (
            <li
              key={place.place_id}
              className="mb-2 pb-2 border-b border-gray-500 cursor-pointer last-of-type:border-b-0"
              onClick={() => handleMarkerClick(place)}
            >
              <h3 className="text-gray-300 font-bold text-lg">{place.name}</h3>
              <p className="text-gray-300">
                {place.formatted_address || place.vicinity}
              </p>
              <p>User rating: {place.rating}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
