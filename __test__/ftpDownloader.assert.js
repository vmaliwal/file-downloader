import FtpDownloader from "../src/downloader/ftpDownloader";
import URLParser from "../src/parser/urlParser";
import FTPClient from 'promise-ftp';
import jest from 'jest-mock';

describe('FTP Downloader', () => {
    let ftp;
    const DESTINATION = './downloads';
    let URL = "ftp://speeduser:speedtest@sftp.otenet.gr:21/test100k.db";
    const urlParser = new URLParser(URL);
    
    beforeEach(() => {
        ftp = new FtpDownloader(urlParser, DESTINATION);
    });

    test('FTP instance', () => {
        expect(ftp instanceof FtpDownloader).toBe(true);
        expect(ftp.ftpClient instanceof FTPClient).toBe(true);
    });

    test('FTP config', () => {
        const config = ftp.__getConfig();
        expect(config.host).toBe(urlParser.getHost());
        expect(config.user).toBe(urlParser.getUsername());
        expect(config.password).toBe(urlParser.getPassword());
    });

    describe('FTP connection', () => {
        let __connectSpy, 
        __startDownloadSpy,
        __getRemoteFileStatsSpy;

        beforeEach(() => {
            __connectSpy = FtpDownloader.prototype.__connect = jest.fn();

            __startDownloadSpy = FtpDownloader.prototype.__startDownload = jest.fn();
    
            __getRemoteFileStatsSpy = FtpDownloader.prototype.__getRemoteFileStats = jest.fn();
            
            __getRemoteFileStatsSpy.mockReturnValue(1234);
    
            ftp.download();
        });

        afterAll(() => {
            jest.resetAllMocks();
        });

        test('__connectSpy to be called', () => {
            expect(__connectSpy).toHaveBeenCalledTimes(1);
        });

        test('__getRemoteFileStatsSpy to be called', () => {
            expect(__getRemoteFileStatsSpy).toHaveBeenCalledTimes(1);
        });
        test('__startDownloadSpy to be called', () => {
            expect(__startDownloadSpy).toHaveBeenCalledTimes(1);
        });

    });
});