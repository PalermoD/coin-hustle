'use strict';

const Hapi = require('hapi');
require('dotenv').config();

var Crawler = require("crawler");
var _LIST='';
var _BinanceUrl= 'https://support.binance.com/hc/en-us/categories/115000056351-Announcements';

var CronJob = require('cron').CronJob;
var Zport = process.env.PORT || 80;



var server = new Hapi.Server(~~process.env.PORT || 3000, '0.0.0.0');

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);

    var client = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    function letsMakeSomeMoney() {
      var crawler = new Crawler({
        maxConnections : 10,
        callback : function (error, res, done) {
          if (res.statusCode !== 200){
            return sendSmsMessage('Crypto Alert: URL responding with ' + res.statusCode + ' status code.')
          }

          if (error) return sendSmsMessage('Crypto Alert: URL ERROR ' + error);

          var $ = res.$;
          var newList = $(".article-list-item").text();

          if (_LIST !== newList) {
            _LIST = newList
            return sendSmsMessage('Crypto Alert: $$$ new coin(s) listed on Binance \n' + _LIST)
          }

          console.log("Nothing changed ...")
          done();


        }
      });

      return crawler.queue(_BinanceUrl);
    }

    function sendSmsMessage(message) {
      const numbers = [
        process.env.CHRIS,
        process.env.DAVID,
        process.env.PALERMO,
        process.env.ZOUHAIR
      ];

      Promise.all(
        numbers.map((number) => {
          return client.messages.create({
            from: process.env.MESSAGE_SERVICE_ID,
            to: number,
            body: message,
          }).then((message) => console.log(message.sid));
        })
      );
    }

    return new CronJob('*/4 * * * *', function() {
      //console.log('You will see this message every 30 minute');
      return letsMakeSomeMoney();
    }, null, true, 'America/Los_Angeles');

    //return letsMakeSomeMoney();
});
