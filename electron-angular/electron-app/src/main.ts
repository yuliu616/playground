import { app, BrowserWindow, ipcMain } from 'electron';
import * as moment from 'moment';
import * as path from 'path';
import * as fs from 'fs';

ipcMain.on('ECHO', (event, ... arg: any[])=>{
  console.log(`when the time is `, moment().format(), 'someone said: ', arg);
  if (arg.length >= 2) {
    let ppl = arg[1];
    let targetFile = path.resolve(__dirname, '..', '..', 'out', moment().unix()+'.json');
    console.log('creating:', ppl, ' targetFile=', targetFile);
    fs.writeFile(targetFile, JSON.stringify(ppl,null,2), (err)=>{
      console.log('created', ppl);
    });
  }
});

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false,
    },
  });

  // and load the index.html of the app.
  // win.loadFile('index.html');
  let targetFile = path.resolve(__dirname, '../angular-app/index.html');
  // console.log(`targetFile = `, targetFile);
  win.loadURL(`file://${targetFile}`);
  
  // Open the DevTools.
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    // block all navigation
    console.error(`page navigation caused, block it:`, navigationUrl);
    event.preventDefault();
  });
  contents.on('new-window', async (event, navigationUrl) => {
    // block all new window (other means of navigation)
    console.error(`new window navigation caused, block it:`, navigationUrl);
    event.preventDefault();
  });
});
