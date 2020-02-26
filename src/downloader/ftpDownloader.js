import BaseDownloader from "./baseDownloader";
import ftp from 'promise-ftp';
import { FTP_CONFIG_DEFAULT } from '../config'

export default class FtpDownloader extends BaseDownloader {
    constructor(urlParser, destinationDir) {
        super(urlParser, destinationDir);

        this.ftpClient = this.__getFreshFtpClient();
    }

    async request() {
        try {
            const { path: remotePath } = this.getOrigin();
            await this.__connect();
            this.onStart();
    
            const fileStat = await this.__getRemoteFileStats();
            this.onDownload(fileStat);            
    
            const readStream = await this.ftpClient.get(remotePath);
    
            readStream.on('data', chunk => {
                this.onProgress(chunk.length);
            });
    
            readStream.on('error', (err) => {
                this.onError(err);
            });
    
            readStream.on('end', () => {
                this.ftpClient.end();
                this.onEnd();
            });
    
            const writeStream = this.getWriteStream();
            readStream.pipe(writeStream);
    
        } catch (e) {
            this.onError(e);
        }
        
        return this;

    }

    __getFreshFtpClient() {
        return new ftp();
    }

    async __connect() {
        const config = this.__getConfig();
        return await this.ftpClient.connect(config);
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

    async __getRemoteFileStats() {
        const { path: remotePath } = this.getOrigin();
        return await this.ftpClient.size(remotePath);
    }
}