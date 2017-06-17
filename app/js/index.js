// Add your index.js code in this file
'use strict';

const {ipcRenderer, remote, path} = require('electron');
//Assign sound button to the main desktop app
var soundButtons = document.querySelectorAll('.button-sound');

for (var i = 0; i < soundButtons.length; i++) {
    var soundButton = soundButtons[i];
    var soundName = soundButton.attributes['data-sound'].value;

    prepareButton(soundButton, soundName);
}

function prepareButton(buttonEl, soundName) {
    buttonEl.querySelector('span').style.backgroundImage = 'url("img/icons/' + soundName + '.png")';

    var audio = new Audio(__dirname + '/wav/' + soundName + '.wav');
    buttonEl.addEventListener('click', function () {
        audio.currentTime = 0;
        audio.play();
    });
}

//Make the close button of desktop app working
var closeEl = document.querySelector('.close');

closeEl.addEventListener('click', function () {

    ipcRenderer.sendSync('close-main-window');

});

//Make the setting button of desktop app working
var settingsEl = document.querySelector('.settings');

settingsEl.addEventListener('click', function () {

    ipcRenderer.send('open-settings-window');

});

//Make the shortcut buttons work
ipcRenderer.on('global-shortcut', function (event, arg) {

    var event = new MouseEvent('click');
    console.log(arg);

    soundButtons[parseInt(arg)].dispatchEvent(event);
});

//adding code for the tray icons

var Tray = remote.require('tray');
var Menu = remote.require('menu');

var trayIcon = null;
console.log(process.platform);
if (process.platform === 'darwin') {
    trayIcon = new Tray(path.join(__dirname, 'img/tray-iconTemplate.png'));
}
else {
    trayIcon = new Tray(path.join(__dirname, 'img/tray-icon-alt.png'));
}

var trayMenuTemplate = [
    {
        label: 'Sound machine',
        enabled: false
    },
    {
        label: 'Settings',
        click: function () {
            ipc.send('open-settings-window');
        }
    },
    {
        label: 'Quit',
        click: function () {
            ipc.send('close-main-window');
        }
    }
];
var trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
trayIcon.setContextMenu(trayMenu);