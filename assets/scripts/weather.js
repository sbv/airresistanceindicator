'use strict';

function saveOpenWeatherMapResponse() {
  if (Weather.openWeatherMapRequest.readyState == 4) {
    if(Weather.openWeatherMapRequest.status == 200) {
      document.getElementById('weatherAlert').style.display = 'none';
      Weather.openWeatherMapRequestCallback(JSON.parse(Weather.openWeatherMapRequest.response));
    } else {
      document.getElementById('weatherAlert').style.display = 'inline-block';
    }
  }
}

var Weather = module.exports = {

  openWeatherMapRequest: undefined,
  openWeatherMapRequestCallback: undefined,

  get: function (appId, position, callback) {
    Weather.openWeatherMapRequestCallback = callback;
    Weather.openWeatherMapRequest = new XMLHttpRequest();
    Weather.openWeatherMapRequest.onreadystatechange = saveOpenWeatherMapResponse;
    Weather.openWeatherMapRequest.open("GET", "http://api.openweathermap.org/data/2.5/weather?APPID="+appId+"&lat="+position.coords.latitude+"&lon="+position.coords.longitude, true);
    Weather.openWeatherMapRequest.send();
  }
};
