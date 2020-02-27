import cli from 'cli-ux';
import Url from 'url';
import { DEFAULT_URLS, DEFAULT_DESTINATION_DIR } from '../config';

/**
 * Class to show prompts to user
 */
export default async function DownloaderCli (){
    const downloadLocation = await promptDownloadLocation();
    const downloadUrls = await promptDownloadUrls();
    const urlArray = parseUrls(downloadUrls);

    async function promptDownloadLocation() {
        const txt = `Enter download location?`;
        return await cli.prompt(txt, {default: DEFAULT_DESTINATION_DIR});
    }

    async function promptDownloadUrls() {
        const txt = `Enter URLs to be downloaded seperated by comma (',')?`;
        const defaults = {
            default: DEFAULT_URLS
        }

        return await cli.prompt(txt, defaults);
    }

    function parseUrls(urls) {
        return urls.split(",").filter(url => validateUrl(url)).map(url => url.trim());
    }

    // check if URL is valid
    function validateUrl(url) {
        const { href, host } = Url.parse(url);
        return (href !== "" && host !== null);
    }

    return {
        downloadLocation: downloadLocation,
        urls: urlArray
    }
}