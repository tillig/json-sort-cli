#!/usr/bin/env node

'use strict';

const process = require('node:process');
// const json5 = require('json5');
// const stringify = require('json-stable-stringify');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// pre-commit try-repo /path/to/cloned/pre-commit-json-sort json-sort

// TODO: Create options based on parameters and .editorconfig.
// TODO: Override indent based on .editorconfig.
// TODO: Override newline at end of file based on .editorconfig.
/*
  try {
    sorted = stringify(json5.parse(original), opts);
    success = true;
  } catch (e) {
    let error = '[unknown error]';
    if (typeof e === 'string') {
      error = e;
    } else if (e instanceof Error) {
      error = e.message;
    }

    const message = 'Error doing stable stringify of the JSON content which starts at line ' + start.line + ', char ' + start.character + '.';
    console.error('Sort errors usually are from malformed JSON - missing comma, extra comma, etc.');
    console.error(message);
    console.error(e);
  }
*/

/**
 * Primary entry point for the hook.
 */
async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('indent', {
      type: 'string',
      description: 'Number of spaces to indent, or a string to use as the indent. Defaults to 2 spaces. Overrides .editorconfig settings if an .editorconfig is found.'
    })
    .option('autofix', {
      type: 'boolean',
      description: 'Update files with fixes instead of just reporting. Defaults to reporting only.',
      default: false
    })
    .option('final-newline', {
      type: 'boolean',
      description: 'Insert a final newline after the sort. Overrides .editorconfig settings if an .editorconfig is found.'
    })
    .parseAsync();

  console.log(`indent = ${argv.indent}`);
  console.log(`autofix = ${argv.autofix}`);
  console.log(`final-newline = ${argv.finalNewline}`);

  // _ is automatically set to the list of JSON files by pre-commit. We don't have to manage that ourselves.
  console.log(`_ = ${argv._}`);
}

main().then(() => process.exit(0));
