import BaseDownloader from "../src/downloader/baseDownloader";
import URLParser from "../src/parser/urlParser";
import RemoteFileInfo from "../src/file/remoteFileInfo";
import LocalFileHandler from "../src/file/localFileHandler";
import { DOWNLOAD_EVENTS } from "../src/config";

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

    describe('Test event emmitters', () => {
        const name = `test100k.db`;
        let size, chunkLength;

        beforeEach(() => {
            size = 1234;
            chunkLength = 12;
        });

        test('on start event', (done) => {
            downloader.on(DOWNLOAD_EVENTS.START, ({data}) => {
                expect(data).not.toBe(null);
                expect(data.name).toBe(name);
                expect(data.progress).toBe(0);
                done();
            })
            downloader.onStart();
        });

        test('on download event', (done) => {
            downloader.on(DOWNLOAD_EVENTS.DOWNLOAD, ({data}) => {
                expect(data.total).toBe(size);
                done();
            });
            downloader.onDownload(size);
        });

        test('on progress event', (done) => {
            downloader.on(DOWNLOAD_EVENTS.PROGRESS, ({data}) => {
                expect(data.progress).toBe(downloader.__calculateProgress());
                done();
            });
            downloader.onDownload(size);
            downloader.onProgress(chunkLength);
        });

        test('on end event', (done) => {
            downloader.on(DOWNLOAD_EVENTS.END, ({data}) => {
                expect(data.downloaded).toBe(chunkLength+chunkLength);
                done();
            });
            downloader.onDownload(size);
            downloader.onProgress(chunkLength);
            downloader.onProgress(chunkLength);
            downloader.onEnd();
        });

        test('on error event', (done) => {
            const err = new Error("Random error");
            downloader.on(DOWNLOAD_EVENTS.ERROR, (data) => {
                expect(data.error).toBe(err);
                done();
            });
            downloader.onError(err);
        });
    })
});