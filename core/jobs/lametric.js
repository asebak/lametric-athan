var LaMetricApi = require('../lametricApi')

class LaMetricJob {

    constructor(devices) {
        this.name = "lametric"
        this.devices = devices;
        this.services = []
        for (var i = 0; i < devices.length; i++) {
            this.services.push(new LaMetricApi.DeviceApi(devices[i].ipv4_internal, devices[i].api_key));
        }
    }

    async createNotification(model) {
        this.services.forEach(async s => {
            try {
                var result = await s.createNotification(model);
            } catch(err) {
                console.warn("error in creating notification:" + JSON.stringify(err));
            }
        });
    }
    
}


module.exports = LaMetricJob