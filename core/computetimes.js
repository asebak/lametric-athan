var PrayTimes = require('../utils/praytimes');
const {CircularLinkedList, PrayerSlot } = require('../models/prayerslot')

const slots = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

class ComputeTimes {

    constructor(lat,long,timezone) {
        this.lat = lat;
        this.long = long;
        this.timezone = timezone;
    }
    

    calculate() {
        var prayTimes = new PrayTimes('ISNA');
        var currentDate = new Date( new Date().toLocaleString("en-US", { timeZone: this.timezone }));
        var currentTime = currentDate.getHours() + ':' + this.appendZero(currentDate.getMinutes());
        const schedule = prayTimes.getTimes(currentDate, [this.lat, this.long, 0], this.getOffsetHoursFromTz(this.timezone), 0, '24h')
    
        var list = new CircularLinkedList();
        for(var i = 0; i < slots.length; i++) {
            list.append(new PrayerSlot(slots[i], schedule[slots[i]].replace(/^0/, '')))
        }

        return list.traverse(currentTime);
    }

    appendZero = (n) => {
        if (n < 10) {
            n = '0' + n;
        }
        return n;
    }
    
    getOffsetHoursFromTz = (tz) => {
        let date = new Date();
        let utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
        let tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
        return (tzDate.getTime() - utcDate.getTime()) / 3600000;
    }
}

module.exports = ComputeTimes