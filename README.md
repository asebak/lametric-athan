# lametric-athan

# 1. Create a notification lametric app from here: https://developer.lametric.com/applications/create

# 2. Configure the settings for the redirect url put: http://localhost:3000/auth

# 3. Clone repo and inside the models folder create a new file config.js with the following values:
```js
const oauthConfig = {
    client: {
      id: '',
      secret: ''
    },
    auth: {
      tokenHost: 'https://developer.lametric.com',
      tokenPath: '/api/v2/oauth2/token',
      authorizeHost: 'https://developer.lametric.com',
      authorizePath: '/api/v2/oauth2/authorize/'
    }
  };

  const redirectUrl = "http://localhost:3000/auth";

  const locationConfig = {
    lat: ,
    long: ,
    timezone: "",
  }

module.exports = {oauthConfig, locationConfig, redirectUrl}  
```

Fill in the id, secret from your application that you just created on the lametric portal.
Fill in the lat, long, and timezone according to the pc you will be running this server on.  lat and long are doubles.

# 4. Run the app

```shell
npm install
npm start
```