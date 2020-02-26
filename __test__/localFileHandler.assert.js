import LocalFileHandler from "../src/file/localFileHandler";
import { makeDir, removeDir, checkLocalPathExist } from "../src/file/fileUtils";
import path from 'path';
import { Writable } from "stream";

describe('Local File Handler', () => {
    let fileHandler;
    const FILENAME = 'TEST_FILE';
    const LOCATION = './downloads';
    
    beforeEach(() => {
        makeDir(LOCATION);
        fileHandler = new LocalFileHandler(FILENAME, LOCATION);
    });

    afterEach(() => {
        removeDir(LOCATION);
    })

    test('file attributes', () => {
        expect(fileHandler.getFileName()).toBe(FILENAME);
        expect(fileHandler.getFilePath()).toBe(LOCATION);
        expect(fileHandler.__getDestination()).toBe(path.join(LOCATION, FILENAME));
    });

    test('write stream', () => {
        const writeStream = fileHandler.getWriteStream();
        expect(writeStream).not.toBeNull();
        expect(writeStream instanceof Writable).toBe(true);
    });

    test('clean up', () => {
        const path = fileHandler.__getDestination();
        expect(checkLocalPathExist(path)).toBe(true);
        fileHandler.cleanUp();
        expect(checkLocalPathExist(path)).toBe(false);
    })
});