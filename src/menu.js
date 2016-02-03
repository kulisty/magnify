var magnifyApp = magnifyApp || {};
var remote = require('remote');
var fs = require('fs');
var Menu = remote.require('menu');
var dialog = remote.require('dialog');

magnifyApp.menu = function() {

  var template = [
    // Top level item: file
    {
      label: 'File',
      submenu: [
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: function(item, focusedWindow) {
            if (focusedWindow) {
              dialog.showOpenDialog({ filters: [
                 { name: 'Git', extensions: ['git', 'github', 'gitlab'] }
               ]}, function (fileNames) {
                if (fileNames === undefined) return;
                var fileName = fileNames[0];
                fs.readFile(fileName, 'utf-8', function (err, data) {
                  //## geojson(JSON.parse(data));
                  //## nothing being done, yet
                });
              });
            }
          } // click for open
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+C',
          click: function(item, focusedWindows) {
            //## nothing being done, yet
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
