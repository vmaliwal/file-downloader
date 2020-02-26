export const SFTP_CONFIG_DEFAULT = {
    host: 'test.rebex.net',
    port:'22',
    username:'demo',
    password: 'password'
}

export const FTP_CONFIG_DEFAULT = {
    host: 'test.rebex.net',
    port:'21',
    user:'demo',
    password: 'password'
}

export const DEFAULT_DESTINATION_DIR = './downloads';

export const DOWNLOAD_EVENTS = {
    START: "START",
    DOWNLOAD: "DOWNLOAD",
    PROGRESS: "PROGRESS",
    ERROR: "ERROR",
    END: "END"
}

export const DEFAULT_URLS = `
    https://speed.hetzner.de/100MB.bin,
    ftp://speedtest:speedtest@ftp.otenet.gr/test100Mb.db,
    http://speedtest.ftp.otenet.gr/files/test100k.db,
    sftp://demo-user:demo-user@demo.wftpserver.com:2222/download/manual_en.pdf,
    sftp://demo-user:demo-user@demo.wftpserver.com:2222/download/wftpserver-mac-i386.tar.gz,
`