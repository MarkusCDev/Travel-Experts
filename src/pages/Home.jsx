import React, { useState } from "react";
import ChatGpt from "../components/ChatGpt";
import Map from "../components/Map";

const Home = () => {
  const [position, setPosition] = useState({ lat: 40.820150578444924, lng: -73.949533933551});

  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half">
          <Map position={position} />
        </div>
        <div className="column is-half">
          <ChatGpt onLocationReceived={(loc) => setPosition(loc)} />
        </div>
      </div>
    </div>
  );
};

export default Home;



