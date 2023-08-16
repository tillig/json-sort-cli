#!/usr/bin/env node

'use strict';

const fs = require('fs').promises;
const os = require('os');
const path = require('path');
const process = require('node:process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const opt = require('./src/options');
const formatter = require('./src/formatter');

/**
 * The exit code that will be used on program end.
 */
let exitCode = 0;

// TODO: Accept/expand globs so CLI support works better.
// TODO: Compare original file to new contents - log if there are differences, update contents if autofix is enabled.
// TODO: If there were any diffs/changes, exit 1.

/**
 * Primary entry point for the hook.
 */
async function main() {
  const argv = await parseArguments();

  if (argv.autofix) {
    console.log('Autofix is ENABLED.');
  }

  const overrides = opt.createOverrides(argv);
  const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'json-sort'));
  for (const file of argv._) {
    console.log(`File: ${file}`);

    let format;
    try {
      format = await opt.createFormatOptions(file, overrides);
    } catch (e) {
      writeError(`Error generating format options for file ${file}.`, e);
      continue;
    }

    let formattedFile;
    try {
      formattedFile = await formatter.createFormattedFile(file, format, tempDirectory);
      if (!formattedFile) {
        writeError(`Unable to create formatted file for ${file}. Does ${file} exist?`);
        continue;
      }
    } catch (e) {
      writeError(`Error creating formatted file for ${file}. Most formatting errors are due to malformed JSON - missing comma, extra comma, etc.`, e);
      continue;
    }

    const updatedContents = await fs.readFile(formattedFile, 'utf8');
    console.log('Updated contents:');
    console.log(updatedContents);
  }

  await fs.rm(tempDirectory, { recursive: true, force: true });
}

/**
 * Parses the command line arguments into a structure we can use.
 * @returns {object} The parsed arguments from yargs.
 */
async function parseArguments() {
  return await yargs(hideBin(process.argv))
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
      type: 'string',
      description: '`tab` or `space`. Defaults to `space`. Overrides .editorconfig settings if an .editorconfig is found.'
    })
    .option('insert-final-newline', {
      type: 'boolean',
      description: 'Insert a final newline after the sort. Overrides .editorconfig settings if an .editorconfig is found.'
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
 * Writes an error to the console and sets the program to exit with a non-zero code.
 * @param {string} message The message to write to the console.
 * @param {Error} error The error structure, if any, to provide additional information.
 */
function writeError(message, error) {
  exitCode = 1;
  console.error(message);
  if (error) {
    console.error(error);
  }
}

main().then(() => process.exit(exitCode));
