#!/usr/bin/env node

'use strict';

(function () {
  const fs = require('fs');
  const vm = require('vm');
  const path = require('path');

  const BAKERY = '// BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY ';
  const DATA_FILE_NAME = '// DATA_FILE_NAME // DATA_FILE_NAME // DATA_FILE_NAME // DATA_FILE_NAME // DATA_FILE_NAME '.trim() + '.data';
  const DATA_FILE = path.join(__dirname, DATA_FILE_NAME);

  function readPrelude (fd) {
    const PAYLOAD_POSITION = '// PAYLOAD_POSITION //' | 0;
    const PAYLOAD_SIZE = '// PAYLOAD_SIZE //' | 0;
    const PRELUDE_POSITION = '// PRELUDE_POSITION //' | 0;
    const PRELUDE_SIZE = '// PRELUDE_SIZE //' | 0;
    if (!PRELUDE_POSITION) {
      // no prelude - remove entrypoint from argv[1]
      process.argv.splice(1, 1);
      return { undoPatch: true };
    }
    const prelude = Buffer.alloc(PRELUDE_SIZE);
    const read = fs.readSync(fd, prelude, 0, PRELUDE_SIZE, PRELUDE_POSITION);
    if (read !== PRELUDE_SIZE) {
      console.error('Pkg: Error reading from file.');
      process.exit(1);
    }
    const s = new vm.Script(prelude, { filename: 'pkg/prelude/bootstrap.js' });
    const fn = s.runInThisContext();
    return fn(process, require,
      console, fd, PAYLOAD_POSITION, PAYLOAD_SIZE, DATA_FILE);
  }

  (function () {
    const fd = fs.openSync(DATA_FILE, 'r');
    readPrelude(fd);
  }());
}());
