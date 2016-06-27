"use strict";

process.env.FORECAST_API_KEY = "test-forecast-io-key"
process.env.BUILDKITE_BUILD_NUMBER = "42"

const assert = require('assert');
const fetchMock = require('fetch-mock');
const fetchWeather = require('./index').handle;

function mockForecastIo(lat, lng, response) {
  fetchMock.mock(`https://api.forecast.io/forecast/test-forecast-io-key/${lat},${lng}?units=ca&exclude=currently,minutely,hourly,alerts,flags`, 'GET', response)
}

describe('fetchWeather', function() {
  afterEach(function() {
    fetchMock.restore();
  })

  it('returns Melbourne Weather by default', function(done) {
    mockForecastIo('-37.8162789','144.9642459', { daily: { data: [ {temperatureMax: 1.1, summary: "One"}, {temperatureMax: 1.2, summary: "Two."} ] } })

    fetchWeather({}, {}, function(err, json) {
      try {
        assert.equal(null, err);

        assert.deepEqual({
          "forecasts": [
            {
              "lat": "-37.8162789",
              "lng": "144.9642459",
              "name": "Melbourne",
              "high": 1.2,
              "summary": "Two"
            },
          ],
          "build": "42"
        }, json);

        done();
      } catch (x) {
        done(x);
      }
    })
  })

  it('returns no weather if locations is empty', function(done) {
    fetchWeather({locations: []}, {}, function(err, json) {
      try {
        assert.equal(null, err);

        assert.deepEqual({
          "forecasts": [],
          "build": "42"
        }, json);

        done();
      } catch (x) {
        done(x);
      }
    })
  })

  it('returns weather for multiple string lat/longs', function(done) {
    mockForecastIo('43.7711', '11.2486', { daily: { data: [ {temperatureMax: 1.1, summary: "Loc 1 Day 1."}, {temperatureMax: 1.2, summary: "Loc 1 Day 2."} ] } })
    mockForecastIo('52.5200', '13.4050', { daily: { data: [ {temperatureMax: 2.1, summary: "Loc 1 Day 2."}, {temperatureMax: 2.2, summary: "Loc 2 Day 2."} ] } })

    fetchWeather({
      locations: [
        { lat: '43.7711', lng: '11.2486', name: "Loc 1" },
        { lat: '52.5200', lng: '13.4050', name: "Loc 2" }
      ]
    }, {}, function(err, json) {
      try {
        assert.equal(null, err);

        assert.deepEqual({
          "forecasts": [
            {
              lat: '43.7711',
              lng: '11.2486',
              name: "Loc 1",
              high: 1.2,
              summary: "Loc 1 Day 2"
            },
            {
              lat: '52.5200',
              lng: '13.4050',
              name: "Loc 2",
              high: 2.2,
              summary: "Loc 2 Day 2"
            }
          ],
          "build": "42"
        }, json);

        done();
      } catch (x) {
        done(x);
      }
    })
  })

  it('handles API errors', function(done) {
    mockForecastIo('43.7711','11.2486', 400);

    fetchWeather({ locations: [{ lat: '43.7711', lng: '11.2486', name: "Loc 1." }] }, {}, function(err, json) {
      try {
        assert(err);

        done();
      } catch (x) {
        done(x);
      }
    });
  })
})
