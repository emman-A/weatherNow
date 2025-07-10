var weatherApi = "/weather";
const weatherForm = document.querySelector("form");

const search = document.querySelector("input");

const weatherIcon = document.querySelector(".weatherIcon i");

const weatherCondition = document.querySelector(".weatherConfiguration");

const tempElement = document.querySelector(".temperature span");

const locationElement = document.querySelector(".place");

const dateElement = document.querySelector(".date");

const tempUnitRadios = document.querySelectorAll('input[name="tempUnit"]');

// Store the current temperature in Kelvin for unit conversion
let currentTempKelvin = null;

// Temperature conversion functions
function kelvinToCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(1);
}

function kelvinToFahrenheit(kelvin) {
  return (((kelvin - 273.15) * 9/5) + 32).toFixed(1);
}

function updateTemperatureDisplay() {
  if (currentTempKelvin !== null) {
    const selectedUnit = document.querySelector('input[name="tempUnit"]:checked').value;
    if (selectedUnit === 'celsius') {
      tempElement.textContent = kelvinToCelsius(currentTempKelvin) + "°C";
    } else {
      tempElement.textContent = kelvinToFahrenheit(currentTempKelvin) + "°F";
    }
  }
}

// Add event listeners for temperature unit radio buttons
tempUnitRadios.forEach(radio => {
  radio.addEventListener('change', updateTemperatureDisplay);
});

const currentDate = new Date();

const options = { month: "long" };
const monthName = currentDate.toLocaleString("en-US", options);
dateElement.textContent = new Date().getDate() + ", " + monthName;

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //   console.log(search.value);
  locationElement.textContent = "Loading...";
  weatherIcon.className = "";
  tempElement.textContent = "";
  weatherCondition.textContent = "";

  showData(search.value);
});

if ("geolocation" in navigator) {
  locationElement.textContent = "Loading...";
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.address && data.address.city) {
            const city = data.address.city;

            showData(city);
          } else {
            console.error("City not found in location data.");
          }
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
        });
    },
    function (error) {
      console.error("Error getting location:", error.message);
    }
  );
} else {
  console.error("Geolocation is not available in this browser.");
}

function showData(city) {
  getWeatherData(city, (result) => {
    console.log(result);
    if (result.cod == 200) {
      // Set weather icon based on weather condition
      const weatherMain = result.weather[0].main.toLowerCase();
      const weatherDesc = result.weather[0].description.toLowerCase();
      
      if (weatherDesc.includes("rain") || weatherMain === "rain") {
        weatherIcon.className = "wi wi-day-rain";
      } else if (weatherDesc.includes("cloud") || weatherMain === "clouds") {
        weatherIcon.className = "wi wi-day-cloudy";
      } else if (weatherDesc.includes("clear") || weatherMain === "clear") {
        weatherIcon.className = "wi wi-day-sunny";
      } else if (weatherDesc.includes("snow") || weatherMain === "snow") {
        weatherIcon.className = "wi wi-day-snow";
      } else if (weatherDesc.includes("fog") || weatherDesc.includes("mist")) {
        weatherIcon.className = "wi wi-day-fog";
      } else {
        weatherIcon.className = "wi wi-day-cloudy";
      }
      
      locationElement.textContent = result?.name + ", " + result?.sys?.country;
      
      // Store temperature in Kelvin for unit conversion
      currentTempKelvin = result?.main?.temp;
      
      // Update temperature display based on selected unit
      updateTemperatureDisplay();
      
      weatherCondition.textContent =
        result?.weather[0]?.description?.toUpperCase();
    } else {
      locationElement.textContent = "City not found.";
      weatherIcon.className = "";
      tempElement.textContent = "";
      weatherCondition.textContent = "";
      currentTempKelvin = null;
    }
  });
}

function getWeatherData(city, callback) {
  const locationApi = weatherApi + "?address=" + city;
  fetch(locationApi).then((response) => {
    response.json().then((response) => {
      callback(response);
    });
  });
}
