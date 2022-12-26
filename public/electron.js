const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const child = require('child_process').execFile;
const captureExecCwd = isDev ?
    path.join(__dirname, '../capture_service/dist/capture'):
    path.join(__dirname, '../../app.asar.unpacked/capture_service/dist/capture');

const isMac = process.platform === 'darwin';
const captureExecPath = isMac ? path.join(captureExecCwd, 'capture'): path.join(captureExecCwd, 'capture.exe');
autoUpdater.checkForUpdatesAndNotify();

function createWindow() {
    const win = new BrowserWindow({
        title: 'Duolance Tracker',
        width: 400,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'hidden',
    });
    win.setResizable(false);
    win.loadURL(
        isDev 
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, "../build/index.html")}`
    );
    isDev && win.webContents.openDevTools();
}

app.on('ready', function() {
    createWindow();
    if (isMac) {
        const {getAuthStatus, askForScreenCaptureAccess} = require('node-mac-permissions');
        const screenPermission = getAuthStatus('screen');
        console.log(screenPermission);
        if (screenPermission === 'not-determined' || screenPermission === 'denied') {
            askForScreenCaptureAccess();
        }
    }
})

app.on('window-all-closed', function() {
    if (!isMac) app.quit();
})

app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
})

ipcMain.handle('version:request_version', (event) => {
	return app.getVersion();
});

ipcMain.handle('screenshot:capture', async(e, value) => {
    const parameters = [Date.now().toString()];
    const promise = new Promise((resolve, reject) => {
        child(captureExecPath, parameters, {cwd: captureExecCwd, maxBuffer: 1024 * 1024 * 500}, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            console.log(data.toString())
            try {
                const result = JSON.parse(data.toString());
                resolve(result);
            } catch (e) {
                console.log(data.toString());
                console.error(e);
                reject(e);
            }
        }); 
    });
    
    const result = await promise;
    return result;
});