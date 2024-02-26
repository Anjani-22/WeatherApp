const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;

const baseUrl = `https://api.openweathermap.org/data/2.5/weather`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall`;

// Helper function to make API requests
async function getWeatherData(url, params) {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get weather data");
  }
}

// API endpoints

// **Data of Multiple Cities:**

app.get("/weather", async (req, res) => {
  const { city, code, page = 1, per_page = 10 } = req.query;

  const params = {
    appid: apiKey,
    q: city,
    id: code,
  };

  if (page > 0 && per_page > 0) {
    params.limit = per_page;
    params.offset = (page - 1) * per_page;
  }

  try {
    const data = await getWeatherData(baseUrl, params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Detailed Forecast for X Days:**

app.get("/weather/forecast", async (req, res) => {
  const { city, code, days } = req.query;

  if (!city && !code) {
    return res
      .status(400)
      .json({ error: "Missing required parameter: city or code" });
  }

  if (!days) {
    return res.status(400).json({ error: "Missing required parameter: days" });
  }

  const params = {
    appid: apiKey,
    exclude: "current,minutely,hourly",
    units: "metric", // Adjust units as needed (metric, imperial)
  };

  if (city) {
    params.q = city;
  } else {
    params.id = code;
  }

  params.cnt = days;

  try {
    const data = await getWeatherData(forecastUrl, params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Filter Data by City, Date, and Moment:**

app.get("/weather/filtered", async (req, res) => {
  const { city, code, date, moment } = req.query;

  const params = {
    appid: apiKey,
    units: "metric", // Adjust units as needed
  };

  if (city) {
    params.q = city;
  } else if (code) {
    params.id = code;
  } else {
    return res
      .status(400)
      .json({ error: "Missing required parameter: city or code" });
  }

  if (date) {
    params.dt = new Date(date).getTime() / 1000;
  }

  if (moment && (moment === "daytime" || moment === "nighttime")) {
    params.dt += moment === "daytime" ? 12 * 3600 : 21 * 3600; // Adjust for daytime/nighttime
  }

  try {
    const data = await getWeatherData(baseUrl, params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Current Weather Conditions of a Specific City:**

app.get("/weather/current", async (req, res) => {
  const { city, code } = req.query;

  if (!city && !code) {
    return res
      .status(400)
      .json({ error: "Missing required parameter: city or code" });
  }

  const params = {
    appid: apiKey,
    units: "metric", // Adjust units as needed
  };

  if (city) {
    params.q = city;
  } else {
    params.id = code;
  }

  try {
    const data = await getWeatherData(baseUrl, params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
