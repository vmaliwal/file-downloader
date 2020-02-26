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