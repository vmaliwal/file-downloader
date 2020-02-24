import BaseDownloader from "./baseDownloader";
import axios from "axios";

export default class HttpsDownloader extends BaseDownloader {
    constructor(urlParser, destinationDir) {
        super(urlParser, destinationDir);

        this._progress = 0;
    }

    async request() {
        this.onStart();

        const { href } = this.getOrigin();

        this.onDownload();

        const stream = await axios.get(href, {responseType: 'stream'});
        const readStream = stream.data;

        //TODO:::
        // In the base class create methods like onProgress, onStart
        // call this helper methods here rather than emitting events
        // this helper methods like onStart would eventually emit an
        // event. This will provide a standard way of emitting events
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

        return this;
    }

}