'use strict';

var Cookies = require('js-cookie');

var UI = module.exports = {

  setUID: function (uid) {
    document.getElementById('uid').innerHTML = uid;
  },

  setLocationAlertSeconds: function (location_alerter_counter) {
//    document.getElementById('secondsSinceLastLocation').innerHTML = location_alerter_counter;
//    document.getElementById('locationAlert').style.display = 'inline-block';
  },

  hideLocationAlert: function () {
//    document.getElementById('locationAlert').style.display = 'none';
  },

  shownumbersChanged: function () {
    $('input[name="shownumbers"]').bootstrapSwitch('state', !!Cookies.get('shownumbers'), true);

    document.getElementById('airresistance').style.display = Cookies.get('shownumbers') ? 'block' : 'none';
    document.getElementById('speed').style.display = Cookies.get('shownumbers') ? 'block' : 'none';
    document.getElementById('windangleoncar').style.display = Cookies.get('shownumbers') ? 'block' : 'none';
    document.getElementById('windpart').style.display = Cookies.get('shownumbers') ? 'block' : 'none';
  },

//  owmkeyChanged: function () {
//    document.getElementById('owmkey').value = Cookies.get('owmkey') ? Cookies.get('owmkey') : '';
//
//    document.getElementById('windangleoncar').style.display = Cookies.get('owmkey') ? 'block' : 'none';
//    document.getElementById('windpart').style.display = Cookies.get('owmkey') ? 'block' : 'none';
//  },

  debugloggingChanged: function () {
    $('input[name="debuglogging"]').bootstrapSwitch('state', !!Cookies.get('debuglogging'), true);
  },

  poweronairdragUIValue: 0,
  poweronwinddragUIValue: 0,
  groundspeedUIValue: 0,
  windangleUIValue: 0,
  averageAirEnergyPerKilometerUIValue: 0,
  averageWindEnergyPerKilometerUIValue: 0,

  updateArrow: function (am) {

    var windangleoncar = am.getAngleBetweenWindAndBearing();
        if(windangleoncar === null) {
          document.getElementById("wind-arrowhead").style.display = 'none';
        } else {
          document.getElementById("wind-arrowhead").style.display = 'block';
          document.getElementById("wind-arrowhead").setAttribute("transform", "rotate("+Math.round(-90+UI.windangleUIValue)+", 42, 53)");
        }    
  },

  updateBars: function (am) {
    var poweronairdrag = am.getPowerOnAirInclWindDrag();
    if(poweronairdrag === null) {
      document.airbar.animate(0);
    } else {
      document.airbar.animate((1.0/40000.0)*poweronairdrag);
    }

    var poweronwinddrag = am.getPowerOnWindDrag();
    if(poweronwinddrag === null || poweronwinddrag == 0) {
      document.positivewindbar.animate(0);
      document.negativewindbar.animate(0);
    } else {
      if(poweronwinddrag > 0) { // the wind is negative - using more power
        document.positivewindbar.animate(0);
        document.negativewindbar.animate((1.0/40000.0)*poweronwinddrag);
      } else {
        document.positivewindbar.animate((1.0/40000.0)*poweronwinddrag);
        document.negativewindbar.animate(0);
      }
    }
  },

  updateNumbers: function (am) {
    var elm = document.getElementById('dragarea');
    var selectedDragarea = parseFloat(elm.value);
    if(isNaN(selectedDragarea)) {
      selectedDragarea = am.dragareaOptions[0].value;
    }
//    console.log('selectedDragarea: '+selectedDragarea);
    //TODO only set when config closes
    am.setDragArea(selectedDragarea);


    var averageAirEnergyPerKilometer = am.getAverageAirEnergyPerKilometer();
    if(averageAirEnergyPerKilometer === null) {
      document.getElementById("averageairenergyperkilometer").textContent = '-';
    } else {
      if(UI.averageAirEnergyPerKilometerUIValue < averageAirEnergyPerKilometer) UI.averageAirEnergyPerKilometerUIValue += (averageAirEnergyPerKilometer - UI.averageAirEnergyPerKilometerUIValue) / 2.0;
      else if(UI.averageAirEnergyPerKilometerUIValue > averageAirEnergyPerKilometer) UI.averageAirEnergyPerKilometerUIValue -= (UI.averageAirEnergyPerKilometerUIValue - averageAirEnergyPerKilometer) / 2.0;
      document.getElementById("averageairenergyperkilometer").textContent = Math.round(UI.averageAirEnergyPerKilometerUIValue);
    }

    var averageWindEnergyPerKilometer = am.getAverageWindEnergyPerKilometer();
    if(averageWindEnergyPerKilometer === null) {
      document.getElementById("averagewindenergyperkilometer").textContent = '-';
    } else {
      if(UI.averageWindEnergyPerKilometerUIValue < averageWindEnergyPerKilometer) UI.averageWindEnergyPerKilometerUIValue += (averageWindEnergyPerKilometer - UI.averageWindEnergyPerKilometerUIValue) / 2.0;
      else if(UI.averageWindEnergyPerKilometerUIValue > averageWindEnergyPerKilometer) UI.averageWindEnergyPerKilometerUIValue -= (UI.averageWindEnergyPerKilometerUIValue - averageWindEnergyPerKilometer) / 2.0;
      document.getElementById("averagewindenergyperkilometer").textContent = Math.round(UI.averageWindEnergyPerKilometerUIValue);
    }

    if(Cookies.get('shownumbers')) {
      //animate

      var poweronairdrag = am.getPowerOnAirDrag();
      if(poweronairdrag === null) {
        document.getElementById("poweronwinddrag").innerText = '-';
      } else {
        if(UI.poweronairdragUIValue < poweronairdrag) UI.poweronairdragUIValue += (poweronairdrag - UI.poweronairdragUIValue) / 2.0;
        else if(UI.poweronairdragUIValue > poweronairdrag) UI.poweronairdragUIValue -= (UI.poweronairdragUIValue - poweronairdrag) / 2.0;
        if(Math.abs(UI.poweronairdragUIValue) > 1000) {
          document.getElementById("poweronairdrag").innerText = (UI.poweronairdragUIValue / 1000.0).toFixed(2);
          document.getElementById("poweronairdragunit").innerText = 'kW';
        } else {
          document.getElementById("poweronairdrag").innerText = Math.round(UI.poweronairdragUIValue);
          document.getElementById("poweronairdragunit").innerText = 'Watt';
        }
      }

//      if(Cookies.get('owmkey')) {
        var poweronwinddrag = am.getPowerOnWindDrag();
        if(poweronwinddrag === null) {
          document.getElementById("poweronwinddrag").innerText = '-';
        } else {
          if(UI.poweronwinddragUIValue < poweronwinddrag) UI.poweronwinddragUIValue += (poweronwinddrag - UI.poweronwinddragUIValue) / 2.0;
          else if(UI.poweronwinddragUIValue > poweronwinddrag) UI.poweronwinddragUIValue -= (UI.poweronwinddragUIValue - poweronwinddrag) / 2.0;
          if(Math.abs(UI.poweronwinddragUIValue) > 1000) {
            document.getElementById("poweronwinddrag").innerText = (UI.poweronwinddragUIValue / 1000.0).toFixed(2);
            document.getElementById("poweronwinddragunit").innerText = 'kW';
          } else {
            document.getElementById("poweronwinddrag").innerText = Math.round(UI.poweronwinddragUIValue);
            document.getElementById("poweronwinddragunit").innerText = 'Watt';
          }
        }

        var windangleoncar = am.getAngleBetweenWindAndBearing();
        if(windangleoncar === null) {
          document.getElementById("windangle").innerText = '-';
        } else {
          if(UI.windangleUIValue < windangleoncar) UI.windangleUIValue += (windangleoncar - UI.windangleUIValue) / 2.0;
          else if(UI.windangleUIValue > windangleoncar) UI.windangleUIValue -= (UI.windangleUIValue - windangleoncar) / 2.0;
          document.getElementById("windangle").innerText = Math.round(UI.windangleUIValue);
        }
//      }

      var groundspeed = am.mps2kmph(am.getGroundSpeed());
      if(groundspeed === null) {
        document.getElementById("velocity").innerText = '-';
      } else {
        if(UI.groundspeedUIValue < groundspeed) UI.groundspeedUIValue += (groundspeed - UI.groundspeedUIValue) / 2.0;
        else if(UI.groundspeedUIValue > groundspeed) UI.groundspeedUIValue -= (UI.groundspeedUIValue - groundspeed) / 2.0;
        document.getElementById("velocity").innerText = Math.round(UI.groundspeedUIValue);
      }
    }
  }
};
