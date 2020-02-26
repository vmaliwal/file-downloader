// Refer - https://stackoverflow.com/questions/53095199/node-using-jest-with-esm-package

const esmImport = require('esm')(module);
esmImport('./urlParser.assert');
esmImport('./localFileHandler.assert');
esmImport('./sftpDownloader.assert');
esmImport('./ftpDownloader.assert');
esmImport('./httpsDownloader.assert');
esmImport('./baseDownloader.assert');
