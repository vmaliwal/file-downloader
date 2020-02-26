import BaseDownloader from "../src/downloader/baseDownloader";
import URLParser from "../src/parser/urlParser";
import RemoteFileInfo from "../src/file/remoteFileInfo";
import LocalFileHandler from "../src/file/localFileHandler";

describe('BASE Downloader', () => {

    let downloader;
    const DESTINATION = './downloads';
    let URL = "sftp://speeduser:speedtest@sftp.otenet.gr:22/abc/test100k.db";
    const urlParser = new URLParser(URL);


    beforeEach(() => {
        downloader = new BaseDownloader(urlParser, DESTINATION);
    });

    test('Base Downloader instance', () => {
        expect(downloader instanceof BaseDownloader).toBe(true);
        expect(downloader.urlParser instanceof URLParser).toBe(true);
        expect(downloader.remoteFileInfo instanceof RemoteFileInfo).toBe(true);
        expect(downloader.destinationFileHandler instanceof LocalFileHandler).toBe(true);
    });

    test('getOrigin method', () => {
        const origin = downloader.getOrigin();
        const host = `sftp.otenet.gr`;
        const port = `22`;
        const path = `/abc/test100k.db`;
        const protocol = `sftp:`;
        const username = `speeduser`;
        const password = `speedtest`;
        const remoteFileName = `test100k.db`;
        const remoteFilePath = `/abc`;
        const href = `sftp://speeduser:speedtest@sftp.otenet.gr:22/abc/test100k.db`;

        expect(origin.host).toBe(host);
        expect(origin.port).toBe(port);
        expect(origin.path).toBe(path);
        expect(origin.protocol).toBe(protocol);
        expect(origin.username).toBe(username);
        expect(origin.password).toBe(password);
        expect(origin.remoteFile.name).toBe(remoteFileName);
        expect(origin.remoteFile.path).toBe(remoteFilePath);
        expect(origin.href).toBe(href);
    });

    test('getDestination method', () => {
        const { file: destination } = downloader.getDestination();
        const name = `test100k.db`;
        const path = `./downloads`;
        const absPath = `downloads/test100k.db`;

        expect(destination.name).toBe(name);
        expect(destination.path).toBe(path);
        expect(destination.absolutePath).toBe(absPath);
    });
});