const { ipcMain, app } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const open = require('open');
// const chokidar = require('chokidar');

const notification = require('./notification');

const appDir = path.resolve(os.homedir(), 'electron-app-files');

fs.ensureDirSync(appDir);

exports.getFiles = () => {
    const files = fs.readdirSync(appDir);
    return files.map(filename => {
        const filePath = path.resolve(appDir, filename);
        const fileStats = fs.statSync(filePath);

        return {
            name: filename,
            path: filePath,
            size: Number(fileStats.size/1000).toFixed(1), //kb
        };
    });
};

exports.addFiles = (files = []) => {
    fs.ensureDirSync(appDir);
    files.forEach(file => {
        const filePath = path.resolve(appDir, file.name);
        if(! fs.existsSync(filePath)) {
            fs.copyFileSync(file.path, filePath);
        }
    });
    notification.filesAdded(files.length);
};

exports.deleteFile = (filename) => {
    const filePath = path.resolve(appDir, filename);
    if(fs.existsSync(filePath)) {
        fs.removeSync(filePath);
    }
};

exports.openFile = (filename) => {
    const filepath = path.resolve(appDir, filename);
    if(fs.existsSync(filepath)) {
        open(filepath);
    }
};

// exports.watchFiles = (win) => {
//     chokidar.watch(appDir).on('unlink', (filepath) => {
//         console.log('File ${path} has been removed');
//         win.webContens.send('app:delete-file', path.parse(filepath).base);
//     });
// };