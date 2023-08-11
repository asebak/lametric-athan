var express = require('express');
var router = express.Router();
var config = require('../models/config');
var LaMetricApi = require('../core/lametricApi')
var ScheduleJobHandler = require('../core/schedulejobhandler');
var SalatTimesJob = require('../core/jobs/salattimes');
var SurahJob = require('../core/jobs/surah');

const { AuthorizationCode } = require('simple-oauth2');
  const scope = ['basic', 'devices_read'];
  const redirectUri = config.redirectUrl;

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
          surahJob = new SurahJob();
          salatTimesJob = new SalatTimesJob();
          handler.addJob(salatTimesJob.name, '*/10 * * * *', function(){
            console.log("running salat time checker job...")
            try {
              salatTimesJob.get(ip, devices);
            } catch (error) {
              console.warn("error occured running salat job:" + JSON.stringify(error));
            }
          });
          handler.addJob(surahJob.name, '0 9 * * 5', function(){
            console.log("running surah al khaf job...")
            try {
              surahJob.play("Al-Kahf", "018", devices);
            } catch (error) {
              console.warn("error occured surah al khaf job:" + JSON.stringify(error));
            }
          });
          console.log("authenticated succesfully, jobs configured.");
          res.status(result.status).send();
        } else {
          res.status(400).send();
        }
      } catch (error) {
        console.log('Access Token Error', error.message);
        res.status(400).send();
      }
});


module.exports = router;
