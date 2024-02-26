const weatherService = require("../services/weather");
const Weather = require("../models/weather"); // Import model if needed

const getWeatherByCity = async (req, res) => {
  const { city } = req.query;

  try {
    const data = await weatherService.getWeatherByCity(city);
    // Convert data to weather object (optional):
    const weather = new Weather(
      data.name,
      data.sys.country,
      data.main.temp,
      data.weather[0].description,
      data.weather[0].icon
    );
    res.json(weather); // Send data or weather object
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getForecastByCity = async (req, res) => {
  const { city, days } = req.query;

  try {
    const forecast = await weatherService.getForecastByCity(city, days);
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const filterWeatherData = async (req, res) => {
  const { city, date, moment } = req.query;

  try {
    const data = await weatherService.filterWeatherData(city, date, moment);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrentWeatherByCity = async (req, res) => {
  const { city } = req.query;

  try {
    const data = await weatherService.getWeatherByCity(city);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWeatherByCity,
  getForecastByCity,
  filterWeatherData,
  getCurrentWeatherByCity,
};
