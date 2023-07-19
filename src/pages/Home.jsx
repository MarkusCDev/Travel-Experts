import React from "react";
import ChatGpt from "../components/ChatGpt";
import Map from "../components/Map";

const Home = () => {
  return (
    <div className="container">
      <div className="columns is-centered">
        <div className="column is-half">
          <Map />
        </div>
        <div className="column is-half">
          <ChatGpt />
        </div>
      </div>
    </div>
  );
};

export default Home;


