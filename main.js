import path from 'path';
import DownloaderCli from './src/view/cli';
import fs from 'fs';
import util from 'util';
import cliProgress from 'cli-progress';

import { DEFAULT_DESTINATION_DIR } from './src/config';
import createDownloader from "./src/downloader/createDownloader";
import { makeDir } from './src/file/fileUtils';

/**
 * Entry point for the application
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


    // Add listeners for individual downloaders
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

    const fs = require('fs');
    const util = require('util');
    const log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
    const log_stdout = process.stdout;
    
    console.error = function(d) { //
      log_file.write(util.format(d) + '\n');
      log_stdout.write(util.format(d) + '\n');
    };
    

})();


export default Main;
