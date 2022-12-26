const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('capture_api', {
  capture: (timestamp) => {
    return ipcRenderer.invoke('screenshot:capture', timestamp)
  }
});

contextBridge.exposeInMainWorld('version_api', {
  requestVersion: () => {
    return ipcRenderer.invoke('version:request_version')
  },

  restartApp: () => {
    ipcRenderer.send('version:restart_app')
  }
});