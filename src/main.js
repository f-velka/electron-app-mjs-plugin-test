const YAML = require('yaml');
const electron = require('electron');
const fs = require('fs');
var config = require('../package.json');
const path = require('path');
const url = require('url');

const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
const mjsDirectory = path.join(__dirname, 'plugins');  // .mjsファイルが格納されているディレクトリを指定

function createWindow() {
  mainWindow = new BrowserWindow(
    {
      title: config.name,
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: true,
        nodeIntegration: false
      }
    });

  mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, '/index.html'),
      protocol: 'file:',
      slashes: true
  }));

  mainWindow.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

ipcMain.handle('get-data-definitions', async () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, "configs", "data-definitions.yaml"), (err, data) => {
      if (err) {
        reject("Failed to read config");
      } else {
        const dataObj = YAML.parse(data.toString());
        resolve(JSON.stringify(dataObj));
      }
    })
  });
});

ipcMain.handle('get-mjs-files', async () => {
  return new Promise((resolve, reject) => {
    fs.readdir(mjsDirectory, (err, files) => {
      if (err) {
        reject('Failed to read directory');
      } else {
        const mjsFiles = files.filter(file => file.endsWith('.mjs'));
        resolve(mjsFiles);
      }
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
