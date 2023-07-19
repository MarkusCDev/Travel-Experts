import React, { useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Map = () => {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [position, setPosition] = useState({ lat: 40.820150578444924, lng: -73.949533933551});
  const inputRef = useRef(null);

  const handleInputChange = () => {
    const value = inputRef.current.value;
    const [lat, lng] = value.split(",");
    setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
  };

  const handleButtonClick = () => {
    setPosition(coordinates);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <input
          ref={inputRef}
          type="text"
          className="input"
          style={{ marginRight: "10px" }}
          placeholder="Format: latitude, longitude"
          onChange={handleInputChange}
        />
        <button className="button is-primary" onClick={handleButtonClick}>
          Show Location
        </button>
      </div>
      <div style={{ height: "400px", width: "600px" }}>
        <GoogleMap
          mapContainerStyle={{ height: "100%", width: "100%" }}
          center={position}
          zoom={12}
        >
          <Marker position={position} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default Map;

