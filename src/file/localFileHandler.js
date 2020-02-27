import path from 'path';
import fs from 'fs';

/**
 * File handler for local disk
 */
export default class LocalFileHandler {
    constructor(fileName, filePath) {
        this.fileName = fileName;
        // default filepath should be ./downloads?
        this.filePath = filePath;
        this._writeStream = this.__createWriteStream();
    }

    /**
     * Getter for fileName
     * @returns string
     */
    getFileName() {
        return this.fileName;
    }

    /**
     * Setter for fileName
     * @param {string} fileName 
     */
    setFileName(fileName){
        this.fileName = fileName;
    }

    /**
     * Getter for filePath
     * @returns string
     */
    getFilePath() {
        return this.filePath;
    }

    /**
     * setter for filePath
     * @param {string} filePath 
     */
    setFilePath(filePath) {
        this.filePath = filePath;
    }

    /**
     * creates a Writable stream 
     * @returns stream.Writable
     */
    __createWriteStream() {
        const destination = this.__getDestination();
        return fs.createWriteStream(destination);
    }

    /**
     * Removes file from locally
     */
    cleanUp() {
        const destination = this.__getDestination();
        try {
            fs.unlinkSync(destination);
        } catch(err) {
            console.log(`error while removing files at ${destination}`);
            console.log(err);
        }
    }

    /**
     * Get destination path
     * @returns string
     */
    __getDestination() {
        return path.join(this.getFilePath(), this.getFileName());
    }
    
    /**
     * Getter for write stream
     * @returns stream.Writable
     */
    getWriteStream() {
        return this._writeStream;
    }

}