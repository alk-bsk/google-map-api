import React, { useState } from "react";
import { LoadScript } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyCdZHaiYlY5KJAGs4Bd_rjmYnnr7NIgTqs";
//const DELIVERY_ORIGIN = "Hatsimla rathtala, samudragarh, west bengal"; // e.g., "MG Road, Bangalore, India"
const RATE_PER_KM = 6;

function App() {
  const [destination, setDestination] = useState("");
  const [source, setSource] = useState("");
  const [distanceKm, setDistanceKm] = useState(null);
  const [charge, setCharge] = useState(null);
  const [error, setError] = useState(null);

  const calculateDeliveryCharge = async () => {
    if (!destination) return;

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [source],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      },
      (response, status) => {
        if (status === "OK") {
          //const distanceText = response.rows[0].elements[0].distance.text;
          const distanceValue = response.rows[0].elements[0].distance.value; // in meters
          const km = distanceValue / 1000;
          setDistanceKm(km);
          setCharge(Math.ceil(km * RATE_PER_KM));
        } else {
          setError("Error calculating distance. Please try again.");
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
      <div style={{ padding: "20px" }}>
        <h2>Delivery Charge Calculator</h2>
        <input
          type="text"
          placeholder="Enter your address"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={{ width: "90%", margin: "10px" }}
        />
        <br/>
        <input
          type="text"
          placeholder="Enter your address"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ width: "90%", margin: "10px" }}
        />
        <div style={{textAlign:'center'}}>
        <button  onClick={calculateDeliveryCharge}>Calculate</button>
        </div>

        {distanceKm !== null && (
          <div>
            <p>Distance: {distanceKm.toFixed(2)} km</p>
            <p>Delivery Charge: ₹{charge}</p>
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </LoadScript>
  );
}

export default App;
