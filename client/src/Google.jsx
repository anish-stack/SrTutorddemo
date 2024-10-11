import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker, Circle, InfoWindow } from "@react-google-maps/api";

const Google = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [radius, setRadius] = useState(5); // Radius in kilometers
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  const fetchNearbyPlaces = async () => {
    if (latitude && longitude) {
      const url = `http://localhost:7000/nearby-places?lat=${latitude}&lng=${longitude}&radius=${radius * 1000}`; // Convert km to meters

      try {
        const response = await axios.get(url);
        console.log(response.data)
        const data = response.data.FilterData;
        console.log(data)
        const nextPageToken = response.data.next_page_token;
        setPlaces(
          data.map((place) => ({
            name: place.name,
            lat: place.lat,
            lng: place.lng,
          }))
        );
      
      } catch (error) {
        console.error("Error fetching nearby places:", error);
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Nearby Places</h1>
      <p>
        <strong>Current Location</strong>: Latitude: {latitude} | Longitude: {longitude}
      </p>
      <div>
        <label>Radius (in km): </label>
        <input
          type="number"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          min="1"
        />
        <button onClick={fetchNearbyPlaces} style={{ marginLeft: "10px" }}>
          Find Nearby Places
        </button>
      </div>

      <h2>Places within {radius} km:</h2>
      <ul>
        {places.length > 0 ? (
          places.map((place, index) => (
            <li key={index}>
              {place.name}: Lat {place.lat}, Lng {place.lng}
            </li>
          ))
        ) : (
          <p>No places found yet!</p>
        )}
      </ul>

      {/* Google Map with Circle and Markers */}
      {latitude && longitude && (
        <LoadScript googleMapsApiKey={"AIzaSyCBATa-tKn2Ebm1VbQ5BU8VOqda2nzkoTU"}>
          <GoogleMap
            center={{ lat: latitude, lng: longitude }}
            zoom={12}
            mapContainerStyle={{ width: "100%", height: "500px" }}
          >
            {/* Marker for current location */}
            <Marker position={{ lat: latitude, lng: longitude }} />

            {/* Circle to indicate the search radius */}
            <Circle
              center={{ lat: latitude, lng: longitude }}
              radius={radius * 1000} // Convert km to meters for the circle
              options={{
                fillColor: "rgba(0, 123, 255, 0.2)",
                strokeColor: "#007bff",
                strokeWeight: 2,
              }}
            />

            {/* Markers for nearby places */}
            {places.map((place, index) => (
              <Marker
                key={index}
                position={{ lat: place.lat, lng: place.lng }}
                title={place.name}
                onClick={() => setSelectedPlace(place)}
              />
            ))}

            {/* InfoWindow for selected place */}
            {selectedPlace && (
              <InfoWindow
                position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                onCloseClick={() => setSelectedPlace(null)}
              >
                <div>
                  <h3>{selectedPlace.name}</h3>
                  <p>Lat: {selectedPlace.lat}</p>
                  <p>Lng: {selectedPlace.lng}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
};

export default Google;
