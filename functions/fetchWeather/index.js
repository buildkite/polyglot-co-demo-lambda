"use strict";

require('isomorphic-fetch');

const debug = require('debug')('lambda:fetchWeather');

exports.handle = (e, ctx, cb) => {
  debug('processing event: %j', e)

  const apiKey = process.env.FORECAST_API_KEY || cb("process.env.FORECAST_API_KEY missing");

  // Default to Melbourne, Australia
  const locations = e.locations || [{lat:"-37.8162789",lng:"144.9642459",name:"Melbourne"}];

  Promise.all(fetchNextDayForecasts(apiKey, locations))
    .then(function(forecasts) {
      cb(null, {
        "forecasts": forecasts,
        "build": buildNumber()
      });
    }, function(err) {
      cb(err);
    })
}

function checkStatus(response) {
  debug("Received %s %s response", response.status, response.statusText);
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function fetchNextDayForecasts(forecastIoApiKey, locations) {
  return locations.map((location) => {
    debug("Fetching forecast for %j", location);

    return fetch(forecastUrl(forecastIoApiKey, location.lat, location.lng), {timeout:4000})
      .then(checkStatus)
      .then((res) => res.json())
      .then((json) => {
        debug("Received forecast for %s is %j", location.name, json);

        const nextDayForecast = json.daily.data[1];

        debug("Next day forecast for %s is %j", location.name, nextDayForecast);

        return ({
          "name":    location.name,
          "lat":     location.lat,
          "lng":     location.lng,
          "high":    nextDayForecast.temperatureMax,
          "summary": nextDayForecast.summary.replace(/\.$/,'')
        })
      })
  })
}

function forecastUrl(apiKey, lat, lng) {
  return `https://api.forecast.io/forecast/${apiKey}/${lat},${lng}?units=ca&exclude=currently,minutely,hourly,alerts,flags`
}

function buildNumber() {
  return process.env.BUILDKITE_BUILD_NUMBER || "42";
}