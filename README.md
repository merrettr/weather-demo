### Running ###
- Edit `server/config.js` to set the host for an existing Mongo DB instance
- Run `yarn install` or `npm install` then `yarn start` or `npm start`

### Notes ###
- The Google Maps Time Zone API has a rate limit of 2,500 requests per day and 50 per second, so going over that limit will cause any further calls to that API to fail.
- If the UI doesn't get in valid timezone data it will just make them all be NZ time for the sake of showing the time functionality