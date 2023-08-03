var ComputeTimes = require('../computetimes');
var geoip = require('geoip-lite');
var config = require('../../models/config');
var ScheduleJobHandler = require('../schedulejobhandler');
var LametricJob = require('./lametric');

class SalatTimesJob {
    constructor() {
        this.name = "Times";
    }

    async get(ip, devices) {
            var geo = geoip.lookup(ip);
            var lat, long, timezone;
            if(geo) {
                lat =  geo.ll[0];
                long = geo.ll[1];
                timezone = geo.timezone
            } else {
                lat = config.locationConfig.lat;
                long = config.locationConfig.long;
                timezone = config.locationConfig.timezone;
            }
            var computePrayerTimes = new ComputeTimes(lat, long, timezone);
            var times = computePrayerTimes.calculate();
            var nextPrayer = times.next.value;
            var lametricJob = new LametricJob(devices)
            var handler = ScheduleJobHandler.getInstance();
            var date = new Date();
            let tt = nextPrayer.time.split(':');
            date.setHours(tt[0], tt[1], 0);

            //todo notification based on something coming up in 10 minutes

            this.checkUpcomingPrayer(lametricJob, date, nextPrayer);

            var existingLametricJob = handler.getJob(lametricJob.name);
            if(!existingLametricJob) {
                console.log("adding new job for " + nextPrayer.name);
                handler.addJob(lametricJob.name, date, this.executeNotification(nextPrayer, lametricJob))
            } else {
                var sameDate = !(existingLametricJob.nextInvocation() - date);
                //only reschedule if the date changed, this will apply only once the day passes
                if(!sameDate) {
                    console.log("rescheduling new job for " + nextPrayer.name);
                    // existingLametricJob.reschedule(date)
                    handler.removeJob(lametricJob.name);
                    console.log("removed job");
                    console.log("adding new job for " + nextPrayer.name);
                    handler.addJob(lametricJob.name, date, this.executeNotification(nextPrayer, lametricJob))
                }
            }
    }

    executeNotification(nextPrayer, lametricJob) {
        return function () {
            console.log("executing notification:" + nextPrayer.name);
            var sound = {};
            if (nextPrayer.name === 'Fajr') {
                sound = {
                    "url": "https://media.sd.ma/assabile/adhan_3435370/ddb21f7363eb.mp3",
                    "fallback": {
                        "category": "notifications",
                        "id": "cat"
                    }
                };
            }
            else if (nextPrayer.name !== 'Sunrise') {
                sound = {
                    "url": "https://media.sd.ma/assabile/adhan_3435370/166d1f7c435a.mp3",
                    "fallback": {
                        "category": "notifications",
                        "id": "cat"
                    }
                };
            }
            lametricJob.createNotification(
                {
                    "priority": "critical",
                    "icon_type": "info",
                    "model": {
                        "cycles": 1,
                        "frames": [
                            {
                                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADmSURBVChTY3RxcWBkAIJzTawCf7gYihkYGSwY/jPsYfrLsNak/PcdFpDkmXYWjX9sDLuAzCdMvxiiTCp/PwCJgwATiPjHxjgPRLN8ZfACSV6qYOEA8UGAUfC0q+xfNoZHQGPnmpX8Tj3fyCrwm5shHSj3gP/W/7VM/xkY/kDUMnwBEYb1vz+A3cHAYKM+688fJqCRL4CcC0BBf5jRbB8ZYjne/C8FscFuYPzDkASkBH6IMq4728oqYdD0+4tex58fIDlmJSUFRuk9/148d2Re+p+JQes/K0PeUzdmpaem/55JH2Z4CwDOeE61MMSZbgAAAABJRU5ErkJggg==",
                                "text": nextPrayer.name
                            }
                        ],
                        "sound": sound
                    }
                }
            );
        };
    }

    checkUpcomingPrayer(lametricJob, date, nextPrayer) {
            var diff =(date.getTime() - new Date().getTime()) / 1000;
            diff /= 60;
            var timeDiff =  Math.abs(Math.round(diff));
            if(timeDiff < 60) {
                console.log("executing warning for: " + nextPrayer.name)
                lametricJob.createNotification(
                    {
                        "priority": "critical",
                        "icon_type": "info",
                        "model": {
                            "cycles": 3,
                            "frames": [
                               {
                                "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADmSURBVChTY3RxcWBkAIJzTawCf7gYihkYGSwY/jPsYfrLsNak/PcdFpDkmXYWjX9sDLuAzCdMvxiiTCp/PwCJgwATiPjHxjgPRLN8ZfACSV6qYOEA8UGAUfC0q+xfNoZHQGPnmpX8Tj3fyCrwm5shHSj3gP/W/7VM/xkY/kDUMnwBEYb1vz+A3cHAYKM+688fJqCRL4CcC0BBf5jRbB8ZYjne/C8FscFuYPzDkASkBH6IMq4728oqYdD0+4tex58fIDlmJSUFRuk9/148d2Re+p+JQes/K0PeUzdmpaem/55JH2Z4CwDOeE61MMSZbgAAAABJRU5ErkJggg==",
                                "text": nextPrayer.name + " in " + timeDiff + " minutes."
                               }
                            ]
                        }
                    }
                );
            }
    }

    
}


module.exports = SalatTimesJob
