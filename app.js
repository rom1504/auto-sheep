'use strict';

var ngrok = require('ngrok');
var express = require('express');
var mc = require('dazed-sheep');
var dns = require('dns');
var prettierBytes = require('prettier-bytes');
var usage = require('usage');

let url = null;
let connection = null;
let listening = false;

var server = mc.createMCServer({
  port: 25565,
  name: "A Minecraft Server",
  motd: "Welcome to my Minecraft Server!",
});

server.on('listening', function() {
  listening = true;
});


// TODO: web preformance statistics
// var pid = server.pid;

// usage.lookup(pid, function(err, result) {
//   console.log(result);
// });

ngrok.authtoken(process.env.NGROK_API_TOKEN, function(err, authtoken) {
  if(listening == true) {
    ngrok.connect({ authoken: authtoken, proto: 'tcp', addr: 25565 }, function (err, connection_address) {
      if(err) 
        throw JSON.stringify(err);

      url = connection_address;
      console.log(url);
      dns.lookup(url.split('').splice(6, url.length).join('').split(':')[0], function(err, data) {
        if(err) throw err;
        console.log(data + ':' + url.split(':')[2]);
        connection = data + ':' + url.split(':')[2];
      });
    });
  }
});

var app = express();

app.get('/', function (req, res) {
  if(connection == null) {
    res.send('server not ready yet, try again in a minute');
  } else {
    res.send(connection);
  }
});

app.listen(process.env.PORT || 5000, function () {
  console.log('Web app listening on port ' + process.env.PORT || 5000);
});