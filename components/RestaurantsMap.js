"use client";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "500px",
};

import Link from "next/link";




export default function RestaurantsMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Filtres modifiables dans le formulaire
  const [formFilters, setFormFilters] = useState({
    radius: 1500,
    type: "restaurant",
    minRating: 0,
  });

  // Filtres appliqués lors du clic sur "Rechercher"
  const [activeFilters, setActiveFilters] = useState(formFilters);

  // Géolocalisation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => alert("Impossible de récupérer votre position")
      );
    }
  }, []);

  // Recherche restaurants selon filtres actifs
  useEffect(() => {
    if (userLocation && window.google) {
      const service = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
      service.nearbySearch(
        {
          location: userLocation,
          radius: activeFilters.radius,
          type: [activeFilters.type],
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            const filtered = results.filter(
              (place) => (place.rating || 0) >= activeFilters.minRating
            );
            setPlaces(filtered);
          }
        }
      );
    }
  }, [userLocation, activeFilters]);

  // Gestion des champs formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFilters((prev) => ({
      ...prev,
      [name]:
        name === "radius" || name === "minRating" ? Number(value) : value,
    }));
  };

  // Appliquer les filtres au clic
  const handleSearch = (e) => {
    e.preventDefault();
    setActiveFilters(formFilters);
  };

  {places.map((place, idx) => (
  <div
    key={idx}
    className="bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition cursor-pointer"
    onClick={() => setSelectedPlace(place)}
  >
    <h3 className="font-semibold text-lg">{place.name}</h3>
    <p className="text-gray-600 text-sm">{place.vicinity}</p>
    <p className="text-yellow-500 mt-1">⭐ {place.rating || "Pas de note"}</p>
    <Link
      href={`/restos/${place.place_id}`}
      className="text-blue-600 hover:underline mt-2 block"
    >
      Voir détails →
    </Link>
  </div>
))}

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <div className="flex flex-col gap-6">
        {/* Formulaire filtres */}
        <form
          onSubmit={handleSearch}
          className="bg-white shadow-md rounded-xl p-4 flex flex-wrap gap-4 items-end"
        >
          <div>
            <label className="block text-sm font-semibold">Rayon (m)</label>
            <input
              type="number"
              name="radius"
              value={formFilters.radius}
              onChange={handleChange}
              className="border rounded-lg p-2 w-32"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Type</label>
            <select
              name="type"
              value={formFilters.type}
              onChange={handleChange}
              className="border rounded-lg p-2"
            >
              <option value="restaurant">Restaurant</option>
              <option value="cafe">Café</option>
              <option value="bar">Bar</option>
              <option value="bakery">Boulangerie</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold">Note minimum</label>
            <select
              name="minRating"
              value={formFilters.minRating}
              onChange={handleChange}
              className="border rounded-lg p-2"
            >
              <option value={0}>Aucune</option>
              <option value={3}>3⭐ et +</option>
              <option value={4}>4⭐ et +</option>
              <option value={4.5}>4.5⭐ et +</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            🔍 Rechercher
          </button>
        </form>

        {/* Carte + Liste */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Carte */}
          {userLocation && (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={userLocation}
              zoom={15}
            >
              {/* Marqueur position utilisateur */}
              <Marker position={userLocation} />

              {/* Marqueurs restaurants */}
              {places.map((place, idx) => (
                <Marker
                  key={idx}
                  position={place.geometry.location}
                  title={place.name}
                  onClick={() => setSelectedPlace(place)}
                />
              ))}

              {/* InfoWindow */}
              {selectedPlace && (
                <InfoWindow
                  position={selectedPlace.geometry.location}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div className="p-2">
                    <h3 className="font-bold text-lg">{selectedPlace.name}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedPlace.vicinity}
                    </p>
                    <p className="text-yellow-500">
                      ⭐ {selectedPlace.rating || "Pas de note"}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}

          {/* Liste */}
          <div className="w-full lg:w-1/3 max-h-[500px] overflow-y-auto space-y-4">
            <h2 className="text-xl font-bold mb-2">
              📋 Liste des restaurants
            </h2>
            {places.map((place, idx) => (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition cursor-pointer"
                onClick={() => setSelectedPlace(place)}
              >
                <h3 className="font-semibold text-lg">{place.name}</h3>
                <p className="text-gray-600 text-sm">{place.vicinity}</p>
                <p className="text-yellow-500 mt-1">
                  ⭐ {place.rating || "Pas de note"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LoadScript>
  );
}

