import EventEmitter from 'events';
import path from 'path';
import RemoteFileInfo from '../file/remoteFileInfo';
import LocalFileHandler from '../file/localFileHandler';
import { DOWNLOAD_EVENTS } from '../config';

export default class BaseRequester extends EventEmitter {
    constructor(urlParser, destinationDir) {
        super();

        this.urlParser = urlParser;
        this.remoteFileInfo = new RemoteFileInfo(urlParser);
        this.destinationFileHandler = this.__setUpDestination(destinationDir);
        this.events = DOWNLOAD_EVENTS;
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

    getWriteStream() {
        return this.destinationFileHandler.getWriteStream();
    }

    __removeNull(obj) {
        Object.keys(obj).forEach(key => (obj[key] == null) && delete obj[key]);

        return obj;
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