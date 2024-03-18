'use strict';

const editorconfig = require('editorconfig');
const { EOL } = require('os');

/**
 * Cache of parsed .editorconfig files to optimize repeat reads.
 */
const cache = new Map();

/**
 * Creates an option set including the  JSON stable stringify options based on
 * the formatting options defined in .editorconfig combined with defaults.
 * @param {string} filePath The target file to format, relative to
 * process.cwd().
 * @param {editorconfig.KnownProps} argvOptions The arguments provided to the
 * plugin to override .editorconfig.
 * @returns {import('../types/options').FormattingOptions} A combined set of
 * formatting options that can be used in JSON stable stringify.
 */
exports.createFormatOptions = async function (filePath, argvOptions) {
  argvOptions = argvOptions || {};

  // Get the editorconfig settings for the file relative to its location.
  const config = await editorconfig.parse(filePath, { cache });

  // Defaults => editorconfig => manual overrides.
  const merged = Object.assign({
    indent_size: 2,
    indent_style: 'space',
    insert_final_newline: false
  }, Object.assign(config, argvOptions));

  // Now make _that_ into json-stable-stringify options and add that to the object.
  merged.stringify_options = { space: merged.indent_style === 'tab' ? '\t' : merged.indent_size };

  // Resolve the actual EOL.
  switch (merged.end_of_line) {
    case 'lf':
      merged.line_end_string = '\n';
      break;
    case 'cr':
      merged.line_end_string = '\r';
      break;
    case 'crlf':
      merged.line_end_string = '\r\n';
      break;
    default:
      merged.line_end_string = EOL;
      break;
  }

  return merged;
};

/**
 * Converts the parsed arguments for the command into a set of formatting
 * override options.
 * @param {object} argv The parsed command line arguments.
 * @returns {editorconfig.KnownProps} The arguments converted into .editorconfig
 * override format.
 */
exports.createOptionsFromArguments = function (argv) {
  const options = {
    end_of_line: argv.endOfLine,
    indent_size: argv.indentSize,
    indent_style: argv.indentStyle,
    insert_final_newline: argv.insertFinalNewline === undefined ? undefined : (argv.insertFinalNewline === 'true')
  };

  if (options.indent_style === 'tab' || options.indent_size === 'tab') {
    options.indent_size = 1;
    options.indent_style = 'tab';
  } else if (!isNaN(options.indent_size) && !isNaN(parseInt(options.indent_size))) {
    options.indent_size = parseInt(options.indent_size);
    options.indent_style = 'space';
  }

  // Any properties not passed in should be removed so Object.assign can do its job later
  Object.keys(options).forEach(function (key) {
    if (options[key] === undefined) delete options[key];
  });

  return options;
};
