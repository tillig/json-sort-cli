const crypto = require('crypto');
const editorconfig = require('editorconfig');
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const json5 = require('json5');
const stringify = require('json-stable-stringify');
const { EOL } = require('os');

/**
 * Creates a temporary file with the formatted version of an original JSON file.
 * @param {string} originalPath The path to the original JSON file to format.
 * @param {editorconfig.KnownProps} formatOptions Formatting options.
 * @param {string} tempDirectory Path to the temporary folder where formatted files should go.
 * @returns {string|null} The path to the temporary file that has the sorted JSON. If the original path doesn't exist, this will be null.
 */
exports.createFormattedFile = async function (originalPath, formatOptions, tempDirectory) {
  if (!fsSync.existsSync(originalPath)) {
    return null;
  }

  const charset = formatOptions.charset ?? 'utf8';
  const originalContents = await fs.readFile(originalPath, charset);
  let sortedContents = formatJson(originalContents, formatOptions.stringify_options);
  // TODO: Replace all newlines with specified newline types.
  if (formatOptions.insert_final_newline) {
    switch (formatOptions.end_of_line) {
      case 'lf':
        sortedContents += '\n';
        break;
      case 'cr':
        sortedContents += '\r';
        break;
      case 'crlf':
        sortedContents += '\r\n';
        break;
      default:
        sortedContents += EOL;
        break;
    }
  }

  const guid = crypto.randomBytes(16).toString('hex');
  const tempFile = path.join(tempDirectory, guid);
  await fs.writeFile(tempFile, sortedContents, { encoding: charset });
  return tempFile;
};

/**
 * Format a JSON string using specified options.
 * @param {string} originalContents The original JSON content to format.
 * @param {object} formatOptions Formatting options for json-stable-stringify.
 * @returns {string} The formatted/sorted JSON content.
 */
function formatJson(originalContents, formatOptions) {
  return stringify(json5.parse(originalContents), formatOptions);
}

exports.formatJson = formatJson;
