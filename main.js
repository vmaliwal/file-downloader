import SftpRequester from "./src/requester/sftpRequester";
import URLParser from "./src/UrlParser";

const Main = async () => {
    console.log("Welcome to Multi File Downloader");

    const url = new URLParser("sftp://test.rebex.net/readme.txt");
    const requester = new SftpRequester(url);

    await requester.request();
}
Main();

export default Main;
