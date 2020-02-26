import BaseDownloader from "./baseDownloader";
import ftp from 'promise-ftp';
import { FTP_CONFIG_DEFAULT } from '../config'

export default class FtpDownloader extends BaseDownloader {
    constructor(urlParser, destinationDir) {
        super(urlParser, destinationDir);

        this.ftpClient = this.__getFreshFtpClient();
    }

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

    __getFreshFtpClient() {
        return new ftp();
    }

    async __connect(ftpClient) {
        const config = this.__getConfig();
        return await ftpClient.connect(config);
    }

    __getConfig() {
        const origin = this.getOrigin();
        const user = origin.username || FTP_CONFIG_DEFAULT.user
        return {
            ...FTP_CONFIG_DEFAULT,
            ...origin,
            user: user
        }
    }

    async __getRemoteFileStats(ftpClient) {
        const { path: remotePath } = this.getOrigin();
        return await ftpClient.size(remotePath);
    }

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