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
        const responseText = res.data.trim();

        // Adjusted regular expression to match multi-word location names
        const locationMatches = responseText.match(
          /([A-Za-z\s]+) (-?\d+\.\d+) (-?\d+\.\d+)/g
        );

        const parsedLocations = locationMatches.map((match) => {
          const parts = match.split(" ").filter((part) => part); // Filter to remove any extra spaces
          const lng = parseFloat(parts.pop()); // last element
          const lat = parseFloat(parts.pop()); // second last element
          const name = parts.join(" "); // remaining elements make up the name

          return { name, lat, lng };
        });

        setLocations(parsedLocations);
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
      <div className="location-buttons">
        {locations.map((location) => (
          <button
            key={location.name}
            onClick={() =>
              onLocationReceived({ lat: location.lat, lng: location.lng })
            }
            className="button is-link is-light"
          >
            {location.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatGpt;
