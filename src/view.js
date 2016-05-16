/* ==========================================================
 *         Magnify - Browse source code as a graph
 *        https://github.com/kulisty/magnify.js
 * ==========================================================
 * Copyright (c) 2016 Robert Dabrowski (r.dabrowski@uw.edu.pl)
 *
 * Magnify is distributed under the MIT Licence
 * ========================================================== */

var remote = require('remote');
var Menu = remote.require('menu');
var dialog = remote.require('dialog');
var d3 = require('d3');
var fs = require('fs');
var clipboard = require('clipboard');
var shell = require('electron').shell;

// Global handles; null at the beginning
var svg = null;
var force = null;
var links = null;
var nodes = null;

// Viewport
var margin = {top: 13, right: 13, bottom: 13, left: 13},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;
// viewbox
var vbx = -100,
    vby = -100,
    vbw = 1000,
    vbh = 1000;
// zoom factor
var zmf = 1;
// also as string
function vb(x,y,w,h) {
    return ""+zmf*x+" "+zmf*y+" "+zmf*w+" "+zmf*h+"";
}

// Support for panning and zooming
var x = d3.scale.linear()
    .domain([-width / 2, width / 2])
    .range([0, width]);
//
var y = d3.scale.linear()
    .domain([-height / 2, height / 2])
    .range([height, 0]);
//
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(-height);
//
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickSize(-width);
//
var zoom = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([1, 32]);
    //.on("zoom", zoomed);

// Container for my application view.
var view = {};

// Default file
view.file = '';

// Graph model
view.model = null;
view.data = { nodes: [], links: [] };

// New menu overloading the default one.
view.menu = function() {

  var template = [

    // Top level item: file
    {
      label: 'File',
      submenu: [
        { // File / New
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: function(item, focusedWindows) {
            view.file = "C:\\Project Files\\hab\\magnify\\data\\commits.json";
            svg = d3.select("body").append("svg")
               .attr("viewBox", vb(vbx,vby,vbw,vbh))
               .attr("width", width)
               .attr("height", height);
            svg.append("g")
               .attr("transform", "translate(" + 0 + "," + 0 + ")");
               //.call(zoom);
            svg.append("rect")
               .attr("width", width)
               .attr("height", height);
            d3.json(view.file, drawThePicture);
          } // click for new
        },
        { // File / Open
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: function(item, focusedWindow) {
            if (focusedWindow) {
              dialog.showOpenDialog({ filters: [
                 { name: 'Source code', extensions: ['json','git', 'github', 'gitlab'] }
                ]}, function (fileNames) {
                if (fileNames === undefined) return;
                view.file = fileNames[0];
                view.model = JSON.parse(fs.readFileSync(view.file, 'utf8'));
                fs.writeFile('zrodlowy.json', JSON.stringify(view.model, null, 2));
                d3.select("body").append("svg")
                  .attr("viewBox", vb(vbx,vby,vbw,vbh))
                  .attr("width", width)
                  .attr("height", height);
                //d3.json(view.file, drawThePicture);
                drawThePicture(null, view.model);
              });
            }
          } // click for open
        },
        { // File / Close
          label: 'Close',
          accelerator: 'CmdOrCtrl+C',
          click: function(item, focusedWindows) {
            d3.select('body').select('svg').remove();
            view.file = "";
            view.model = null;
          } // click for close
        },
        { // File / Save
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: function(item, focusedWindows) {
            fs.writeFile('testowy.json', JSON.stringify(view.model, null, 2));
          } // click for test
        },
        { // File / Load
          label: 'Load',
          accelerator: 'CmdOrCtrl+L',
          click: function(item, focusedWindows) {
            updateThePicture(null,
              JSON.parse(fs.readFileSync('testowy.json', 'utf8'))
            );
          } // click for load
        }
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
        { // View / Zoom in
          label: 'Zoom in',
          accelerator: 'CmdOrCtrl+I',
          click: function(item, focusedWindow) {
            clickZoomIn();
          }
        },
        { // View / Zoom out
          label: 'Zoom out',
          accelerator: 'CmdOrCtrl+O',
          click: function(item, focusedWindow) {
            clickZoomOut();
          }
        },
        { // View / Center
          label: 'Zoom to fit',
          accelerator: 'CmdOrCtrl+C',
          click: function(item, focusedWindow) {
            clickZoomFit();
            //window.scrollBy(vbw/4,vbh/4);
          }
        },
        { // View / Reload
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
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
          accelerator: 'CmdOrCtrl+W',
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
