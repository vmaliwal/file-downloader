import SftpRequester from "./src/requester/sftpRequester";
import HttpsRequester from './src/requester/httpsRequester';
import URLParser from "./src/UrlParser";
import path from 'path';
import fs, { mkdir } from 'fs';

import { DEFAULT_DESTINATION_DIR } from './src/config';

const Main = async () => {
    console.log("Welcome to Multi File Downloader");

    // const url = new URLParser("sftp://test.rebex.net/readme.txt");

    const url = new URLParser("https://speed.hetzner.de/100MB.bin");

    const destionation = DEFAULT_DESTINATION_DIR;

    const out = path.parse(__filename);
    const destinationPath = path.join(out.dir, destionation);

    if(!fs.existsSync(destinationPath)) {
        fs.mkdir(destinationPath,  { recursive: true }, (err) => {
            if (err) throw err;
        });
    }

    const requester = new HttpsRequester(url, destinationPath);
    requester.on('START', (data) => {
        console.log("started :", data);
    })
    requester.on('DOWNLOAD', (data) => {
        console.log("DOWNLOAD BEING :", data);
    })
    requester.on('PROGRESS', (data) => {
        console.log("PROGRESS :", data);
    })
    requester.on('ERROR', (data) => {
        console.log("error :", data);
        requester.cleanUp();
    })
    requester.on('END', (data) => {
        console.log("Ended :", data);
    })
    // should be inside try catch for error handling
    requester.request();
}
Main();

export default Main;
