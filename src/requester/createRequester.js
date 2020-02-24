import UrlParser from '../urlParser';
import HttpsRequester from './httpsRequester';
import SftpRequester from './sftpRequester';
import FtpRequester from './sftpRequester';

export default function createRequester(url, destinationFolder) {
    const _url = url;
    const _destinationFolder = destinationFolder;

    const initUrlParser = (url=_url) => {
        return new UrlParser(url);
    }

    const initDownloader = (urlParser, destination = _destinationFolder) => {
        const protocol = urlParser.getProtocol();
        if (!protocol) new Error("Protocol not supported");

        if (protocol.indexOf("http:") !== -1 || protocol.indexOf("https:") !== -1) 
            return new HttpsRequester(urlParser, destination);
        else if (protocol.indexOf("sftp:") !== -1) 
            return new SftpRequester(urlParser, destination);
        else if (protocol === "ftp:")
            return new SftpRequester(urlParser, destination);
        else throw new Error("Protocol not supported");
    }

    const parser = initUrlParser();
    
    return initDownloader(parser);
}