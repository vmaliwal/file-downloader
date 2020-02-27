import path from 'path';
import fs from 'fs';
import DownloaderCli from './src/view/cli';

import cliProgress from 'cli-progress';

import { DEFAULT_DESTINATION_DIR } from './src/config';
import createDownloader from "./src/downloader/createDownloader";
import { makeDir } from './src/file/fileUtils';


//TODOS::
/*
    # Add test cases √
    # Add FTP support √
    # Add file names to be displayed √
    # Add listener when internet connection is off
    # Add cleanup logic when download isn't complete
    # Check if bitly link is provided we are able to download, along with correct file names
    # move logic from main function to a seperate file √
    # Also looking into naming files if file with same names does exist
    # Provide env variables for SFTP
    # test SFTP username:password link does work as expected √
    # Graceful error handling. Add as many tryy catch as possible
    # Show error if file does not exist on remote server

    # ftp://speedtest:speedtest@ftp.otenet.gr/test100Mb.db
*/
const Main = (async() => {
    console.log("Welcome to Multi Protocol File Downloader");

    const response  = await initCli();
    const { urls } = response;

    const {destination, destinationPath} = getDownloadLocation(response);
    
    makeDir(destinationPath);
    
    const queue = getDownloadersQueue(urls);
    const multiBar = initMultiBar(); 
    const multiBars = new Array(queue.length);


    queue.forEach((downloader, i) => {
        downloader.on('START', ({ data }) => {
            const bar = multiBar.create(100, 0, {file: data.name});
            multiBars[i] = bar;
        })
        downloader.on('DOWNLOAD', ({ data }) => {
            const bar = multiBars[i];
            bar.setTotal(data.total);
        })
        downloader.on('PROGRESS', ({ data }) => {
            const bar = multiBars[i];
            bar.update(data.downloaded);
        })
        downloader.on('ERROR', ({ error }) => {
            console.error(error.message);
            downloader.cleanUp();
            const bar = multiBars[i];
            multiBar.remove(bar);
        })
        downloader.on('END', ({ data }) => {
            const bar = multiBars[i];
            bar.update(data.downloaded);
            bar.stop();
        });
        downloader.download();
    });

    /**
     * @returns @instance DownloaderCli
     */
    async function initCli() {
        return await DownloaderCli();
    }

    /**
     * Returns relatve and absolute path based on provided response
     * @param {string} cliResponse
     * @returns Object
     */
    function getDownloadLocation(cliResponse) {
        const { downloadLocation } = cliResponse;
    
        const destination = (downloadLocation) ? downloadLocation : DEFAULT_DESTINATION_DIR;
        
        const out = path.parse(__filename);
        const destinationPath = path.join(out.dir, destination);

        return { destination, destinationPath};
    }

    /**
     * Setup downloader queues
     * @param {string} urls
     * @returns Array<BaseDownloaders> 
     */
    function getDownloadersQueue(urls) {
        const queue = [];

        urls.forEach(url => {
            try {
                const downloader = createDownloader(url, destination);
                queue.unshift(downloader);
            } catch (e) {
                console.error(e.message);
            }
        });
        
        return queue;
    }

    /**
     * Initialize download bars to be displayed on terminal
     */
    function initMultiBar() {
        return new cliProgress.MultiBar({
            format: '  [{bar}] | "{file}" | {percentage}% | {value}/{total}',
            clearOnComplete: false,
            hideCursor: true,
            stopOnComplete: true,
        });
    }

})();
export default Main;
