// Control application life
var app = require('app');

// Create native browser window
var browserWindow = require('browser-window');

// Handles asynchronous and synchronous messages
// sent from a renderer process (web page)
var ipc = require('ipc');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new browserWindow({width: 800, height: 600});
  // and load the index.html of the app.
  // mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.loadUrl(__dirname + '/index.html');
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});
