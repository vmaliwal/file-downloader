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
        this.__totalSize = this.__getTotalSize();
        this.__downloadedSize = 0;
        this.__stats = {
            time: 0,
            bytes: 0,
            prevBytes: 0
        }
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
        const stats = this.__getStats();
        this.emit(DOWNLOAD_EVENTS.START, { data: stats });
    }

    onDownload(fileSize) {
        this.__setTotalSize(fileSize);
        const stats = this.__getStats();
        this.emit(DOWNLOAD_EVENTS.DOWNLOAD, { data: stats });
    }

    onProgress(chunkLength) {
        const stats = this.__calculateStats(chunkLength);
        this.emit(DOWNLOAD_EVENTS.PROGRESS, { data: stats });
    }

    onEnd() {
        const stats = this.__getStats();
        this.emit(DOWNLOAD_EVENTS.END, { data: stats });
    }

    onError(err) {
        this.emit(DOWNLOAD_EVENTS.ERROR, { error: err });
    }

    __calculateStats(chunkLength) {
        const now = new Date();
        const timeSoFar = now - this.__stats.time;
        const totalSize = this.__getTotalSize();
        const downloadedSize = this.__getDownloadedSize();

        this.__updateDownloaded(chunkLength);

        this.__progress = this.__calculateProgress();

        if (downloadedSize === totalSize || timeSoFar > 1000) {
            this.__stats.time = now;
            this.__stats.bytes = downloadedSize - this.__stats.prevBytes;
            this.__stats.prevBytes = downloadedSize;
        }

        return this.__getStats();
    }

    __updateDownloaded(chunkLength) {
        this.__downloadedSize += chunkLength;
    }

    __calculateProgress() {
        const totalSize = this.__getTotalSize();
        return (this.__downloadedSize/totalSize) * 100;
    }

    __getStats() {
        const fileName = this.destinationFileHandler.getFileName();
        const filePath = this.destinationFileHandler.getFilePath();

        return {
            total: this.__getTotalSize(),
            name: fileName,
            path: filePath,
            downloaded: this.__getDownloadedSize(),
            progress: this.__getProgress(),
            speed: this.__getDownloadSpeed()
        }
    }

    __getTotalSize() {
        return this.remoteFileInfo.getFileSize();
    }

    __setTotalSize(size) {
        this.__updateRemoteFileSize(size);
    }

    __updateRemoteFileSize(size) {
        this.remoteFileInfo.setFileSize(size);
    }

    __getProgress() {
        return this.__progress;
    }

    __getDownloadedSize() {
        return this.__downloadedSize;
    }

    __getDownloadSpeed() {
        return this.__stats.bytes;
    }
}