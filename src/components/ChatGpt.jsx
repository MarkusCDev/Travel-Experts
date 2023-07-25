import React, { useState } from "react";
import axios from "axios";

const ChatGpt = ({ onLocationReceived }) => {
  const [prompt, setPrompt] = useState("");
  const [locations, setLocations] = useState([]);
  const HTTP = `${window.location.protocol}//${window.location.hostname}:8020/chat`;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${HTTP}`, { prompt })
      .then((res) => {
        setLocations(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="container">
      <h1 className="title">AI Destination Recommendation</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Enter feature"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div className="control">
            <button className="button is-primary" type="submit">
              Send
            </button>
          </div>
        </div>
      </form>

      <div className="location-buttons" style={{ marginTop: "15px" }}>
        {locations.map((location) => (
          <button
            key={location.name}
            onClick={() => onLocationReceived({ lat: location.lat, lng: location.lng })}
            className="button is-link is-light"
            style={{ display: "block", marginBottom: "10px", width: "95%" }}
          >
            {location.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatGpt;

