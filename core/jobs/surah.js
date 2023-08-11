var LametricJob = require('./lametric');

class SurahJob {
    constructor() {
        this.name = "Surah";
    }

    async play(surahName, surahNum, devices) {
        var lametricJob = new LametricJob(devices)

        lametricJob.createNotification(
            {
                "priority": "critical",
                "icon_type": "info",
                "model": {
                    "cycles": 1,
                    "frames": [
                        {
                            "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADmSURBVChTY3RxcWBkAIJzTawCf7gYihkYGSwY/jPsYfrLsNak/PcdFpDkmXYWjX9sDLuAzCdMvxiiTCp/PwCJgwATiPjHxjgPRLN8ZfACSV6qYOEA8UGAUfC0q+xfNoZHQGPnmpX8Tj3fyCrwm5shHSj3gP/W/7VM/xkY/kDUMnwBEYb1vz+A3cHAYKM+688fJqCRL4CcC0BBf5jRbB8ZYjne/C8FscFuYPzDkASkBH6IMq4728oqYdD0+4tex58fIDlmJSUFRuk9/148d2Re+p+JQes/K0PeUzdmpaem/55JH2Z4CwDOeE61MMSZbgAAAABJRU5ErkJggg==",
                            "text": 'Playing Surah ' + surahName
                        }
                    ],
                    "sound": {
                        "url": "https://server8.mp3quran.net/afs/" + surahNum +".mp3",
                        "fallback": {
                            "category": "notifications",
                            "id": "cat"
                        }
                    }
                }
            }
        );
    }


}



module.exports = SurahJob
