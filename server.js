'use strict';

var express = require('express');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Socket
io.on('connection', require('./lib/socket')(io));

// Start server
server.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
