export default class RemoteFileInfo {
    constructor(urlParser) {
        this.__urlParser = urlParser;

        this.fileName = this.__getFileName();
        this.filePath = this.__getFilePath();
    }

    getFileName() {
        return this.fileName;
    }

    getFilePath() {
        return this.filePath;
    }

    __getFileName() {
        const arr = this.__getPathArray();
        return arr.pop()
    }

    __getFilePath() {
        const arr = this.__getPathArray();
        // discard file name
        arr.pop()
        return arr.join("/");
    }

    __getPathArray() {
        const path = this.__urlParser.getPath();
        return path.split("/");
    }
}