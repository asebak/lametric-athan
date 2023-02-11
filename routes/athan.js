const PrayTimes = require('../utils/praytimes');

var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next) {
    var PT = new PrayTimes('ISNA');
    accountId = req.query.accountid;
    console.log("account id is afterwards: " + accountId);
  res.send(JSON.stringify({
    frames: [
        {
            text: "Wallet",
            icon: "test",
            index: 0
        }
    ]
}, null, 3));


});

module.exports = router;
