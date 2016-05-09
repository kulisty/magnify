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

// Container for my application view.
var view = {};

// Handle to the current canvas; no canvas at the beginning.
var svg = null;

// Global handle to manipulate force.
var force = null;

// Global handle to manipulate graph data.
var gph = null;

// Viewport
var width = 1000,
    height = 1000;
    //var width = window.innerWidth * 0.9
    //var height = window.innerHeight * 0.9
// and viewbox
var vbx = -100,
    vby = -100,
    vbw = 1000,
    vbh = 1000;
// and zoom factor
var zmf = 1;
// also as string
function vb(x,y,w,h) {
    return ""+zmf*x+" "+zmf*y+" "+zmf*w+" "+zmf*h+"";
}

// Default file.
view.file = "C:\\Project Files\\hab\\magnify\\data\\default.json";

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
            //## nothing being done, yet
            view.file = "C:\\Project Files\\hab\\magnify\\data\\commits.json";
            // DEBUG
            console.log("File changed to %s", view.file);
            svg = d3.select("body").append("svg")
                .attr("viewBox", vb(vbx,vby,vbw,vbh))
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
                // DEBUG
                console.log("File changed to %s", view.file);
                svg = d3.select("body").append("svg")
                    .attr("viewBox", vb(vbx,vby,vbw,vbh))
                    .attr("width", width)
                    .attr("height", height);
                d3.json(view.file, drawThePicture);
              });
            }
          } // click for open
        },
        { // File / Close
          label: 'Close',
          accelerator: 'CmdOrCtrl+C',
          click: function(item, focusedWindows) {
            // back to the default file
            view.file = "C:\\Project Files\\hab\\magnify\\data\\default.json";
            // DEBUG
            console.log("File changed to %s", view.file);
            // remove svg
            d3.select('body').select('svg').remove();
            // svg = null;
          } // click for close
        },
        { // File / Test
          label: 'Test',
          accelerator: 'CmdOrCtrl+T',
          click: function(item, focusedWindows) {
            // TODO
            console.log("Just testing...");
            svg.selectAll(".node").transition()
              .attr("cx", function(d) { return 100; })
              .attr("cy", function(d) { return d.y/2; } )
              .attr("r", 7);
          } // click for test
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
            force.stop();
            svg.selectAll(".node")
              .classed("fixed", function(d) {d.fixed = true} );
          }
        },
        { // View / Freeze
          label: 'Unfreeze',
          accelerator: 'CmdOrCtrl+U',
          click: function(item, focusedWindow) {
            svg.selectAll(".node")
              .classed("fixed", function(d) {d.fixed = false} );
            force.start();
          }
        },
        { // View / Zoom in
          label: 'Zoom in',
          accelerator: 'CmdOrCtrl+I',
          click: function(item, focusedWindow) {
            zmf = zmf / 2;
            svg.attr("viewBox", vb(vbx,vby,vbw,vbh));
          }
        },
        { // View / Zoom out
          label: 'Zoom out',
          accelerator: 'CmdOrCtrl+O',
          click: function(item, focusedWindow) {
            zmf = zmf * 2;
            svg.attr("viewBox", vb(vbx,vby,vbw,vbh));
          }
        },
        { // View / Center
          label: 'Zoom to fit',
          accelerator: 'CmdOrCtrl+C',
          click: function(item, focusedWindow) {
            svg.attr("viewBox", vb(-500,-500,3000,3000));
            //window.scrollBy(vbw/4,vbh/4);
          }
        },
        { // View / Reload
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload();
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
