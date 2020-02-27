import BaseDownloader from './baseDownloader';
import Client from 'ssh2-sftp-client';
import { SFTP_CONFIG_DEFAULT } from '../config';

/**
 * Downloader for SFTP protocol that extends BaseDownloader
 */
export default class SftpDownloader extends BaseDownloader {
    constructor(urlParser, destionationDir) {
        super(urlParser, destionationDir);
        this.sftpClient = this.__getFreshSftpClient()
    }
    /**
     * Implements download method that requests to remote server
     * and saves the file at provided destination directory
     */
    async download() {
        try {    
            this.__initClientListeners(this.sftpClient);
            await this.__connect(this.sftpClient);
    
            const fileStat = await this.__getRemoteFileStats(this.sftpClient);
            this.onDownload(fileStat.size);
    
            this.__startDownload(this.sftpClient);

        } catch (err) {
            this.onError(err);
        }

        return this;
    }

    /**
     * Connects to remote SFTP server with provided config
     * @param {Client} sftpClient 
     */
    async __connect(sftpClient) {
        const config = this.__getConfig();
        await sftpClient.connect(config);
    }

    /**
     * Get new instace of Client every time
     */
    __getFreshSftpClient() {
        return new Client();
    }

    /**
     * Get default config, or evaluate based on provided URL
     */

    __getConfig() {
        return {
            ...SFTP_CONFIG_DEFAULT,
            ...this.getOrigin(),
        }
    }

    /**
     * Get remote file stats from remote server
     * @param {Client} sftpClient 
     */
    async __getRemoteFileStats(sftpClient) {
       const { path: remotePath } = this.getOrigin();
       return await sftpClient.stat(remotePath);
    }

    /**
     * Initialize event listeners for SFTP
     * @param {Client} sftpClient 
     */
    __initClientListeners(sftpClient) {
        sftpClient.on('connect', () => {
            this.onStart();
        });

        sftpClient.on('error', (err) => {
            this.onError(err);
        });

        sftpClient.on('end', () => {
            this.onEnd();
        });
    }

    /**
     * Get data from remote sever and save to provided
     * destination directory
     * @param {Client} sftpClient 
     */
    __startDownload(sftpClient) {
        const { path: remotePath } = this.getOrigin();
        const { file: destinationFile } = this.getDestination();
        const { absolutePath: destinationPath } = destinationFile;

        sftpClient
        .fastGet(remotePath, destinationPath,  {
            step: (_, chunk) => {    
                // emit event progress
                this.onProgress(chunk);
            }
        })
        .then(() => {
            sftpClient.end();
        })
        .catch(err => {
            this.onError(err);
        });
    }
}