import React, { useState } from "react";
import ChatGpt from "../components/ChatGpt";
import Map from "../components/Map";

const Home = () => {
  const [positions, setPositions] = useState([]);
  const [showMap, setShowMap] = useState(false);

  
  return (
    <div className="container">
      <div className="columns is-centered" style={{ minHeight: '100vh' }}>
        <div className="column is-half">
          <ChatGpt onLocationReceived={(locs) => {
            setPositions(locs);
            setShowMap(true);
          }} />
          {showMap && <Map positions={positions} />}
        </div>
      </div>
    </div>
  );
};

export default Home;






