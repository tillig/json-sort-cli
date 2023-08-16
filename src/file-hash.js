'use strict';

const crypto = require('crypto');
const fs = require('fs');

/**
 * Reads a file and creates a SHA256 hash. Can be used for comparing two files to see if there are changes.
 * @param {string} file Path to the file for which a hash should be created.
 * @returns {string} A SHA256 hash of the file.
 */
exports.create = function (file) {
  return new Promise((resolve, reject) => {
    const shasum = crypto.createHash('sha256');
    try {
      const stream = fs.createReadStream(file);
      stream.on('data', (data) => {
        shasum.update(data);
      });
      stream.on('end', () => {
        const hash = shasum.digest('hex');
        return resolve(hash);
      });
    } catch (error) {
      return reject(error);
    }
  });
};
