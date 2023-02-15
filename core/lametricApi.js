const axios = require('axios');

var config = require('../models/config');

class CloudApi {
 
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
}

class DeviceApi {
 
    constructor(ip, apiKey) {
        this.baseUrl = `https://${ip}:4343/api/v2/device`;
        this.accessToken = Buffer.from(`dev:${apiKey}`).toString('base64');
    }

    async getNotifications() {
        var endpoint = `${this.baseUrl}/notifications`
        return await axios.get(endpoint, {
            headers: {
              'Authorization': `Basic ${this.accessToken}`
            }
        });
    }

    async createNotification(body) {
        var endpoint = `${this.baseUrl}/notifications`
        return await axios.post(endpoint, body, {
        headers: {
            'Authorization': `Basic ${this.accessToken}`
        }
        });
    }
}

module.exports = {CloudApi, DeviceApi}