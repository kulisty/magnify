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
var path = require("path");
var clipboard = require('clipboard');
var shell = require('electron').shell;

// Global handles; null at the beginning
var svg = null,
    div = null,
    force = null,
    links = null,
    nodes = null;

// Viewport
var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = window.innerWidth,
    height = window.innerHeight;

// Container for my application view.
var view = {};

// Default file
view.file = '';

// Graph model
view.model = null;
// and copy of its data
view.data = null;

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
        /*
        { // File / New
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: function(item, focusedWindows) {
            view.file = "C:\\Project Files\\hab\\magnify\\files.json";
            // Define 'div' for tooltips
            div = d3.select("body")
          	  .append("div") // declare the tooltip div
          	  .attr("class", "tooltip") // apply the 'tooltip' class
          	  .style("opacity", 0); // set the opacity to nil
            svg = d3.select("body").append("svg")
               .attr("width", window.innerWidth)
               .attr("height", window.innerHeight)
               .call(d3.behavior.zoom().on("zoom", function () {
                  //console.log("Zoom on canvas");
                  svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
                  //d3.event.sourceEvent.stopPropagation(); // silence other listeners
                }))
                .call(d3.behavior.drag().on('dragstart', function () {
                  //console.log("Drag on canvas");
                  //d3.event.sourceEvent.stopPropagation(); // silence other listeners
                }))
               .append("g");

               // We're passing in a function in d3.max to tell it what we're maxing (x value)
               var xScale = d3.scale.linear()
                   //.domain([0, d3.max(dataset, function (d) { return d.x + 10; })])
                   //.range([margin.left, w - margin.right]);  // Set margins for x specific
                   .domain([0, 10])
                   .range([0, window.innerWidth]);
               // We're passing in a function in d3.max to tell it what we're maxing (y value)
               var yScale = d3.scale.linear()
                   //.domain([0, d3.max(dataset, function (d) { return d.y + 10; })])
                   //.range([margin.top, h - margin.bottom]);  // Set margins for y specific
                   .domain([0, 10])
                   .range([0, window.innerHeight]);
               // Add a X and Y Axis (Note: orient means the direction that ticks go, not position)
               var xAxis = d3.svg.axis().scale(xScale).orient("top");
               var yAxis = d3.svg.axis().scale(yScale).orient("left");
               //
               var circleAttrs = {
                   cx: function(d) { return xScale(d.x); },
                   cy: function(d) { return yScale(d.y); },
                   r: 10
               };
               // Adds X-Axis as a 'g' element
               svg.append("g").attr({
                 "class": "axis",  // Give class so we can style it
                 transform: "translate(" + [0, margin.top] + ")"  // Translate just moves it down into position (or will be on top)
               }).call(xAxis);  // Call the xAxis function on the group
               // Adds Y-Axis as a 'g' element
               svg.append("g").attr({
                 "class": "axis",
                 transform: "translate(" + [margin.left, 0] + ")"
               }).call(yAxis);  // Call the yAxis function on the group

            d3.json(view.file, drawThePicture);
          } // click for new
        },
        */
        { // File / Open
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: function(item, focusedWindow) {
            //if (focusedWindow) {
              dialog.showOpenDialog({ filters: [
                 { name: 'Source code', extensions: ['json','git', 'github', 'gitlab'] }
                ]}, function (fileNames) {
                if (fileNames === undefined) return;
                view.file = fileNames[0];
                view.model = JSON.parse(fs.readFileSync(view.file, 'utf8'));
                //fs.writeFile('zrodlowy.json', JSON.stringify(view.model, null, 2));
                // Destroy old
                d3.select('body').select('svg').remove();
                // then create new
                svg = d3.select("body").append("svg")
                   .attr("width", window.innerWidth)
                   .attr("height", window.innerHeight)
                   .call(d3.behavior.zoom().on("zoom", function () {
                     //console.log("Drag canvas");
                     svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
                    }))
                    .call(d3.behavior.drag().on('dragstart', function () {
                      //console.log("Drag on canvas");
                    }))
                    .append("g");
                //d3.json(view.file, drawThePicture);
                drawThePicture(null, view.model);
              });
            //} // if (focusedWindow)
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
          label: 'Save fix',
          accelerator: 'CmdOrCtrl+S',
          click: function(item, focusedWindows) {
            view.data = saveFix(view.model);
            fs.writeFile(
              //path.basename(view.file, '.json')+'_fix'+path.extname(view.file),
              view.file,
              JSON.stringify(view.data, null, 2)
            );
          } // click for test
        },
        { // File / Load
          label: 'Load fix',
          accelerator: 'CmdOrCtrl+L',
          click: function(item, focusedWindows) {
            updateThePicture(null, JSON.parse(fs.readFileSync(view.file, 'utf8')));
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
        /*
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
        */
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
