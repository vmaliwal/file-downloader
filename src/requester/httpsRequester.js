import BaseRequester from "./baseRequester";
import axios from "axios";

export default class HttpsRequester extends BaseRequester {
    constructor(urlParser, destinationDir) {
        super(urlParser, destinationDir);

        this._progress = 0;
    }

    async request() {

        const { START, DOWNLOAD, PROGRESS, ERROR, END } = this.events

        this.emit(START, { msg: "start downloading" });
        const { href } = this.getOrigin();
        this.emit(DOWNLOAD, { msg: "Begin download" });
        const stream = await axios.get(href, {responseType: 'stream'});

        const readStream = stream.data;

        //TODO:::
        // In the base class create methods like onProgress, onStart
        // call this helper methods here rather than emitting events
        // this helper methods like onStart would eventually emit an
        // event. This will provide a standard way of emitting events
        readStream.on('data', chunk => {
            this._progress += chunk.length;
            this.emit(PROGRESS, { msg: this._progress });
        });

        readStream.on('error', (err) => {
            this.emit(ERROR, { error: err });
        });

        readStream.on('end', () => {
            this.emit(END, { msg: `ended` });
        });
        const writeStream = this.getWriteStream();

        readStream.pipe(writeStream);

        return this;
    }

}