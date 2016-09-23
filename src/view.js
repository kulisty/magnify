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

//var jsdom = require("jsdom").jsdom;
//var $ = require('jquery'); //$('.tag').click(function(){return console.log('clicked');});

// Global handles for visual controls
var svg = null, // containter for nodes, links
    tip = null, // tool-tip
    con = null, // context buttons
    pan = null, // pane for context actions results
    str = null, // pane for structure selection
    b01 = null, // global buttons: zoom in
    b02 = null, // global buttons: zoom out
    b03 = null, // global buttons: zoom fit
    b04 = null, // global buttons: layers
    b05 = null, // global buttons: network
    // subgraph selection
    sub = null, // ie. one node
    // layer selection
    lay = 0, // ie. commits, files, functions
    lmx = 0, // number of layers in total
    // d3 shortcuts
    force = null,
    zoom  = null,
    drag  = null,
    color = null,
    links = null,
    nodes = null,
    // slider
    slider = null,
    handle = null,
    tpanel = null,
    tscale = null;

// Viewport
// var margin = {top: 0, right: 0, bottom: 0, left: 0};
var width = window.innerWidth, // - margin.left - margin.right,
    height = window.innerHeight; // - margin.top - margin.bottom;

// Container for my application view.
var view = {};
view.file = ''; // default file
view.model = null; // graph model
view.data = null; // and copy of its data
view.lays = []; // empty list of layers

// Handle window events
/*
window.onresize = function () {
  //console.log("Resize new");
  d3.select('body').select('svg')
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);
};
*/

// New menu overloading the default one.
view.menu = function() {

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
                    view.file  = fileNames[0];
                    view.model = JSON.parse(fs.readFileSync(view.file, 'utf8'));
                    view.data  = saveFix(view.model);
                    view.lays  = [view.model.commits, view.model.files, view.model.functions];
                    lay = 1;
                    lmx = 3;
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
            view.data = saveFix(view.model);
            fs.writeFile(
              //path.basename(view.file, '.json')+'_fix'+path.extname(view.file),
              view.file,
              JSON.stringify(view.data, null, 2)
            );
          }
        }, // File / Save
        { // File / Close
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          click: function(item, focusedWindows) {
            clearThePicture();
            view.file  = "";
            view.model = null;
            view.data  = null;
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
        },
        { // View / Freeze
          label: 'Unfreeze',
          accelerator: 'CmdOrCtrl+U',
          click: function(item, focusedWindow) {
            clickUnfreeze();
          }
        },
        { // View / Reload
          label: 'Shake',
          accelerator: 'F5',
          click: function(item, focusedWindow) {
            clickReload();
            //window.reload();
          }
        },
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
        },
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
        },
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
view.menu.init();
