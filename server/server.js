import fs from 'fs';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import fetch from 'isomorphic-fetch';
import { mongoHost, googleApiKey } from './config';

const app = express();
app.use(bodyParser.json());

mongoose.connect(mongoHost, { useMongoClient: true });
mongoose.Promise = Promise;

mongoose.connection.once('open', () => {
  const City = mongoose.model('City', mongoose.Schema({
    name: String,
    country: String,
    temperature: String,
    weather: String,
    timezone: String,
    dstOffset: Number,
    rawOffset: Number,
    lat: String,
    long: String,
  }));

  fs.readFile('server/country-list.csv', 'utf8', (error, data) => {
    data
      .split('\n')
      .slice(1)
      .map(line => line.replace(/"/g, '').split(','))
      .forEach(([ country, capital ]) => City.findOneAndUpdate(
        { name: capital },
        { name: capital, country },
        { upsert: true },
        () => {}))
  });

  const updateWeather = async () => {
    const cities = await City.find({});

    cities.forEach(async ({ _id, name }) => {
      try {
        const weather = await fetch(`https://query.yahooapis.com/v1/public/yql?format=json&q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${name}")`, {
          'content-type': 'application/json'
        });

        const { condition, lat, long } = (await weather.json()).query.results.channel.item;
        City.findOneAndUpdate(
          { _id },
          { temperature: condition.temp, weather: condition.text, lat, long },
          () => {});
      } catch (e) {
        console.error('error checking weather api', e);
      }
    })
  };

  const updateTimezone = async () => {
    const cities = await City.find({});
    const currentTs = new Date().getTime() / 1000;

    cities.forEach(async ({ _id, long, lat }) => {
      try {
        const timezone = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${long}&timestamp=${currentTs}&key=${googleApiKey}`);

        const { dstOffset, rawOffset, timeZoneName } = await timezone.json();
        City.findOneAndUpdate(
          { _id },
          { dstOffset, rawOffset, timezone: timeZoneName },
          () => {});
      } catch (e) {
        console.error('error checking time api', e);
      }
    });
  };

  /*
  updateWeather();
  updateTimezone();
  */

  app.get('/cities', (req, res) => City
      .find()
      .then(cities => res.send(cities)));

  app.delete('/cities/:id', (req, res) => City
    .remove({ _id: req.params.id })
    .then(res.send()));

  app.put('/cities/:id', (req, res) => City.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
      (error, city) => res.send(city)));

  app.listen(8080, () => {
    console.log('App listening on port 8080!');
  });
});

