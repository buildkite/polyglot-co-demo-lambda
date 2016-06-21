"use strict";

require('isomorphic-fetch');

exports.handle = (e, ctx, cb) => {
  console.log('processing event: %j', e)

  const apiKey = process.env.FORECAST_API_KEY || cb("process.env.FORECAST_API_KEY missing");

  // Default to Melbourne, Australia
  const locations = e.locations || [["-37.8162789","144.9642459"]];

  Promise.all(fetchNextDayForecasts(apiKey, locations))
    .then(function(forecasts) {
      cb(null, forecastsResponse(forecasts));
    }, function(err) {
      cb(err);
    })
}

function fetchNextDayForecasts(forecastIoApiKey, locations) {
  return locations.map((location) => {
    return fetch(forecastUrl(forecastIoApiKey, location[0], location[1]), {timeout:4000})
      .then((res) =>  { return res.json() })
      .then((json) => { return json.daily.data[1] })
  })
}

function forecastsResponse(forecasts) {
  console.log("Formatting response", forecasts);
  return {
    "forecasts": forecasts.map(function(forecast) {
      return {
        "high": forecast.temperatureMax,
        "summary": forecast.summary
      }
    })
  }
}

function forecastUrl(apiKey, lat, lng) {
  return `https://api.forecast.io/forecast/${apiKey}/${lat},${lng}?units=ca&exclude=currently,minutely,hourly,alerts,flags`
}
