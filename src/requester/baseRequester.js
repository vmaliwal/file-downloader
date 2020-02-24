import EventEmitter from 'events';
import RemoteFileInfo from '../file/remoteFileInfo';

export default class BaseRequester extends EventEmitter {
    constructor(urlParser) {
        super();
        this.__request = null;

        this.urlParser = urlParser;
        this.remoteFileInfo = new RemoteFileInfo(urlParser);

        this.requestStream = null;
        this.responseStream = null;
    }
    
    getOrigin() {
        const origin = {
            host: this.urlParser.getHost(),
            port: this.urlParser.getPort(),
            path: this.urlParser.getPath(),
            protocol: this.urlParser.getProtocol(),
            username: this.urlParser.getUsername(),
            password: this.urlParser.getPassword(),
            remoteFile: {
                name: this.remoteFileInfo.getFileName(),
                path: this.remoteFileInfo.getFilePath()
            },
            href: this.urlParser.getUrl()
        }

        return this.__removeNull(origin);
    }

    __removeNull(obj) {
        Object.keys(obj).forEach(key => (obj[key] == null) && delete obj[key]);

        return obj;
    }

    getRequestStream() {
        return this.requestStream;
    }

    setRequestStream(stream) {
        this.requestStream = stream;
    }

    getResponseStream() {
        return this.responseStream;
    }

    setResponseStream(stream) {
        this.responseStream = stream;
    }

    __setRquest(request) {
        this.__request = request;
    }

    __getRequest() {
        return this.__request;
    }
}