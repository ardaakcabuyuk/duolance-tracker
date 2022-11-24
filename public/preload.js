const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('capture_api', {
  capture: (timestamp) => {
    return ipcRenderer.invoke('screenshot:capture', timestamp)
  }
});