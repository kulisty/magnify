/* ==========================================================
 *         Magnify - Browse source code as a graph
 *        https://github.com/kulisty/magnify.js
 * ==========================================================
 * Copyright (c) 2016 Robert Dabrowski (r.dabrowski@uw.edu.pl)
 *
 * Magnify is distributed under the MIT Licence
 * ========================================================== */

'use strict';

const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
// let mainWindow;
var mainWindow = null;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});
  //mainWindow = new BrowserWindow({width: 1000, height: 1000, frame: false, frame: true});
  //mainWindow.setAutoHideMenuBar(true);
  //mainWindow.setMenuBarVisibility(false);

  // Load the index.html of the app
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Maximize the window.
  //mainWindow.maximize();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Emitted when the window is closed.
  mainWindow.on('resize', function() {
    // Redraw the content
    // console.log('RESIZE!!!');
  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
