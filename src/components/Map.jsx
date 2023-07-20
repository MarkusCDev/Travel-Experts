import React, { useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Map = ({ position }) => {
  const inputRef = useRef(null);

  const handleInputChange = () => {
    const value = inputRef.current.value;
    const [lat, lng] = value.split(",");
    //  directly updating the position based on the input.
    // Using a separate local state for this and set the position using the handleButtonClick method.
    position = { lat: parseFloat(lat), lng: parseFloat(lng) };
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


