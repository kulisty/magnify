/* ==========================================================
 *         Magnify - Browse source code as a graph
 *        https://github.com/kulisty/magnify.js
 * ==========================================================
 * Copyright (c) 2016 Robert Dabrowski (r.dabrowski@uw.edu.pl)
 *
 * Magnify is distributed under the MIT Licence
 * ========================================================== */

const {remote} = require('electron');
const {Menu, MenuItem, dialog} = remote;

var path = require("path");
var fs = require('fs');
var d3 = require('d3');
var qr = require('qr-image');

// Viewport
// var width = window.innerWidth,
//     height = window.innerHeight;

// Container for application model
var file = { name:'', data: null, copy: null };
// Container for application view and its handling
var view = { svg: null, zoom: null, simu: null, obj: null };
// testing and debugging, to be eventually removed
var temp = null;

// New menu overloading the default one
var menu = function() {

  var template = [

    // Top level item: file
    {
      label: 'File',
      submenu: [

        { // File / Open
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: function(item, focusedWindow) {
            if (focusedWindow) {
              dialog.showOpenDialog(
                { filters:
                  [{ name: 'Source code', extensions: ['json','kml', 'xml'] } ]},
                  function (fileNames) {
                    if (fileNames === undefined) return;
                    file.name = fileNames[0];
                    file.data = JSON.parse(fs.readFileSync(file.name, 'utf8'));
                    file.copy = saveFix(file.data);
                    //d3.json(view.file, drawThePicture);
                    clearThePicture();
                    drawThePicture();
                }
              );
            }
          }
        }, // File / Open

        { // File / Save
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: function(item, focusedWindows) {
            file.copy = saveFix(file.data);
            fs.writeFile(
              //path.basename(view.file, '.json')+'_fix'+path.extname(view.file),
              file.name, JSON.stringify(file.copy, null, 2)
            );
          }
        }, // File / Save

        { // File / Close
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          click: function(item, focusedWindows) {
            file = { name:'', data: null, copy: null};
            clearThePicture();
          }
        } // File / Close

      ]
    }, // file

    // Top level item: view
    {
      label: 'View',
      submenu: [

        { // View / Freeze
          label: 'Freeze',
          accelerator: 'CmdOrCtrl+F',
          click: function(item, focusedWindow) {
            clickFreeze();
          }
        }, // View / Freeze

        { // View / Unfreeze
          label: 'Unfreeze',
          accelerator: 'CmdOrCtrl+U',
          click: function(item, focusedWindow) {
            clickUnfreeze();
          }
        }, // View / Unfreeze

        { // View / Reload
          label: 'Shake',
          accelerator: 'F5',
          click: function(item, focusedWindow) {
            clickReload();
            //window.reload();
          }
        }, // View / Reload

        { // View / Reload
          label: 'Toggle board',
          accelerator: 'F7',
          click: function(item, focusedWindow) {
            clickBoard();
            //window.reload();
          }
        }, // View / Toggle board

        { // View / Toggle full screen
          label: 'Toggle Full Screen',
          accelerator: (function() {
            if (process.platform == 'darwin')
              return 'Ctrl+Command+F';
            else
              return 'F11';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        }, // View / Toggle full screen

        { // View / Toggle developer tools
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (process.platform == 'darwin')
              return 'Alt+Command+I';
            else
              return 'Ctrl+Shift+I';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.toggleDevTools();
          }
        }, // View / Toggle developer tools

      ]
    }, // view

    // Top level item: window
    {
      label: 'Window',
      role: 'window',
      submenu: [
        { // Window / Minimize
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        { // Window / Close
          label: 'Close',
          accelerator: 'CmdOrCtrl+Q',
          role: 'close'
        },
      ]
    } // window

  ]; // template

  function initialize() {
    var menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }

  return { init: initialize }

}();

// Build the menu so it is visible.
menu.init();
