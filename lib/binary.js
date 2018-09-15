'use strict';

console.log('.');

const BAKERY = '// BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY // BAKERY ';

(function () {
  const fs = require('fs');
  const vm = require('vm');
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
    console.log(Buffer.from(String(prelude).substr(2), 'base64').toString());
    const s = new vm.Script(Buffer.from(String(prelude).substr(2), 'base64'), { filename: 'pkg/prelude/bootstrap.js' });
    const fn = s.runInThisContext();
    return fn(process, require,
      console, fd, PAYLOAD_POSITION, PAYLOAD_SIZE);
  }
  (function () {
    const fd = fs.openSync(__filename, 'r');
    const result = readPrelude(fd);
    if (result && result.undoPatch) {
      const bindingFs = process.binding('fs');
      fs.internalModuleStat = bindingFs.internalModuleStat;
      fs.internalModuleReadJSON = bindingFs.internalModuleReadJSON;
      fs.closeSync(fd);
    }
  }());
}());
