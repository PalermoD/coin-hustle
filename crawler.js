require('dotenv').config();

var Crawler = require("crawler");
var _LIST='';
var _BinanceUrl= 'https://support.binance.com/hc/en-us/categories/115000056351-Announcements';

var CronJob = require('cron').CronJob;


var client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// function letsMakeSomeMoney() {
//   var crawler = new Crawler({
//     maxConnections : 10,
//     callback : function (error, res, done) {
//       if (res.statusCode !== 200){
//         return sendSmsMessage('Crypto Alert: URL responding with ' + res.statusCode + ' status code.')
//       }
//
//       if (error) return sendSmsMessage('Crypto Alert: URL ERROR ' + error);
//
//       var $ = res.$;
//       var newList = $(".article-list-item").text();
//
//       if (_LIST !== newList) {
//         _LIST = newList
//         return sendSmsMessage('Crypto Alert: $$$ new coin(s) listed on Binance \n' + _LIST)
//       }
//
//       console.log("Nothing changed ...")
//       done();
//
//
//     }
//   });
//
//   return crawler.queue(_BinanceUrl);
// }
//
// function sendSmsMessage(message) {
//   const numbers = [
//     process.env.CHRIS,
//     process.env.DAVID,
//     process.env.PALERMO,
//     process.env.ZOUHAIR
//   ];
//
//   Promise.all(
//     numbers.map((number) => {
//       return client.messages.create({
//         from: process.env.MESSAGE_SERVICE_ID,
//         to: number,
//         body: message,
//       }).then((message) => console.log(message.sid));
//     })
//   );
// }
//
// return new CronJob('*/4 * * * *', function() {
//   //console.log('You will see this message every 30 minute');
//   return letsMakeSomeMoney();
// }, null, true, 'America/Los_Angeles');
//
// return letsMakeSomeMoney();
//
//
//
// 'use strict';
//
// const Hapi = require('hapi');
//
// const server = new Hapi.Server();
// server.connection({ port: 3000, host: 'localhost' });
//
// server.start((err) => {
//
//     if (err) {
//         throw err;
//     }
//
//     return new CronJob('*/4 * * * *', function() {
//       //console.log('You will see this message every 30 minute');
//       return letsMakeSomeMoney();
//     }, null, true, 'America/Los_Angeles');
//     console.log(`Server running at: ${server.info.uri}`);
//
// });

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

const cors = require('cors')

//DB setup


//App setup
app.use(morgan('combine'));
app.use(cors())
app.use(bodyParser.json({type: '*/*'}));


//Sever setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server litsening on ', port);

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
  //return sendSmsMessage('test message')
}, null, true, 'America/Los_Angeles');
