var express = require('express');
var router = express.Router();
var JPush = require("../node_modules/jpush-sdk/lib/JPush/JPush.js");
var client = JPush.buildClient('5df2da0b9842sfds50c4c4sff65c85983', 'ab154afc579faefsfgf4e0c6c3c4');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  client.push().setPlatform(JPush.ALL)
    .setAudience(JPush.ALL)
    .setNotification('Hi, JPush', JPush.ios('ios alert', 'happy.caf', 5))
    .send(function(err, res) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
        }
    });

});

module.exports = router;
