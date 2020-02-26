import URLParser from "../src/parser/urlParser";
import HttpsDownloader from "../src/downloader/httpsDownloader";
import jest from 'jest-mock';
import { ObjectReadableMock, ObjectWritableMock } from 'stream-mock';

describe('HTTPS Downloader', () => {
    let https;
    const DESTINATION = './downloads';
    let URL = "https://speed.hetzner.de/100MB.bin";
    
    const urlParser = new URLParser(URL);
    
    beforeEach(() => {
        https = new HttpsDownloader(urlParser, DESTINATION);
    });

    test('HTTPS instance', () => {
        expect(https instanceof HttpsDownloader).toBe(true);
    });

    test('HTTPS config', () => {
        const {protocol, username} = https.getOrigin();
        expect(protocol).toBe("https:");
        expect(username).toBe(undefined);
    });

    describe('HTTPS connection', () => {
        let __makeRequestSpy, __getRemoteFileStatsSpy, getWriteStreamSpy;
        
        beforeEach(() => {
            __makeRequestSpy = HttpsDownloader.prototype.__makeRequest = jest.fn();
            __makeRequestSpy.mockReturnValue(ObjectReadableMock);

            __getRemoteFileStatsSpy = HttpsDownloader.prototype.__getRemoteFileStats = jest.fn();
            __getRemoteFileStatsSpy.mockReturnValue(1234);

            getWriteStreamSpy = HttpsDownloader.prototype.getWriteStream;
            getWriteStreamSpy.mockReturnValue(ObjectReadableMock);

            test('__makeRequest to be called', () => {
                expect(__makeRequestSpy).toHaveBeenCalledTimes(1);
            });

            test('__getRemoteFileStats to be called', () => {
                expect(__getRemoteFileStatsSpy).toHaveBeenCalledTimes(1);
            });

            test('getWriteStream to be called', () => {
                expect(getWriteStreamSpy).toHaveBeenCalledTimes(1);
            });


        });
    });
});

describe.skip('HTTP Downloader', () => {

});