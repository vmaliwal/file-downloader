import BaseDownloader from "./baseDownloader";
import axios from "axios";

/**
 * Downloader for HTTP & HTTPS protocol that extends BaseDownloader
 */
export default class HttpsDownloader extends BaseDownloader {
    constructor(urlParser, destinationDir) {
        super(urlParser, destinationDir);
    }

    /**
     * Implements download method that requests to remote server
     * and saves the file at provided destination directory
     */
    async download() {
        try {
            this.onStart();

            const { href } = this.getOrigin();
            const stream = await this.__makeRequest(href);
            const readStream = this.__getDataValueOfStream(stream);
            const fileStat = this.__getRemoteFileStats(readStream);
            
            this.onDownload(fileStat);
            
            this.__attachedEventsToReadStream(readStream);
            const writeStream = this.getWriteStream();
            
            this.__listenForClientRequestEvent(stream);
    
            readStream.pipe(writeStream);
        }catch (err) {
            this.onError(err);
        }
        return this;
    }

    /**
     * Sends a get request to remote server
     * @param {string} href 
     */
    async __makeRequest(href) {
        return await axios.get(href, {responseType: 'stream'});
    }

    /**
     * attach event handlers to Readable stream
     * @param {streams.Readable} readStream
     */
    __attachedEventsToReadStream(readStream) {
        readStream.on('data', chunk => {
            this.onProgress(chunk.length);
        });

        readStream.on('error', (err) => {
            this.onError(err);
        });

        readStream.on('end', () => {
            this.onEnd();
        });

        readStream.on('timeout', (err) => {
            this.onError(err);
        })
    }

    /**
     * Get remote file size to be downloaded
     * @param {stream.Readable} response
     * @returns Number
     */
    __getRemoteFileStats(response) {
        return parseInt(response.headers['content-length']);
    }

    /**
     * Returns data value of stream
     * @param {stream} stream
     * @returns stream.Readable
     */
    __getDataValueOfStream(stream) {
        return stream.data;
    }

    __listenForClientRequestEvent(stream) {
        const { req } = stream;
        req.on('abort', (e) => {
            this.onError(e);
        });

        req.on('timeout', (e) => {
            this.onError(e);
        })
    }

}