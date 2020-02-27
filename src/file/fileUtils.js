import fs from 'fs';

/**
 * create a directory recursively at provided path
 * @param {path} path 
 */
export function makeDir(path) {
    if(!checkLocalPathExist(path)) {
        try {
            fs.mkdirSync(path, {recursive: true});
        } catch(err) {
            throw err;
        }
    }
}

/**
 * remove directory recursively at provided path
 * @param {path} path 
 */
export function removeDir(path) {
    if(checkLocalPathExist(path)) {
        fs.rmdir(path,  { recursive: true }, (err) => {
            if (err) throw err;
        });
    }
}

/**
 * Check if provided path exists already locally
 * @param {path} path 
 */
export function checkLocalPathExist(path) {
    return fs.existsSync(path);
}