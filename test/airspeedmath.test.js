var am = require('../assets/scripts/airspeedmath');
var assert = require('assert');

describe('Test Distance', function () {

  beforeEach(function () {
    am.reset();
  });

  it('distance 0 if not 2 positions', function () {
    assert.equal(0, am.getDistance());
    am.setPosition({coords: {latitude: 56.000000, longitude: 10.000000}, timestamp: 1439575379468});
    assert.equal(0, am.getDistance());
  });

  it('check all combis of distance', function () {
    var lngs = [-1, -0.000090, -0.000045, 0, 1];
    var lats = [-1, -0.000090, -0.000045, 0, 1];
    lngs.forEach(function(lng) {
      lats.forEach(function(lat) {
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng+0.000090}, timestamp: 1});
        assert.equal(10, Math.round(am.getDistance()));

        am.setPosition({coords: {latitude: lat, longitude: lng+0.000090}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        assert.equal(10, Math.round(am.getDistance()));

        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng}, timestamp: 1});
        assert.equal(10, Math.round(am.getDistance()));

        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        assert.equal(10, Math.round(am.getDistance()));

        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1});
        assert.equal(14, Math.round(am.getDistance()));

        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        assert.equal(14, Math.round(am.getDistance()));
      });
    });
  });
});

describe('Test Bearing', function () {

  beforeEach(function () {
    am.reset();
  });

  it('no bearing if not 2 positions', function () {
    assert.equal(0, am.getBearing());
    am.setPosition({coords: {latitude: 56.000000, longitude: 10.000000}, timestamp: 1439575379468});
    assert.equal(0, am.getBearing());
  });

  it('check all combis of bearing', function () {
    var lngs = [-0.000135, -0.000090, -0.000045, 0, 0.000045];
    var lats = [-0.000135, -0.000090, -0.000045, 0, 0.000045];
    lngs.forEach(function(lng) {
      lats.forEach(function(lat) {
        // east
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng+0.000090}, timestamp: 1});
        assert.equal(90, Math.round(am.getBearing()));

        // west
        am.setPosition({coords: {latitude: lat, longitude: lng+0.000090}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        assert.equal(270, Math.round(am.getBearing()));

        // north
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng}, timestamp: 1});
        assert.equal(0, Math.round(am.getBearing()));

        // south
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        assert.equal(180, Math.round(am.getBearing()));

        // northeast
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1});
//        console.log({coords: {latitude: lat, longitude: lng}, timestamp: 1});
//        console.log({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1});
//        console.log(am.getBearing());
        assert.equal(45, Math.round(am.getBearing()));

        // southwest
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        assert.equal(225, Math.round(am.getBearing()));
      });
    });
  });
});

describe('Test AngleBetweenWindAndBearing', function () {

  beforeEach(function () {
    am.reset();
  });

  it('if no weather data then zero', function () {
    assert.equal(0, am.getAngleBetweenWindAndBearing());
  });

  it('check all combis of wind from south west', function () {
    var weatherdata = {wind: {deg: 225, speed: 1}};
    var lngs = [-0.000135, -0.000090, -0.000045, 0, 0.000045];
    var lats = [-0.000135, -0.000090, -0.000045, 0, 0.000045];

    lngs.forEach(function(lng) {
      lats.forEach(function(lat) {
        // driving east
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng+0.000090}, timestamp: 1});
        am.setWeatherData(weatherdata);
//        console.log({coords: {latitude: lat, longitude: lng}, timestamp: 1});
//        console.log({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1});
//        console.log(am.getAngleBetweenWindAndBearing());
        assert.equal(135, Math.round(am.getAngleBetweenWindAndBearing()));

        // west
        am.setPosition({coords: {latitude: lat, longitude: lng+0.000090}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
//        console.log(am.getBearing());
//        console.log(am.getAngleBetweenWindAndBearing());
        assert.equal(315, Math.round(am.getAngleBetweenWindAndBearing()));

        // north
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng}, timestamp: 1});
        assert.equal(225, Math.round(am.getAngleBetweenWindAndBearing()));

        // south
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        assert.equal(45, Math.round(am.getAngleBetweenWindAndBearing()));

        // northeast
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1});
        assert.equal(180, Math.round(am.getAngleBetweenWindAndBearing()));

        // southwest
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
//        console.log(am.getAngleBetweenWindAndBearing());
        assert.equal(true, Math.round(am.getAngleBetweenWindAndBearing()) == 0 || Math.round(am.getAngleBetweenWindAndBearing()) == 360);
      });
    });
  });
});

