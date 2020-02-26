import URLParser from "../src/parser/urlParser";

describe('URL Parser', () => {
    const URL = "ftp://speedtest:speedtest@ftp.otenet.gr:21/test100Mb.db";
    let parser;
    beforeEach(() => {
        parser = new URLParser(URL);
    });

    test('URL methods', () => {
        expect(parser.getUrl()).toBe(URL);
        expect(parser.getProtocol()).toBe("ftp:");
        expect(parser.getHost()).toBe("ftp.otenet.gr");
        expect(parser.getPath()).toBe("/test100Mb.db");
        expect(parser.getPort()).toBe("21");
        expect(parser.getUsername()).toBe("speedtest");
        expect(parser.getPassword()).toBe("speedtest");
    });

});