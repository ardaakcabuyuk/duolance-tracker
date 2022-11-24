const {app, BrowserWindow, ipcMain, desktopCapturer} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');
const {PythonShell} = require('python-shell');
const {getAuthStatus, askForScreenCaptureAccess} = require('node-mac-permissions');
const child = require('child_process').execFile;
const captureExecCwd = isDev ?
    path.join(__dirname, '../capture_service/dist/capture'):
    path.join(__dirname, '../../app.asar.unpacked/capture_service/dist/capture');

const captureExecPath = path.join(captureExecCwd, 'capture');
    

const isMac = process.platform === 'darwin'

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
    
    // const promise = new Promise((resolve, reject) => {
    //     PythonShell.run('capture.py', {
    //         scriptPath:
    //         (isDev
    //         ? path.join(__dirname, '../src/capture_service') :
    //         path.join(__dirname, '../src/capture_service').replace('app.asar', 'app.asar.unpacked')),
    //         args: [value]
    //     }, function (err, response) {
    //         if (err) reject(err);
    //         console.log('finished');
    //         console.log(response);
    //         resolve(JSON.parse(response));
    //     });
    // });
    const result = await promise;
    return result;
});