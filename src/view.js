var remote = require('remote');
var Menu = remote.require('menu');
var dialog = remote.require('dialog');
var d3 = require('d3');
var fs = require('fs');

var width = 2000,
    height = 2000;

// Container for my application view.
var view = {};

// Handle to the current canvas; no canvas at the beginning.
var svg = null;

// Default file.
view.file = "C:\\Project Files\\hab\\magnify\\data\\default.json";

// New menu overloading the default one.
view.menu = function() {

  var template = [
    // Top level item: file
    {
      label: 'File',
      submenu: [
        {
          label: 'Test',
          accelerator: 'CmdOrCtrl+T',
          click: function(item, focusedWindows) {
            // DEBUG
            console.log("Test mode");
          } // click for test
        },        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click: function(item, focusedWindows) {
            //## nothing being done, yet
            view.file = "C:\\Project Files\\hab\\magnify\\data\\commits.json";
            // DEBUG
            console.log("File changed to %s", view.file);
            svg = d3.select("body").append("svg")
                //.attr("viewBox", "0 0 4000 4000")
                .attr("width", width)
                .attr("height", height);
            d3.json(view.file, drawThePicture);
          } // click for new
        },
        {
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
                    .attr("width", width)
                    .attr("height", height);
                d3.json(view.file, drawThePicture);
              });
            }
          } // click for open
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+C',
          click: function(item, focusedWindows) {
            //## nothing being done, yet
            view.file = "C:\\Project Files\\hab\\magnify\\data\\default.json";
            // DEBUG
            console.log("File changed to %s", view.file);
            // remove svg
            d3.select('body').select('svg').remove();
            // svg = null;
          } // click for close
        }
      ]
    }, // file
    // Top level item: view
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload();
          }
        },
        {
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
        {
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
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
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
