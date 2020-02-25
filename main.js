import SftpDownloader from "./src/downloader/sftpDownloader";
import HttpsDownloader from './src/downloader/httpsDownloader';
import URLParser from "./src/UrlParser";
import path from 'path';
import fs from 'fs';
import DownloaderCli from './src/view/cli';

import cliProgress from 'cli-progress';

import { DEFAULT_DESTINATION_DIR } from './src/config';
import createDownloader from "./src/downloader/createDownloader";

const Main = async () => {
    console.log("Welcome to Multi File Downloader");

    const response  = await DownloaderCli();
    const { downloadLocation, urls } = response;

    const queue = [];

    const destionation = (downloadLocation) ? downloadLocation : DEFAULT_DESTINATION_DIR;
    
    const out = path.parse(__filename);
    const destinationPath = path.join(out.dir, destionation);

    if(!fs.existsSync(destinationPath)) {
        fs.mkdir(destinationPath,  { recursive: true }, (err) => {
            if (err) throw err;
        });
    }

    urls.forEach(url => {
        const downloader = createDownloader(url, destionation);
        queue.push(downloader);
    });

    const multiBar = new cliProgress.MultiBar({
        clearOnComplete: false,
        hideCursor: true
    });

    const multiBars = new Array(queue.length);

    queue.forEach((requester, i) => {
        
        let b;
        requester.on('START', () => {
            b = multiBar.create(100, 0)
            multiBars[i] = b;
            // console.log("started :", data);
        })
        requester.on('DOWNLOAD', (data) => {
            // console.log("DOWNLOAD BEING :", data);
        })
        requester.on('PROGRESS', ({ data }) => {
            const bar = multiBars[i];
            bar.update(data.progress);
            // console.log("PROGRESS :", data);
        })
        requester.on('ERROR', (data) => {
            console.log("error :", data);
            requester.cleanUp();
        })
        requester.on('END', ({ progress }) => {
            const bar = multiBars[i];
            bar.update(progress);
            bar.stop();
            // console.log("Ended :", data);
        })

        requester.request();
    })

/*
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

    const requester = new HttpsDownloader(url, destinationPath);
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
*/
}
Main();

export default Main;
