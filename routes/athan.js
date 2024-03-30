var ComputeTimes = require('../core/computetimes');
const {PrayerSlot, slots } = require('../models/prayerslot')
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var lat = req.query.lat;
    var long = req.query.long;

    var computePrayerTimes = new ComputeTimes(lat, long);
    var prayerSlots = computePrayerTimes.getSchedule();
    var list = []
    for(var i = 0; i < slots.length; i++) {
        list.push(new PrayerSlot(slots[i], prayerSlots[slots[i]].replace(/^0/, '')))
    }
    
    res.send(JSON.stringify({
        times: list
}, null, 3));


});


module.exports = router;
