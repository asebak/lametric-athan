var PrayTimes = require('../utils/praytimes');
const {CircularLinkedList, PrayerSlot, slots } = require('../models/prayerslot')
const { find } = require('geo-tz')


class ComputeTimes {

    constructor(lat,long) {
        this.lat = lat;
        this.long = long;
        this.timezone = find(lat, long)[0];
        this.currentDate = new Date( new Date().toLocaleString("en-US", { timeZone: this.timezone }));
    }
    

    calculate() {
        const schedule = this.getSchedule();
        var list = new CircularLinkedList();
        for(var i = 0; i < slots.length; i++) {
            list.append(new PrayerSlot(slots[i], schedule[slots[i]].replace(/^0/, '')))
        }

        var currentTime = this.currentDate.getHours() + ':' + this.appendZero(this.currentDate.getMinutes());
        return list.traverse(currentTime);
    }

    getSchedule() {
        var prayTimes = new PrayTimes('ISNA');
        return prayTimes.getTimes(this.currentDate, [this.lat, this.long, 0], this.getOffsetHoursFromTz(this.timezone), 0, '24h')
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