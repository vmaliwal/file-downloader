export default class RemoteFileInfo {
    constructor(urlParser) {
        this.__urlParser = urlParser;

        this.fileName = this.getFileName();
        this.filePath = this.getFilePath();
    }

    getFileName() {
        const arr = this.__getPathArray();
        return arr.pop()
    }

    getFilePath() {
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