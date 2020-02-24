import BaseRequester from "./baseRequester";
import axios from "axios";

export default class HttpsRequester extends BaseRequester {
    constructor(urlParser) {
        super(urlParser);
    }

    async request() {
        const { href } = this.getOrigin();
        const stream = await axios.get(href, {responseType: 'stream'});

        this.__request = stream;

        this.setRequestStream(stream.request);
        this.setResponseStream(stream.data);

        return this;
    }

    // remote file information should include its size   
}