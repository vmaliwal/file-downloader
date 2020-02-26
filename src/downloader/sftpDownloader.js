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

    
    async __connect(sftpClient) {
        const config = this.__getConfig();
        await sftpClient.connect(config);
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

    async __getRemoteFileStats(sftpClient) {
       const { path: remotePath } = this.getOrigin();
       return await sftpClient.stat(remotePath);
    }

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

    __startDownload(sftpClient) {
        const { path: remotePath } = this.getOrigin();
        const { file: destinationFile } = this.getDestionation();
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