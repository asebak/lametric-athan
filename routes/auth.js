var express = require('express');
var router = express.Router();
var config = require('../models/config');
var LaMetricApi = require('../core/lametricApi')
const { AuthorizationCode } = require('simple-oauth2');
  const scope = ['basic', 'devices_read'];
  const redirectUri = 'http://localhost:3000/auth';

  const client = new AuthorizationCode(config.oauthConfig);


router.get('/authorize', function(req, res, next) {

    const authorizationUri = client.authorizeURL({
        redirect_uri: redirectUri,
        scope: scope,
        state: 'STATE'
      });

      res.redirect(authorizationUri);
});

router.get('/', async function(req, res, next) {
    const tokenParams = {
        code: req.query.code,
        redirect_uri: redirectUri,
        scope: scope,
      };
    
      try {
        const accessToken = await client.getToken(tokenParams, {json: true});
        ///var api = new LaMetricApi(accessToken.token.access_token);
        //api.getDevices();
        res.send(accessToken.token, null, 3);
      } catch (error) {
        console.log('Access Token Error', error.message);
      }

});


module.exports = router;
