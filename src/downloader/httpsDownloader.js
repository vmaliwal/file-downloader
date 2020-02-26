import BaseDownloader from "./baseDownloader";
import axios from "axios";

export default class HttpsDownloader extends BaseDownloader {
    constructor(urlParser, destinationDir) {
        super(urlParser, destinationDir);

        this._progress = 0;
    }

    async download() {
        try {
            this.onStart();

            const { href } = this.getOrigin();
            const stream = await axios.get(href, {responseType: 'stream'});
            const readStream = stream.data;
            const fileStat = this.__getRemoteFileStats(readStream);
    
            this.onDownload(fileStat);
    
            readStream.on('data', chunk => {
                this.onProgress(chunk.length);
            });
    
            readStream.on('error', (err) => {
                this.onError(err);
            });
    
            readStream.on('end', () => {
                this.onEnd();
            });
            const writeStream = this.getWriteStream();
    
            readStream.pipe(writeStream);
        }catch (err) {
            this.onError(err);
        }
        return this;
    }

    __getRemoteFileStats(response) {
        return parseInt(response.headers['content-length']);
    }

}