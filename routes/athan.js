var PrayTimes = require('../utils/praytimes');
var geoip = require('geoip-lite');
var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next) {
    var prayTimes = new PrayTimes('ISNA');
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    var geo = geoip.lookup(ip);
    var lat = req.query.lat;
    var long = req.query.long;
    if(geo) {
        if(!lat) {
            lat = geo.ll[0]
        }
        if(!long) {
            lat = geo.ll[1]
        }
    }
    console.log("lat:" + lat);
    console.log("long:" + long);
    const schedule = prayTimes.getTimes(new Date(), [lat, long, 0], getOffsetHoursFromTimeZone(geo.timezone), 0, '24h')
    console.log(JSON.stringify(schedule));
  res.send(JSON.stringify({
    frames: [
        {
            text: "Wallet",
            icon: "test",
            index: 0
        }
    ]
}, null, 3));


});

const getOffsetHoursFromTimeZone = (tz) => {
    let date = new Date();
    let utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    let tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
    return (tzDate.getTime() - utcDate.getTime()) / 3600000;
}

module.exports = router;
