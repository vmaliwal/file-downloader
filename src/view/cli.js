import cli from 'cli-ux'

export default async function DownloaderCli (){

    const downloadLocation = await promptDownloadLocation();
    const downloadUrls = await promptDownloadUrls();
    const urlArray = parseUrls(downloadUrls);

    async function promptDownloadLocation() {
        return await cli.prompt(`Enter download location?`, {default: './downloads'});
    }

    async function promptDownloadUrls() {    
        const defaults = {
            default: `
            https://speed.hetzner.de/100MB.bin,
            ftp://speedtest:speedtest@ftp.otenet.gr/test100Mb.db,
            http://speedtest.ftp.otenet.gr/files/test100k.db,
            sftp://demo-user:demo-user@demo.wftpserver.com:2222/download/manual_en.pdf,
            sftp://demo-user:demo-user@demo.wftpserver.com:2222/download/wftpserver-mac-i386.tar.gz
            `
        }

        return await cli.prompt(`Enter URLs to be downloaded seperated by comma (',')`, defaults);
    }

    // convert provided urls into array
    function parseUrls(urls) {
        return urls.split(",").map(url => url.trim());
    }

    // check if URL is valid
    const validateUrls = () => {

    }

    return {
        downloadLocation: downloadLocation,
        urls: urlArray
    }
}