import React, { useState } from "react";
import ChatGpt from "../components/ChatGpt";
import Map from "../components/Map";

const Home = () => {
  const [position, setPosition] = useState(null);
  const [showMap, setShowMap] = useState(false);  // New state variable to control map visibility

  // Modify this handler to also change the showMap state
  const handleLocationReceived = (loc) => {
    setPosition(loc);
    setShowMap(true);  // Show the map when a location is received
  };

  
  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half">
          {showMap && position && <Map position={position} />}
        </div>
        <div className="column is-half">
          <ChatGpt onLocationReceived={handleLocationReceived} />
        </div>
      </div>
    </div>
  );
};

export default Home;



