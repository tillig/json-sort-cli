'use strict';

const editorconfig = require('editorconfig');

/**
 * Cache of parsed .editorconfig files to optimize repeat reads.
 */
const cache = new Map();

/**
 * Creates an option set including the  JSON stable stringify options based on
 * the formatting options defined in .editorconfig combined with defaults.
 * @param {string} filePath The target file to format, relative to process.cwd().
 * @param {editorconfig.KnownProps} overrides The arguments provided to the plugin to override .editorconfig.
 * @returns {editorconfig.KnownProps} A combined set of formatting options that can be used in JSON stable stringify.
 */
exports.createFormatOptions = async function (filePath, overrides) {
  overrides = overrides || {};

  // Any properties not passed in should be removed so Object.assign can do its job.
  Object.keys(overrides).forEach(function (key) {
    if (overrides[key] === undefined) delete overrides[key];
  });

  // Clone the config so we don't change it in-memory.
  const config = await editorconfig.parse(filePath, { cache });

  // Defaults => editorconfig => manual overrides.
  const merged = Object.assign({
    indent_size: 2,
    indent_style: 'space',
    insert_final_newline: true
  }, Object.assign(config, overrides));

  // Now make _that_ into json-stable-stringify options and add that to the object.
  merged.stringify_options = { space: calculateStringifyOptions(merged) };
  return merged;
};

/**
 * Calculates the json-stable-stringify options based on merged .editorconfig settings.
 * @param {editorconfig.KnownProps} source The set of .editorconfig options from which to base the calculations.
 * @returns {object} The value of options.space to pass to json-stable-stringify.
 */
function calculateStringifyOptions(source) {
  if (source.indent_style === 'tab') {
    return '\t';
  }

  return source.indent_size;
}

/**
 * Converts the parsed arguments for the command into a set of formatting override options.
 * @param {object} argv The parsed command line arguments.
 * @returns {editorconfig.KnownProps} The arguments converted into .editorconfig override format.
 */
exports.createOverrides = function (argv) {
  return {
    indent_size: argv.indentSize,
    indent_style: argv.indentStyle,
    insert_final_newline: argv.insertFinalNewline
  };
};
