import fs from 'fs';

export function makeDir(path) {
    if(!checkLocalPathExist(path)) {
        fs.mkdir(path,  { recursive: true }, (err) => {
            if (err) throw err;
        });
    }
}

export function removeDir(path) {
    if(checkLocalPathExist(path)) {
        fs.rmdir(path,  { recursive: true }, (err) => {
            if (err) throw err;
        });
    }
}

export function checkLocalPathExist(path) {
    return fs.existsSync(path);
}