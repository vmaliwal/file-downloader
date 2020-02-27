# Multi-Protocl File Downloader

A small cli app/tool to download files on the interwebs to local configurable location on local disk. This app should work on most systems given right version of Node.js and NPM is installed correctly. 

To manage multiple versions of Node.js please consider using [NVM](https://github.com/nvm-sh/nvm)

## Requirements
- [NodeJS >= v12.3.1](https://nodejs.org/en/)
- [NPM](https://www.npmjs.com/)

## Installation

Install required dependencies

```
$ npm install
```

## Tests

Run tests

```
$ npm test
```

## To Start

The application is a tiny terminal app that can be run by:

```
$ npm start
```

Once started it will prompt 2 questions

- 1. Enter download location on local disk?
- 2. Enter URLs to be downloaded seperated by comma (',')?

Resonable defaults are also provided to test the app, and these defaults can be changed if required by modifying `src/config.js`.

### URL Format
For protocols like `FTP` & `SFTP` it is required to provide authentication information. Currently, this app only supports authentication via username & password provided via URL. Please follow the below format:

```
ftp://username:password@ftp.otenet.gr/test100Mb.db
```

### LOGs

Error logs can be found in `./debug.log` file. It will be automatically created when the app starts.

### Downloads

If default download location is used, all downloaded files can be found inside `./downloads` directory.