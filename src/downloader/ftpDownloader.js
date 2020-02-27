import BaseDownloader from "./baseDownloader";
import FTP from 'promise-ftp';
import { FTP_CONFIG_DEFAULT } from '../config'

/**
 * Downloader for FTP protocol that extends BaseDownloader
 */
export default class FtpDownloader extends BaseDownloader {
    constructor(urlParser, destinationDir) {
        super(urlParser, destinationDir);

        this.ftpClient = this.__getFreshFtpClient();
    }

    /**
     * Implements download method that requests to remote server
     * and saves the file at provided destination directory
     */
    async download() {
        try {
            await this.__connect(this.ftpClient);
            this.onStart();
    
            const fileSize = await this.__getRemoteFileStats(this.ftpClient);
            this.onDownload(fileSize);            
           
            this.__startDownload(this.ftpClient);
    
        } catch (e) {
            this.onError(e);
        }
        
        return this;

    }

    /**
     * Returns a new FTP client instance everytime
     * @returns @instance FTP
     */
    __getFreshFtpClient() {
        return new FTP();
    }

    /**
     * Connect to remote FTP server with provided config
     * @param {FTP} ftpClient
     * @returns Promise<Object>
     */
    async __connect(ftpClient) {
        const config = this.__getConfig();
        return await ftpClient.connect(config);
    }

    /**
     * Get default config, or evaluate based on provided URL
     * @returns Object
     */
    __getConfig() {
        const origin = this.getOrigin();
        const user = origin.username || FTP_CONFIG_DEFAULT.user
        return {
            ...FTP_CONFIG_DEFAULT,
            ...origin,
            user: user
        }
    }

    /**
     * Get file stats from remote sever
     * @param {FTP} ftpClient
     * @returns Number
     */
    async __getRemoteFileStats(ftpClient) {
        const { path: remotePath } = this.getOrigin();
        return await ftpClient.size(remotePath);
    }

    /**
     * Download and pipe to write stream
     * @param {FTP} ftpClient 
     */
    async __startDownload(ftpClient) {
        const { path: remotePath } = this.getOrigin();
        const readStream = await ftpClient.get(remotePath);
    
        readStream.on('data', chunk => {
            this.onProgress(chunk.length);
        });

        readStream.on('error', (err) => {
            this.onError(err);
        });

        readStream.on('end', () => {
            ftpClient.end();
            this.onEnd();
        });

        const writeStream = this.getWriteStream();
        readStream.pipe(writeStream);
    }
}