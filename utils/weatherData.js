const request = require('request');

const openWeatherMap = {
    BASE_URL: "https://api.openweathermap.org/data/2.5/weather?q=",
    SECRET_KEY: "4383fbc3a68aa8253ccebd8d5b20f352"
};

const weatherData = (address, callback) => {
    const url = openWeatherMap.BASE_URL + encodeURIComponent(address) + "&APPID=" + openWeatherMap.SECRET_KEY;
    console.log(url);

    request({url, json: true}, (error, response) => {
        if (error) {
            callback(true, "Unable to fetch data, please try again: " + error);
        } else if (response.body.cod && response.body.cod !== 200) {
            callback(true, response.body.message || "City not found");
        } else {
            callback(false, response.body);
        }
    });
};

module.exports = weatherData;
