'use strict';

const {app, BrowserWindow, ipcMain, globalShortcut} = require('electron');

//Helps in initializing main window
var mainWindow = null;

var configuration = require('./configuration');

app.on('ready', function() {

	if (!configuration.readSettings('shortcutKeys')) {
        configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
    }

    mainWindow = new BrowserWindow({
    	frame: false,
        height: 700,
        resizeable: false,
        width: 368
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');

    setGlobalShortcuts();
});

//Helps in closing main window
ipcMain.on('close-main-window', function () {
    app.quit();
});

//Helps in opening/closing settings window
var settingsWindow = null;

ipcMain.on('open-settings-window', function () {
    if (settingsWindow) {
        return;
    }

    settingsWindow = new BrowserWindow({
        frame: false,
        height: 200,
        resizable: false,
        width: 200
    });

    settingsWindow.loadURL('file://' + __dirname + '/app/settings.html');

    settingsWindow.on('closed', function () {
        settingsWindow = null;
    });
});

ipcMain.on('close-settings-window', function () {

    if (settingsWindow) {
        settingsWindow.close();
    }

});

function setGlobalShortcuts() {
	globalShortcut.unregisterAll();
    
    var shortcutKeysSetting = configuration.readSettings('shortcutKeys');
    var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';
    
    //Register Global shortcuts keyboard keys
    globalShortcut.register(shortcutPrefix + '1', function () {
            mainWindow.webContents.send('global-shortcut', 0);
    });
    globalShortcut.register(shortcutPrefix + '2', function () {
        mainWindow.webContents.send('global-shortcut', 1);
    });
}

ipcMain.on('set-global-shortcuts', function () {
    setGlobalShortcuts();
});