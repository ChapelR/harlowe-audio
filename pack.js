/* jshint node: true, esversion: 6 */
'use strict';

const fs = require('fs');
const jetpack = require('fs-jetpack');
const zip = require('node-zip')();

const jsFile = jetpack.read('./dist/harlowe-audio.min.js', 'utf8');
const cssFile = jetpack.read('./dist/harlowe-audio.min.css', 'utf8');
const license = jetpack.read('./LICENSE', 'utf8');

zip
    .file('harlowe-audio.min.js', jsFile)
    .file('harlowe-audio.min.css', cssFile)
    .file('LICENSE.txt', license);

const bin = zip.generate({ base64 : false, compression : 'DEFLATE' });

fs.writeFileSync('./harlowe-audio.zip', bin, 'binary');