var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

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
