#!/usr/bin/env node

var fs = require('fs'); // file i/o
var dnode = require('dnode'); // asynchronous bidirectional remote method invocation
var argv = require('minimist')(process.argv.slice(2)); // parse argument options
var electron = require('electron-prebuilt') // electron prebuilt binaries
var proc = require('child_process') // ability to spawn child processes
var net = require('net'); // creating servers and clients (called streams)

// start app as a child process
var child = proc.spawn(electron, [__dirname+'/../src/index.js'], {
  stdio: 'inherit'
});
