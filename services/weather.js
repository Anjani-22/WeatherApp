const axios = require("axios");
const dotenv = require("dotenv");
const moment = require("moment"); // For date/time manipulation

dotenv.config();

const apiKey = process.env.OPEN_WEATHER_MAP_API_KEY;

const baseUrl = `https://api.openweathermap.org/data/2.5/weather`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/onecall`;

const getWeatherData = async (url, params) => {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get weather data");
  }
};

const getWeatherByCity = async (city) => {
  const params = {
    appid: apiKey,
    q: city,
    units: "metric", // Adjust units as needed (metric, imperial)
  };
  return await getWeatherData(baseUrl, params);
};

const getForecastByCity = async (city, days) => {
  if (!days) {
    throw new Error("Missing required parameter: days");
  }

  const params = {
    appid: apiKey,
    exclude: "current,minutely,hourly", // Exclude unnecessary data
    units: "metric", // Adjust units as needed
    cnt: days,
  };

  if (city) {
    params.q = city;
  } else {
    throw new Error("Missing required parameter: city");
  }

  return await getWeatherData(forecastUrl, params);
};

const filterWeatherData = async (city, date, moment) => {
  const params = {
    appid: apiKey,
    units: "metric", // Adjust units as needed
  };

  if (city) {
    params.q = city;
  } else {
    throw new Error("Missing required parameter: city");
  }

  if (date) {
    params.dt = moment(date).unix(); // Use moment.js for reliable date handling
  }

  if (moment && (moment === "daytime" || moment === "nighttime")) {
    const timeOfDay = moment(date).format("HH"); // Get hour of day
    params.dt +=
      moment === "daytime" ? (timeOfDay >= 12 ? 0 : 12 * 3600) : 21 * 3600; // Adjust for daytime/nighttime
  }

  return await getWeatherData(baseUrl, params);
};

module.exports = {
  getWeatherByCity,
  getForecastByCity,
  filterWeatherData,
};
