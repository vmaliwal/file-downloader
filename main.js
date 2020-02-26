import path from 'path';
import fs from 'fs';
import DownloaderCli from './src/view/cli';

import cliProgress from 'cli-progress';

import { DEFAULT_DESTINATION_DIR } from './src/config';
import createDownloader from "./src/downloader/createDownloader";
import { makeDir } from './src/file/fileUtils';


//TODOS::
/*
    # Add test cases
    # Add FTP support √
    # Add file names to be displayed √
    # Add listener when internet connection is off
    # Add cleanup logic when download isn't complete
    # Check if bitly link is provided we are able to download, along with correct file names
    # move logic from main function to a seperate file
    # Also looking into naming files if file with same names does exist
    # Provide env variables for SFTP
    # test SFTP username:password link does work as expected
    # Graceful error handling. Add as many tryy catch as possible

    # ftp://speedtest:speedtest@ftp.otenet.gr/test100Mb.db
*/
const Main = async () => {
    console.log("Welcome to Multi File Downloader");

    const response  = await DownloaderCli();
    const { downloadLocation, urls } = response;

    const queue = [];

    const destination = (downloadLocation) ? downloadLocation : DEFAULT_DESTINATION_DIR;
    
    const out = path.parse(__filename);
    const destinationPath = path.join(out.dir, destination);

    makeDir(destinationPath);

    urls.forEach(url => {
        const downloader = createDownloader(url, destination);
        queue.unshift(downloader);
    });

    const multiBar = new cliProgress.MultiBar({
        format: '  [{bar}] | "{file}" | {percentage}% | {value}/{total}',
        clearOnComplete: false,
        hideCursor: true
    });

    const multiBars = new Array(queue.length);


    queue.forEach((downloader, i) => {
        downloader.on('START', ({ data }) => {
            const bar = multiBar.create(100, 0, {file: data.name });
            multiBars[i] = bar;
        })
        downloader.on('DOWNLOAD', ({ data }) => {
            // console.log("DOWNLOAD BEING :", data);
        })
        downloader.on('PROGRESS', ({ data }) => {
            const bar = multiBars[i];
            bar.update(data.progress);
        })
        downloader.on('ERROR', ({ err }) => {
            console.log("error :", err);
            downloader.cleanUp();
        })
        downloader.on('END', ({ data }) => {
            const bar = multiBars[i];
            bar.update(data.progress);
            bar.stop();
            // console.log("Ended :", data);
        })

        downloader.download();
    });
}
Main();

export default Main;
