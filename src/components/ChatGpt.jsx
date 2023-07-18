import React, { useState } from "react";
import axios from "axios";

const ChatGpt = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const HTTP = "http://localhost:8020/chat";

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${HTTP}`, { prompt })
      // .get(`${HTTP}`, console.log('Get Worked'))
      .then((res) => setResponse(res.data))
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>ChatGpt Destination Recommendation</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter feature"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
      <div>
        <p>{response ? response : "Enter any travel desination feature..."}</p>
      </div>
    </div>
  );
};

export default ChatGpt;
