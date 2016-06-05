'use strict';

function requestTeslaLocation(callback) {
//  var host = 'https://'+document.location.host;
  var host = 'http://' + document.location.hostname + ':8888';
  var positionRequest = new XMLHttpRequest();
  positionRequest.open('GET', host + '/airdragindicator/tesladrivingandposition.php?access_token=' + Location.tesla_access_token + '&vehicle_id=' + Location.tesla_vehicle_id, true);

  positionRequest.onreadystatechange = function () {
    if (positionRequest.readyState === 4) {
      console.log('Status:' +positionRequest.status);
      console.log('Headers:' +positionRequest.getAllResponseHeaders());
      console.log('Body:' + positionRequest.responseText);
      var startIndex = positionRequest.response.indexOf('{');
      if(startIndex != -1) {
        var jsonString = positionRequest.response.substring(startIndex);
        jsonString = jsonString.substring(0, jsonString.length - 2);
        var response = JSON.parse(jsonString);
        var pos = { coords: {
          latitude: response.response.latitude,
          longitude: response.response.longitude,
          heading: response.response.heading,
          speed: response.response.speed
        }, timestamp: response.response.gps_as_of};
        callback(pos);
      }
      setTimeout(requestTeslaLocation, Location.prototype.delay, callback);
    }
  };
  console.log('call: tesladrivingandposition.php');
  positionRequest.send();
}

var Location = module.exports = {

  delay: 60000,

  get: function (callback, error) {
    if (Location.tesla_access_token) {
      navigator.geolocation.clearWatch(Location.geoWatchId);
      requestTeslaLocation.call(callback);

    } else if (navigator.geolocation) {
      var timeoutVal = 10 * 1000 * 1000;
      Location.geoWatchId = navigator.geolocation.watchPosition(callback, error, { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 });
    }
    else {
      alert("Geolocation is not supported by this browser");
    }
  }

};