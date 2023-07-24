import React, { useState } from "react";
import axios from "axios";

const ChatGpt = ({ onLocationReceived }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const HTTP = "http://localhost:8020/chat";

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${HTTP}`, { prompt })
      .then((res) => {
        const responseText = res.data.trim();
        setResponse(responseText);

        // Extract multiple latitudes and longitudes from the response
        const regex = /(-?\d+\.\d+) (-?\d+\.\d+)/g;
        let match;
        const locations = [];

        while ((match = regex.exec(responseText)) !== null) {
          const lat = parseFloat(match[1]);
          const lng = parseFloat(match[2]);
          locations.push({ lat, lng });
        }

        if (locations.length) {
          onLocationReceived(locations);
        }
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
      <div>
        <p className="response">
          {response ? response : "Enter any travel destination feature..."}
        </p>
      </div>
    </div>
  );
};

export default ChatGpt;


