const axios = require('axios');

var config = require('../models/config');

class LaMetricApi {
 
    constructor(accessToken) {
        this.baseUrl = config.oauthConfig.auth.authorizeHost;
        this.accessToken = accessToken;
    }

    async getDevices() {
        var endpoint = `${this.baseUrl}/api/v2/users/me/devices`
        return await axios.get(endpoint, {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
        });
    }

    async getNotifications() {
        var endpoint = `${this.baseUrl}/api/v2/device/notifications`
        return await axios.get(endpoint, {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
        });
    }

    async createNotification() {
        var endpoint = `${this.baseUrl}/api/v2/device/notifications`
        const body = {};
        return await axios.post(endpoint, body, {
        headers: {
            'Authorization': `Bearer ${this.accessToken}`
        }
        });
    }
}

module.exports = LaMetricApi