describe('Test DirectWindSpeed', function () {

  beforeEach(function () {
    am.reset();
  });

  it('if no weather data then zero', function () {
    assert.equal(0, am.getAngleBetweenWindAndBearing());
  });

  it('check all combis of wind from south west', function () {
    var weatherdata = {wind: {deg: 225, speed: 10}};
    var lngs = [-0.000135, -0.000090, -0.000045, 0, 0.000045];
    var lats = [-0.000135, -0.000090, -0.000045, 0, 0.000045];

    lngs.forEach(function(lng) {
      lats.forEach(function(lat) {
        // driving east
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng+0.000090}, timestamp: 1});
        am.setWeatherData(weatherdata);
//        console.log({coords: {latitude: lat, longitude: lng}, timestamp: 1});
//        console.log({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1});
//        console.log(am.getAngleBetweenWindAndBearing());
        assert.equal(-7, Math.round(am.getDirectWindSpeed()));

        // west
        am.setPosition({coords: {latitude: lat, longitude: lng+0.000090}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
//        console.log(am.getBearing());
//        console.log(am.getAngleBetweenWindAndBearing());
        assert.equal(7, Math.round(am.getDirectWindSpeed()));

        // north
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng}, timestamp: 1});
        assert.equal(-7, Math.round(am.getDirectWindSpeed()));

        // south
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        assert.equal(7, Math.round(am.getDirectWindSpeed()));

        // northeast
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1});
        assert.equal(-10, Math.round(am.getDirectWindSpeed()));

        // southwest
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1});
//        console.log(am.getDirectWindSpeed());
        assert.equal(10, Math.round(am.getDirectWindSpeed()));
      });
    });
  });
});

