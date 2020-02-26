import SftpDownloader from "../src/downloader/sftpDownloader";
import URLParser from "../src/parser/urlParser";
import SFTPClient from 'ssh2-sftp-client';
import jest from 'jest-mock'

describe('SFTP Downloader', () => {
    let sftp;
    const DESTINATION = './downloads';
    let URL = "sftp://speedtest:speedtest@sftp.otenet.gr:22/test100k.db";
    const urlParser = new URLParser(URL)
    beforeEach(() => {
        sftp = new SftpDownloader(urlParser, DESTINATION);
    });

    test('SFTP instance', () => {
        expect(sftp instanceof SftpDownloader).toBe(true);
        expect(sftp.sftpClient instanceof SFTPClient).toBe(true);
    });

    test('SFTP config', () => {
        const config = sftp.__getConfig();
        expect(config.host).toBe(urlParser.getHost());
        expect(config.port).toBe(urlParser.getPort());
        expect(config.path).toBe(urlParser.getPath());
        expect(config.protocol).toBe(urlParser.getProtocol());
        expect(config.username).toBe(urlParser.getUsername());
        expect(config.password).toBe(urlParser.getPassword());
        expect(config.remoteFile.name).toBe("test100k.db");
        expect(config.remoteFile.path).toBe("");
        expect(config.href).toBe(urlParser.getUrl());
    });

    describe('SFTP connection', () => {
        let __connectSpy, 
        __startDownloadSpy,
        __getRemoteFileStatsSpy;
        
        
        beforeEach(() => {
            __connectSpy = SftpDownloader.prototype.__connect = jest.fn();

            __startDownloadSpy = SftpDownloader.prototype.__startDownload = jest.fn();
    
            __getRemoteFileStatsSpy = SftpDownloader.prototype.__getRemoteFileStats = jest.fn();
            
            __getRemoteFileStatsSpy.mockReturnValue({ size: 1234 });
    
            sftp.download();
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
    })
});