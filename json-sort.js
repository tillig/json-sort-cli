#!/usr/bin/env node

'use strict';

const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const process = require('node:process');
const yargs = require('yargs/yargs');
const { glob } = require('glob');
const { hideBin } = require('yargs/helpers');

const opt = require('./src/options');
const formatter = require('./src/formatter');
const fileHash = require('./src/file-hash');

/**
 * The exit code that will be used on program end.
 */
let exitCode = 0;

/**
 * Primary entry point for the hook.
 */
async function main() {
  const argv = await parseArguments(process.argv);
  const argvOptions = opt.createOptionsFromArguments(argv);
  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'json-sort'));
  const filesToProcess = await expandGlobs(argv._);

  for (const originalFilePath of filesToProcess) {
    let formatOptions;
    try {
      formatOptions = await opt.createFormatOptions(originalFilePath, argvOptions);
    } catch (e) {
      writeError(`Error generating format options for file ${originalFilePath}.`, e);
      continue;
    }

    let formattedFilePath;
    try {
      formattedFilePath = await formatter.createFormattedFile(originalFilePath, formatOptions, tempDirectory);
      if (!formattedFilePath) {
        writeError(`Unable to create formatted file for ${originalFilePath}. Does ${originalFilePath} exist?`);
        continue;
      }
    } catch (e) {
      writeError(`Error creating formatted file for ${originalFilePath}. Most formatting errors are due to malformed JSON - missing comma, extra comma, etc.`, e);
      continue;
    }

    const originalHash = await fileHash.create(originalFilePath);
    const formattedHash = await fileHash.create(formattedFilePath);
    if (originalHash !== formattedHash) {
      const isStructuralDifference = await formatter.isStructuralDifference(originalFilePath, formattedFilePath);
      exitCode = 1;
      if (argv.autofix) {
        console.error(`Updating file ${originalFilePath} (${isStructuralDifference ? 'structure' : 'whitespace'}).`);
        try {
          await fs.cp(formattedFilePath, originalFilePath, { force: true });
        } catch (e) {
          writeError(`Error copying sorted data to autofix ${originalFilePath}.`, e);
          continue;
        }
      } else {
        console.error(`${originalFilePath} is not properly sorted (${isStructuralDifference ? 'structure' : 'whitespace'}).`);
      }
    }
  }

  await fs.rm(tempDirectory, { recursive: true, force: true });
}

/**
 * Expands the file arguments like globs into the set of files to format. This
 * also filters out files that were specified but don't exist.
 * @param {any} argvUnderscore The `argv._` argument with the set of files/globs
 * to expand.
 * @returns {string[]} An array of paths to files based on expanding the
 * provided globs.
 */
async function expandGlobs(argvUnderscore) {
  let expanded = [];
  for (const globToProcess of argvUnderscore) {
    const globProcessed = await glob(globToProcess);
    expanded = expanded.concat(globProcessed);
  }

  return expanded;
}

/**
 * Parses the command line arguments into a structure we can use.
 * @param {string[]} argumentsToParse `process.argv` - the arguments to parse.
 * @returns {object} The parsed arguments from yargs.
 */
async function parseArguments(argumentsToParse) {
  return await yargs(hideBin(argumentsToParse))
    .usage('Usage: $0 <file.json> [options]')
    .option('autofix', {
      type: 'boolean',
      description: 'Update files with fixes instead of just reporting. Defaults to reporting only.',
      default: false
    })
    .option('indent-size', {
      type: 'string',
      description: 'Number of spaces to indent, or the string "tab" to use tabs. Defaults to 2 spaces. Overrides .editorconfig settings if an .editorconfig is found.'
    })
    .option('indent-style', {
      choices: ['space', 'tab'],
      type: 'string',
      description: '`tab` or `space`. Defaults to `space`. Overrides .editorconfig settings if an .editorconfig is found.'
    })
    .option('insert-final-newline', {
      // This is a choice rather than a Boolean so we can differentiate between
      // true, false, and "not specified."
      choices: ['true', 'false'],
      type: 'string',
      description: 'Insert a final newline after the sort. Defaults to false. Overrides .editorconfig settings if an .editorconfig is found.'
    })
    .option('end-of-line', {
      choices: ['lf', 'crlf', 'cr', 'unset'],
      type: 'string',
      description: 'Specify the desired line ending for output. Defaults to system line ending. Overrides .editorconfig settings if an .editorconfig is found.'
    })
    .check((argv, _) => {
      if (argv._.length === 0) {
        throw new Error('You must provide at least one file path to sort.');
      } else {
        return true;
      }
    })
    .showHelpOnFail(true)
    .parseAsync();
}

/**
 * Writes an error to the console and sets the program to exit with a non-zero
 * code.
 * @param {string} message The message to write to the console.
 * @param {Error} error The error structure, if any, to provide additional
 * information.
 */
function writeError(message, error) {
  exitCode = 1;
  console.error(message);
  if (error) {
    console.error(error);
  }
}

main().then(() => process.exit(exitCode));
