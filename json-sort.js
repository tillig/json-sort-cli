#!/usr/bin/env node

'use strict';

const process = require('node:process');
const { glob } = require('glob');
// const json5 = require('json5');
// const stringify = require('json-stable-stringify');

// pre-commit try-repo /path/to/cloned/pre-commit-json-sort json-sort

// TODO: Parameter(s) for which files to format.
// TODO: Parameter for autofix.
// TODO: Parameter for indent (stringify opts.space, default to two spaces).
// TODO: Parameter for newline at end of file (default to true)
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
  console.log('Ran the hook.');
  const files = await glob('**/*.json', { ignore: 'node_modules/**' });
  files.forEach((file) => console.log(file));
}

main().then(() => process.exit(0));
