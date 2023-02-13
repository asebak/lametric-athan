var ComputeTimes = require('../core/computetimes');
var geoip = require('geoip-lite');
var express = require('express');
var router = express.Router();
const PRAY_ICON = "i26556";

router.get('/', function(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
    var geo = geoip.lookup(ip);
    var lat = req.query.lat;
    var long = req.query.long;
    var timezone = req.query.timeZone
    if(geo) {
        if(!lat) {
            lat = geo.ll[0]
        }
        if(!long) {
            long = geo.ll[1]
        }
        if(!timezone) {
            timezone = geo.timezone
        }
    }
    
    var computePrayerTimes = new ComputeTimes(lat, long, timezone);
    var prayerSlot = computePrayerTimes.calculate();

    var currentSlot = prayerSlot.value;
    var nextSlot = prayerSlot.next.value;

    var frames = [];

    frames.push({
        text: `Currently: ${currentSlot.name}:`,
        index: 0
    })

    frames.push({
        text: `${nextSlot.name}: ${nextSlot.time}`,
        icon: PRAY_ICON,
        index: 1
    })
    

    res.send(JSON.stringify({
    frames: frames
}, null, 3));


});


module.exports = router;
