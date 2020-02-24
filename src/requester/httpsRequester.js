import BaseRequester from "./baseRequester";
import axios from "axios";

export default class HttpsRequester extends BaseRequester {
    constructor(urlParser, destinationDir) {
        super(urlParser, destinationDir);

        this._progress = 0;
    }

    async request() {
        this.emit('START', { msg: "start downloading" });
        const { href } = this.getOrigin();
        this.emit('DOWNLOAD', { msg: "Begin download" });
        const stream = await axios.get(href, {responseType: 'stream'});

        const readStream = stream.data;

        readStream.on('data', chunk => {
            this._progress += chunk.length;
            this.emit('PROGRESS', { msg: this._progress });
        });

        readStream.on('error', (err) => {
            this.emit('ERROR', { error: error })
        });

        readStream.on('end', () => {
            this.emit('END', { msg: `ended` });
        });
        const writeStream = this.getWriteStream();

        readStream.pipe(writeStream);

        return this;
    }

}