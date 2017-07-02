import fs from 'fs';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import fetch from 'isomorphic-fetch';
import { port, mongoHost, googleApiKey } from './config';

const app = express();
app.use(bodyParser.json());
app.use(cors());

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

  const updateWeather = async (resolve) => {
    const cities = await City.find({});
    let count = 0;

    cities.forEach(async ({ _id, name }) => {
      try {
        const weather = await fetch(`https://query.yahooapis.com/v1/public/yql?format=json&q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${name}")`, {
          'content-type': 'application/json'
        });

        const { condition, lat, long } = (await weather.json()).query.results.channel.item;
        // temps come in from the api in fahrenheit
        const celsius = Math.floor((condition.temp - 32) * 5 / 9);

        City.findOneAndUpdate(
          { _id },
          { temperature: celsius, weather: condition.text, lat, long },
          () => {});
      } catch (e) {
        // api doesnt always match up for all cities so it may have issues with some calls
      }

      if (++count === cities.length) {
        resolve();
        console.log('finished weather');
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
        // if some of the data from the weather call wasn't complete then it might cause the timezone call to fail since it uses the coordinated from it
      }
    });
  };

  // only check the timezones after the weather because we use the coordinated from the weather api to get the timezones
  updateWeather(updateTimezone);

  app.get('/cities', (req, res) => City
    .find()
    .sort('name')
    .then(cities => res.send(cities)));

  app.delete('/cities/:id', (req, res) => City
    .remove({ _id: req.params.id })
    .then(res.send()));

  app.patch('/cities/:id', (req, res) => City.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
      (error, city) => res.send(city)));

  app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
  });
});

