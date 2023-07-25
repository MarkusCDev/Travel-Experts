import React, { useState } from "react";
import ChatGpt from "../components/ChatGpt";
import Map from "../components/Map";

const Home = () => {
  const [position, setPosition] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const handleLocationReceived = (loc) => {
    setPosition(loc);
    setShowMap(true);
  };

  return (
    <div className="container">
      <div className="columns is-centered is-multiline">
        <div className="column is-three-quarters">
          <ChatGpt onLocationReceived={handleLocationReceived} />
        </div>
        <div className="column is-three-quarters">
          {showMap && position && <Map position={position} />}
        </div>
      </div>
    </div>
  );
};

export default Home;







