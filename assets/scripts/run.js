'use strict';

var location = require('./location');
//var location = require('./testlocation');
var weather = require('./weather');
//var weather = require('./testweather');
var am = require('./airspeedmath');
var ui = require('./ui');
var cookies = require('js-cookie');

//TODO put firebase in own module
//var Firebase = require("firebase");
var firebase;

var uid;

function createDebugString(pos) {
  var result = pos.coords.latitude + ',' + pos.coords.longitude + ',' + pos.timestamp + ',tickmark,' + am.getBearing()
      + ',bearing=' + am.getBearing() + ' poaiwd=' + am.getPowerOnAirInclWindDrag()+ ' powda=' + am.getPowerOnWindDrag()
      + ' groundspeed=' + am.mps2kmph(am.getGroundSpeed()) + ' calspeed=' + am.mps2kmph(am.getCalculatedGroundSpeed())
      + ' gpsspeed=' + am.mps2kmph(pos.coords.speed) + ' triptime=' + am.tripTime + ' tripdistance=' + am.tripDistance
      + ' tripairenergy=' + am.tripAirEnergy+ ' tripwindenergy=' + am.tripWindEnergy + ', red, 1\n';
  if (am.getWeatherData()) result += (pos.coords.latitude + 0.00005) + ',' + pos.coords.longitude + ','
      + pos.timestamp + ',tickmark,' + (am.getWeatherData().wind.deg + 180) + ',windspeed=' + am.getWeatherData().wind.speed
      + ' windbearing=' + (am.getWeatherData().wind.deg + 180) + ' carAngle=' + am.getAngleBetweenWindAndBearing() + ', yellow, 1\n';
  return result;
}

function setWeatherForTS(weathers, posTS) {
  for (var weather in weathers) {
    if (weathers.hasOwnProperty(weather)) {
      var weatherData = weathers[weather].weatherData;
      var weatherDataTS = weathers[weather].timestamp;
      if (weatherDataTS < posTS) {
        setWeatherDataIfValid(weatherData);
      }
      if (weatherDataTS > posTS) {
        break;
      }
    }
  }
}

function setPositionIfValid(pos) {
  if (am.isPositionValid(pos)) {
    am.setPosition(pos);
    return true;
  }
  return false;
}

