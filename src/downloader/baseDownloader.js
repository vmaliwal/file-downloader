import EventEmitter from 'events';
import path from 'path';
import RemoteFileInfo from '../file/remoteFileInfo';
import LocalFileHandler from '../file/localFileHandler';
import { DOWNLOAD_EVENTS } from '../config';

/**
 * Base class that all protocols should be extended
 * Internally extends EventEmitter for emitting events
 * at various stages of file download
 */
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
    
    /**
     * Get location data associated with remote file and server
     * @returns Object
     */
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

    /**
     * Get destination information where downloaded file to be saved
     * @returns Object
     */
    getDestination() {
        const fileHandler = this.__getDestinationFileHandler();
        return {
            file: {
                name: fileHandler.getFileName(),
                path: fileHandler.getFilePath(),
                absolutePath: path.join(fileHandler.getFilePath(), fileHandler.getFileName())
            }
        }
    }

    /**
     * Returns write stream of destination
     * @returns stream.Writable
     */
    getWriteStream() {
        return this.destinationFileHandler.getWriteStream();
    }

    /**
     * Removes key with null values
     * @param {object} obj
     * @returns Object
     */
    __removeNull(obj) {
        Object.keys(obj).forEach(key => (obj[key] == null) && delete obj[key]);

        return obj;
    }

    /**
     * Sets up destination directory and file and returns a new usable
     * instance of LocalFileHandler
     * @param {string} destinationDir
     * @returns LocalFileHandler
     */
    __setUpDestination(destinationDir) {
        const remoteFileName = this.remoteFileInfo.getFileName();
        return new LocalFileHandler(remoteFileName, destinationDir);
    }

    /**
     * Calls cleanup method on destination
     */
    cleanUp() {
        this.destinationFileHandler.cleanUp();
    }

    /**
     * Returns property holding LocalFileHandler
     * @returns LocalFileHandler
     */
    __getDestinationFileHandler() {
        return this.destinationFileHandler;
    }

    /**
     * Emit START event along with default stats
     */
    onStart() {
        const stats = this.__getStats();
        this.emit(DOWNLOAD_EVENTS.START, { data: stats });
    }

    /**
     * Emit DOWNLOAD event, update total size of the file to be downloaded
     * @param {number} fileSize 
     */
    onDownload(fileSize) {
        this.__setTotalSize(fileSize);
        const stats = this.__getStats();
        this.emit(DOWNLOAD_EVENTS.DOWNLOAD, { data: stats });
    }

    /**
     * Emit PROGRESS event, and update progress stats
     * @param {number} chunkLength 
     */
    onProgress(chunkLength) {
        const stats = this.__calculateStats(chunkLength);
        this.emit(DOWNLOAD_EVENTS.PROGRESS, { data: stats });
    }

    /**
     * Emit END event and provide updated stats
     */
    onEnd() {
        const stats = this.__getStats();
        this.emit(DOWNLOAD_EVENTS.END, { data: stats });
    }

    /**
     * Emit ERROR event, and provide details about the error
     * @param {Error} err 
     */
    onError(err) {
        this.emit(DOWNLOAD_EVENTS.ERROR, { error: err });
    }

    /**
     * Update progress stats every second
     * @param {number} chunkLength 
     * @returns Object
     */
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

    /**
     * Update to total downloaded size
     * @param {number} chunkLength 
     */
    __updateDownloaded(chunkLength) {
        this.__downloadedSize += chunkLength;
    }

    /**
     * Returns progress as percentage
     * @returns Number
     */
    __calculateProgress() {
        const totalSize = this.__getTotalSize();
        return (this.__downloadedSize/totalSize) * 100;
    }

    /**
     * Returns updated stats
     * @returns Object
     */
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

    /**
     * Returns total size of the file to be downloaded
     * @returns Number
     */
    __getTotalSize() {
        return this.remoteFileInfo.getFileSize();
    }

    /**
     * Setter for setting total size of the file
     * @param {number} size 
     */
    __setTotalSize(size) {
        this.__updateRemoteFileSize(size);
    }

    /**
     * Setter for setting total file size of remote file
     * @param {number} size 
     */
    __updateRemoteFileSize(size) {
        this.remoteFileInfo.setFileSize(size);
    }

    /**
     * Getter for progress
     * @returns Number
     */
    __getProgress() {
        return this.__progress;
    }

    /**
     * Getter for downloadedSize
     * @returns Number
     */
    __getDownloadedSize() {
        return this.__downloadedSize;
    }

    /**
     * Getter to calculate download speed
     * @deprecated
     */
    __getDownloadSpeed() {
        return this.__stats.bytes;
    }
}