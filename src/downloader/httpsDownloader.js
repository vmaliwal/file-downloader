import BaseDownloader from "./baseDownloader";
import axios from "axios";

export default class HttpsDownloader extends BaseDownloader {
    constructor(urlParser, destinationDir) {
        super(urlParser, destinationDir);
    }

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
    
            readStream.pipe(writeStream);
        }catch (err) {
            console.log(err);
            this.onError(err);
        }
        return this;
    }

    async __makeRequest(href) {
        return await axios.get(href, {responseType: 'stream'});
    }

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
    }

    __getRemoteFileStats(response) {
        return parseInt(response.headers['content-length']);
    }

    __getDataValueOfStream(stream) {
        return stream.data;
    }

}