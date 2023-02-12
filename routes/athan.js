var PrayTimes = require('../utils/praytimes');
const {CircularLinkedList, PrayerSlot } = require('../models/prayerslot')
var geoip = require('geoip-lite');
var express = require('express');
var router = express.Router();
const PRAY_ICON = "i26556";
const slots = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

router.get('/', function(req, res, next) {
    var prayTimes = new PrayTimes('ISNA');
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
    //lat = 34.912;
    //long = -82.4666;
    //timezone = "America/New_York";

    //timezone = 'Europe/Helsinki'
    //lat = 60.1708
    //long = 24.9375
    var currentDate = new Date( new Date().toLocaleString("en-US", { timeZone: timezone }));
    var currentTime = currentDate.getHours() + ':' + fillInZeros(currentDate.getMinutes());
    const schedule = prayTimes.getTimes(currentDate, [lat, long, 0], getOffsetHoursFromTimeZone(timezone), 0, '24h')




    let prayerSlots = []
    var list = new CircularLinkedList();
    for(var i = 0; i < slots.length; i++) {
        //old way
       // if(i == slots.length - 1) {
           // prayerSlots.push(new PrayerSlot(slots[i], schedule[slots[i]].replace(/^0/, ''), schedule[slots[0]].replace(/^0/, ''), currentTime));
        //} else{
            //prayerSlots.push(new PrayerSlot(slots[i], schedule[slots[i]].replace(/^0/, ''), schedule[slots[i + 1]].replace(/^0/, ''), currentTime));
       // }
        //list.append(new PrayerSlot(slots[i], schedule[slots[i]].replace(/^0/, ''), schedule[slots[i + 1]].replace(/^0/, ''), currentTime))
        list.append(new PrayerSlot(slots[i], schedule[slots[i]].replace(/^0/, '')))
    }
        //var prayerSlot = prayerSlots.find(prayerSlot => prayerSlot.isCurrent())


    var prayerSlot = list.traverse(currentTime);
    var currentSlot = prayerSlot.value;
    var nextSlot = prayerSlot.next.value;

    var frames = [];

    frames.push({
        text: `${nextSlot.name}: ${nextSlot.time}`,
        icon: PRAY_ICON,
        index: 0
    })

    res.send(JSON.stringify({
    frames: frames
}, null, 3));


});

const fillInZeros = (n) => {
    if (n < 10) {
        n = '0' + n;
    }
    return n;
}

const getOffsetHoursFromTimeZone = (tz) => {
    let date = new Date();
    let utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    let tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
    return (tzDate.getTime() - utcDate.getTime()) / 3600000;
}

module.exports = router;
