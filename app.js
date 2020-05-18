// Select Elements form UI
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

// Weather data
const weather = {};

weather.temperature = {
  unit: "celcius"
};

// Const and variables
const KELVIN = 273;
// API Key
const key = "your api key";

// Browser geolocation support
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.display = "block";
  notificationElement.innerHTML = "<p>Browser does not support Geolocation</p>";
}

// Set Users Position
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}

// Geolocation Error
function showError(error) {
  console.log(error);
  notificationElement.display = "block";
  notificationElement.innerHTML = `<p>${error.message}</p>`;
}

// Get weather
function getWeather(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key} `;

  fetch(api)
    .then(function(response) {
      let data = response.json();
      return data;
    })
    .then(function(data) {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(function() {
      displayWeather();
    });
}

// Dipslay Weather
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}&deg;<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// convert when clicked
function celciusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}
tempElement.addEventListener("click", function() {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit == "celsius") {
    let fahrenheit = celciusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit}&deg;<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}&deg;<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
