import BaseRequester from './baseRequester';
import fs from 'fs';

const Client = require('ssh2-sftp-client');

import { SFTP_CONFIG_DEFAULT } from '../config';


export default class SftpRequester extends BaseRequester {
    constructor(urlParser) {
        super(urlParser);
    }

    request() {
        const sftpClient = this.__getFreshSftpClient();
        const config = this.__getConfig();
        const { path } = this.getOrigin();
        const writeStream = fs.createWriteStream('./download.txt');

        sftpClient.on('connect', () => {
            console.log("success connect");
        })
        sftpClient.on('data', (data) => {
            console.log("success data");
            console.log(data);
        })

        sftpClient.connect(config)
            .then((sftpWrapper) => {
                console.log("we have wrapper");
                // console.log(sftpWrapper);
                sftpClient.get(path, writeStream)
                .then(buff => {
                    console.log("we finally have buff data");
                    console.log(buff);
                })
            })
        
        // sftpClient.on("data", (data) => {
        //     console.log("we have listened for data");
        //     console.log(data);
        // })
        
        return this;
    }

    
    __connect() {
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