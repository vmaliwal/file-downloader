import * as URL from 'url';

/**
 * Utility class to parse URLs
 */
export default class URLParser {
    constructor(url) {
        this.url = URL.parse(url);
    }

    getUrl(){
        return this.url.href;
    }

    getProtocol() {
        return this.url.protocol;
    }

    getHost() {
        return this.url.hostname;
    }

    getPath() {
        return this.url.pathname;
    }

    getPort() {
        return this.url.port;
    }

    getUsername() {
        const auth = this.__splitAuth(":");
        if (!auth || auth.length === 0) return;
        
        return auth[0];
    }

    getPassword() {
        const auth = this.__splitAuth(":");
        if (!auth || auth.length === 0) return;
        
        return auth[1];
    }

    __getAuth() {
        return this.url.auth;
    }

    __splitAuth(str) {
        const authString = this.__getAuth();
        return (authString) ? authString.split(str) : null
    }
}