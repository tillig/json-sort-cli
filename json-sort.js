#!/usr/bin/env node

'use strict';

const process = require('node:process');
// const json5 = require('json5');
// const stringify = require('json-stable-stringify');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const opt = require('src/options');

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
    .parseAsync();

  console.log(`autofix = ${argv.autofix}`);

  const overrides = opt.createOverrides(argv);
  console.log(`indent-size = ${overrides.indent_size}`);
  console.log(`indent-style = ${overrides.indent_stye}`);
  console.log(`insert-final-newline = ${overrides.insert_final_newline}`);

  // _ is automatically set to the list of JSON files by pre-commit. We don't have to manage that ourselves.
  console.log(`_ = ${argv._}`);
}

main().then(() => process.exit(0));
