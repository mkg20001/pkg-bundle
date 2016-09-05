#!/usr/bin/env node

'use strict';

const assert = require('assert');
const utils = require('../utils.js');

assert(!module.parent);
assert(__dirname === process.cwd());

const input = './test-x-index';
const newcomers = [ 'test-output.exe' ];
const before = utils.filesBefore(newcomers);

utils.pkg.sync([
  '--output', 'test-output.exe', input
]);

utils.filesAfter(before, newcomers);