function replayTrip() {
  var userRef = firebase.child('uuid');
  userRef.on('value', function (snapshot) {
    //TODO add and set from firebase
    am.setDragArea(0.575999);

    var weathers = snapshot.val().weathers;
    var oldPosTS = 0;
    var posTS = 0;

    var positionArray = [];
    var positions1 = snapshot.val().trip['-timestamp-'].positions;
    for (var position in positions1) {
      if (positions1.hasOwnProperty(position)) {
        positionArray.push(positions1[position]);
      }
    }

//    var positions2 = snapshot.val().trip['20160215-2328'].positions;
//    for (var position in positions2) {
//      if (positions2.hasOwnProperty(position)) {
//        positionArray.push(positions2[position]);
//      }
//    }
    var index = 0;

    var replayPosition = function(index) {
      var pos = positionArray[index].pos;
      oldPosTS = posTS;
      posTS = positionArray[index].timestamp;

      setWeatherForTS(weathers, posTS);
      if(setPositionIfValid(pos)){
        console.log(createDebugString(pos));
      }
//      var delay = oldPosTS!=0?(posTS - oldPosTS)/2.0:0;
      var delay = 1000;
      setTimeout(replayPosition, delay, ++index);
    };

    replayPosition(0);

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

function generateGPSVisualizerData() {
  var userRef = firebase.child("anonymous:-JxY4OyMvdXwze4uaeXu"); // tur i tesla
//  var userRef = firebase.child("anonymous:-Jx8PyT0mprplAiKuvrE"); // tur i tesla
//  var userRef = firebase.child("anonymous:-Jx8pWRh360r9qAzDFPD"); // tur fra snurretoppen på iphone
  userRef.on("value", function (snapshot) {
//    console.log(snapshot.val());

    am.setDragArea(0.575999);

    var positions = snapshot.val().positions;
    var weathers = snapshot.val().weathers;
    var result = "latitude,longitude,time,symbol,rotation,name,color,scale\n";
    for (var position in positions) {
      if (positions.hasOwnProperty(position)) {
        var pos = positions[position].pos;
        var posTS = positions[position].timestamp;

        setWeatherForTS(weathers, posTS);
        if(setPositionIfValid(pos)) {
          result += createDebugString(pos);
        }
      }
    }
    console.log(result);

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

function init() {

  if(Run.debuglogging) {
    firebase.authAnonymously(function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        uid = authData.uid;
//      console.log("Authenticated successfully with payload: "+ authData);

        console.log("uid: "+ uid);
        ui.setUID(uid);

        var date = new Date();
        var userAgentRef = firebase.child(uid);
        userAgentRef.set({
          userAgent: navigator.userAgent,
          timestamp: date.getTime(),
          date: date.getDate() + '/' + (date.getMonth() + 1) +'/' +date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        });
//      var tripsRef = userAgentRef.child('trips');


        if (typeof console != "undefined") {
          if (typeof console.log != 'undefined')
            console.olog = console.log;
          else
            console.olog = function () {
            };
        }

        console.log = function (message) {
          console.olog(message);
          var consoleRef = firebase.child(uid + "/console");
          consoleRef.push(message);
        };
        console.error = console.debug = console.info = console.log;

        run();
      }
    });
  } else {
    run();
  }
}

function run() {
  location.get(locationCallback, locationError);
}

function locationError(error) {
  var errors = {
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };

  if(Run.debuglogging) {
    var locationFailedRef = firebase.child(uid+"/locationFailed");
    locationFailedRef.push({
      error: errors[error.code],
      timestamp: new Date().getTime()
    });
  }

//  setTimeout(run, delay);

//  console.log("get location failed: " + errors[error.code]);
//  Location.callback();
//  alert("Error: " + errors[error.code]);
  //TODO call callback again..
}

function nowString() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var hh = today.getHours();
  var minutes = today.getMinutes();

  var yyyy = today.getFullYear();
  if(dd<10){
    dd='0'+dd
  }
  if(mm<10){
    mm='0'+mm
  }
  if(hh<10){
    hh='0'+hh
  }
  if(minutes<10){
    minutes='0'+minutes
  }
  return yyyy+mm+dd+'-'+hh+minutes;
}

var lastWeatherUpdate = 0;
var tripId = nowString();
function handlePosition(pos) {

  var now = new Date();

  if(am.resetIfNewTrip()) {
    tripId = nowString();
  }

  var validPos = setPositionIfValid(pos);

  if(Run.debuglogging) {
    var positionsRef = firebase.child(uid + '/trip/' + tripId + '/positions');
    if(Object.prototype.toString.call(pos) === '[object Geoposition]') {
      positionsRef.push({
        pos: {coords: {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          altitude: pos.coords.altitude,
          altitudeAccuracy: pos.coords.altitudeAccuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed
        }, timestamp: pos.timestamp},
        timestamp: now.getTime(),
        valid: validPos
      });
    } else {
      positionsRef.push({
        pos: pos,
        timestamp: now.getTime(),
        valid: validPos
      });
    }

    var debuglogsRef = firebase.child(uid + "/debuglogs");
    debuglogsRef.push({log: createDebugString(pos), timestamp: pos.timestamp});
  }

  console.log(createDebugString(pos));
}

var location_alerter;
var location_alerter_counter;

function location_alerter_trigger() {
  location_alerter_counter++;
  if(location_alerter_counter >= 10) {
//    ui.setLocationAlertSeconds(location_alerter_counter);
  }
  location_alerter = setTimeout(location_alerter_trigger, 1000);
}

function location_alerter_reset() {
  clearTimeout(location_alerter);
  location_alerter_counter = 1;
//  ui.hideLocationAlert();
  location_alerter_trigger();
}

function locationCallback(pos) {
  location_alerter_reset();
  if(pos) {
    handlePosition(pos);
//    if(cookies.get('owmkey')) {
      if(new Date().getTime() - lastWeatherUpdate > 60000) {
        weather.get('@owmkey@', pos, updateWeatherData);
        lastWeatherUpdate = new Date().getTime();
      }
//    }
  }
}

function setWeatherDataIfValid(weatherData) {
  if (am.isWeatherDataValid(weatherData)) {
    am.setWeatherData(weatherData);
    return true;
  }
  return false;
}

function updateWeatherData(weatherData) {
  setWeatherDataIfValid(weatherData);

  if(Run.debuglogging) {
    var weathersRef = firebase.child(uid+"/weathers");
    weathersRef.push({
      weatherData: weatherData, timestamp: new Date().getTime()
    });
  }
}

function updateNumbers() {
  ui.updateNumbers(am);
  setTimeout(updateNumbers, 200);
}

function updateBars() {
  ui.updateBars(am);
  setTimeout(updateBars, 1000);
}

function switch_style ( css_title ) {
// You may use this script on your site free of charge provided
// you do not remove this notice or the URL below. Script from
// http://www.thesitewizard.com/javascripts/change-style-sheets.shtml
  var i, link_tag ;
  for (i = 0, link_tag = document.getElementsByTagName("link"); i < link_tag.length ; i++ ) {
    if ((link_tag[i].rel.indexOf( "stylesheet" ) != -1) && link_tag[i].title) {
      link_tag[i].disabled = true;
      if (link_tag[i].title == css_title) {
        link_tag[i].disabled = false ;
      }
    }
  }
  cookies.set('style', css_title, { expires: 7 });
}

var Run = module.exports = {

  run: function () {
  //  debug.addConsoleToDiv();

    if(Run.debuglogging) {
      firebase = new Firebase("@firebaserepourl@");
    }

  //  generateGPSVisualizerData();
  //  replayTrip();
    init();
    updateNumbers();
    updateBars();
  },


  //module.exports: function () {
  //};


  switch_to_day: function () {
    switch_style('day');
  },

  switch_to_night: function () {
    switch_style('night');
  },

  show_settings: function () {
    $('#configModal').modal('show');
  },

  show_info: function () {
    $('#infoModal').modal('show');
  },

  change_dragarea: function () {
    var select = document.getElementById('dragarea');
    cookies.set('dragarea', select.selectedIndex, { expires: 365 });
  },

//  change_owmkey: function () {
//    var input = document.getElementById('owmkey');
//    cookies.set('owmkey', input.value, { expires: 365 });
//    if(!input.value) {
//      cookies.set('showwindangleoncar', "", { expires: 365 });
//      ui.showwindangleoncarChanged();
//    }
//    ui.owmkeyChanged();
//  },

  change_shownumbers: function () {
    var input = document.getElementById('shownumbers');
    cookies.set('shownumbers', input.checked?"true":"", { expires: 365 });
    ui.shownumbersChanged();
  },

  change_debuglogging: function () {
    var input = document.getElementById('debuglogging');
    cookies.set('debuglogging', input.checked?"true":"", { expires: 365 });
    ui.debugloggingChanged();
    Run.debuglogging = cookies.get('debuglogging');
  },

  tesla_signin: function () {
  //  var host = 'https://'+document.location.host;
    var host = 'http://'+document.location.hostname + ':8888';

    var signinRequest = new XMLHttpRequest();
    var password = document.getElementById('password').value;
    var email = document.getElementById('email').value;
    signinRequest.open('GET', host + '/airdragindicator/teslasignin.php?email='+ email + '&password='+ password, true);
    cookies.set('email', email, { expires: 7 });
    cookies.set('password', password, { expires: 7 });

    signinRequest.onreadystatechange = function () {
      if (signinRequest.readyState === 4) {
        console.log('Status:' + signinRequest.status);
        console.log('Headers:' + signinRequest.getAllResponseHeaders());
        console.log('Body:' + signinRequest.responseText);
        var jsonString = signinRequest.response.substring(13);
        jsonString = jsonString.substring(0, jsonString.length-2);
        var response = JSON.parse(jsonString);
        if(response.access_token) {
          location.tesla_access_token = response.access_token;
          var vehiclesRequest = new XMLHttpRequest();
          vehiclesRequest.open('GET', host + '/airdragindicator/teslavehicles.php?access_token='+ location.tesla_access_token, true);
          console.log('call: teslavehicles.php');
          vehiclesRequest.onreadystatechange = function () {
            if (vehiclesRequest.readyState === 4) {
              console.log('Status:' + vehiclesRequest.status);
              console.log('Headers:' + vehiclesRequest.getAllResponseHeaders());
              console.log('Body:' + vehiclesRequest.responseText);
              var jsonString = vehiclesRequest.response.substring(13);
              jsonString = jsonString.substring(0, jsonString.length-2);
              var response = JSON.parse(jsonString);
              location.tesla_vehicle_id = response.response[0].id;
              run();
            }
          };
          vehiclesRequest.send();
        }
      }
    };
    console.log('call: teslasignin.php');
    signinRequest.send();
  },

//  setup_from_url: function() {
//    var myRegexp = /owmkey\/([a-z0-9]+)/g;
//    var match = myRegexp.exec(window.location.hash);
//    if(match) {
//      document.getElementById('owmkey').value = match[1];
//      Run.change_owmkey();
//    }
//  },

  setup_from_cookie: function() {
    var css_title = cookies.get('style');
    if (css_title && css_title.length) {
      switch_style( css_title );
    }
    if(cookies.get('dragarea')) {
      var select = document.getElementById('dragarea');
      select.selectedIndex = cookies.get('dragarea');
      //TODO if list changes - cookie select wrong index
    }
//    ui.owmkeyChanged();
    ui.shownumbersChanged();
    ui.debugloggingChanged();
    Run.debuglogging = cookies.get('debuglogging');

  //  document.getElementById('password').value = cookies.get('password')?cookies.get('password'):'';
  //  document.getElementById('email').value = cookies.get('email')?cookies.get('email'):'';

  }
};