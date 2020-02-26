import path from 'path';
import fs from 'fs';

export default class LocalFileHandler {
    constructor(fileName, filePath) {
        this.fileName = fileName;
        // default filepath should be ./downloads?
        this.filePath = filePath;
        this._writeStream = this.__createWriteStream();
    }

    getFileName() {
        return this.fileName;
    }

    setFileName(fileName){
        this.fileName = fileName;
    }

    getFilePath() {
        return this.filePath;
    }

    setFilePath(filePath) {
        this.filePath = filePath;
    }

    __createWriteStream() {
        const destination = this.__getDestination();
        return fs.createWriteStream(destination);
    }

    cleanUp() {
        const destination = this.__getDestination();
        try {
            fs.unlinkSync(destination);
        } catch(err) {
            console.log(`error while removing files at ${destination}`);
            console.log(err);
        }
    }
    __getDestination() {
        return path.join(this.getFilePath(), this.getFileName());
    }
    
    getWriteStream() {
        return this._writeStream;
    }

}