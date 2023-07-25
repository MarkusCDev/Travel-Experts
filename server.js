const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    max_tokens: 70,
    temperature: 0,
    prompt: `Recommend me 3 '${prompt}' and only provide the longitude and latitude in the format: 'Location_name latitude_number longitude_number Location_name latitude_number longitude_number Location_name latitude_number longitude_number'`,
  });
  res.send(completion.data.choices[0].text);
});

const PORT = 8020;

// app.get("/x", (req, res) => {
//   res.send("GET Request Called");
//   console.log("Get Request Called")
// });

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
