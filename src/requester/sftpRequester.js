import BaseRequester from './baseRequester';

const Client = require('ssh2-sftp-client');

import { SFTP_CONFIG_DEFAULT } from '../config';


export default class SftpRequester extends BaseRequester {
    constructor(urlParser, destionationDir) {
        super(urlParser, destionationDir);
        this.sftpClient = this.__getFreshSftpClient()
    }

    async request() {
        const { path: remotePath } = this.getOrigin();
        const { file: destinationFile } = this.getDestionation();
        const { absolutePath: destinationPath } = destinationFile;


        this.sftpClient.on('connect', () => {
            // emit event start
            this.emit('START', {msg: "Connection successful"})
        });

        this.sftpClient.on('error', (err) => {
            this.emit('ERROR', {error: err});
        });

        this.sftpClient.on('end', () => {
            this.emit('END', {msg: "Connection Ended"});
        });

        await this.__connect();

        this.emit('DOWNLOAD', { msg: "download has started" });

        // replace download with localpath
        this.sftpClient
        .fastGet(remotePath, destinationPath,  {
            step: (total_transferred, chunk, total) => {    
                // emit event progress
                this.emit('PROGRESS', {msg: total_transferred });
                console.log(total_transferred, chunk, total);
                // also once total_transferred === total, emit event end
            }
        })
        .then(() => {
            this.sftpClient.end();
        })
        .catch(err => {
            this.emit('ERRPR', {error: err});
        });
        // emit event error in catch block

        return this;
    }

    
    async __connect() {
        const config = this.__getConfig();
        await this.sftpClient.connect(config);
    }

    __getFreshSftpClient() {
        return new Client();
    }
    __getConfig() {
        return {
            ...SFTP_CONFIG_DEFAULT,
            ...this.getOrigin(),
        }
    }
}