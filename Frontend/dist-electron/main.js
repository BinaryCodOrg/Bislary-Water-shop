import { ipcMain, app, BrowserWindow } from "electron";
import path$1 from "path";
import { fileURLToPath } from "url";
import require$$0 from "fs";
import require$$2 from "util";
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var lib = { exports: {} };
function commonjsRequire(path2) {
  throw new Error('Could not dynamically require "' + path2 + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var util$1 = {};
util$1.getBooleanOption = (options, key) => {
  let value = false;
  if (key in options && typeof (value = options[key]) !== "boolean") {
    throw new TypeError(`Expected the "${key}" option to be a boolean`);
  }
  return value;
};
util$1.cppdb = Symbol();
util$1.inspect = Symbol.for("nodejs.util.inspect.custom");
const descriptor = { value: "SqliteError", writable: true, enumerable: false, configurable: true };
function SqliteError$1(message, code) {
  if (new.target !== SqliteError$1) {
    return new SqliteError$1(message, code);
  }
  if (typeof code !== "string") {
    throw new TypeError("Expected second argument to be a string");
  }
  Error.call(this, message);
  descriptor.value = "" + message;
  Object.defineProperty(this, "message", descriptor);
  Error.captureStackTrace(this, SqliteError$1);
  this.code = code;
}
Object.setPrototypeOf(SqliteError$1, Error);
Object.setPrototypeOf(SqliteError$1.prototype, Error.prototype);
Object.defineProperty(SqliteError$1.prototype, "name", descriptor);
var sqliteError = SqliteError$1;
var bindings = { exports: {} };
var fileUriToPath_1;
var hasRequiredFileUriToPath;
function requireFileUriToPath() {
  if (hasRequiredFileUriToPath) return fileUriToPath_1;
  hasRequiredFileUriToPath = 1;
  var sep = path$1.sep || "/";
  fileUriToPath_1 = fileUriToPath;
  function fileUriToPath(uri) {
    if ("string" != typeof uri || uri.length <= 7 || "file://" != uri.substring(0, 7)) {
      throw new TypeError("must pass in a file:// URI to convert to a file path");
    }
    var rest = decodeURI(uri.substring(7));
    var firstSlash = rest.indexOf("/");
    var host = rest.substring(0, firstSlash);
    var path2 = rest.substring(firstSlash + 1);
    if ("localhost" == host) host = "";
    if (host) {
      host = sep + sep + host;
    }
    path2 = path2.replace(/^(.+)\|/, "$1:");
    if (sep == "\\") {
      path2 = path2.replace(/\//g, "\\");
    }
    if (/^.+\:/.test(path2)) ;
    else {
      path2 = sep + path2;
    }
    return host + path2;
  }
  return fileUriToPath_1;
}
var hasRequiredBindings;
function requireBindings() {
  if (hasRequiredBindings) return bindings.exports;
  hasRequiredBindings = 1;
  (function(module, exports) {
    var fs2 = require$$0, path2 = path$1, fileURLToPath2 = requireFileUriToPath(), join = path2.join, dirname = path2.dirname, exists = fs2.accessSync && function(path22) {
      try {
        fs2.accessSync(path22);
      } catch (e) {
        return false;
      }
      return true;
    } || fs2.existsSync || path2.existsSync, defaults = {
      arrow: process.env.NODE_BINDINGS_ARROW || " → ",
      compiled: process.env.NODE_BINDINGS_COMPILED_DIR || "compiled",
      platform: process.platform,
      arch: process.arch,
      nodePreGyp: "node-v" + process.versions.modules + "-" + process.platform + "-" + process.arch,
      version: process.versions.node,
      bindings: "bindings.node",
      try: [
        // node-gyp's linked version in the "build" dir
        ["module_root", "build", "bindings"],
        // node-waf and gyp_addon (a.k.a node-gyp)
        ["module_root", "build", "Debug", "bindings"],
        ["module_root", "build", "Release", "bindings"],
        // Debug files, for development (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Debug", "bindings"],
        ["module_root", "Debug", "bindings"],
        // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Release", "bindings"],
        ["module_root", "Release", "bindings"],
        // Legacy from node-waf, node <= 0.4.x
        ["module_root", "build", "default", "bindings"],
        // Production "Release" buildtype binary (meh...)
        ["module_root", "compiled", "version", "platform", "arch", "bindings"],
        // node-qbs builds
        ["module_root", "addon-build", "release", "install-root", "bindings"],
        ["module_root", "addon-build", "debug", "install-root", "bindings"],
        ["module_root", "addon-build", "default", "install-root", "bindings"],
        // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
        ["module_root", "lib", "binding", "nodePreGyp", "bindings"]
      ]
    };
    function bindings2(opts) {
      if (typeof opts == "string") {
        opts = { bindings: opts };
      } else if (!opts) {
        opts = {};
      }
      Object.keys(defaults).map(function(i2) {
        if (!(i2 in opts)) opts[i2] = defaults[i2];
      });
      if (!opts.module_root) {
        opts.module_root = exports.getRoot(exports.getFileName());
      }
      if (path2.extname(opts.bindings) != ".node") {
        opts.bindings += ".node";
      }
      var requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : commonjsRequire;
      var tries = [], i = 0, l = opts.try.length, n, b, err;
      for (; i < l; i++) {
        n = join.apply(
          null,
          opts.try[i].map(function(p) {
            return opts[p] || p;
          })
        );
        tries.push(n);
        try {
          b = opts.path ? requireFunc.resolve(n) : requireFunc(n);
          if (!opts.path) {
            b.path = n;
          }
          return b;
        } catch (e) {
          if (e.code !== "MODULE_NOT_FOUND" && e.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(e.message)) {
            throw e;
          }
        }
      }
      err = new Error(
        "Could not locate the bindings file. Tried:\n" + tries.map(function(a) {
          return opts.arrow + a;
        }).join("\n")
      );
      err.tries = tries;
      throw err;
    }
    module.exports = exports = bindings2;
    exports.getFileName = function getFileName(calling_file) {
      var origPST = Error.prepareStackTrace, origSTL = Error.stackTraceLimit, dummy = {}, fileName;
      Error.stackTraceLimit = 10;
      Error.prepareStackTrace = function(e, st) {
        for (var i = 0, l = st.length; i < l; i++) {
          fileName = st[i].getFileName();
          if (fileName !== __filename) {
            if (calling_file) {
              if (fileName !== calling_file) {
                return;
              }
            } else {
              return;
            }
          }
        }
      };
      Error.captureStackTrace(dummy);
      dummy.stack;
      Error.prepareStackTrace = origPST;
      Error.stackTraceLimit = origSTL;
      var fileSchema = "file://";
      if (fileName.indexOf(fileSchema) === 0) {
        fileName = fileURLToPath2(fileName);
      }
      return fileName;
    };
    exports.getRoot = function getRoot(file) {
      var dir = dirname(file), prev;
      while (true) {
        if (dir === ".") {
          dir = process.cwd();
        }
        if (exists(join(dir, "package.json")) || exists(join(dir, "node_modules"))) {
          return dir;
        }
        if (prev === dir) {
          throw new Error(
            'Could not find module root given file: "' + file + '". Do you have a `package.json` file? '
          );
        }
        prev = dir;
        dir = join(dir, "..");
      }
    };
  })(bindings, bindings.exports);
  return bindings.exports;
}
var wrappers$1 = {};
var hasRequiredWrappers;
function requireWrappers() {
  if (hasRequiredWrappers) return wrappers$1;
  hasRequiredWrappers = 1;
  const { cppdb } = util$1;
  wrappers$1.prepare = function prepare(sql) {
    return this[cppdb].prepare(sql, this, false);
  };
  wrappers$1.exec = function exec(sql) {
    this[cppdb].exec(sql);
    return this;
  };
  wrappers$1.close = function close() {
    this[cppdb].close();
    return this;
  };
  wrappers$1.loadExtension = function loadExtension(...args) {
    this[cppdb].loadExtension(...args);
    return this;
  };
  wrappers$1.defaultSafeIntegers = function defaultSafeIntegers(...args) {
    this[cppdb].defaultSafeIntegers(...args);
    return this;
  };
  wrappers$1.unsafeMode = function unsafeMode(...args) {
    this[cppdb].unsafeMode(...args);
    return this;
  };
  wrappers$1.getters = {
    name: {
      get: function name() {
        return this[cppdb].name;
      },
      enumerable: true
    },
    open: {
      get: function open() {
        return this[cppdb].open;
      },
      enumerable: true
    },
    inTransaction: {
      get: function inTransaction() {
        return this[cppdb].inTransaction;
      },
      enumerable: true
    },
    readonly: {
      get: function readonly() {
        return this[cppdb].readonly;
      },
      enumerable: true
    },
    memory: {
      get: function memory() {
        return this[cppdb].memory;
      },
      enumerable: true
    }
  };
  return wrappers$1;
}
var transaction;
var hasRequiredTransaction;
function requireTransaction() {
  if (hasRequiredTransaction) return transaction;
  hasRequiredTransaction = 1;
  const { cppdb } = util$1;
  const controllers = /* @__PURE__ */ new WeakMap();
  transaction = function transaction2(fn) {
    if (typeof fn !== "function") throw new TypeError("Expected first argument to be a function");
    const db2 = this[cppdb];
    const controller = getController(db2, this);
    const { apply } = Function.prototype;
    const properties = {
      default: { value: wrapTransaction(apply, fn, db2, controller.default) },
      deferred: { value: wrapTransaction(apply, fn, db2, controller.deferred) },
      immediate: { value: wrapTransaction(apply, fn, db2, controller.immediate) },
      exclusive: { value: wrapTransaction(apply, fn, db2, controller.exclusive) },
      database: { value: this, enumerable: true }
    };
    Object.defineProperties(properties.default.value, properties);
    Object.defineProperties(properties.deferred.value, properties);
    Object.defineProperties(properties.immediate.value, properties);
    Object.defineProperties(properties.exclusive.value, properties);
    return properties.default.value;
  };
  const getController = (db2, self) => {
    let controller = controllers.get(db2);
    if (!controller) {
      const shared = {
        commit: db2.prepare("COMMIT", self, false),
        rollback: db2.prepare("ROLLBACK", self, false),
        savepoint: db2.prepare("SAVEPOINT `	_bs3.	`", self, false),
        release: db2.prepare("RELEASE `	_bs3.	`", self, false),
        rollbackTo: db2.prepare("ROLLBACK TO `	_bs3.	`", self, false)
      };
      controllers.set(db2, controller = {
        default: Object.assign({ begin: db2.prepare("BEGIN", self, false) }, shared),
        deferred: Object.assign({ begin: db2.prepare("BEGIN DEFERRED", self, false) }, shared),
        immediate: Object.assign({ begin: db2.prepare("BEGIN IMMEDIATE", self, false) }, shared),
        exclusive: Object.assign({ begin: db2.prepare("BEGIN EXCLUSIVE", self, false) }, shared)
      });
    }
    return controller;
  };
  const wrapTransaction = (apply, fn, db2, { begin, commit, rollback, savepoint, release, rollbackTo }) => function sqliteTransaction() {
    let before, after, undo;
    if (db2.inTransaction) {
      before = savepoint;
      after = release;
      undo = rollbackTo;
    } else {
      before = begin;
      after = commit;
      undo = rollback;
    }
    before.run();
    try {
      const result = apply.call(fn, this, arguments);
      if (result && typeof result.then === "function") {
        throw new TypeError("Transaction function cannot return a promise");
      }
      after.run();
      return result;
    } catch (ex) {
      if (db2.inTransaction) {
        undo.run();
        if (undo !== rollback) after.run();
      }
      throw ex;
    }
  };
  return transaction;
}
var pragma;
var hasRequiredPragma;
function requirePragma() {
  if (hasRequiredPragma) return pragma;
  hasRequiredPragma = 1;
  const { getBooleanOption, cppdb } = util$1;
  pragma = function pragma2(source, options) {
    if (options == null) options = {};
    if (typeof source !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
    const simple = getBooleanOption(options, "simple");
    const stmt = this[cppdb].prepare(`PRAGMA ${source}`, this, true);
    return simple ? stmt.pluck().get() : stmt.all();
  };
  return pragma;
}
var backup;
var hasRequiredBackup;
function requireBackup() {
  if (hasRequiredBackup) return backup;
  hasRequiredBackup = 1;
  const fs2 = require$$0;
  const path2 = path$1;
  const { promisify } = require$$2;
  const { cppdb } = util$1;
  const fsAccess = promisify(fs2.access);
  backup = async function backup2(filename, options) {
    if (options == null) options = {};
    if (typeof filename !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
    filename = filename.trim();
    const attachedName = "attached" in options ? options.attached : "main";
    const handler = "progress" in options ? options.progress : null;
    if (!filename) throw new TypeError("Backup filename cannot be an empty string");
    if (filename === ":memory:") throw new TypeError('Invalid backup filename ":memory:"');
    if (typeof attachedName !== "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
    if (handler != null && typeof handler !== "function") throw new TypeError('Expected the "progress" option to be a function');
    await fsAccess(path2.dirname(filename)).catch(() => {
      throw new TypeError("Cannot save backup because the directory does not exist");
    });
    const isNewFile = await fsAccess(filename).then(() => false, () => true);
    return runBackup(this[cppdb].backup(this, attachedName, filename, isNewFile), handler || null);
  };
  const runBackup = (backup2, handler) => {
    let rate = 0;
    let useDefault = true;
    return new Promise((resolve, reject) => {
      setImmediate(function step() {
        try {
          const progress = backup2.transfer(rate);
          if (!progress.remainingPages) {
            backup2.close();
            resolve(progress);
            return;
          }
          if (useDefault) {
            useDefault = false;
            rate = 100;
          }
          if (handler) {
            const ret = handler(progress);
            if (ret !== void 0) {
              if (typeof ret === "number" && ret === ret) rate = Math.max(0, Math.min(2147483647, Math.round(ret)));
              else throw new TypeError("Expected progress callback to return a number or undefined");
            }
          }
          setImmediate(step);
        } catch (err) {
          backup2.close();
          reject(err);
        }
      });
    });
  };
  return backup;
}
var serialize;
var hasRequiredSerialize;
function requireSerialize() {
  if (hasRequiredSerialize) return serialize;
  hasRequiredSerialize = 1;
  const { cppdb } = util$1;
  serialize = function serialize2(options) {
    if (options == null) options = {};
    if (typeof options !== "object") throw new TypeError("Expected first argument to be an options object");
    const attachedName = "attached" in options ? options.attached : "main";
    if (typeof attachedName !== "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!attachedName) throw new TypeError('The "attached" option cannot be an empty string');
    return this[cppdb].serialize(attachedName);
  };
  return serialize;
}
var _function;
var hasRequired_function;
function require_function() {
  if (hasRequired_function) return _function;
  hasRequired_function = 1;
  const { getBooleanOption, cppdb } = util$1;
  _function = function defineFunction(name, options, fn) {
    if (options == null) options = {};
    if (typeof options === "function") {
      fn = options;
      options = {};
    }
    if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof fn !== "function") throw new TypeError("Expected last argument to be a function");
    if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
    if (!name) throw new TypeError("User-defined function name cannot be an empty string");
    const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
    const deterministic = getBooleanOption(options, "deterministic");
    const directOnly = getBooleanOption(options, "directOnly");
    const varargs = getBooleanOption(options, "varargs");
    let argCount = -1;
    if (!varargs) {
      argCount = fn.length;
      if (!Number.isInteger(argCount) || argCount < 0) throw new TypeError("Expected function.length to be a positive integer");
      if (argCount > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
    }
    this[cppdb].function(fn, name, argCount, safeIntegers, deterministic, directOnly);
    return this;
  };
  return _function;
}
var aggregate;
var hasRequiredAggregate;
function requireAggregate() {
  if (hasRequiredAggregate) return aggregate;
  hasRequiredAggregate = 1;
  const { getBooleanOption, cppdb } = util$1;
  aggregate = function defineAggregate(name, options) {
    if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
    if (typeof options !== "object" || options === null) throw new TypeError("Expected second argument to be an options object");
    if (!name) throw new TypeError("User-defined function name cannot be an empty string");
    const start = "start" in options ? options.start : null;
    const step = getFunctionOption(options, "step", true);
    const inverse = getFunctionOption(options, "inverse", false);
    const result = getFunctionOption(options, "result", false);
    const safeIntegers = "safeIntegers" in options ? +getBooleanOption(options, "safeIntegers") : 2;
    const deterministic = getBooleanOption(options, "deterministic");
    const directOnly = getBooleanOption(options, "directOnly");
    const varargs = getBooleanOption(options, "varargs");
    let argCount = -1;
    if (!varargs) {
      argCount = Math.max(getLength(step), inverse ? getLength(inverse) : 0);
      if (argCount > 0) argCount -= 1;
      if (argCount > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
    }
    this[cppdb].aggregate(start, step, inverse, result, name, argCount, safeIntegers, deterministic, directOnly);
    return this;
  };
  const getFunctionOption = (options, key, required) => {
    const value = key in options ? options[key] : null;
    if (typeof value === "function") return value;
    if (value != null) throw new TypeError(`Expected the "${key}" option to be a function`);
    if (required) throw new TypeError(`Missing required option "${key}"`);
    return null;
  };
  const getLength = ({ length }) => {
    if (Number.isInteger(length) && length >= 0) return length;
    throw new TypeError("Expected function.length to be a positive integer");
  };
  return aggregate;
}
var table;
var hasRequiredTable;
function requireTable() {
  if (hasRequiredTable) return table;
  hasRequiredTable = 1;
  const { cppdb } = util$1;
  table = function defineTable(name, factory) {
    if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
    if (!name) throw new TypeError("Virtual table module name cannot be an empty string");
    let eponymous = false;
    if (typeof factory === "object" && factory !== null) {
      eponymous = true;
      factory = defer(parseTableDefinition(factory, "used", name));
    } else {
      if (typeof factory !== "function") throw new TypeError("Expected second argument to be a function or a table definition object");
      factory = wrapFactory(factory);
    }
    this[cppdb].table(factory, name, eponymous);
    return this;
  };
  function wrapFactory(factory) {
    return function virtualTableFactory(moduleName, databaseName, tableName, ...args) {
      const thisObject = {
        module: moduleName,
        database: databaseName,
        table: tableName
      };
      const def = apply.call(factory, thisObject, args);
      if (typeof def !== "object" || def === null) {
        throw new TypeError(`Virtual table module "${moduleName}" did not return a table definition object`);
      }
      return parseTableDefinition(def, "returned", moduleName);
    };
  }
  function parseTableDefinition(def, verb, moduleName) {
    if (!hasOwnProperty.call(def, "rows")) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "rows" property`);
    }
    if (!hasOwnProperty.call(def, "columns")) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition without a "columns" property`);
    }
    const rows = def.rows;
    if (typeof rows !== "function" || Object.getPrototypeOf(rows) !== GeneratorFunctionPrototype) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "rows" property (should be a generator function)`);
    }
    let columns = def.columns;
    if (!Array.isArray(columns) || !(columns = [...columns]).every((x) => typeof x === "string")) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "columns" property (should be an array of strings)`);
    }
    if (columns.length !== new Set(columns).size) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate column names`);
    }
    if (!columns.length) {
      throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with zero columns`);
    }
    let parameters;
    if (hasOwnProperty.call(def, "parameters")) {
      parameters = def.parameters;
      if (!Array.isArray(parameters) || !(parameters = [...parameters]).every((x) => typeof x === "string")) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "parameters" property (should be an array of strings)`);
      }
    } else {
      parameters = inferParameters(rows);
    }
    if (parameters.length !== new Set(parameters).size) {
      throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with duplicate parameter names`);
    }
    if (parameters.length > 32) {
      throw new RangeError(`Virtual table module "${moduleName}" ${verb} a table definition with more than the maximum number of 32 parameters`);
    }
    for (const parameter of parameters) {
      if (columns.includes(parameter)) {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with column "${parameter}" which was ambiguously defined as both a column and parameter`);
      }
    }
    let safeIntegers = 2;
    if (hasOwnProperty.call(def, "safeIntegers")) {
      const bool = def.safeIntegers;
      if (typeof bool !== "boolean") {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "safeIntegers" property (should be a boolean)`);
      }
      safeIntegers = +bool;
    }
    let directOnly = false;
    if (hasOwnProperty.call(def, "directOnly")) {
      directOnly = def.directOnly;
      if (typeof directOnly !== "boolean") {
        throw new TypeError(`Virtual table module "${moduleName}" ${verb} a table definition with an invalid "directOnly" property (should be a boolean)`);
      }
    }
    const columnDefinitions = [
      ...parameters.map(identifier).map((str) => `${str} HIDDEN`),
      ...columns.map(identifier)
    ];
    return [
      `CREATE TABLE x(${columnDefinitions.join(", ")});`,
      wrapGenerator(rows, new Map(columns.map((x, i) => [x, parameters.length + i])), moduleName),
      parameters,
      safeIntegers,
      directOnly
    ];
  }
  function wrapGenerator(generator, columnMap, moduleName) {
    return function* virtualTable(...args) {
      const output = args.map((x) => Buffer.isBuffer(x) ? Buffer.from(x) : x);
      for (let i = 0; i < columnMap.size; ++i) {
        output.push(null);
      }
      for (const row of generator(...args)) {
        if (Array.isArray(row)) {
          extractRowArray(row, output, columnMap.size, moduleName);
          yield output;
        } else if (typeof row === "object" && row !== null) {
          extractRowObject(row, output, columnMap, moduleName);
          yield output;
        } else {
          throw new TypeError(`Virtual table module "${moduleName}" yielded something that isn't a valid row object`);
        }
      }
    };
  }
  function extractRowArray(row, output, columnCount, moduleName) {
    if (row.length !== columnCount) {
      throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an incorrect number of columns`);
    }
    const offset = output.length - columnCount;
    for (let i = 0; i < columnCount; ++i) {
      output[i + offset] = row[i];
    }
  }
  function extractRowObject(row, output, columnMap, moduleName) {
    let count = 0;
    for (const key of Object.keys(row)) {
      const index = columnMap.get(key);
      if (index === void 0) {
        throw new TypeError(`Virtual table module "${moduleName}" yielded a row with an undeclared column "${key}"`);
      }
      output[index] = row[key];
      count += 1;
    }
    if (count !== columnMap.size) {
      throw new TypeError(`Virtual table module "${moduleName}" yielded a row with missing columns`);
    }
  }
  function inferParameters({ length }) {
    if (!Number.isInteger(length) || length < 0) {
      throw new TypeError("Expected function.length to be a positive integer");
    }
    const params = [];
    for (let i = 0; i < length; ++i) {
      params.push(`$${i + 1}`);
    }
    return params;
  }
  const { hasOwnProperty } = Object.prototype;
  const { apply } = Function.prototype;
  const GeneratorFunctionPrototype = Object.getPrototypeOf(function* () {
  });
  const identifier = (str) => `"${str.replace(/"/g, '""')}"`;
  const defer = (x) => () => x;
  return table;
}
var inspect;
var hasRequiredInspect;
function requireInspect() {
  if (hasRequiredInspect) return inspect;
  hasRequiredInspect = 1;
  const DatabaseInspection = function Database2() {
  };
  inspect = function inspect2(depth, opts) {
    return Object.assign(new DatabaseInspection(), this);
  };
  return inspect;
}
const fs = require$$0;
const path = path$1;
const util = util$1;
const SqliteError = sqliteError;
let DEFAULT_ADDON;
function Database$1(filenameGiven, options) {
  if (new.target == null) {
    return new Database$1(filenameGiven, options);
  }
  let buffer;
  if (Buffer.isBuffer(filenameGiven)) {
    buffer = filenameGiven;
    filenameGiven = ":memory:";
  }
  if (filenameGiven == null) filenameGiven = "";
  if (options == null) options = {};
  if (typeof filenameGiven !== "string") throw new TypeError("Expected first argument to be a string");
  if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
  if ("readOnly" in options) throw new TypeError('Misspelled option "readOnly" should be "readonly"');
  if ("memory" in options) throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');
  const filename = filenameGiven.trim();
  const anonymous = filename === "" || filename === ":memory:";
  const readonly = util.getBooleanOption(options, "readonly");
  const fileMustExist = util.getBooleanOption(options, "fileMustExist");
  const timeout = "timeout" in options ? options.timeout : 5e3;
  const verbose = "verbose" in options ? options.verbose : null;
  const nativeBinding = "nativeBinding" in options ? options.nativeBinding : null;
  if (readonly && anonymous && !buffer) throw new TypeError("In-memory/temporary databases cannot be readonly");
  if (!Number.isInteger(timeout) || timeout < 0) throw new TypeError('Expected the "timeout" option to be a positive integer');
  if (timeout > 2147483647) throw new RangeError('Option "timeout" cannot be greater than 2147483647');
  if (verbose != null && typeof verbose !== "function") throw new TypeError('Expected the "verbose" option to be a function');
  if (nativeBinding != null && typeof nativeBinding !== "string" && typeof nativeBinding !== "object") throw new TypeError('Expected the "nativeBinding" option to be a string or addon object');
  let addon;
  if (nativeBinding == null) {
    addon = DEFAULT_ADDON || (DEFAULT_ADDON = requireBindings()("better_sqlite3.node"));
  } else if (typeof nativeBinding === "string") {
    const requireFunc = typeof __non_webpack_require__ === "function" ? __non_webpack_require__ : commonjsRequire;
    addon = requireFunc(path.resolve(nativeBinding).replace(/(\.node)?$/, ".node"));
  } else {
    addon = nativeBinding;
  }
  if (!addon.isInitialized) {
    addon.setErrorConstructor(SqliteError);
    addon.isInitialized = true;
  }
  if (!anonymous && !fs.existsSync(path.dirname(filename))) {
    throw new TypeError("Cannot open database because the directory does not exist");
  }
  Object.defineProperties(this, {
    [util.cppdb]: { value: new addon.Database(filename, filenameGiven, anonymous, readonly, fileMustExist, timeout, verbose || null, buffer || null) },
    ...wrappers.getters
  });
}
const wrappers = requireWrappers();
Database$1.prototype.prepare = wrappers.prepare;
Database$1.prototype.transaction = requireTransaction();
Database$1.prototype.pragma = requirePragma();
Database$1.prototype.backup = requireBackup();
Database$1.prototype.serialize = requireSerialize();
Database$1.prototype.function = require_function();
Database$1.prototype.aggregate = requireAggregate();
Database$1.prototype.table = requireTable();
Database$1.prototype.loadExtension = wrappers.loadExtension;
Database$1.prototype.exec = wrappers.exec;
Database$1.prototype.close = wrappers.close;
Database$1.prototype.defaultSafeIntegers = wrappers.defaultSafeIntegers;
Database$1.prototype.unsafeMode = wrappers.unsafeMode;
Database$1.prototype[util.inspect] = requireInspect();
var database = Database$1;
lib.exports = database;
lib.exports.SqliteError = sqliteError;
var libExports = lib.exports;
const Database = /* @__PURE__ */ getDefaultExportFromCjs(libExports);
const __filename$2 = fileURLToPath(import.meta.url);
const __dirname$1 = path$1.dirname(__filename$2);
const db = new Database(path$1.join(__dirname$1, "../../waterData.db"));
db.exec(`
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  houseNumber TEXT,
  phoneNumber TEXT,
  quantity INTEGER,
  rate REAL,
  total_amount REAL,
  orderType TEXT CHECK(orderType IN ('delivery', 'walk-in', 'bulk')),
  remarks TEXT,
  status TEXT DEFAULT 'pending',
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  amount_paid REAL,
  payment_method TEXT,
  paidAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS dues_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  houseNumber TEXT,
  order_id INTEGER,
  due_amount REAL,
  paid_amount REAL DEFAULT 0,
  isSettled BOOLEAN DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS delivery_boys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phoneNumber TEXT,
  salary TEXT,
  iDCard TEXT,
  remarks TEXT
);

CREATE TABLE IF NOT EXISTS order_delivery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER,
  delivery_boy_id INTEGER,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (delivery_boy_id) REFERENCES delivery_boys(id)
);

  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    amount REAL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);
ipcMain.handle("order:add", async (event, order) => {
  const stmt = db.prepare(`
    INSERT INTO orders (houseNumber, phoneNumber, quantity, rate, total_amount, orderType, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    order.houseNumber || "",
    order.phoneNumber || "",
    parseFloat(order.quantity) || 0,
    parseFloat(order.rate.replace(/[^0-9.-]+/g, "")) || 0,
    (parseFloat(order.quantity) || 0) * (parseFloat(order.rate.replace(/[^0-9.-]+/g, "")) || 0),
    order.orderType || "delivery",
    order.remarks || ""
  );
  return { success: true, id: info.lastInsertRowid };
});
ipcMain.handle("order:getAll", () => {
  return db.prepare(`SELECT * FROM orders ORDER BY createdAt DESC`).all();
});
ipcMain.handle("order:delete", (event, orderId) => {
  const result = db.prepare("DELETE FROM orders WHERE id = ?").run(orderId);
  return { success: result.changes > 0 };
});
ipcMain.handle("order:updateStatus", (event, { orderId, newStatus }) => {
  const result = db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(newStatus, orderId);
  return { success: result.changes > 0 };
});
ipcMain.handle("order:getAllHouseNumbers", () => {
  const result = db.prepare("SELECT DISTINCT houseNumber FROM orders").all();
  return result.map((r) => r.houseNumber);
});
ipcMain.handle("payment:add", (event, payment) => {
  const stmt = db.prepare(`
    INSERT INTO payments (order_id, amount_paid, payment_method)
    VALUES (?, ?, ?)
  `);
  const info = stmt.run(
    payment.order_id,
    payment.amount_paid,
    payment.payment_method
  );
  return { success: true, id: info.lastInsertRowid };
});
ipcMain.handle("payment:getByOrder", (event, order_id) => {
  return db.prepare("SELECT * FROM payments WHERE order_id = ?").all(order_id);
});
ipcMain.handle("due:add", (event, due) => {
  const stmt = db.prepare(`
    INSERT INTO dues_ledger (houseNumber, order_id, due_amount, paid_amount)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(
    due.houseNumber,
    due.order_id,
    due.due_amount,
    due.paid_amount || 0
  );
  return { success: true, id: info.lastInsertRowid };
});
ipcMain.handle("due:getAll", () => {
  return db.prepare("SELECT * FROM dues_ledger ORDER BY createdAt DESC").all();
});
ipcMain.handle("due:updatePayment", (event, { id, paid_amount }) => {
  const result = db.prepare(
    `
    UPDATE dues_ledger SET paid_amount = ?, isSettled = CASE WHEN ? >= due_amount THEN 1 ELSE 0 END
    WHERE id = ?
  `
  ).run(paid_amount, paid_amount, id);
  return { success: result.changes > 0 };
});
ipcMain.handle("deliveryBoy:add", (event, boy) => {
  const stmt = db.prepare(
    "INSERT INTO delivery_boys (name, phoneNumber, salary, iDCard, remarks) VALUES (?, ?, ?, ?, ?)"
  );
  const info = stmt.run(
    boy.name,
    boy.phoneNumber,
    boy.salary,
    boy.iDCard,
    boy.remarks
  );
  return { success: true, id: info.lastInsertRowid };
});
ipcMain.handle("deliveryBoy:getAll", () => {
  return db.prepare("SELECT * FROM delivery_boys").all();
});
ipcMain.handle(
  "orderDelivery:assign",
  (event, { order_id, delivery_boy_id }) => {
    const stmt = db.prepare(
      "INSERT INTO order_delivery (order_id, delivery_boy_id) VALUES (?, ?)"
    );
    const info = stmt.run(order_id, delivery_boy_id);
    return { success: true, id: info.lastInsertRowid };
  }
);
ipcMain.handle("order:add:smart", async (event, order) => {
  const {
    houseNumber,
    phoneNumber,
    quantity,
    rate,
    remarks,
    orderType,
    status
  } = order;
  const totalDue = (parseFloat(quantity) || 0) * (parseFloat(rate.replace(/[^0-9.-]+/g, "")) || 0);
  const insertOrder = db.prepare(`
    INSERT INTO orders (houseNumber, phoneNumber, quantity, rate, total_amount, remarks, orderType, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = insertOrder.run(
    houseNumber,
    phoneNumber,
    quantity,
    rate,
    totalDue,
    remarks,
    orderType,
    status
  );
  const orderId = result.lastInsertRowid;
  if (status !== "complete") {
    const insertDue = db.prepare(`
      INSERT INTO dues_ledger (order_id, due_amount, houseNumber)
      VALUES (?, ?, ?)
      `);
    insertDue.run(orderId, totalDue, houseNumber);
  }
  return { success: true, id: orderId };
});
ipcMain.handle(
  "order:markComplete",
  async (event, { orderId, amount_paid, payment_method, deliveryBoy }) => {
    try {
      const getOrder = db.prepare(
        `SELECT total_amount FROM orders WHERE id = ?`
      );
      const order = getOrder.get(orderId);
      if (!order) {
        return { success: false, error: "Order not found." };
      }
      const totalAmount = order.total_amount;
      let status = "complete";
      if (amount_paid < totalAmount) {
        status = "debit";
      } else if (amount_paid > totalAmount) {
        status = "credit";
      }
      const updateOrder = db.prepare(
        `UPDATE orders SET status = ? WHERE id = ?`
      );
      updateOrder.run(status, orderId);
      const insertPayment = db.prepare(`
        INSERT INTO payments (order_id, amount_paid, payment_method)
        VALUES (?, ?, ?)
      `);
      insertPayment.run(orderId, amount_paid, payment_method);
      const removeDue = db.prepare(
        `DELETE FROM dues_ledger WHERE order_id = ?`
      );
      const getDue = db.prepare(`SELECT * FROM dues_ledger WHERE order_id = ?`).get(orderId);
      if (status === "debit") {
        const dueAmount = totalAmount - amount_paid;
        console.log(dueAmount, totalAmount, amount_paid, "if status is debit");
        if (getDue) {
          const updateDue = db.prepare(
            `UPDATE dues_ledger SET isSettled = ?, paid_amount = ? WHERE order_id = ?`
          );
          updateDue.run(dueAmount, amount_paid, orderId);
        }
      } else if (status === "credit") {
        const overpaidAmount = amount_paid - totalAmount;
        if (getDue) {
          const updateDue = db.prepare(
            `UPDATE dues_ledger SET isSettled = ?, paid_amount = ? WHERE order_id = ?`
          );
          updateDue.run(-overpaidAmount, amount_paid, orderId);
        }
      } else {
        if (getDue) removeDue.run(orderId);
      }
      const insertDelivery = db.prepare(`
        INSERT INTO order_delivery (order_id, delivery_boy_id)
        VALUES (?, ?)
      `);
      insertDelivery.run(orderId, deliveryBoy);
      return { success: true, status };
    } catch (error) {
      console.error("Error in order:markComplete:", error);
      return { success: false, error: error.message };
    }
  }
);
ipcMain.handle("dues:isSettledSum", async (event, houseNumber) => {
  try {
    const stmt = db.prepare(`
      SELECT isSettled FROM dues_ledger WHERE houseNumber = ?
    `);
    const rows = stmt.all(houseNumber);
    const isSettledSum = rows.reduce(
      (sum, row) => sum + Number(row.isSettled || 0),
      0
    );
    return { success: true, isSettledSum };
  } catch (error) {
    console.error("Error in dues:isSettledSum:", error);
    return { success: false, error: error.message };
  }
});
ipcMain.handle("order:getDeliveryBoyName", async (event, orderId) => {
  try {
    const orderStmt = db.prepare(`SELECT status FROM orders WHERE id = ?`);
    const order = orderStmt.get(orderId);
    if (!order) {
      return { success: false, error: "Order not found" };
    }
    const status = order.status.toLowerCase();
    if (status === "pending" || status === "cancelled") {
      return {
        success: false,
        message: "Order is not completed or delivered yet"
      };
    }
    const deliveryStmt = db.prepare(
      `SELECT delivery_boy_id FROM order_delivery WHERE order_id = ?`
    );
    const delivery = deliveryStmt.get(orderId);
    if (!delivery) {
      return { success: false, error: "Delivery record not found" };
    }
    const boyStmt = db.prepare(`SELECT name FROM delivery_boys WHERE id = ?`);
    const boy = boyStmt.get(delivery.delivery_boy_id);
    if (!boy) {
      return { success: false, error: "Delivery boy not found" };
    }
    return { success: true, name: boy.name };
  } catch (error) {
    console.error("Error in order:getDeliveryBoyName:", error);
    return { success: false, error: error.message };
  }
});
ipcMain.handle("orderDelivery:getAll", () => {
  return db.prepare(
    `
    SELECT od.*, o.houseNumber, d.name as deliveryBoyName FROM order_delivery od
    JOIN orders o ON od.order_id = o.id
    JOIN delivery_boys d ON od.delivery_boy_id = d.id
    ORDER BY od.id DESC
  `
  ).all();
});
ipcMain.handle("order:add:walkIn", async (event, order) => {
  try {
    const { houseNumber, quantity, rate, remarks, payment_method } = order;
    const totalAmount = (parseFloat(quantity) || 0) * (parseFloat(rate.replace(/[^0-9.-]+/g, "")) || 0);
    const insertOrder = db.prepare(`
      INSERT INTO orders (houseNumber, phoneNumber, quantity, rate, total_amount, remarks, status)
      VALUES (?, NULL, ?, ?, ?, ?, 'complete')
    `);
    const result = insertOrder.run(
      houseNumber,
      quantity,
      rate,
      totalAmount,
      remarks
    );
    const orderId = result.lastInsertRowid;
    const insertPayment = db.prepare(`
      INSERT INTO payments (order_id, amount_paid, payment_method)
      VALUES (?, ?, ?)
    `);
    insertPayment.run(orderId, totalAmount, payment_method || "cash");
    return { success: true, id: orderId };
  } catch (err) {
    console.error("Error in order:add:walkIn:", err);
    return { success: false, error: err.message };
  }
});
ipcMain.handle("stats:todaySummary", async () => {
  try {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const totalSalesToday = db.prepare(
      `
      SELECT COUNT(*) as count
      FROM orders
      WHERE DATE(createdAt) = DATE(?)
    `
    ).get(today).count;
    const totalRevenueToday = db.prepare(
      `
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM orders
      WHERE DATE(createdAt) = DATE(?)
    `
    ).get(today).total;
    const deliveryRevenueToday = db.prepare(
      `
      SELECT COALESCE(SUM(o.amount_paid), 0) as total
      FROM payments o
      JOIN orders d ON o.order_id = d.id
      WHERE DATE(createdAt) = DATE(?)
    `
    ).get(today).total;
    const totalExpensesToday = db.prepare(
      `
      SELECT COALESCE(SUM(amount), 0) as total
      FROM expenses
      WHERE DATE(createdAt) = DATE(?)
    `
    ).get(today).total;
    return {
      success: true,
      data: {
        totalSalesToday,
        totalRevenueToday,
        deliveryRevenueToday,
        totalExpensesToday
      }
    };
  } catch (err) {
    console.error("Error in stats:todaySummary:", err);
    return { success: false, error: err.message };
  }
});
ipcMain.handle("expense:add", async (event, { name, amount }) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO expenses (name, amount)
      VALUES (?, ?)
    `);
    const result = stmt.run(name, amount);
    return { success: true, id: result.lastInsertRowid };
  } catch (err) {
    console.error("Failed to add expense:", err);
    return { success: false, error: err.message };
  }
});
ipcMain.handle("expense:getAll", async () => {
  try {
    const stmt = db.prepare("SELECT * FROM expenses ORDER BY createdAt DESC");
    const data = stmt.all();
    return { success: true, data };
  } catch (err) {
    console.error("Failed to fetch expenses:", err);
    return { success: false, error: err.message };
  }
});
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname = path$1.dirname(__filename$1);
let mainWindow;
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: __dirname + "/preload.js",
      // adjust if needed
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path$1.join(__dirname, "../../dist/index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};
app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
