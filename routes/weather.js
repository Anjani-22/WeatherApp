const express = require("express");

const weatherController = require("../controllers/weather");

const router = express.Router();

// Route for getting weather data by city
router.get("/weather/current", weatherController.getWeatherByCity);

// Route for getting detailed forecast for X days
router.get("/weather/forecast", weatherController.getForecastByCity);

// Route for filtering weather data by city, date, and moment
router.get("/weather/filter", weatherController.filterWeatherData);

// Route for getting current weather conditions of a specific city (alternative)
router.get("/weather", weatherController.getCurrentWeatherByCity);

module.exports = router;
