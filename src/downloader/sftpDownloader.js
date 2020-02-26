import BaseDownloader from './baseDownloader';
import Client from 'ssh2-sftp-client';
import { SFTP_CONFIG_DEFAULT } from '../config';


export default class SftpDownloader extends BaseDownloader {
    constructor(urlParser, destionationDir) {
        super(urlParser, destionationDir);
        this.sftpClient = this.__getFreshSftpClient()
    }

    async download() {
        try {    
            this.__initClientListeners();
            await this.__connect();
    
            const fileStat = await this.__getRemoteFileStats();
            this.onDownload(fileStat.size);
    
            this.__startDownload();

        } catch (err) {
            this.onError(err);
        }

        return this;
    }

    
    async __connect() {
        const config = this.__getConfig();
        await this.sftpClient.connect(config);
    }

    __getFreshSftpClient() {
        return new Client();
    }
    __getConfig() {
        return {
            ...SFTP_CONFIG_DEFAULT,
            ...this.getOrigin(),
        }
    }

    async __getRemoteFileStats() {
       const { path: remotePath } = this.getOrigin();
       return await this.sftpClient.stat(remotePath);
    }

    __initClientListeners() {
        this.sftpClient.on('connect', () => {
            this.onStart();
        });

        this.sftpClient.on('error', (err) => {
            this.onError(err);
        });

        this.sftpClient.on('end', () => {
            this.onEnd();
        });
    }

    __startDownload() {
        const { path: remotePath } = this.getOrigin();
        const { file: destinationFile } = this.getDestionation();
        const { absolutePath: destinationPath } = destinationFile;

        this.sftpClient
        .fastGet(remotePath, destinationPath,  {
            step: (total_transferred, chunk) => {    
                // emit event progress
                this.onProgress(chunk);
            }
        })
        .then(() => {
            this.sftpClient.end();
        })
        .catch(err => {
            this.onError(err);
        });
    }
}