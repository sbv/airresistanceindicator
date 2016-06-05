'use strict';

function Weather() {
  this.testWeatherIndex = 0;

  this.testWeather = [
    {wind: {deg: 360, speed: 10}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 360, speed: 10}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 360, speed: 10}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 360, speed: 10}, dt: new Date().getTime() / 1000 - 6000},
  ];

  this.testWeather1 = [
    {wind: {deg: 360, speed: 1}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 350, speed: 1.5}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 340, speed: 2}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 330, speed: 2.5}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 320, speed: 3}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 310, speed: 3.5}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 300, speed: 4}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 290, speed: 4.5}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 280, speed: 5}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 270, speed: 5.5}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 260, speed: 6}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 250, speed: 6.5}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 240, speed: 7}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 230, speed: 7.5}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 220, speed: 8}, dt: new Date().getTime() / 1000 - 6000},
    {wind: {deg: 210, speed: 8.5}, dt: new Date().getTime() / 1000 - 6000}
  ];
}

Weather.prototype.get = function (position, callback) {
  callback(this.testWeather[this.testWeatherIndex]);
  this.testWeatherIndex++;
  if (this.testWeatherIndex > this.testWeather.length - 1) this.testWeatherIndex = 0;
};

module.exports = Weather;
