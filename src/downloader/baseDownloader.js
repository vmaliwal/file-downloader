import EventEmitter from 'events';
import path from 'path';
import RemoteFileInfo from '../file/remoteFileInfo';
import LocalFileHandler from '../file/localFileHandler';
import { DOWNLOAD_EVENTS } from '../config';

export default class BaseDownloader extends EventEmitter {
    constructor(urlParser, destinationDir) {
        super();

        this.urlParser = urlParser;
        this.remoteFileInfo = new RemoteFileInfo(urlParser);
        this.destinationFileHandler = this.__setUpDestination
        (destinationDir);

        this.__progress = 0;
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

    onStart() {
        this.emit(DOWNLOAD_EVENTS.START, { msg: "start downloading" });
    }

    onDownload() {
        this.emit(DOWNLOAD_EVENTS.DOWNLOAD, { msg: "Begin download" });
    }

    onProgress(progress) {
        this.__progress += progress;
        this.emit(DOWNLOAD_EVENTS.PROGRESS, { msg: this.__progress });
    }

    onEnd() {
        this.emit(DOWNLOAD_EVENTS.END, { msg: `ended` });
    }

    onError(err) {
        this.emit(DOWNLOAD_EVENTS.ERROR, { error: err });
    }
}