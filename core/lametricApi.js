var config = require('../models/config');

class LaMetricApi {
 
    constructor() {
        this.baseUrl = config.oauthConfig.auth.authorizeHost
    }

    getDevices() {
        var endpoint = `${this.baseUrl}/api/v2/users/me/devices`
    }

    getNotifications() {
        var endpoint = `${this.baseUrl}/api/v2/device/notifications`
    }

    createNotification() {
        var endpoint = `${this.baseUrl}/api/v2/device/notifications`
    }
}

module.exports = LaMetricApi