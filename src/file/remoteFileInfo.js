/**
 * Utility class to handle Remote File Information
 */
export default class RemoteFileInfo {
    constructor(urlParser) {
        this.__urlParser = urlParser;

        this.fileName = this.__getFileName();
        this.filePath = this.__getFilePath();
        this.fileSize = 0;
    }

    /**
     * Getter for fileName
     * @returns String
     */
    getFileName() {
        return this.fileName;
    }

    /**
     * Getter for filePath
     * @returns String
     */
    getFilePath() {
        return this.filePath;
    }

    /**
     * Getter for fileSize
     * @returns Number
     */
    getFileSize() {
        return this.fileSize;
    }

    /**
     * Setter for fileSize
     * @param {number} size 
     */
    setFileSize(size) {
        this.fileSize = size;
    }

    /**
     * Evaluate fileName and return the name
     * @returns String
     */
    __getFileName() {
        const arr = this.__getPathArray();
        return arr.pop()
    }

    /**
     * Returns fully qualified path from path array
     * @returns string
     */
    __getFilePath() {
        const arr = this.__getPathArray();
        // discard file name
        arr.pop()
        return arr.join("/");
    }

    /**
     * Split string by /
     * @returns Array<String>
     */
    __getPathArray() {
        const path = this.__urlParser.getPath();
        return path.split("/");
    }
}