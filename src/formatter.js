const crypto = require('crypto');
const editorconfig = require('editorconfig');
const fs = require('fs').promises;
const fsSync = require('fs');
const json5 = require('json5');
const path = require('path');
const stringify = require('json-stable-stringify');
const { EOL } = require('os');

/**
 * Creates a temporary file with the formatted version of an original JSON file.
 * @param {string} originalPath The path to the original JSON file to format.
 * @param {import('../types/options').FormattingOptions} formatOptions Formatting options.
 * @param {string} tempDirectory Path to the temporary folder where formatted files should go.
 * @returns {string|null} The path to the temporary file that has the sorted JSON. If the original path doesn't exist, this will be null.
 */
exports.createFormattedFile = async function (originalPath, formatOptions, tempDirectory) {
  if (!fsSync.existsSync(originalPath)) {
    return null;
  }

  const charset = formatOptions.charset ?? 'utf8';
  const originalContents = await fs.readFile(originalPath, charset);
  const sortedContents = exports.formatJson(originalContents, formatOptions);
  const guid = crypto.randomBytes(16).toString('hex');
  const tempFile = path.join(tempDirectory, guid);
  await fs.writeFile(tempFile, sortedContents, { encoding: charset });
  return tempFile;
};

/**
 * Format a JSON string using specified options.
 * @param {string} originalContents The original JSON content string to format.
 * @param {import('../types/options').FormattingOptions} formatOptions Formatting options.
 * @returns {string} The formatted/sorted JSON content.
 */
exports.formatJson = function (originalContents, formatOptions) {
  let sortedContents = stringify(json5.parse(originalContents), formatOptions.stringify_options);

  // json-stable-stringify always uses \n.
  sortedContents.replace('\n', formatOptions.line_end_string);
  if (formatOptions.insert_final_newline) {
    sortedContents += formatOptions.line_end_string;
  }

  return sortedContents;
};
