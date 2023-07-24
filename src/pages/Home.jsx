import React, { useState } from "react";
import ChatGpt from "../components/ChatGpt";
import Map from "../components/Map";

const Home = () => {
  const [position, setPosition] = useState({ lat: 40.820150578444924, lng: -73.949533933551 });
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="container">
      <div className="columns is-centered" style={{ minHeight: '100vh' }}> {/* Ensure it's centered and takes full viewport height */}
        <div className="column is-half">
          <ChatGpt onLocationReceived={(loc) => {
            setPosition(loc);
            setShowMap(true);
          }} />
          {showMap && <Map position={position} />}
        </div>
      </div>
    </div>
  );
};

export default Home;





