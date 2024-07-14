const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getDataDefinitions: () => ipcRenderer.invoke('get-data-definitions'),
  getMjsFiles: () => ipcRenderer.invoke('get-mjs-files'),
});