describe('Test Groundspeed', function () {

  it('no speed if not 2 positions', function () {
    am.reset();
    assert.equal(0, am.getGroundSpeed());
    am.setPosition({coords: {latitude: 56.000000, longitude: 10.000000}, timestamp: 1439575380510});
    assert.equal(0, am.getGroundSpeed());
  });

  //TODO test two pos same timestamp
  //TODO test with +2 positions

  it('check weighted speed', function () {
    var lngs = [-0.000135, -0.000090, -0.000045, 0, 0.000045];
    var lats = [-0.000135, -0.000090, -0.000045, 0, 0.000045];
    am.reset();
    var timestamp = 1439575380510;
    am.setPosition({coords: {latitude: lats[0], longitude: lngs[0]}, timestamp: timestamp});
    am.setPosition({coords: {latitude: lats[0], longitude: lngs[0]+0.000090}, timestamp: timestamp + 1000});
    assert.equal(10, Math.round(am.getCalculatedGroundSpeed()));
    am.setPosition({coords: {latitude: lats[0], longitude: lngs[0]+0.000180}, timestamp: timestamp + 2000});
    assert.equal(10, Math.round(am.getCalculatedGroundSpeed()));
    am.setPosition({coords: {latitude: lats[0], longitude: lngs[0]+0.000270}, timestamp: timestamp + 3000});
    assert.equal(10, Math.round(am.getCalculatedGroundSpeed()));
    am.setPosition({coords: {latitude: lats[0], longitude: lngs[0]+0.000360}, timestamp: timestamp + 4000});
    assert.equal(10, Math.round(am.getCalculatedGroundSpeed()));
//        console.log({coords: {latitude: lat, longitude: lng}, timestamp: 1439575380510});
//        console.log({coords: {latitude: lat, longitude: lng+0.000090}, timestamp: 1439575381510});
//        console.log(am.getGroundSpeed());

  });

  it('check all combis of calculatedGroundSpeed', function () {
    var lngs = [-0.000135, -0.000090, -0.000045, 0, 0.000045];
    var lats = [-0.000135, -0.000090, -0.000045, 0, 0.000045];
    lngs.forEach(function(lng) {
      lats.forEach(function(lat) {
        am.reset();
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1439575380510});
        am.setPosition({coords: {latitude: lat, longitude: lng+0.000090}, timestamp: 1439575381510});
//        console.log({coords: {latitude: lat, longitude: lng}, timestamp: 1439575380510});
//        console.log({coords: {latitude: lat, longitude: lng+0.000090}, timestamp: 1439575381510});
//        console.log(am.getGroundSpeed());
        assert.equal(10, Math.round(am.getCalculatedGroundSpeed()));

        am.reset();
        am.setPosition({coords: {latitude: lat, longitude: lng+0.000090}, timestamp: 1439575380510});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1439575381510});
        assert.equal(10, Math.round(am.getCalculatedGroundSpeed()));

        am.reset();
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1439575380510});
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng}, timestamp: 1439575381510});
        assert.equal(10, Math.round(am.getCalculatedGroundSpeed()));

        am.reset();
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng}, timestamp: 1439575380510});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1439575381510});
        assert.equal(10, Math.round(am.getCalculatedGroundSpeed()));

        am.reset();
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1439575380510});
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1439575381510});
        assert.equal(14, Math.round(am.getCalculatedGroundSpeed()));

        am.reset();
        am.setPosition({coords: {latitude: lat+0.000090, longitude: lng+0.000090}, timestamp: 1439575380510});
        am.setPosition({coords: {latitude: lat, longitude: lng}, timestamp: 1439575381510});
        assert.equal(14, Math.round(am.getCalculatedGroundSpeed()));
      });
    });
  });
});


describe('AirspeedMath', function () {

  var testWeather = [
    {wind: {deg: 90, speed: 4.6}}
  ];

  var testPositions = [
    {coords: {latitude: 56.05388978501414, longitude: 9.943623142326198}, timestamp: 1439575379468},
  {coords: {latitude: 56.053614565223505, longitude: 9.94251019322308}, timestamp:   1439575381510}];

  beforeEach(function () {
    am.reset();
    am.setDragArea(0.575999);
  });

  it('testPosition1', function () {
    am.setWeatherData(testWeather[0]);
    am.setPosition(testPositions[0]);
    assert.equal(false, am.isSamePosition(testPositions[1]));
    assert.equal(false, am.isNearlySameTimestamp(testPositions[1]));
    am.setPosition(testPositions[1]);

    assert.equal(75.57922239300487, am.getDistance());
    assert.equal(254.31940333939963, am.getBearing());  // sydøst
    assert.equal(37.01235180852345, am.getGroundSpeed()); // 133 km/t
    assert.equal(195.68059666060037, am.getAngleBetweenWindAndBearing());
    assert.equal(-4.428803320974058, am.getDirectWindSpeed());
    assert.equal(32.58354848754939, am.getAirSpeed());
    assert.equal(11955.510274973853, am.getPowerOnAirInclWindDrag());
    assert.equal(13580.520627359996, am.getPowerOnAirDrag()); // 17523.184131225247
    assert.equal(-1625.0103523861449, am.getPowerOnWindDrag()); // -5567.673856251395
    assert.equal(-11.965744149103664, am.getWindImpactOnConsumption());
    assert.equal(36, am.mps2kmph(10));
  });

    it('testUpdateTripEnergy', function () {
    am.setWeatherData(testWeather[0]);
    am.setPosition(testPositions[0]);
    assert.equal(0, am.tripWindEnergy);
    assert.equal(0, am.tripAirEnergy); 
    console.log('bøf bøf bøf');
    am.setPosition(testPositions[1]);
    assert.equal(-0.9217419832145854, am.tripWindEnergy);
    assert.equal(7.7031730891858645, am.tripAirEnergy); 
  });

});
