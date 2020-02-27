import UrlParser from '../parser/urlParser';
import HttpsDownloader from './httpsDownloader';
import SftpDownloader from './sftpDownloader';
import FtpDownloader from './ftpDownloader';

/**
 * Factory funtion to return relevant downloader based of provided URL
 * @param {string} url 
 * @param {string} destinationFolder 
 * @returns @instance BaseDownloader
 */
export default function createDownloader(url, destinationFolder) {
    const _url = url;
    const _destinationFolder = destinationFolder;

    /**
     * Initialize UrlParser
     * @param {string} url 
     * @returns @instance UrlParser
     */
    const initUrlParser = (url=_url) => {
        return new UrlParser(url);
    }

    /**
     * Intitialize downloader based on protocol parsed by UrlParser
     * @param {UrlParser} urlParser 
     * @param {string} destination 
     * @returns @instance BaseDownloader
     */
    const initDownloader = (urlParser, destination = _destinationFolder) => {
        const protocol = urlParser.getProtocol();
        if (!protocol) new Error("Protocol not supported");

        if (protocol.indexOf("http:") !== -1 || protocol.indexOf("https:") !== -1) 
            return new HttpsDownloader(urlParser, destination);
        else if (protocol.indexOf("sftp:") !== -1) 
            return new SftpDownloader(urlParser, destination);
        else if (protocol === "ftp:")
            return new FtpDownloader(urlParser, destination);
        else throw new Error("Protocol not supported");
    }

    const parser = initUrlParser();
    
    return initDownloader(parser);
}