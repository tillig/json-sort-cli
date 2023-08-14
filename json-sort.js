#!/usr/bin/env node

'use strict';

const process = require('node:process');

// pre-commit try-repo /path/to/cloned/pre-commit-json-sort json-sort

// Console log output only shows up if you exit non-zero.
console.log('Ran the hook.');
process.exit(0);
