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
            default: "sftp://test.rebex.net/readme.txt, https://speed.hetzner.de/100MB.bin"
        }

        return await cli.prompt(`Enter URLs to be downloaded seperated by ',' (for example -  http://my.file.com/file.jpg, ftp://other.file.com/other.bin, sftp://and.also.this/ending.txt)`, defaults);
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