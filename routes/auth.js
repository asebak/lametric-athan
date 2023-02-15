var express = require('express');
var router = express.Router();
var config = require('../models/config');
var LaMetricApi = require('../core/lametricApi')
var ScheduleJobHandler = require('../core/schedulejobhandler');
var SalatTimesJob = require('../core/jobs/salattimes');

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
      var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      try {
        const accessToken = await client.getToken(tokenParams, {json: true});
        var api = new LaMetricApi.CloudApi(accessToken.token.access_token);
        var result = await api.getDevices();
        if(result.status === 200) {
          var devices = result.data;
          var handler = ScheduleJobHandler.getInstance();
          salatTimesJob = new SalatTimesJob();
          //probably run once an hour or something
          handler.addJob(salatTimesJob.name, '*/15 * * * *', function(){
            salatTimesJob.get(ip, devices);
          });
          res.status(result.status).send(JSON.stringify("message: Athan scheduled"));
        } else {
          res.status(400).send();
        }
      } catch (error) {
        console.log('Access Token Error', error.message);
        res.status(400).send();
      }
});


module.exports = router;
