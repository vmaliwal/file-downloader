import EventEmitter from 'events';
import path from 'path';
import RemoteFileInfo from '../file/remoteFileInfo';
import LocalFileHandler from '../file/localFileInfo';

export default class BaseRequester extends EventEmitter {
    constructor(urlParser, destinationDir) {
        super();
        this.__request = null;

        this.urlParser = urlParser;
        this.remoteFileInfo = new RemoteFileInfo(urlParser);
        this.destinationFileHandler = this.__setUpDestination(destinationDir);

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

    getDestionation() {
        const fileHandler = this.__getDestinationFileHandler();
        return {
            file: {
                name: fileHandler.getFileName(),
                path: fileHandler.getFilePath(),
                absolutePath: path.join(fileHandler.getFilePath(), fileHandler.getFileName())
            }
        }
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

    // destination dir should be a path object
    __setUpDestination(destinationDir) {
        const remoteFileName = this.remoteFileInfo.getFileName();

        return new LocalFileHandler(remoteFileName, destinationDir);

    }

    cleanUp() {
        this.destinationFileHandler.cleanUp();
    }

    __getDestinationFileHandler() {
        return this.destinationFileHandler;
    }
}