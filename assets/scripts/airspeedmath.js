'use strict';

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function toDeg(rad) {
  return rad * 180 / Math.PI;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// latitude (y), longitude (x)
function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d * 1000.0; // Distance in meters
}

/**
 * Calculate the bearing between two positions as a value from 0-360
 *
 * @param lat1 - The latitude of the first position
 * @param lng1 - The longitude of the first position
 * @param lat2 - The latitude of the second position
 * @param lng2 - The longitude of the second position
 *
 * @return int - The bearing between 0 and 360
 */
function bearing(lat1, lng1, lat2, lng2) {
  var dLon = (lng2 - lng1);
  var y = Math.sin(dLon) * Math.cos(lat2);
  var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  var brng = toDeg(Math.atan2(y, x));
  var finalbrng = 360 - ((brng + 360) % 360);
  var compassbrng = (brng + 180) % 360;
  return compassbrng;
}

function timeBetweenPositions() {
  if (!AirspeedMath.position || !AirspeedMath.oldposition) return 0;
  return AirspeedMath.position.timestamp - AirspeedMath.oldposition.timestamp;
}

var AirspeedMath = module.exports = {

  isWeatherDataValid: function (weatherData) {
    return weatherData.wind && weatherData.wind.deg;
  },

  isPositionValid: function (pos) {
    if (AirspeedMath.isNearlySameTimestamp(pos)) return false;
    if (AirspeedMath.isAccuracyTooLow(pos)) return false;
    return true;
  },

  isAccuracyTooLow: function (pos) {
    return pos.coords.accuracy && pos.coords.accuracy > 175; // bigger number is less accurate
  },

  isSamePosition: function (pos) {
    if (!AirspeedMath.position) return false;
    return AirspeedMath.position.coords.latitude === pos.coords.latitude
        && AirspeedMath.position.coords.longitude === pos.coords.longitude;
  },

  isNearlySameTimestamp: function (pos) {
    if (!AirspeedMath.position) return false;
    return Math.abs(pos.timestamp - AirspeedMath.position.timestamp) < 100;
  },

  setPosition: function (position) {
    AirspeedMath.oldestgroundspeed = AirspeedMath.oldergroundspeed;
    AirspeedMath.oldergroundspeed = AirspeedMath.oldgroundspeed;
    AirspeedMath.oldgroundspeed = AirspeedMath.getCalculatedGroundSpeed();
    AirspeedMath.oldposition = AirspeedMath.position;
    AirspeedMath.position = position;

    AirspeedMath.updateTripTime();
    AirspeedMath.updateTripWindEnergy();
    AirspeedMath.updateTripAirEnergy();
    AirspeedMath.updateTripDistance();
  },

  tripWindEnergy: 0,
  updateTripWindEnergy: function () {
    AirspeedMath.tripWindEnergy += AirspeedMath.getPowerOnWindDrag() * (timeBetweenPositions() / (60 * 60 * 1000));
  },

  tripAirEnergy: 0,
  updateTripAirEnergy: function () {
    AirspeedMath.tripAirEnergy += AirspeedMath.getPowerOnAirDrag() * (timeBetweenPositions() / (60 * 60 * 1000));
  },

  tripTime: 0,
  updateTripTime: function () {
    AirspeedMath.tripTime += timeBetweenPositions();
  },

  tripDistance: 0,
  updateTripDistance: function () {
    AirspeedMath.tripDistance += AirspeedMath.getDistance();
  },

  resetIfNewTrip: function () {
    if (timeBetweenPositions() > 10 * 60 * 1000) {
      AirspeedMath.oldposition = undefined;
      AirspeedMath.oldestgroundspeed = undefined;
      AirspeedMath.oldergroundspeed = undefined;
      AirspeedMath.oldgroundspeed = undefined;
      AirspeedMath.tripTime = 0;
      AirspeedMath.tripDistance = 0;
      return true;
    }
    return false;
  },

  reset: function () {
    AirspeedMath.weatherData = undefined;
    AirspeedMath.position = undefined;
    AirspeedMath.oldposition = undefined;
    AirspeedMath.oldestgroundspeed = undefined;
    AirspeedMath.oldergroundspeed = undefined;
    AirspeedMath.oldgroundspeed = undefined;
    AirspeedMath.tripTime = 0;
    AirspeedMath.tripDistance = 0;
  },

  setWeatherData: function (weatherData) {
    AirspeedMath.weatherData = weatherData;
  },

  getDistance: function () {
    if (!AirspeedMath.oldposition) return 0;
    return getDistanceFromLatLon(
        AirspeedMath.oldposition.coords.latitude, AirspeedMath.oldposition.coords.longitude,
        AirspeedMath.position.coords.latitude, AirspeedMath.position.coords.longitude);
  },

  // wind.deg: wind blowing 0 deg is from north, 90 deg is from east, 180 south, 270 east
  // called Angle Of Attack
  getAngleBetweenWindAndBearing: function () {
    if (!AirspeedMath.weatherData) {
      return 0;
    } else {
      var angle = AirspeedMath.weatherData.wind.deg - AirspeedMath.getBearing();
      if (angle < 0) angle += 360;
      return  angle % 360;
    }
  },

  // 0 is moving north, 90 east, 180 south, 270 east
  getBearing: function () {
    if (!AirspeedMath.position || !AirspeedMath.oldposition) {
      return 0;
    } else {
      return bearing(
          AirspeedMath.position.coords.latitude, AirspeedMath.position.coords.longitude,
          AirspeedMath.oldposition.coords.latitude, AirspeedMath.oldposition.coords.longitude);
    }
  },

  mps2kmph: function (value) {
    if (!isNumeric(value)) return value;
    return Math.round(value * 3.6);
  },

  getCalculatedGroundSpeed: function () {
    var distance = AirspeedMath.getDistance();
    if (distance == 0) {
      return 0;
    } else {
      return distance / (timeBetweenPositions() / 1000.0);
    }
  },

  getGroundSpeed: function () {
    if (!AirspeedMath.position) return 0;
    if (isNumeric(AirspeedMath.position.coords.speed)) {
      return AirspeedMath.position.coords.speed;
    }

    var speed = AirspeedMath.getCalculatedGroundSpeed();
    if (timeBetweenPositions() > 10000) { // dont use weighted if more than 10 secs between positions
      return speed;
    }

    var weightedSpeed;
    if (AirspeedMath.oldestgroundspeed) {
      weightedSpeed = speed / 4.0 + AirspeedMath.oldgroundspeed / 4.0 + AirspeedMath.oldergroundspeed / 4.0 + AirspeedMath.oldestgroundspeed / 4.0;
    } else if (AirspeedMath.oldergroundspeed) {
      weightedSpeed = speed / 3.0 + AirspeedMath.oldgroundspeed / 3.0 + AirspeedMath.oldergroundspeed / 3.0;
    } else if (AirspeedMath.oldgroundspeed) {
      weightedSpeed = speed / 2.0 + AirspeedMath.oldgroundspeed / 2.0;
    } else {
      weightedSpeed = speed;
    }
    return weightedSpeed;
  },

  // wind speed opposite moving direction
  getDirectWindSpeed: function () {
    if (!AirspeedMath.weatherData) {
      return 0;
    } else {
      return AirspeedMath.weatherData.wind.speed * Math.cos(deg2rad(AirspeedMath.getAngleBetweenWindAndBearing()));
    }
  },

  getWeatherData: function () {
    return AirspeedMath.weatherData;
  },

  getAirSpeed: function () {
    return AirspeedMath.getGroundSpeed() + AirspeedMath.getDirectWindSpeed();
  },

  setDragArea: function (dragarea) {
    AirspeedMath.dragarea = dragarea;
  },

  getPowerOnWindDrag: function () {
    if (!AirspeedMath.weatherData) return 0;
    return AirspeedMath.getPowerOnAirInclWindDrag() - AirspeedMath.getPowerOnAirDrag();
  },

  getPowerOnAirInclWindDrag: function () {
    if(AirspeedMath.getGroundSpeed() == 0) return 0;
    return 0.5 * 1.2 * Math.pow(AirspeedMath.getGroundSpeed() + AirspeedMath.getDirectWindSpeed(), 3) * AirspeedMath.dragarea;
  },

  getPowerOnAirDrag: function () {
    return 0.5 * 1.2 * Math.pow(AirspeedMath.getGroundSpeed(), 3) * AirspeedMath.dragarea;
  },

  getWindImpactOnConsumption: function () {
    if (AirspeedMath.getGroundSpeed() < 1) return 0; // too unprecise under 1 m/s
    return AirspeedMath.getDirectWindSpeed() / AirspeedMath.getGroundSpeed() * 100;
  },

  getAverageAirEnergyPerKilometer: function () {
    return AirspeedMath.tripAirEnergy / (AirspeedMath.tripDistance / 1000.0);
  },

  getAverageWindEnergyPerKilometer: function () {
    return AirspeedMath.tripWindEnergy / (AirspeedMath.tripDistance / 1000.0);
  }
};
