#!/usr/bin/env node
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 682);
/******/ })
/************************************************************************/
/******/ ({

/***/ 16:
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ 22:
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ 57:
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ 675:
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

var EventEmitter = __webpack_require__(80).EventEmitter;
var spawn = __webpack_require__(57).spawn;
var path = __webpack_require__(22);
var dirname = path.dirname;
var basename = path.basename;
var fs = __webpack_require__(16);

/**
 * Expose the root command.
 */

exports = module.exports = new Command();

/**
 * Expose `Command`.
 */

exports.Command = Command;

/**
 * Expose `Option`.
 */

exports.Option = Option;

/**
 * Initialize a new `Option` with the given `flags` and `description`.
 *
 * @param {String} flags
 * @param {String} description
 * @api public
 */

function Option(flags, description) {
  this.flags = flags;
  this.required = ~flags.indexOf('<');
  this.optional = ~flags.indexOf('[');
  this.bool = !~flags.indexOf('-no-');
  flags = flags.split(/[ ,|]+/);
  if (flags.length > 1 && !/^[[<]/.test(flags[1])) this.short = flags.shift();
  this.long = flags.shift();
  this.description = description || '';
}

/**
 * Return option name.
 *
 * @return {String}
 * @api private
 */

Option.prototype.name = function() {
  return this.long
    .replace('--', '')
    .replace('no-', '');
};

/**
 * Return option name, in a camelcase format that can be used
 * as a object attribute key.
 *
 * @return {String}
 * @api private
 */

Option.prototype.attributeName = function() {
  return camelcase( this.name() );
};

/**
 * Check if `arg` matches the short or long flag.
 *
 * @param {String} arg
 * @return {Boolean}
 * @api private
 */

Option.prototype.is = function(arg) {
  return arg == this.short || arg == this.long;
};

/**
 * Initialize a new `Command`.
 *
 * @param {String} name
 * @api public
 */

function Command(name) {
  this.commands = [];
  this.options = [];
  this._execs = {};
  this._allowUnknownOption = false;
  this._args = [];
  this._name = name || '';
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Command.prototype.__proto__ = EventEmitter.prototype;

/**
 * Add command `name`.
 *
 * The `.action()` callback is invoked when the
 * command `name` is specified via __ARGV__,
 * and the remaining arguments are applied to the
 * function for access.
 *
 * When the `name` is "*" an un-matched command
 * will be passed as the first arg, followed by
 * the rest of __ARGV__ remaining.
 *
 * Examples:
 *
 *      program
 *        .version('0.0.1')
 *        .option('-C, --chdir <path>', 'change the working directory')
 *        .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
 *        .option('-T, --no-tests', 'ignore test hook')
 *
 *      program
 *        .command('setup')
 *        .description('run remote setup commands')
 *        .action(function() {
 *          console.log('setup');
 *        });
 *
 *      program
 *        .command('exec <cmd>')
 *        .description('run the given remote command')
 *        .action(function(cmd) {
 *          console.log('exec "%s"', cmd);
 *        });
 *
 *      program
 *        .command('teardown <dir> [otherDirs...]')
 *        .description('run teardown commands')
 *        .action(function(dir, otherDirs) {
 *          console.log('dir "%s"', dir);
 *          if (otherDirs) {
 *            otherDirs.forEach(function (oDir) {
 *              console.log('dir "%s"', oDir);
 *            });
 *          }
 *        });
 *
 *      program
 *        .command('*')
 *        .description('deploy the given env')
 *        .action(function(env) {
 *          console.log('deploying "%s"', env);
 *        });
 *
 *      program.parse(process.argv);
  *
 * @param {String} name
 * @param {String} [desc] for git-style sub-commands
 * @return {Command} the new command
 * @api public
 */

Command.prototype.command = function(name, desc, opts) {
  if(typeof desc === 'object' && desc !== null){
    opts = desc;
    desc = null;
  }
  opts = opts || {};
  var args = name.split(/ +/);
  var cmd = new Command(args.shift());

  if (desc) {
    cmd.description(desc);
    this.executables = true;
    this._execs[cmd._name] = true;
    if (opts.isDefault) this.defaultExecutable = cmd._name;
  }
  cmd._noHelp = !!opts.noHelp;
  this.commands.push(cmd);
  cmd.parseExpectedArgs(args);
  cmd.parent = this;

  if (desc) return this;
  return cmd;
};

/**
 * Define argument syntax for the top-level command.
 *
 * @api public
 */

Command.prototype.arguments = function (desc) {
  return this.parseExpectedArgs(desc.split(/ +/));
};

/**
 * Add an implicit `help [cmd]` subcommand
 * which invokes `--help` for the given command.
 *
 * @api private
 */

Command.prototype.addImplicitHelpCommand = function() {
  this.command('help [cmd]', 'display help for [cmd]');
};

/**
 * Parse expected `args`.
 *
 * For example `["[type]"]` becomes `[{ required: false, name: 'type' }]`.
 *
 * @param {Array} args
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.parseExpectedArgs = function(args) {
  if (!args.length) return;
  var self = this;
  args.forEach(function(arg) {
    var argDetails = {
      required: false,
      name: '',
      variadic: false
    };

    switch (arg[0]) {
      case '<':
        argDetails.required = true;
        argDetails.name = arg.slice(1, -1);
        break;
      case '[':
        argDetails.name = arg.slice(1, -1);
        break;
    }

    if (argDetails.name.length > 3 && argDetails.name.slice(-3) === '...') {
      argDetails.variadic = true;
      argDetails.name = argDetails.name.slice(0, -3);
    }
    if (argDetails.name) {
      self._args.push(argDetails);
    }
  });
  return this;
};

/**
 * Register callback `fn` for the command.
 *
 * Examples:
 *
 *      program
 *        .command('help')
 *        .description('display verbose help')
 *        .action(function() {
 *           // output help here
 *        });
 *
 * @param {Function} fn
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.action = function(fn) {
  var self = this;
  var listener = function(args, unknown) {
    // Parse any so-far unknown options
    args = args || [];
    unknown = unknown || [];

    var parsed = self.parseOptions(unknown);

    // Output help if necessary
    outputHelpIfNecessary(self, parsed.unknown);

    // If there are still any unknown options, then we simply
    // die, unless someone asked for help, in which case we give it
    // to them, and then we die.
    if (parsed.unknown.length > 0) {
      self.unknownOption(parsed.unknown[0]);
    }

    // Leftover arguments need to be pushed back. Fixes issue #56
    if (parsed.args.length) args = parsed.args.concat(args);

    self._args.forEach(function(arg, i) {
      if (arg.required && null == args[i]) {
        self.missingArgument(arg.name);
      } else if (arg.variadic) {
        if (i !== self._args.length - 1) {
          self.variadicArgNotLast(arg.name);
        }

        args[i] = args.splice(i);
      }
    });

    // Always append ourselves to the end of the arguments,
    // to make sure we match the number of arguments the user
    // expects
    if (self._args.length) {
      args[self._args.length] = self;
    } else {
      args.push(self);
    }

    fn.apply(self, args);
  };
  var parent = this.parent || this;
  var name = parent === this ? '*' : this._name;
  parent.on('command:' + name, listener);
  if (this._alias) parent.on('command:' + this._alias, listener);
  return this;
};

/**
 * Define option with `flags`, `description` and optional
 * coercion `fn`.
 *
 * The `flags` string should contain both the short and long flags,
 * separated by comma, a pipe or space. The following are all valid
 * all will output this way when `--help` is used.
 *
 *    "-p, --pepper"
 *    "-p|--pepper"
 *    "-p --pepper"
 *
 * Examples:
 *
 *     // simple boolean defaulting to false
 *     program.option('-p, --pepper', 'add pepper');
 *
 *     --pepper
 *     program.pepper
 *     // => Boolean
 *
 *     // simple boolean defaulting to true
 *     program.option('-C, --no-cheese', 'remove cheese');
 *
 *     program.cheese
 *     // => true
 *
 *     --no-cheese
 *     program.cheese
 *     // => false
 *
 *     // required argument
 *     program.option('-C, --chdir <path>', 'change the working directory');
 *
 *     --chdir /tmp
 *     program.chdir
 *     // => "/tmp"
 *
 *     // optional argument
 *     program.option('-c, --cheese [type]', 'add cheese [marble]');
 *
 * @param {String} flags
 * @param {String} description
 * @param {Function|*} [fn] or default
 * @param {*} [defaultValue]
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.option = function(flags, description, fn, defaultValue) {
  var self = this
    , option = new Option(flags, description)
    , oname = option.name()
    , name = option.attributeName();

  // default as 3rd arg
  if (typeof fn != 'function') {
    if (fn instanceof RegExp) {
      var regex = fn;
      fn = function(val, def) {
        var m = regex.exec(val);
        return m ? m[0] : def;
      }
    }
    else {
      defaultValue = fn;
      fn = null;
    }
  }

  // preassign default value only for --no-*, [optional], or <required>
  if (false == option.bool || option.optional || option.required) {
    // when --no-* we make sure default is true
    if (false == option.bool) defaultValue = true;
    // preassign only if we have a default
    if (undefined !== defaultValue) {
      self[name] = defaultValue;
      option.defaultValue = defaultValue;
    }
  }

  // register the option
  this.options.push(option);

  // when it's passed assign the value
  // and conditionally invoke the callback
  this.on('option:' + oname, function(val) {
    // coercion
    if (null !== val && fn) val = fn(val, undefined === self[name]
      ? defaultValue
      : self[name]);

    // unassigned or bool
    if ('boolean' == typeof self[name] || 'undefined' == typeof self[name]) {
      // if no value, bool true, and we have a default, then use it!
      if (null == val) {
        self[name] = option.bool
          ? defaultValue || true
          : false;
      } else {
        self[name] = val;
      }
    } else if (null !== val) {
      // reassign
      self[name] = val;
    }
  });

  return this;
};

/**
 * Allow unknown options on the command line.
 *
 * @param {Boolean} arg if `true` or omitted, no error will be thrown
 * for unknown options.
 * @api public
 */
Command.prototype.allowUnknownOption = function(arg) {
    this._allowUnknownOption = arguments.length === 0 || arg;
    return this;
};

/**
 * Parse `argv`, settings options and invoking commands when defined.
 *
 * @param {Array} argv
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.parse = function(argv) {
  // implicit help
  if (this.executables) this.addImplicitHelpCommand();

  // store raw args
  this.rawArgs = argv;

  // guess name
  this._name = this._name || basename(argv[1], '.js');

  // github-style sub-commands with no sub-command
  if (this.executables && argv.length < 3 && !this.defaultExecutable) {
    // this user needs help
    argv.push('--help');
  }

  // process argv
  var parsed = this.parseOptions(this.normalize(argv.slice(2)));
  var args = this.args = parsed.args;

  var result = this.parseArgs(this.args, parsed.unknown);

  // executable sub-commands
  var name = result.args[0];

  var aliasCommand = null;
  // check alias of sub commands
  if (name) {
    aliasCommand = this.commands.filter(function(command) {
      return command.alias() === name;
    })[0];
  }

  if (this._execs[name] && typeof this._execs[name] != "function") {
    return this.executeSubCommand(argv, args, parsed.unknown);
  } else if (aliasCommand) {
    // is alias of a subCommand
    args[0] = aliasCommand._name;
    return this.executeSubCommand(argv, args, parsed.unknown);
  } else if (this.defaultExecutable) {
    // use the default subcommand
    args.unshift(this.defaultExecutable);
    return this.executeSubCommand(argv, args, parsed.unknown);
  }

  return result;
};

/**
 * Execute a sub-command executable.
 *
 * @param {Array} argv
 * @param {Array} args
 * @param {Array} unknown
 * @api private
 */

Command.prototype.executeSubCommand = function(argv, args, unknown) {
  args = args.concat(unknown);

  if (!args.length) this.help();
  if ('help' == args[0] && 1 == args.length) this.help();

  // <cmd> --help
  if ('help' == args[0]) {
    args[0] = args[1];
    args[1] = '--help';
  }

  // executable
  var f = argv[1];
  // name of the subcommand, link `pm-install`
  var bin = basename(f, '.js') + '-' + args[0];


  // In case of globally installed, get the base dir where executable
  //  subcommand file should be located at
  var baseDir
    , link = fs.lstatSync(f).isSymbolicLink() ? fs.readlinkSync(f) : f;

  // when symbolink is relative path
  if (link !== f && link.charAt(0) !== '/') {
    link = path.join(dirname(f), link)
  }
  baseDir = dirname(link);

  // prefer local `./<bin>` to bin in the $PATH
  var localBin = path.join(baseDir, bin);

  // whether bin file is a js script with explicit `.js` extension
  var isExplicitJS = false;
  if (exists(localBin + '.js')) {
    bin = localBin + '.js';
    isExplicitJS = true;
  } else if (exists(localBin)) {
    bin = localBin;
  }

  args = args.slice(1);

  var proc;
  if (process.platform !== 'win32') {
    if (isExplicitJS) {
      args.unshift(bin);
      // add executable arguments to spawn
      args = (process.execArgv || []).concat(args);

      proc = spawn(process.argv[0], args, { stdio: 'inherit', customFds: [0, 1, 2] });
    } else {
      proc = spawn(bin, args, { stdio: 'inherit', customFds: [0, 1, 2] });
    }
  } else {
    args.unshift(bin);
    proc = spawn(process.execPath, args, { stdio: 'inherit'});
  }

  var signals = ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'];
  signals.forEach(function(signal) {
    process.on(signal, function(){
      if ((proc.killed === false) && (proc.exitCode === null)){
        proc.kill(signal);
      }
    });
  });
  proc.on('close', process.exit.bind(process));
  proc.on('error', function(err) {
    if (err.code == "ENOENT") {
      console.error('\n  %s(1) does not exist, try --help\n', bin);
    } else if (err.code == "EACCES") {
      console.error('\n  %s(1) not executable. try chmod or run with root\n', bin);
    }
    process.exit(1);
  });

  // Store the reference to the child process
  this.runningCommand = proc;
};

/**
 * Normalize `args`, splitting joined short flags. For example
 * the arg "-abc" is equivalent to "-a -b -c".
 * This also normalizes equal sign and splits "--abc=def" into "--abc def".
 *
 * @param {Array} args
 * @return {Array}
 * @api private
 */

Command.prototype.normalize = function(args) {
  var ret = []
    , arg
    , lastOpt
    , index;

  for (var i = 0, len = args.length; i < len; ++i) {
    arg = args[i];
    if (i > 0) {
      lastOpt = this.optionFor(args[i-1]);
    }

    if (arg === '--') {
      // Honor option terminator
      ret = ret.concat(args.slice(i));
      break;
    } else if (lastOpt && lastOpt.required) {
      ret.push(arg);
    } else if (arg.length > 1 && '-' == arg[0] && '-' != arg[1]) {
      arg.slice(1).split('').forEach(function(c) {
        ret.push('-' + c);
      });
    } else if (/^--/.test(arg) && ~(index = arg.indexOf('='))) {
      ret.push(arg.slice(0, index), arg.slice(index + 1));
    } else {
      ret.push(arg);
    }
  }

  return ret;
};

/**
 * Parse command `args`.
 *
 * When listener(s) are available those
 * callbacks are invoked, otherwise the "*"
 * event is emitted and those actions are invoked.
 *
 * @param {Array} args
 * @return {Command} for chaining
 * @api private
 */

Command.prototype.parseArgs = function(args, unknown) {
  var name;

  if (args.length) {
    name = args[0];
    if (this.listeners('command:' + name).length) {
      this.emit('command:' + args.shift(), args, unknown);
    } else {
      this.emit('command:*', args);
    }
  } else {
    outputHelpIfNecessary(this, unknown);

    // If there were no args and we have unknown options,
    // then they are extraneous and we need to error.
    if (unknown.length > 0) {
      this.unknownOption(unknown[0]);
    }
  }

  return this;
};

/**
 * Return an option matching `arg` if any.
 *
 * @param {String} arg
 * @return {Option}
 * @api private
 */

Command.prototype.optionFor = function(arg) {
  for (var i = 0, len = this.options.length; i < len; ++i) {
    if (this.options[i].is(arg)) {
      return this.options[i];
    }
  }
};

/**
 * Parse options from `argv` returning `argv`
 * void of these options.
 *
 * @param {Array} argv
 * @return {Array}
 * @api public
 */

Command.prototype.parseOptions = function(argv) {
  var args = []
    , len = argv.length
    , literal
    , option
    , arg;

  var unknownOptions = [];

  // parse options
  for (var i = 0; i < len; ++i) {
    arg = argv[i];

    // literal args after --
    if (literal) {
      args.push(arg);
      continue;
    }

    if ('--' == arg) {
      literal = true;
      continue;
    }

    // find matching Option
    option = this.optionFor(arg);

    // option is defined
    if (option) {
      // requires arg
      if (option.required) {
        arg = argv[++i];
        if (null == arg) return this.optionMissingArgument(option);
        this.emit('option:' + option.name(), arg);
      // optional arg
      } else if (option.optional) {
        arg = argv[i+1];
        if (null == arg || ('-' == arg[0] && '-' != arg)) {
          arg = null;
        } else {
          ++i;
        }
        this.emit('option:' + option.name(), arg);
      // bool
      } else {
        this.emit('option:' + option.name());
      }
      continue;
    }

    // looks like an option
    if (arg.length > 1 && '-' == arg[0]) {
      unknownOptions.push(arg);

      // If the next argument looks like it might be
      // an argument for this option, we pass it on.
      // If it isn't, then it'll simply be ignored
      if (argv[i+1] && '-' != argv[i+1][0]) {
        unknownOptions.push(argv[++i]);
      }
      continue;
    }

    // arg
    args.push(arg);
  }

  return { args: args, unknown: unknownOptions };
};

/**
 * Return an object containing options as key-value pairs
 *
 * @return {Object}
 * @api public
 */
Command.prototype.opts = function() {
  var result = {}
    , len = this.options.length;

  for (var i = 0 ; i < len; i++) {
    var key = this.options[i].attributeName();
    result[key] = key === 'version' ? this._version : this[key];
  }
  return result;
};

/**
 * Argument `name` is missing.
 *
 * @param {String} name
 * @api private
 */

Command.prototype.missingArgument = function(name) {
  console.error();
  console.error("  error: missing required argument `%s'", name);
  console.error();
  process.exit(1);
};

/**
 * `Option` is missing an argument, but received `flag` or nothing.
 *
 * @param {String} option
 * @param {String} flag
 * @api private
 */

Command.prototype.optionMissingArgument = function(option, flag) {
  console.error();
  if (flag) {
    console.error("  error: option `%s' argument missing, got `%s'", option.flags, flag);
  } else {
    console.error("  error: option `%s' argument missing", option.flags);
  }
  console.error();
  process.exit(1);
};

/**
 * Unknown option `flag`.
 *
 * @param {String} flag
 * @api private
 */

Command.prototype.unknownOption = function(flag) {
  if (this._allowUnknownOption) return;
  console.error();
  console.error("  error: unknown option `%s'", flag);
  console.error();
  process.exit(1);
};

/**
 * Variadic argument with `name` is not the last argument as required.
 *
 * @param {String} name
 * @api private
 */

Command.prototype.variadicArgNotLast = function(name) {
  console.error();
  console.error("  error: variadic arguments must be last `%s'", name);
  console.error();
  process.exit(1);
};

/**
 * Set the program version to `str`.
 *
 * This method auto-registers the "-V, --version" flag
 * which will print the version number when passed.
 *
 * @param {String} str
 * @param {String} [flags]
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.version = function(str, flags) {
  if (0 == arguments.length) return this._version;
  this._version = str;
  flags = flags || '-V, --version';
  this.option(flags, 'output the version number');
  this.on('option:version', function() {
    process.stdout.write(str + '\n');
    process.exit(0);
  });
  return this;
};

/**
 * Set the description to `str`.
 *
 * @param {String} str
 * @return {String|Command}
 * @api public
 */

Command.prototype.description = function(str) {
  if (0 === arguments.length) return this._description;
  this._description = str;
  return this;
};

/**
 * Set an alias for the command
 *
 * @param {String} alias
 * @return {String|Command}
 * @api public
 */

Command.prototype.alias = function(alias) {
  var command = this;
  if(this.commands.length !== 0) {
    command = this.commands[this.commands.length - 1]
  }

  if (arguments.length === 0) return command._alias;

  if (alias === command._name) throw new Error('Command alias can\'t be the same as its name');

  command._alias = alias;
  return this;
};

/**
 * Set / get the command usage `str`.
 *
 * @param {String} str
 * @return {String|Command}
 * @api public
 */

Command.prototype.usage = function(str) {
  var args = this._args.map(function(arg) {
    return humanReadableArgName(arg);
  });

  var usage = '[options]'
    + (this.commands.length ? ' [command]' : '')
    + (this._args.length ? ' ' + args.join(' ') : '');

  if (0 == arguments.length) return this._usage || usage;
  this._usage = str;

  return this;
};

/**
 * Get or set the name of the command
 *
 * @param {String} str
 * @return {String|Command}
 * @api public
 */

Command.prototype.name = function(str) {
  if (0 === arguments.length) return this._name;
  this._name = str;
  return this;
};

/**
 * Return the largest option length.
 *
 * @return {Number}
 * @api private
 */

Command.prototype.largestOptionLength = function() {
  return this.options.reduce(function(max, option) {
    return Math.max(max, option.flags.length);
  }, 0);
};

/**
 * Return help for options.
 *
 * @return {String}
 * @api private
 */

Command.prototype.optionHelp = function() {
  var width = this.largestOptionLength();

  // Append the help information
  return this.options.map(function(option) {
      return pad(option.flags, width) + '  ' + option.description
        + ((option.bool != false && option.defaultValue !== undefined) ? ' (default: ' + option.defaultValue + ')' : '');
  }).concat([pad('-h, --help', width) + '  ' + 'output usage information'])
    .join('\n');
};

/**
 * Return command help documentation.
 *
 * @return {String}
 * @api private
 */

Command.prototype.commandHelp = function() {
  if (!this.commands.length) return '';

  var commands = this.commands.filter(function(cmd) {
    return !cmd._noHelp;
  }).map(function(cmd) {
    var args = cmd._args.map(function(arg) {
      return humanReadableArgName(arg);
    }).join(' ');

    return [
      cmd._name
        + (cmd._alias ? '|' + cmd._alias : '')
        + (cmd.options.length ? ' [options]' : '')
        + (args ? ' ' + args : '')
      , cmd._description
    ];
  });

  var width = commands.reduce(function(max, command) {
    return Math.max(max, command[0].length);
  }, 0);

  return [
    ''
    , '  Commands:'
    , ''
    , commands.map(function(cmd) {
      var desc = cmd[1] ? '  ' + cmd[1] : '';
      return (desc ? pad(cmd[0], width) : cmd[0]) + desc;
    }).join('\n').replace(/^/gm, '    ')
    , ''
  ].join('\n');
};

/**
 * Return program help documentation.
 *
 * @return {String}
 * @api private
 */

Command.prototype.helpInformation = function() {
  var desc = [];
  if (this._description) {
    desc = [
      '  ' + this._description
      , ''
    ];
  }

  var cmdName = this._name;
  if (this._alias) {
    cmdName = cmdName + '|' + this._alias;
  }
  var usage = [
    ''
    ,'  Usage: ' + cmdName + ' ' + this.usage()
    , ''
  ];

  var cmds = [];
  var commandHelp = this.commandHelp();
  if (commandHelp) cmds = [commandHelp];

  var options = [
    ''
    , '  Options:'
    , ''
    , '' + this.optionHelp().replace(/^/gm, '    ')
    , ''
  ];

  return usage
    .concat(desc)
    .concat(options)
    .concat(cmds)
    .join('\n');
};

/**
 * Output help information for this command
 *
 * @api public
 */

Command.prototype.outputHelp = function(cb) {
  if (!cb) {
    cb = function(passthru) {
      return passthru;
    }
  }
  process.stdout.write(cb(this.helpInformation()));
  this.emit('--help');
};

/**
 * Output help information and exit.
 *
 * @api public
 */

Command.prototype.help = function(cb) {
  this.outputHelp(cb);
  process.exit();
};

/**
 * Camel-case the given `flag`
 *
 * @param {String} flag
 * @return {String}
 * @api private
 */

function camelcase(flag) {
  return flag.split('-').reduce(function(str, word) {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

/**
 * Pad `str` to `width`.
 *
 * @param {String} str
 * @param {Number} width
 * @return {String}
 * @api private
 */

function pad(str, width) {
  var len = Math.max(0, width - str.length);
  return str + Array(len + 1).join(' ');
}

/**
 * Output help information if necessary
 *
 * @param {Command} command to output help for
 * @param {Array} array of options to search for -h or --help
 * @api private
 */

function outputHelpIfNecessary(cmd, options) {
  options = options || [];
  for (var i = 0; i < options.length; i++) {
    if (options[i] == '--help' || options[i] == '-h') {
      cmd.outputHelp();
      process.exit(0);
    }
  }
}

/**
 * Takes an argument an returns its human readable equivalent for help usage.
 *
 * @param {Object} arg
 * @return {String}
 * @api private
 */

function humanReadableArgName(arg) {
  var nameOutput = arg.name + (arg.variadic === true ? '...' : '');

  return arg.required
    ? '<' + nameOutput + '>'
    : '[' + nameOutput + ']'
}

// for versions before node v0.8 when there weren't `fs.existsSync`
function exists(file) {
  try {
    if (fs.statSync(file).isFile()) {
      return true;
    }
  } catch (e) {
    return false;
  }
}



/***/ }),

/***/ 677:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.DEFAULT = { isDefault: true };
exports.LIST = 'list';
exports.LIST_DESC = 'list all your tasks';
exports.ADD = 'add';
exports.ADD_DESC = 'add a task in your list';
exports.DEL = 'del [id]';
exports.DEL_DESC = 'delete a task from you tasklist';
exports.DEL_OPTION = '-a, --all';
exports.DEL_OPTION_DESC = 'delete all tasks from database';
exports.LANG = 'lang';
exports.LANG_DESC = 'Pick a language for your pada';
exports.DONE = 'done [id]';
exports.DONE_DESC = 'Mark a task as complete';
exports.CONFIG = 'config';
exports.CONFIG_DESC = 'set username and email';
exports.CONFIG_OPTION_U = '-u, --username';
exports.CONFIG_OPTION_U_DESC = 'set username';
exports.CONFIG_OPTION_E = '-e, --email';
exports.CONFIG_OPTION_E_DESC = 'set email, you will be emailed if your task time\'s up ';


/***/ }),

/***/ 682:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var program = __webpack_require__(675);
var _a = __webpack_require__(677), DEFAULT = _a.DEFAULT, ADD = _a.ADD, ADD_DESC = _a.ADD_DESC, LIST = _a.LIST, LIST_DESC = _a.LIST_DESC, DEL = _a.DEL, DEL_DESC = _a.DEL_DESC, DEL_OPTION = _a.DEL_OPTION, DEL_OPTION_DESC = _a.DEL_OPTION_DESC, LANG = _a.LANG, LANG_DESC = _a.LANG_DESC, DONE = _a.DONE, DONE_DESC = _a.DONE_DESC, CONFIG = _a.CONFIG, CONFIG_DESC = _a.CONFIG_DESC;
var version = __webpack_require__(683)['version'];
var nodeVersion = process.version.match(/\d+/g)[0];
program
    .version(version, '-v, --version');
program
    .command(LIST, LIST_DESC)
    .alias('ls');
program
    .command(ADD, ADD_DESC)
    .alias('a');
program
    .command(DEL, DEL_DESC)
    .alias('d');
program
    .command(LANG, LANG_DESC);
program
    .command(DONE, DONE_DESC);
program
    .command(CONFIG, CONFIG_DESC);
program.parse(process.argv);


/***/ }),

/***/ 683:
/***/ (function(module, exports) {

module.exports = {"name":"pada","version":"0.1.2","description":"Command line interface for crul your todo list.","scripts":{"start":"webpack --config ./webpack.config.js --progress --watch","test":"echo \"Error: no test specified\" && exit 1","build":"webpack --config ./webpack.config.js"},"bin":{"pada":"dist/@pada/pada.js"},"keywords":["pada","pada-todo-list","node-todo-list"],"author":"Haowen <haowen737@gmail.com>","license":"MIT","dependencies":{"@types/cli-table2":"^0.2.1","@types/moment":"^2.13.0","@types/node":"^9.4.0","chalk":"^2.3.0","cli-table2":"^0.2.0","commander":"^2.13.0","inquirer":"^5.1.0","moment":"^2.20.1","node-emoji":"^1.8.1","node-timeter":"^1.0.4","sql.js":"^0.5.0","ts-loader":"^3.4.0","typescript":"^2.6.2","webpack":"^3.10.0"},"devDependencies":{"eslint-config-standard":"^11.0.0-beta.0","eslint-loader":"^1.9.0","eslint-plugin-import":"^2.8.0","eslint-plugin-node":"^6.0.0","eslint-plugin-promise":"^3.6.0","eslint-plugin-standard":"^3.0.1","tslint":"^5.9.1","tslint-loader":"^3.5.3"}}

/***/ }),

/***/ 80:
/***/ (function(module, exports) {

module.exports = require("events");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMjllN2ZhMWY1Nzk3YTc0Njc3ZTciLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2hpbGRfcHJvY2Vzc1wiIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb21tYW5kZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRMaXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9iaW4vcGFkYS50cyIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlLmpzb24iLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXZlbnRzXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REEsK0I7Ozs7Ozs7QUNBQSxpQzs7Ozs7OztBQ0FBLDBDOzs7Ozs7O0FDQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsZ0NBQWdDO0FBQ3ZFO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFlBQVksUUFBUTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLFdBQVcsU0FBUztBQUNwQixZQUFZLFFBQVE7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsV0FBVztBQUN0QixXQUFXLEVBQUU7QUFDYixZQUFZLFFBQVE7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFlBQVksUUFBUTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsTUFBTTtBQUNqQixXQUFXLE1BQU07QUFDakI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsMkNBQTJDLHlDQUF5QztBQUNwRixLQUFLO0FBQ0wsK0JBQStCLHlDQUF5QztBQUN4RTtBQUNBLEdBQUc7QUFDSDtBQUNBLDBDQUEwQyxrQkFBa0I7QUFDNUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxNQUFNO0FBQ2pCLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0NBQW9DLFNBQVM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBLDRDQUE0QyxTQUFTO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7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QTJHLHNLQUFzSyxRQUFRLDRCQUE0QiwrSEFBK0gsaVRBQWlULG9CQUFvQixnUDs7Ozs7OztBQ0Ezd0IsbUMiLCJmaWxlIjoicGFkYS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDY4Mik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMjllN2ZhMWY1Nzk3YTc0Njc3ZTciLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImZzXCJcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInBhdGhcIlxuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNSA2IDciLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjaGlsZF9wcm9jZXNzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiY2hpbGRfcHJvY2Vzc1wiXG4vLyBtb2R1bGUgaWQgPSA1N1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA3IiwiLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgc3Bhd24gPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuc3Bhd247XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBkaXJuYW1lID0gcGF0aC5kaXJuYW1lO1xudmFyIGJhc2VuYW1lID0gcGF0aC5iYXNlbmFtZTtcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbi8qKlxuICogRXhwb3NlIHRoZSByb290IGNvbW1hbmQuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gbmV3IENvbW1hbmQoKTtcblxuLyoqXG4gKiBFeHBvc2UgYENvbW1hbmRgLlxuICovXG5cbmV4cG9ydHMuQ29tbWFuZCA9IENvbW1hbmQ7XG5cbi8qKlxuICogRXhwb3NlIGBPcHRpb25gLlxuICovXG5cbmV4cG9ydHMuT3B0aW9uID0gT3B0aW9uO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYE9wdGlvbmAgd2l0aCB0aGUgZ2l2ZW4gYGZsYWdzYCBhbmQgYGRlc2NyaXB0aW9uYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmxhZ3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBkZXNjcmlwdGlvblxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBPcHRpb24oZmxhZ3MsIGRlc2NyaXB0aW9uKSB7XG4gIHRoaXMuZmxhZ3MgPSBmbGFncztcbiAgdGhpcy5yZXF1aXJlZCA9IH5mbGFncy5pbmRleE9mKCc8Jyk7XG4gIHRoaXMub3B0aW9uYWwgPSB+ZmxhZ3MuaW5kZXhPZignWycpO1xuICB0aGlzLmJvb2wgPSAhfmZsYWdzLmluZGV4T2YoJy1uby0nKTtcbiAgZmxhZ3MgPSBmbGFncy5zcGxpdCgvWyAsfF0rLyk7XG4gIGlmIChmbGFncy5sZW5ndGggPiAxICYmICEvXltbPF0vLnRlc3QoZmxhZ3NbMV0pKSB0aGlzLnNob3J0ID0gZmxhZ3Muc2hpZnQoKTtcbiAgdGhpcy5sb25nID0gZmxhZ3Muc2hpZnQoKTtcbiAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uIHx8ICcnO1xufVxuXG4vKipcbiAqIFJldHVybiBvcHRpb24gbmFtZS5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5PcHRpb24ucHJvdG90eXBlLm5hbWUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubG9uZ1xuICAgIC5yZXBsYWNlKCctLScsICcnKVxuICAgIC5yZXBsYWNlKCduby0nLCAnJyk7XG59O1xuXG4vKipcbiAqIFJldHVybiBvcHRpb24gbmFtZSwgaW4gYSBjYW1lbGNhc2UgZm9ybWF0IHRoYXQgY2FuIGJlIHVzZWRcbiAqIGFzIGEgb2JqZWN0IGF0dHJpYnV0ZSBrZXkuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuT3B0aW9uLnByb3RvdHlwZS5hdHRyaWJ1dGVOYW1lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBjYW1lbGNhc2UoIHRoaXMubmFtZSgpICk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGBhcmdgIG1hdGNoZXMgdGhlIHNob3J0IG9yIGxvbmcgZmxhZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJnXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuT3B0aW9uLnByb3RvdHlwZS5pcyA9IGZ1bmN0aW9uKGFyZykge1xuICByZXR1cm4gYXJnID09IHRoaXMuc2hvcnQgfHwgYXJnID09IHRoaXMubG9uZztcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgQ29tbWFuZGAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gQ29tbWFuZChuYW1lKSB7XG4gIHRoaXMuY29tbWFuZHMgPSBbXTtcbiAgdGhpcy5vcHRpb25zID0gW107XG4gIHRoaXMuX2V4ZWNzID0ge307XG4gIHRoaXMuX2FsbG93VW5rbm93bk9wdGlvbiA9IGZhbHNlO1xuICB0aGlzLl9hcmdzID0gW107XG4gIHRoaXMuX25hbWUgPSBuYW1lIHx8ICcnO1xufVxuXG4vKipcbiAqIEluaGVyaXQgZnJvbSBgRXZlbnRFbWl0dGVyLnByb3RvdHlwZWAuXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuX19wcm90b19fID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZTtcblxuLyoqXG4gKiBBZGQgY29tbWFuZCBgbmFtZWAuXG4gKlxuICogVGhlIGAuYWN0aW9uKClgIGNhbGxiYWNrIGlzIGludm9rZWQgd2hlbiB0aGVcbiAqIGNvbW1hbmQgYG5hbWVgIGlzIHNwZWNpZmllZCB2aWEgX19BUkdWX18sXG4gKiBhbmQgdGhlIHJlbWFpbmluZyBhcmd1bWVudHMgYXJlIGFwcGxpZWQgdG8gdGhlXG4gKiBmdW5jdGlvbiBmb3IgYWNjZXNzLlxuICpcbiAqIFdoZW4gdGhlIGBuYW1lYCBpcyBcIipcIiBhbiB1bi1tYXRjaGVkIGNvbW1hbmRcbiAqIHdpbGwgYmUgcGFzc2VkIGFzIHRoZSBmaXJzdCBhcmcsIGZvbGxvd2VkIGJ5XG4gKiB0aGUgcmVzdCBvZiBfX0FSR1ZfXyByZW1haW5pbmcuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBwcm9ncmFtXG4gKiAgICAgICAgLnZlcnNpb24oJzAuMC4xJylcbiAqICAgICAgICAub3B0aW9uKCctQywgLS1jaGRpciA8cGF0aD4nLCAnY2hhbmdlIHRoZSB3b3JraW5nIGRpcmVjdG9yeScpXG4gKiAgICAgICAgLm9wdGlvbignLWMsIC0tY29uZmlnIDxwYXRoPicsICdzZXQgY29uZmlnIHBhdGguIGRlZmF1bHRzIHRvIC4vZGVwbG95LmNvbmYnKVxuICogICAgICAgIC5vcHRpb24oJy1ULCAtLW5vLXRlc3RzJywgJ2lnbm9yZSB0ZXN0IGhvb2snKVxuICpcbiAqICAgICAgcHJvZ3JhbVxuICogICAgICAgIC5jb21tYW5kKCdzZXR1cCcpXG4gKiAgICAgICAgLmRlc2NyaXB0aW9uKCdydW4gcmVtb3RlIHNldHVwIGNvbW1hbmRzJylcbiAqICAgICAgICAuYWN0aW9uKGZ1bmN0aW9uKCkge1xuICogICAgICAgICAgY29uc29sZS5sb2coJ3NldHVwJyk7XG4gKiAgICAgICAgfSk7XG4gKlxuICogICAgICBwcm9ncmFtXG4gKiAgICAgICAgLmNvbW1hbmQoJ2V4ZWMgPGNtZD4nKVxuICogICAgICAgIC5kZXNjcmlwdGlvbigncnVuIHRoZSBnaXZlbiByZW1vdGUgY29tbWFuZCcpXG4gKiAgICAgICAgLmFjdGlvbihmdW5jdGlvbihjbWQpIHtcbiAqICAgICAgICAgIGNvbnNvbGUubG9nKCdleGVjIFwiJXNcIicsIGNtZCk7XG4gKiAgICAgICAgfSk7XG4gKlxuICogICAgICBwcm9ncmFtXG4gKiAgICAgICAgLmNvbW1hbmQoJ3RlYXJkb3duIDxkaXI+IFtvdGhlckRpcnMuLi5dJylcbiAqICAgICAgICAuZGVzY3JpcHRpb24oJ3J1biB0ZWFyZG93biBjb21tYW5kcycpXG4gKiAgICAgICAgLmFjdGlvbihmdW5jdGlvbihkaXIsIG90aGVyRGlycykge1xuICogICAgICAgICAgY29uc29sZS5sb2coJ2RpciBcIiVzXCInLCBkaXIpO1xuICogICAgICAgICAgaWYgKG90aGVyRGlycykge1xuICogICAgICAgICAgICBvdGhlckRpcnMuZm9yRWFjaChmdW5jdGlvbiAob0Rpcikge1xuICogICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkaXIgXCIlc1wiJywgb0Rpcik7XG4gKiAgICAgICAgICAgIH0pO1xuICogICAgICAgICAgfVxuICogICAgICAgIH0pO1xuICpcbiAqICAgICAgcHJvZ3JhbVxuICogICAgICAgIC5jb21tYW5kKCcqJylcbiAqICAgICAgICAuZGVzY3JpcHRpb24oJ2RlcGxveSB0aGUgZ2l2ZW4gZW52JylcbiAqICAgICAgICAuYWN0aW9uKGZ1bmN0aW9uKGVudikge1xuICogICAgICAgICAgY29uc29sZS5sb2coJ2RlcGxveWluZyBcIiVzXCInLCBlbnYpO1xuICogICAgICAgIH0pO1xuICpcbiAqICAgICAgcHJvZ3JhbS5wYXJzZShwcm9jZXNzLmFyZ3YpO1xuICAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHtTdHJpbmd9IFtkZXNjXSBmb3IgZ2l0LXN0eWxlIHN1Yi1jb21tYW5kc1xuICogQHJldHVybiB7Q29tbWFuZH0gdGhlIG5ldyBjb21tYW5kXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLmNvbW1hbmQgPSBmdW5jdGlvbihuYW1lLCBkZXNjLCBvcHRzKSB7XG4gIGlmKHR5cGVvZiBkZXNjID09PSAnb2JqZWN0JyAmJiBkZXNjICE9PSBudWxsKXtcbiAgICBvcHRzID0gZGVzYztcbiAgICBkZXNjID0gbnVsbDtcbiAgfVxuICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgdmFyIGFyZ3MgPSBuYW1lLnNwbGl0KC8gKy8pO1xuICB2YXIgY21kID0gbmV3IENvbW1hbmQoYXJncy5zaGlmdCgpKTtcblxuICBpZiAoZGVzYykge1xuICAgIGNtZC5kZXNjcmlwdGlvbihkZXNjKTtcbiAgICB0aGlzLmV4ZWN1dGFibGVzID0gdHJ1ZTtcbiAgICB0aGlzLl9leGVjc1tjbWQuX25hbWVdID0gdHJ1ZTtcbiAgICBpZiAob3B0cy5pc0RlZmF1bHQpIHRoaXMuZGVmYXVsdEV4ZWN1dGFibGUgPSBjbWQuX25hbWU7XG4gIH1cbiAgY21kLl9ub0hlbHAgPSAhIW9wdHMubm9IZWxwO1xuICB0aGlzLmNvbW1hbmRzLnB1c2goY21kKTtcbiAgY21kLnBhcnNlRXhwZWN0ZWRBcmdzKGFyZ3MpO1xuICBjbWQucGFyZW50ID0gdGhpcztcblxuICBpZiAoZGVzYykgcmV0dXJuIHRoaXM7XG4gIHJldHVybiBjbWQ7XG59O1xuXG4vKipcbiAqIERlZmluZSBhcmd1bWVudCBzeW50YXggZm9yIHRoZSB0b3AtbGV2ZWwgY29tbWFuZC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLmFyZ3VtZW50cyA9IGZ1bmN0aW9uIChkZXNjKSB7XG4gIHJldHVybiB0aGlzLnBhcnNlRXhwZWN0ZWRBcmdzKGRlc2Muc3BsaXQoLyArLykpO1xufTtcblxuLyoqXG4gKiBBZGQgYW4gaW1wbGljaXQgYGhlbHAgW2NtZF1gIHN1YmNvbW1hbmRcbiAqIHdoaWNoIGludm9rZXMgYC0taGVscGAgZm9yIHRoZSBnaXZlbiBjb21tYW5kLlxuICpcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLmFkZEltcGxpY2l0SGVscENvbW1hbmQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5jb21tYW5kKCdoZWxwIFtjbWRdJywgJ2Rpc3BsYXkgaGVscCBmb3IgW2NtZF0nKTtcbn07XG5cbi8qKlxuICogUGFyc2UgZXhwZWN0ZWQgYGFyZ3NgLlxuICpcbiAqIEZvciBleGFtcGxlIGBbXCJbdHlwZV1cIl1gIGJlY29tZXMgYFt7IHJlcXVpcmVkOiBmYWxzZSwgbmFtZTogJ3R5cGUnIH1dYC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzXG4gKiBAcmV0dXJuIHtDb21tYW5kfSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUucGFyc2VFeHBlY3RlZEFyZ3MgPSBmdW5jdGlvbihhcmdzKSB7XG4gIGlmICghYXJncy5sZW5ndGgpIHJldHVybjtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBhcmdzLmZvckVhY2goZnVuY3Rpb24oYXJnKSB7XG4gICAgdmFyIGFyZ0RldGFpbHMgPSB7XG4gICAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgICBuYW1lOiAnJyxcbiAgICAgIHZhcmlhZGljOiBmYWxzZVxuICAgIH07XG5cbiAgICBzd2l0Y2ggKGFyZ1swXSkge1xuICAgICAgY2FzZSAnPCc6XG4gICAgICAgIGFyZ0RldGFpbHMucmVxdWlyZWQgPSB0cnVlO1xuICAgICAgICBhcmdEZXRhaWxzLm5hbWUgPSBhcmcuc2xpY2UoMSwgLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1snOlxuICAgICAgICBhcmdEZXRhaWxzLm5hbWUgPSBhcmcuc2xpY2UoMSwgLTEpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoYXJnRGV0YWlscy5uYW1lLmxlbmd0aCA+IDMgJiYgYXJnRGV0YWlscy5uYW1lLnNsaWNlKC0zKSA9PT0gJy4uLicpIHtcbiAgICAgIGFyZ0RldGFpbHMudmFyaWFkaWMgPSB0cnVlO1xuICAgICAgYXJnRGV0YWlscy5uYW1lID0gYXJnRGV0YWlscy5uYW1lLnNsaWNlKDAsIC0zKTtcbiAgICB9XG4gICAgaWYgKGFyZ0RldGFpbHMubmFtZSkge1xuICAgICAgc2VsZi5fYXJncy5wdXNoKGFyZ0RldGFpbHMpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZWdpc3RlciBjYWxsYmFjayBgZm5gIGZvciB0aGUgY29tbWFuZC5cbiAqXG4gKiBFeGFtcGxlczpcbiAqXG4gKiAgICAgIHByb2dyYW1cbiAqICAgICAgICAuY29tbWFuZCgnaGVscCcpXG4gKiAgICAgICAgLmRlc2NyaXB0aW9uKCdkaXNwbGF5IHZlcmJvc2UgaGVscCcpXG4gKiAgICAgICAgLmFjdGlvbihmdW5jdGlvbigpIHtcbiAqICAgICAgICAgICAvLyBvdXRwdXQgaGVscCBoZXJlXG4gKiAgICAgICAgfSk7XG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0NvbW1hbmR9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5hY3Rpb24gPSBmdW5jdGlvbihmbikge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKGFyZ3MsIHVua25vd24pIHtcbiAgICAvLyBQYXJzZSBhbnkgc28tZmFyIHVua25vd24gb3B0aW9uc1xuICAgIGFyZ3MgPSBhcmdzIHx8IFtdO1xuICAgIHVua25vd24gPSB1bmtub3duIHx8IFtdO1xuXG4gICAgdmFyIHBhcnNlZCA9IHNlbGYucGFyc2VPcHRpb25zKHVua25vd24pO1xuXG4gICAgLy8gT3V0cHV0IGhlbHAgaWYgbmVjZXNzYXJ5XG4gICAgb3V0cHV0SGVscElmTmVjZXNzYXJ5KHNlbGYsIHBhcnNlZC51bmtub3duKTtcblxuICAgIC8vIElmIHRoZXJlIGFyZSBzdGlsbCBhbnkgdW5rbm93biBvcHRpb25zLCB0aGVuIHdlIHNpbXBseVxuICAgIC8vIGRpZSwgdW5sZXNzIHNvbWVvbmUgYXNrZWQgZm9yIGhlbHAsIGluIHdoaWNoIGNhc2Ugd2UgZ2l2ZSBpdFxuICAgIC8vIHRvIHRoZW0sIGFuZCB0aGVuIHdlIGRpZS5cbiAgICBpZiAocGFyc2VkLnVua25vd24ubGVuZ3RoID4gMCkge1xuICAgICAgc2VsZi51bmtub3duT3B0aW9uKHBhcnNlZC51bmtub3duWzBdKTtcbiAgICB9XG5cbiAgICAvLyBMZWZ0b3ZlciBhcmd1bWVudHMgbmVlZCB0byBiZSBwdXNoZWQgYmFjay4gRml4ZXMgaXNzdWUgIzU2XG4gICAgaWYgKHBhcnNlZC5hcmdzLmxlbmd0aCkgYXJncyA9IHBhcnNlZC5hcmdzLmNvbmNhdChhcmdzKTtcblxuICAgIHNlbGYuX2FyZ3MuZm9yRWFjaChmdW5jdGlvbihhcmcsIGkpIHtcbiAgICAgIGlmIChhcmcucmVxdWlyZWQgJiYgbnVsbCA9PSBhcmdzW2ldKSB7XG4gICAgICAgIHNlbGYubWlzc2luZ0FyZ3VtZW50KGFyZy5uYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJnLnZhcmlhZGljKSB7XG4gICAgICAgIGlmIChpICE9PSBzZWxmLl9hcmdzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBzZWxmLnZhcmlhZGljQXJnTm90TGFzdChhcmcubmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICBhcmdzW2ldID0gYXJncy5zcGxpY2UoaSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBBbHdheXMgYXBwZW5kIG91cnNlbHZlcyB0byB0aGUgZW5kIG9mIHRoZSBhcmd1bWVudHMsXG4gICAgLy8gdG8gbWFrZSBzdXJlIHdlIG1hdGNoIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRoZSB1c2VyXG4gICAgLy8gZXhwZWN0c1xuICAgIGlmIChzZWxmLl9hcmdzLmxlbmd0aCkge1xuICAgICAgYXJnc1tzZWxmLl9hcmdzLmxlbmd0aF0gPSBzZWxmO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcmdzLnB1c2goc2VsZik7XG4gICAgfVxuXG4gICAgZm4uYXBwbHkoc2VsZiwgYXJncyk7XG4gIH07XG4gIHZhciBwYXJlbnQgPSB0aGlzLnBhcmVudCB8fCB0aGlzO1xuICB2YXIgbmFtZSA9IHBhcmVudCA9PT0gdGhpcyA/ICcqJyA6IHRoaXMuX25hbWU7XG4gIHBhcmVudC5vbignY29tbWFuZDonICsgbmFtZSwgbGlzdGVuZXIpO1xuICBpZiAodGhpcy5fYWxpYXMpIHBhcmVudC5vbignY29tbWFuZDonICsgdGhpcy5fYWxpYXMsIGxpc3RlbmVyKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIERlZmluZSBvcHRpb24gd2l0aCBgZmxhZ3NgLCBgZGVzY3JpcHRpb25gIGFuZCBvcHRpb25hbFxuICogY29lcmNpb24gYGZuYC5cbiAqXG4gKiBUaGUgYGZsYWdzYCBzdHJpbmcgc2hvdWxkIGNvbnRhaW4gYm90aCB0aGUgc2hvcnQgYW5kIGxvbmcgZmxhZ3MsXG4gKiBzZXBhcmF0ZWQgYnkgY29tbWEsIGEgcGlwZSBvciBzcGFjZS4gVGhlIGZvbGxvd2luZyBhcmUgYWxsIHZhbGlkXG4gKiBhbGwgd2lsbCBvdXRwdXQgdGhpcyB3YXkgd2hlbiBgLS1oZWxwYCBpcyB1c2VkLlxuICpcbiAqICAgIFwiLXAsIC0tcGVwcGVyXCJcbiAqICAgIFwiLXB8LS1wZXBwZXJcIlxuICogICAgXCItcCAtLXBlcHBlclwiXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgIC8vIHNpbXBsZSBib29sZWFuIGRlZmF1bHRpbmcgdG8gZmFsc2VcbiAqICAgICBwcm9ncmFtLm9wdGlvbignLXAsIC0tcGVwcGVyJywgJ2FkZCBwZXBwZXInKTtcbiAqXG4gKiAgICAgLS1wZXBwZXJcbiAqICAgICBwcm9ncmFtLnBlcHBlclxuICogICAgIC8vID0+IEJvb2xlYW5cbiAqXG4gKiAgICAgLy8gc2ltcGxlIGJvb2xlYW4gZGVmYXVsdGluZyB0byB0cnVlXG4gKiAgICAgcHJvZ3JhbS5vcHRpb24oJy1DLCAtLW5vLWNoZWVzZScsICdyZW1vdmUgY2hlZXNlJyk7XG4gKlxuICogICAgIHByb2dyYW0uY2hlZXNlXG4gKiAgICAgLy8gPT4gdHJ1ZVxuICpcbiAqICAgICAtLW5vLWNoZWVzZVxuICogICAgIHByb2dyYW0uY2hlZXNlXG4gKiAgICAgLy8gPT4gZmFsc2VcbiAqXG4gKiAgICAgLy8gcmVxdWlyZWQgYXJndW1lbnRcbiAqICAgICBwcm9ncmFtLm9wdGlvbignLUMsIC0tY2hkaXIgPHBhdGg+JywgJ2NoYW5nZSB0aGUgd29ya2luZyBkaXJlY3RvcnknKTtcbiAqXG4gKiAgICAgLS1jaGRpciAvdG1wXG4gKiAgICAgcHJvZ3JhbS5jaGRpclxuICogICAgIC8vID0+IFwiL3RtcFwiXG4gKlxuICogICAgIC8vIG9wdGlvbmFsIGFyZ3VtZW50XG4gKiAgICAgcHJvZ3JhbS5vcHRpb24oJy1jLCAtLWNoZWVzZSBbdHlwZV0nLCAnYWRkIGNoZWVzZSBbbWFyYmxlXScpO1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmbGFnc1xuICogQHBhcmFtIHtTdHJpbmd9IGRlc2NyaXB0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufCp9IFtmbl0gb3IgZGVmYXVsdFxuICogQHBhcmFtIHsqfSBbZGVmYXVsdFZhbHVlXVxuICogQHJldHVybiB7Q29tbWFuZH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLm9wdGlvbiA9IGZ1bmN0aW9uKGZsYWdzLCBkZXNjcmlwdGlvbiwgZm4sIGRlZmF1bHRWYWx1ZSkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgICAsIG9wdGlvbiA9IG5ldyBPcHRpb24oZmxhZ3MsIGRlc2NyaXB0aW9uKVxuICAgICwgb25hbWUgPSBvcHRpb24ubmFtZSgpXG4gICAgLCBuYW1lID0gb3B0aW9uLmF0dHJpYnV0ZU5hbWUoKTtcblxuICAvLyBkZWZhdWx0IGFzIDNyZCBhcmdcbiAgaWYgKHR5cGVvZiBmbiAhPSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKGZuIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICB2YXIgcmVnZXggPSBmbjtcbiAgICAgIGZuID0gZnVuY3Rpb24odmFsLCBkZWYpIHtcbiAgICAgICAgdmFyIG0gPSByZWdleC5leGVjKHZhbCk7XG4gICAgICAgIHJldHVybiBtID8gbVswXSA6IGRlZjtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBmbjtcbiAgICAgIGZuID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvLyBwcmVhc3NpZ24gZGVmYXVsdCB2YWx1ZSBvbmx5IGZvciAtLW5vLSosIFtvcHRpb25hbF0sIG9yIDxyZXF1aXJlZD5cbiAgaWYgKGZhbHNlID09IG9wdGlvbi5ib29sIHx8IG9wdGlvbi5vcHRpb25hbCB8fCBvcHRpb24ucmVxdWlyZWQpIHtcbiAgICAvLyB3aGVuIC0tbm8tKiB3ZSBtYWtlIHN1cmUgZGVmYXVsdCBpcyB0cnVlXG4gICAgaWYgKGZhbHNlID09IG9wdGlvbi5ib29sKSBkZWZhdWx0VmFsdWUgPSB0cnVlO1xuICAgIC8vIHByZWFzc2lnbiBvbmx5IGlmIHdlIGhhdmUgYSBkZWZhdWx0XG4gICAgaWYgKHVuZGVmaW5lZCAhPT0gZGVmYXVsdFZhbHVlKSB7XG4gICAgICBzZWxmW25hbWVdID0gZGVmYXVsdFZhbHVlO1xuICAgICAgb3B0aW9uLmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZTtcbiAgICB9XG4gIH1cblxuICAvLyByZWdpc3RlciB0aGUgb3B0aW9uXG4gIHRoaXMub3B0aW9ucy5wdXNoKG9wdGlvbik7XG5cbiAgLy8gd2hlbiBpdCdzIHBhc3NlZCBhc3NpZ24gdGhlIHZhbHVlXG4gIC8vIGFuZCBjb25kaXRpb25hbGx5IGludm9rZSB0aGUgY2FsbGJhY2tcbiAgdGhpcy5vbignb3B0aW9uOicgKyBvbmFtZSwgZnVuY3Rpb24odmFsKSB7XG4gICAgLy8gY29lcmNpb25cbiAgICBpZiAobnVsbCAhPT0gdmFsICYmIGZuKSB2YWwgPSBmbih2YWwsIHVuZGVmaW5lZCA9PT0gc2VsZltuYW1lXVxuICAgICAgPyBkZWZhdWx0VmFsdWVcbiAgICAgIDogc2VsZltuYW1lXSk7XG5cbiAgICAvLyB1bmFzc2lnbmVkIG9yIGJvb2xcbiAgICBpZiAoJ2Jvb2xlYW4nID09IHR5cGVvZiBzZWxmW25hbWVdIHx8ICd1bmRlZmluZWQnID09IHR5cGVvZiBzZWxmW25hbWVdKSB7XG4gICAgICAvLyBpZiBubyB2YWx1ZSwgYm9vbCB0cnVlLCBhbmQgd2UgaGF2ZSBhIGRlZmF1bHQsIHRoZW4gdXNlIGl0IVxuICAgICAgaWYgKG51bGwgPT0gdmFsKSB7XG4gICAgICAgIHNlbGZbbmFtZV0gPSBvcHRpb24uYm9vbFxuICAgICAgICAgID8gZGVmYXVsdFZhbHVlIHx8IHRydWVcbiAgICAgICAgICA6IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZltuYW1lXSA9IHZhbDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG51bGwgIT09IHZhbCkge1xuICAgICAgLy8gcmVhc3NpZ25cbiAgICAgIHNlbGZbbmFtZV0gPSB2YWw7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWxsb3cgdW5rbm93biBvcHRpb25zIG9uIHRoZSBjb21tYW5kIGxpbmUuXG4gKlxuICogQHBhcmFtIHtCb29sZWFufSBhcmcgaWYgYHRydWVgIG9yIG9taXR0ZWQsIG5vIGVycm9yIHdpbGwgYmUgdGhyb3duXG4gKiBmb3IgdW5rbm93biBvcHRpb25zLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuQ29tbWFuZC5wcm90b3R5cGUuYWxsb3dVbmtub3duT3B0aW9uID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgdGhpcy5fYWxsb3dVbmtub3duT3B0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCBhcmc7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFBhcnNlIGBhcmd2YCwgc2V0dGluZ3Mgb3B0aW9ucyBhbmQgaW52b2tpbmcgY29tbWFuZHMgd2hlbiBkZWZpbmVkLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3ZcbiAqIEByZXR1cm4ge0NvbW1hbmR9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKGFyZ3YpIHtcbiAgLy8gaW1wbGljaXQgaGVscFxuICBpZiAodGhpcy5leGVjdXRhYmxlcykgdGhpcy5hZGRJbXBsaWNpdEhlbHBDb21tYW5kKCk7XG5cbiAgLy8gc3RvcmUgcmF3IGFyZ3NcbiAgdGhpcy5yYXdBcmdzID0gYXJndjtcblxuICAvLyBndWVzcyBuYW1lXG4gIHRoaXMuX25hbWUgPSB0aGlzLl9uYW1lIHx8IGJhc2VuYW1lKGFyZ3ZbMV0sICcuanMnKTtcblxuICAvLyBnaXRodWItc3R5bGUgc3ViLWNvbW1hbmRzIHdpdGggbm8gc3ViLWNvbW1hbmRcbiAgaWYgKHRoaXMuZXhlY3V0YWJsZXMgJiYgYXJndi5sZW5ndGggPCAzICYmICF0aGlzLmRlZmF1bHRFeGVjdXRhYmxlKSB7XG4gICAgLy8gdGhpcyB1c2VyIG5lZWRzIGhlbHBcbiAgICBhcmd2LnB1c2goJy0taGVscCcpO1xuICB9XG5cbiAgLy8gcHJvY2VzcyBhcmd2XG4gIHZhciBwYXJzZWQgPSB0aGlzLnBhcnNlT3B0aW9ucyh0aGlzLm5vcm1hbGl6ZShhcmd2LnNsaWNlKDIpKSk7XG4gIHZhciBhcmdzID0gdGhpcy5hcmdzID0gcGFyc2VkLmFyZ3M7XG5cbiAgdmFyIHJlc3VsdCA9IHRoaXMucGFyc2VBcmdzKHRoaXMuYXJncywgcGFyc2VkLnVua25vd24pO1xuXG4gIC8vIGV4ZWN1dGFibGUgc3ViLWNvbW1hbmRzXG4gIHZhciBuYW1lID0gcmVzdWx0LmFyZ3NbMF07XG5cbiAgdmFyIGFsaWFzQ29tbWFuZCA9IG51bGw7XG4gIC8vIGNoZWNrIGFsaWFzIG9mIHN1YiBjb21tYW5kc1xuICBpZiAobmFtZSkge1xuICAgIGFsaWFzQ29tbWFuZCA9IHRoaXMuY29tbWFuZHMuZmlsdGVyKGZ1bmN0aW9uKGNvbW1hbmQpIHtcbiAgICAgIHJldHVybiBjb21tYW5kLmFsaWFzKCkgPT09IG5hbWU7XG4gICAgfSlbMF07XG4gIH1cblxuICBpZiAodGhpcy5fZXhlY3NbbmFtZV0gJiYgdHlwZW9mIHRoaXMuX2V4ZWNzW25hbWVdICE9IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGVTdWJDb21tYW5kKGFyZ3YsIGFyZ3MsIHBhcnNlZC51bmtub3duKTtcbiAgfSBlbHNlIGlmIChhbGlhc0NvbW1hbmQpIHtcbiAgICAvLyBpcyBhbGlhcyBvZiBhIHN1YkNvbW1hbmRcbiAgICBhcmdzWzBdID0gYWxpYXNDb21tYW5kLl9uYW1lO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGVTdWJDb21tYW5kKGFyZ3YsIGFyZ3MsIHBhcnNlZC51bmtub3duKTtcbiAgfSBlbHNlIGlmICh0aGlzLmRlZmF1bHRFeGVjdXRhYmxlKSB7XG4gICAgLy8gdXNlIHRoZSBkZWZhdWx0IHN1YmNvbW1hbmRcbiAgICBhcmdzLnVuc2hpZnQodGhpcy5kZWZhdWx0RXhlY3V0YWJsZSk7XG4gICAgcmV0dXJuIHRoaXMuZXhlY3V0ZVN1YkNvbW1hbmQoYXJndiwgYXJncywgcGFyc2VkLnVua25vd24pO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8qKlxuICogRXhlY3V0ZSBhIHN1Yi1jb21tYW5kIGV4ZWN1dGFibGUuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJndlxuICogQHBhcmFtIHtBcnJheX0gYXJnc1xuICogQHBhcmFtIHtBcnJheX0gdW5rbm93blxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuZXhlY3V0ZVN1YkNvbW1hbmQgPSBmdW5jdGlvbihhcmd2LCBhcmdzLCB1bmtub3duKSB7XG4gIGFyZ3MgPSBhcmdzLmNvbmNhdCh1bmtub3duKTtcblxuICBpZiAoIWFyZ3MubGVuZ3RoKSB0aGlzLmhlbHAoKTtcbiAgaWYgKCdoZWxwJyA9PSBhcmdzWzBdICYmIDEgPT0gYXJncy5sZW5ndGgpIHRoaXMuaGVscCgpO1xuXG4gIC8vIDxjbWQ+IC0taGVscFxuICBpZiAoJ2hlbHAnID09IGFyZ3NbMF0pIHtcbiAgICBhcmdzWzBdID0gYXJnc1sxXTtcbiAgICBhcmdzWzFdID0gJy0taGVscCc7XG4gIH1cblxuICAvLyBleGVjdXRhYmxlXG4gIHZhciBmID0gYXJndlsxXTtcbiAgLy8gbmFtZSBvZiB0aGUgc3ViY29tbWFuZCwgbGluayBgcG0taW5zdGFsbGBcbiAgdmFyIGJpbiA9IGJhc2VuYW1lKGYsICcuanMnKSArICctJyArIGFyZ3NbMF07XG5cblxuICAvLyBJbiBjYXNlIG9mIGdsb2JhbGx5IGluc3RhbGxlZCwgZ2V0IHRoZSBiYXNlIGRpciB3aGVyZSBleGVjdXRhYmxlXG4gIC8vICBzdWJjb21tYW5kIGZpbGUgc2hvdWxkIGJlIGxvY2F0ZWQgYXRcbiAgdmFyIGJhc2VEaXJcbiAgICAsIGxpbmsgPSBmcy5sc3RhdFN5bmMoZikuaXNTeW1ib2xpY0xpbmsoKSA/IGZzLnJlYWRsaW5rU3luYyhmKSA6IGY7XG5cbiAgLy8gd2hlbiBzeW1ib2xpbmsgaXMgcmVsYXRpdmUgcGF0aFxuICBpZiAobGluayAhPT0gZiAmJiBsaW5rLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgbGluayA9IHBhdGguam9pbihkaXJuYW1lKGYpLCBsaW5rKVxuICB9XG4gIGJhc2VEaXIgPSBkaXJuYW1lKGxpbmspO1xuXG4gIC8vIHByZWZlciBsb2NhbCBgLi88YmluPmAgdG8gYmluIGluIHRoZSAkUEFUSFxuICB2YXIgbG9jYWxCaW4gPSBwYXRoLmpvaW4oYmFzZURpciwgYmluKTtcblxuICAvLyB3aGV0aGVyIGJpbiBmaWxlIGlzIGEganMgc2NyaXB0IHdpdGggZXhwbGljaXQgYC5qc2AgZXh0ZW5zaW9uXG4gIHZhciBpc0V4cGxpY2l0SlMgPSBmYWxzZTtcbiAgaWYgKGV4aXN0cyhsb2NhbEJpbiArICcuanMnKSkge1xuICAgIGJpbiA9IGxvY2FsQmluICsgJy5qcyc7XG4gICAgaXNFeHBsaWNpdEpTID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChleGlzdHMobG9jYWxCaW4pKSB7XG4gICAgYmluID0gbG9jYWxCaW47XG4gIH1cblxuICBhcmdzID0gYXJncy5zbGljZSgxKTtcblxuICB2YXIgcHJvYztcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICd3aW4zMicpIHtcbiAgICBpZiAoaXNFeHBsaWNpdEpTKSB7XG4gICAgICBhcmdzLnVuc2hpZnQoYmluKTtcbiAgICAgIC8vIGFkZCBleGVjdXRhYmxlIGFyZ3VtZW50cyB0byBzcGF3blxuICAgICAgYXJncyA9IChwcm9jZXNzLmV4ZWNBcmd2IHx8IFtdKS5jb25jYXQoYXJncyk7XG5cbiAgICAgIHByb2MgPSBzcGF3bihwcm9jZXNzLmFyZ3ZbMF0sIGFyZ3MsIHsgc3RkaW86ICdpbmhlcml0JywgY3VzdG9tRmRzOiBbMCwgMSwgMl0gfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb2MgPSBzcGF3bihiaW4sIGFyZ3MsIHsgc3RkaW86ICdpbmhlcml0JywgY3VzdG9tRmRzOiBbMCwgMSwgMl0gfSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGFyZ3MudW5zaGlmdChiaW4pO1xuICAgIHByb2MgPSBzcGF3bihwcm9jZXNzLmV4ZWNQYXRoLCBhcmdzLCB7IHN0ZGlvOiAnaW5oZXJpdCd9KTtcbiAgfVxuXG4gIHZhciBzaWduYWxzID0gWydTSUdVU1IxJywgJ1NJR1VTUjInLCAnU0lHVEVSTScsICdTSUdJTlQnLCAnU0lHSFVQJ107XG4gIHNpZ25hbHMuZm9yRWFjaChmdW5jdGlvbihzaWduYWwpIHtcbiAgICBwcm9jZXNzLm9uKHNpZ25hbCwgZnVuY3Rpb24oKXtcbiAgICAgIGlmICgocHJvYy5raWxsZWQgPT09IGZhbHNlKSAmJiAocHJvYy5leGl0Q29kZSA9PT0gbnVsbCkpe1xuICAgICAgICBwcm9jLmtpbGwoc2lnbmFsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIHByb2Mub24oJ2Nsb3NlJywgcHJvY2Vzcy5leGl0LmJpbmQocHJvY2VzcykpO1xuICBwcm9jLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycikge1xuICAgIGlmIChlcnIuY29kZSA9PSBcIkVOT0VOVFwiKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdcXG4gICVzKDEpIGRvZXMgbm90IGV4aXN0LCB0cnkgLS1oZWxwXFxuJywgYmluKTtcbiAgICB9IGVsc2UgaWYgKGVyci5jb2RlID09IFwiRUFDQ0VTXCIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1xcbiAgJXMoMSkgbm90IGV4ZWN1dGFibGUuIHRyeSBjaG1vZCBvciBydW4gd2l0aCByb290XFxuJywgYmluKTtcbiAgICB9XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9KTtcblxuICAvLyBTdG9yZSB0aGUgcmVmZXJlbmNlIHRvIHRoZSBjaGlsZCBwcm9jZXNzXG4gIHRoaXMucnVubmluZ0NvbW1hbmQgPSBwcm9jO1xufTtcblxuLyoqXG4gKiBOb3JtYWxpemUgYGFyZ3NgLCBzcGxpdHRpbmcgam9pbmVkIHNob3J0IGZsYWdzLiBGb3IgZXhhbXBsZVxuICogdGhlIGFyZyBcIi1hYmNcIiBpcyBlcXVpdmFsZW50IHRvIFwiLWEgLWIgLWNcIi5cbiAqIFRoaXMgYWxzbyBub3JtYWxpemVzIGVxdWFsIHNpZ24gYW5kIHNwbGl0cyBcIi0tYWJjPWRlZlwiIGludG8gXCItLWFiYyBkZWZcIi5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgdmFyIHJldCA9IFtdXG4gICAgLCBhcmdcbiAgICAsIGxhc3RPcHRcbiAgICAsIGluZGV4O1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcmdzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYXJnID0gYXJnc1tpXTtcbiAgICBpZiAoaSA+IDApIHtcbiAgICAgIGxhc3RPcHQgPSB0aGlzLm9wdGlvbkZvcihhcmdzW2ktMV0pO1xuICAgIH1cblxuICAgIGlmIChhcmcgPT09ICctLScpIHtcbiAgICAgIC8vIEhvbm9yIG9wdGlvbiB0ZXJtaW5hdG9yXG4gICAgICByZXQgPSByZXQuY29uY2F0KGFyZ3Muc2xpY2UoaSkpO1xuICAgICAgYnJlYWs7XG4gICAgfSBlbHNlIGlmIChsYXN0T3B0ICYmIGxhc3RPcHQucmVxdWlyZWQpIHtcbiAgICAgIHJldC5wdXNoKGFyZyk7XG4gICAgfSBlbHNlIGlmIChhcmcubGVuZ3RoID4gMSAmJiAnLScgPT0gYXJnWzBdICYmICctJyAhPSBhcmdbMV0pIHtcbiAgICAgIGFyZy5zbGljZSgxKS5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihjKSB7XG4gICAgICAgIHJldC5wdXNoKCctJyArIGMpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICgvXi0tLy50ZXN0KGFyZykgJiYgfihpbmRleCA9IGFyZy5pbmRleE9mKCc9JykpKSB7XG4gICAgICByZXQucHVzaChhcmcuc2xpY2UoMCwgaW5kZXgpLCBhcmcuc2xpY2UoaW5kZXggKyAxKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldC5wdXNoKGFyZyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn07XG5cbi8qKlxuICogUGFyc2UgY29tbWFuZCBgYXJnc2AuXG4gKlxuICogV2hlbiBsaXN0ZW5lcihzKSBhcmUgYXZhaWxhYmxlIHRob3NlXG4gKiBjYWxsYmFja3MgYXJlIGludm9rZWQsIG90aGVyd2lzZSB0aGUgXCIqXCJcbiAqIGV2ZW50IGlzIGVtaXR0ZWQgYW5kIHRob3NlIGFjdGlvbnMgYXJlIGludm9rZWQuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJnc1xuICogQHJldHVybiB7Q29tbWFuZH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5wYXJzZUFyZ3MgPSBmdW5jdGlvbihhcmdzLCB1bmtub3duKSB7XG4gIHZhciBuYW1lO1xuXG4gIGlmIChhcmdzLmxlbmd0aCkge1xuICAgIG5hbWUgPSBhcmdzWzBdO1xuICAgIGlmICh0aGlzLmxpc3RlbmVycygnY29tbWFuZDonICsgbmFtZSkubGVuZ3RoKSB7XG4gICAgICB0aGlzLmVtaXQoJ2NvbW1hbmQ6JyArIGFyZ3Muc2hpZnQoKSwgYXJncywgdW5rbm93bik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW1pdCgnY29tbWFuZDoqJywgYXJncyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG91dHB1dEhlbHBJZk5lY2Vzc2FyeSh0aGlzLCB1bmtub3duKTtcblxuICAgIC8vIElmIHRoZXJlIHdlcmUgbm8gYXJncyBhbmQgd2UgaGF2ZSB1bmtub3duIG9wdGlvbnMsXG4gICAgLy8gdGhlbiB0aGV5IGFyZSBleHRyYW5lb3VzIGFuZCB3ZSBuZWVkIHRvIGVycm9yLlxuICAgIGlmICh1bmtub3duLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMudW5rbm93bk9wdGlvbih1bmtub3duWzBdKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmV0dXJuIGFuIG9wdGlvbiBtYXRjaGluZyBgYXJnYCBpZiBhbnkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFyZ1xuICogQHJldHVybiB7T3B0aW9ufVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUub3B0aW9uRm9yID0gZnVuY3Rpb24oYXJnKSB7XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLm9wdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zW2ldLmlzKGFyZykpIHtcbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNbaV07XG4gICAgfVxuICB9XG59O1xuXG4vKipcbiAqIFBhcnNlIG9wdGlvbnMgZnJvbSBgYXJndmAgcmV0dXJuaW5nIGBhcmd2YFxuICogdm9pZCBvZiB0aGVzZSBvcHRpb25zLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3ZcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5wYXJzZU9wdGlvbnMgPSBmdW5jdGlvbihhcmd2KSB7XG4gIHZhciBhcmdzID0gW11cbiAgICAsIGxlbiA9IGFyZ3YubGVuZ3RoXG4gICAgLCBsaXRlcmFsXG4gICAgLCBvcHRpb25cbiAgICAsIGFyZztcblxuICB2YXIgdW5rbm93bk9wdGlvbnMgPSBbXTtcblxuICAvLyBwYXJzZSBvcHRpb25zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBhcmcgPSBhcmd2W2ldO1xuXG4gICAgLy8gbGl0ZXJhbCBhcmdzIGFmdGVyIC0tXG4gICAgaWYgKGxpdGVyYWwpIHtcbiAgICAgIGFyZ3MucHVzaChhcmcpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKCctLScgPT0gYXJnKSB7XG4gICAgICBsaXRlcmFsID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGZpbmQgbWF0Y2hpbmcgT3B0aW9uXG4gICAgb3B0aW9uID0gdGhpcy5vcHRpb25Gb3IoYXJnKTtcblxuICAgIC8vIG9wdGlvbiBpcyBkZWZpbmVkXG4gICAgaWYgKG9wdGlvbikge1xuICAgICAgLy8gcmVxdWlyZXMgYXJnXG4gICAgICBpZiAob3B0aW9uLnJlcXVpcmVkKSB7XG4gICAgICAgIGFyZyA9IGFyZ3ZbKytpXTtcbiAgICAgICAgaWYgKG51bGwgPT0gYXJnKSByZXR1cm4gdGhpcy5vcHRpb25NaXNzaW5nQXJndW1lbnQob3B0aW9uKTtcbiAgICAgICAgdGhpcy5lbWl0KCdvcHRpb246JyArIG9wdGlvbi5uYW1lKCksIGFyZyk7XG4gICAgICAvLyBvcHRpb25hbCBhcmdcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9uLm9wdGlvbmFsKSB7XG4gICAgICAgIGFyZyA9IGFyZ3ZbaSsxXTtcbiAgICAgICAgaWYgKG51bGwgPT0gYXJnIHx8ICgnLScgPT0gYXJnWzBdICYmICctJyAhPSBhcmcpKSB7XG4gICAgICAgICAgYXJnID0gbnVsbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICArK2k7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbWl0KCdvcHRpb246JyArIG9wdGlvbi5uYW1lKCksIGFyZyk7XG4gICAgICAvLyBib29sXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVtaXQoJ29wdGlvbjonICsgb3B0aW9uLm5hbWUoKSk7XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBsb29rcyBsaWtlIGFuIG9wdGlvblxuICAgIGlmIChhcmcubGVuZ3RoID4gMSAmJiAnLScgPT0gYXJnWzBdKSB7XG4gICAgICB1bmtub3duT3B0aW9ucy5wdXNoKGFyZyk7XG5cbiAgICAgIC8vIElmIHRoZSBuZXh0IGFyZ3VtZW50IGxvb2tzIGxpa2UgaXQgbWlnaHQgYmVcbiAgICAgIC8vIGFuIGFyZ3VtZW50IGZvciB0aGlzIG9wdGlvbiwgd2UgcGFzcyBpdCBvbi5cbiAgICAgIC8vIElmIGl0IGlzbid0LCB0aGVuIGl0J2xsIHNpbXBseSBiZSBpZ25vcmVkXG4gICAgICBpZiAoYXJndltpKzFdICYmICctJyAhPSBhcmd2W2krMV1bMF0pIHtcbiAgICAgICAgdW5rbm93bk9wdGlvbnMucHVzaChhcmd2WysraV0pO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gYXJnXG4gICAgYXJncy5wdXNoKGFyZyk7XG4gIH1cblxuICByZXR1cm4geyBhcmdzOiBhcmdzLCB1bmtub3duOiB1bmtub3duT3B0aW9ucyB9O1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmcgb3B0aW9ucyBhcyBrZXktdmFsdWUgcGFpcnNcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5Db21tYW5kLnByb3RvdHlwZS5vcHRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXN1bHQgPSB7fVxuICAgICwgbGVuID0gdGhpcy5vcHRpb25zLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCA7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBrZXkgPSB0aGlzLm9wdGlvbnNbaV0uYXR0cmlidXRlTmFtZSgpO1xuICAgIHJlc3VsdFtrZXldID0ga2V5ID09PSAndmVyc2lvbicgPyB0aGlzLl92ZXJzaW9uIDogdGhpc1trZXldO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEFyZ3VtZW50IGBuYW1lYCBpcyBtaXNzaW5nLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5taXNzaW5nQXJndW1lbnQgPSBmdW5jdGlvbihuYW1lKSB7XG4gIGNvbnNvbGUuZXJyb3IoKTtcbiAgY29uc29sZS5lcnJvcihcIiAgZXJyb3I6IG1pc3NpbmcgcmVxdWlyZWQgYXJndW1lbnQgYCVzJ1wiLCBuYW1lKTtcbiAgY29uc29sZS5lcnJvcigpO1xuICBwcm9jZXNzLmV4aXQoMSk7XG59O1xuXG4vKipcbiAqIGBPcHRpb25gIGlzIG1pc3NpbmcgYW4gYXJndW1lbnQsIGJ1dCByZWNlaXZlZCBgZmxhZ2Agb3Igbm90aGluZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9uXG4gKiBAcGFyYW0ge1N0cmluZ30gZmxhZ1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUub3B0aW9uTWlzc2luZ0FyZ3VtZW50ID0gZnVuY3Rpb24ob3B0aW9uLCBmbGFnKSB7XG4gIGNvbnNvbGUuZXJyb3IoKTtcbiAgaWYgKGZsYWcpIHtcbiAgICBjb25zb2xlLmVycm9yKFwiICBlcnJvcjogb3B0aW9uIGAlcycgYXJndW1lbnQgbWlzc2luZywgZ290IGAlcydcIiwgb3B0aW9uLmZsYWdzLCBmbGFnKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKFwiICBlcnJvcjogb3B0aW9uIGAlcycgYXJndW1lbnQgbWlzc2luZ1wiLCBvcHRpb24uZmxhZ3MpO1xuICB9XG4gIGNvbnNvbGUuZXJyb3IoKTtcbiAgcHJvY2Vzcy5leGl0KDEpO1xufTtcblxuLyoqXG4gKiBVbmtub3duIG9wdGlvbiBgZmxhZ2AuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZsYWdcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLnVua25vd25PcHRpb24gPSBmdW5jdGlvbihmbGFnKSB7XG4gIGlmICh0aGlzLl9hbGxvd1Vua25vd25PcHRpb24pIHJldHVybjtcbiAgY29uc29sZS5lcnJvcigpO1xuICBjb25zb2xlLmVycm9yKFwiICBlcnJvcjogdW5rbm93biBvcHRpb24gYCVzJ1wiLCBmbGFnKTtcbiAgY29uc29sZS5lcnJvcigpO1xuICBwcm9jZXNzLmV4aXQoMSk7XG59O1xuXG4vKipcbiAqIFZhcmlhZGljIGFyZ3VtZW50IHdpdGggYG5hbWVgIGlzIG5vdCB0aGUgbGFzdCBhcmd1bWVudCBhcyByZXF1aXJlZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUudmFyaWFkaWNBcmdOb3RMYXN0ID0gZnVuY3Rpb24obmFtZSkge1xuICBjb25zb2xlLmVycm9yKCk7XG4gIGNvbnNvbGUuZXJyb3IoXCIgIGVycm9yOiB2YXJpYWRpYyBhcmd1bWVudHMgbXVzdCBiZSBsYXN0IGAlcydcIiwgbmFtZSk7XG4gIGNvbnNvbGUuZXJyb3IoKTtcbiAgcHJvY2Vzcy5leGl0KDEpO1xufTtcblxuLyoqXG4gKiBTZXQgdGhlIHByb2dyYW0gdmVyc2lvbiB0byBgc3RyYC5cbiAqXG4gKiBUaGlzIG1ldGhvZCBhdXRvLXJlZ2lzdGVycyB0aGUgXCItViwgLS12ZXJzaW9uXCIgZmxhZ1xuICogd2hpY2ggd2lsbCBwcmludCB0aGUgdmVyc2lvbiBudW1iZXIgd2hlbiBwYXNzZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHBhcmFtIHtTdHJpbmd9IFtmbGFnc11cbiAqIEByZXR1cm4ge0NvbW1hbmR9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS52ZXJzaW9uID0gZnVuY3Rpb24oc3RyLCBmbGFncykge1xuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGhpcy5fdmVyc2lvbjtcbiAgdGhpcy5fdmVyc2lvbiA9IHN0cjtcbiAgZmxhZ3MgPSBmbGFncyB8fCAnLVYsIC0tdmVyc2lvbic7XG4gIHRoaXMub3B0aW9uKGZsYWdzLCAnb3V0cHV0IHRoZSB2ZXJzaW9uIG51bWJlcicpO1xuICB0aGlzLm9uKCdvcHRpb246dmVyc2lvbicsIGZ1bmN0aW9uKCkge1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKHN0ciArICdcXG4nKTtcbiAgICBwcm9jZXNzLmV4aXQoMCk7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IHRoZSBkZXNjcmlwdGlvbiB0byBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd8Q29tbWFuZH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuZGVzY3JpcHRpb24gPSBmdW5jdGlvbihzdHIpIHtcbiAgaWYgKDAgPT09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aGlzLl9kZXNjcmlwdGlvbjtcbiAgdGhpcy5fZGVzY3JpcHRpb24gPSBzdHI7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgYW4gYWxpYXMgZm9yIHRoZSBjb21tYW5kXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFsaWFzXG4gKiBAcmV0dXJuIHtTdHJpbmd8Q29tbWFuZH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuYWxpYXMgPSBmdW5jdGlvbihhbGlhcykge1xuICB2YXIgY29tbWFuZCA9IHRoaXM7XG4gIGlmKHRoaXMuY29tbWFuZHMubGVuZ3RoICE9PSAwKSB7XG4gICAgY29tbWFuZCA9IHRoaXMuY29tbWFuZHNbdGhpcy5jb21tYW5kcy5sZW5ndGggLSAxXVxuICB9XG5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiBjb21tYW5kLl9hbGlhcztcblxuICBpZiAoYWxpYXMgPT09IGNvbW1hbmQuX25hbWUpIHRocm93IG5ldyBFcnJvcignQ29tbWFuZCBhbGlhcyBjYW5cXCd0IGJlIHRoZSBzYW1lIGFzIGl0cyBuYW1lJyk7XG5cbiAgY29tbWFuZC5fYWxpYXMgPSBhbGlhcztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCAvIGdldCB0aGUgY29tbWFuZCB1c2FnZSBgc3RyYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd8Q29tbWFuZH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUudXNhZ2UgPSBmdW5jdGlvbihzdHIpIHtcbiAgdmFyIGFyZ3MgPSB0aGlzLl9hcmdzLm1hcChmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gaHVtYW5SZWFkYWJsZUFyZ05hbWUoYXJnKTtcbiAgfSk7XG5cbiAgdmFyIHVzYWdlID0gJ1tvcHRpb25zXSdcbiAgICArICh0aGlzLmNvbW1hbmRzLmxlbmd0aCA/ICcgW2NvbW1hbmRdJyA6ICcnKVxuICAgICsgKHRoaXMuX2FyZ3MubGVuZ3RoID8gJyAnICsgYXJncy5qb2luKCcgJykgOiAnJyk7XG5cbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRoaXMuX3VzYWdlIHx8IHVzYWdlO1xuICB0aGlzLl91c2FnZSA9IHN0cjtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogR2V0IG9yIHNldCB0aGUgbmFtZSBvZiB0aGUgY29tbWFuZFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge1N0cmluZ3xDb21tYW5kfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5uYW1lID0gZnVuY3Rpb24oc3RyKSB7XG4gIGlmICgwID09PSBhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGhpcy5fbmFtZTtcbiAgdGhpcy5fbmFtZSA9IHN0cjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgbGFyZ2VzdCBvcHRpb24gbGVuZ3RoLlxuICpcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLmxhcmdlc3RPcHRpb25MZW5ndGggPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMub3B0aW9ucy5yZWR1Y2UoZnVuY3Rpb24obWF4LCBvcHRpb24pIHtcbiAgICByZXR1cm4gTWF0aC5tYXgobWF4LCBvcHRpb24uZmxhZ3MubGVuZ3RoKTtcbiAgfSwgMCk7XG59O1xuXG4vKipcbiAqIFJldHVybiBoZWxwIGZvciBvcHRpb25zLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLm9wdGlvbkhlbHAgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHdpZHRoID0gdGhpcy5sYXJnZXN0T3B0aW9uTGVuZ3RoKCk7XG5cbiAgLy8gQXBwZW5kIHRoZSBoZWxwIGluZm9ybWF0aW9uXG4gIHJldHVybiB0aGlzLm9wdGlvbnMubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgcmV0dXJuIHBhZChvcHRpb24uZmxhZ3MsIHdpZHRoKSArICcgICcgKyBvcHRpb24uZGVzY3JpcHRpb25cbiAgICAgICAgKyAoKG9wdGlvbi5ib29sICE9IGZhbHNlICYmIG9wdGlvbi5kZWZhdWx0VmFsdWUgIT09IHVuZGVmaW5lZCkgPyAnIChkZWZhdWx0OiAnICsgb3B0aW9uLmRlZmF1bHRWYWx1ZSArICcpJyA6ICcnKTtcbiAgfSkuY29uY2F0KFtwYWQoJy1oLCAtLWhlbHAnLCB3aWR0aCkgKyAnICAnICsgJ291dHB1dCB1c2FnZSBpbmZvcm1hdGlvbiddKVxuICAgIC5qb2luKCdcXG4nKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGNvbW1hbmQgaGVscCBkb2N1bWVudGF0aW9uLlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLmNvbW1hbmRIZWxwID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5jb21tYW5kcy5sZW5ndGgpIHJldHVybiAnJztcblxuICB2YXIgY29tbWFuZHMgPSB0aGlzLmNvbW1hbmRzLmZpbHRlcihmdW5jdGlvbihjbWQpIHtcbiAgICByZXR1cm4gIWNtZC5fbm9IZWxwO1xuICB9KS5tYXAoZnVuY3Rpb24oY21kKSB7XG4gICAgdmFyIGFyZ3MgPSBjbWQuX2FyZ3MubWFwKGZ1bmN0aW9uKGFyZykge1xuICAgICAgcmV0dXJuIGh1bWFuUmVhZGFibGVBcmdOYW1lKGFyZyk7XG4gICAgfSkuam9pbignICcpO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIGNtZC5fbmFtZVxuICAgICAgICArIChjbWQuX2FsaWFzID8gJ3wnICsgY21kLl9hbGlhcyA6ICcnKVxuICAgICAgICArIChjbWQub3B0aW9ucy5sZW5ndGggPyAnIFtvcHRpb25zXScgOiAnJylcbiAgICAgICAgKyAoYXJncyA/ICcgJyArIGFyZ3MgOiAnJylcbiAgICAgICwgY21kLl9kZXNjcmlwdGlvblxuICAgIF07XG4gIH0pO1xuXG4gIHZhciB3aWR0aCA9IGNvbW1hbmRzLnJlZHVjZShmdW5jdGlvbihtYXgsIGNvbW1hbmQpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgobWF4LCBjb21tYW5kWzBdLmxlbmd0aCk7XG4gIH0sIDApO1xuXG4gIHJldHVybiBbXG4gICAgJydcbiAgICAsICcgIENvbW1hbmRzOidcbiAgICAsICcnXG4gICAgLCBjb21tYW5kcy5tYXAoZnVuY3Rpb24oY21kKSB7XG4gICAgICB2YXIgZGVzYyA9IGNtZFsxXSA/ICcgICcgKyBjbWRbMV0gOiAnJztcbiAgICAgIHJldHVybiAoZGVzYyA/IHBhZChjbWRbMF0sIHdpZHRoKSA6IGNtZFswXSkgKyBkZXNjO1xuICAgIH0pLmpvaW4oJ1xcbicpLnJlcGxhY2UoL14vZ20sICcgICAgJylcbiAgICAsICcnXG4gIF0uam9pbignXFxuJyk7XG59O1xuXG4vKipcbiAqIFJldHVybiBwcm9ncmFtIGhlbHAgZG9jdW1lbnRhdGlvbi5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5oZWxwSW5mb3JtYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIGRlc2MgPSBbXTtcbiAgaWYgKHRoaXMuX2Rlc2NyaXB0aW9uKSB7XG4gICAgZGVzYyA9IFtcbiAgICAgICcgICcgKyB0aGlzLl9kZXNjcmlwdGlvblxuICAgICAgLCAnJ1xuICAgIF07XG4gIH1cblxuICB2YXIgY21kTmFtZSA9IHRoaXMuX25hbWU7XG4gIGlmICh0aGlzLl9hbGlhcykge1xuICAgIGNtZE5hbWUgPSBjbWROYW1lICsgJ3wnICsgdGhpcy5fYWxpYXM7XG4gIH1cbiAgdmFyIHVzYWdlID0gW1xuICAgICcnXG4gICAgLCcgIFVzYWdlOiAnICsgY21kTmFtZSArICcgJyArIHRoaXMudXNhZ2UoKVxuICAgICwgJydcbiAgXTtcblxuICB2YXIgY21kcyA9IFtdO1xuICB2YXIgY29tbWFuZEhlbHAgPSB0aGlzLmNvbW1hbmRIZWxwKCk7XG4gIGlmIChjb21tYW5kSGVscCkgY21kcyA9IFtjb21tYW5kSGVscF07XG5cbiAgdmFyIG9wdGlvbnMgPSBbXG4gICAgJydcbiAgICAsICcgIE9wdGlvbnM6J1xuICAgICwgJydcbiAgICAsICcnICsgdGhpcy5vcHRpb25IZWxwKCkucmVwbGFjZSgvXi9nbSwgJyAgICAnKVxuICAgICwgJydcbiAgXTtcblxuICByZXR1cm4gdXNhZ2VcbiAgICAuY29uY2F0KGRlc2MpXG4gICAgLmNvbmNhdChvcHRpb25zKVxuICAgIC5jb25jYXQoY21kcylcbiAgICAuam9pbignXFxuJyk7XG59O1xuXG4vKipcbiAqIE91dHB1dCBoZWxwIGluZm9ybWF0aW9uIGZvciB0aGlzIGNvbW1hbmRcbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLm91dHB1dEhlbHAgPSBmdW5jdGlvbihjYikge1xuICBpZiAoIWNiKSB7XG4gICAgY2IgPSBmdW5jdGlvbihwYXNzdGhydSkge1xuICAgICAgcmV0dXJuIHBhc3N0aHJ1O1xuICAgIH1cbiAgfVxuICBwcm9jZXNzLnN0ZG91dC53cml0ZShjYih0aGlzLmhlbHBJbmZvcm1hdGlvbigpKSk7XG4gIHRoaXMuZW1pdCgnLS1oZWxwJyk7XG59O1xuXG4vKipcbiAqIE91dHB1dCBoZWxwIGluZm9ybWF0aW9uIGFuZCBleGl0LlxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuaGVscCA9IGZ1bmN0aW9uKGNiKSB7XG4gIHRoaXMub3V0cHV0SGVscChjYik7XG4gIHByb2Nlc3MuZXhpdCgpO1xufTtcblxuLyoqXG4gKiBDYW1lbC1jYXNlIHRoZSBnaXZlbiBgZmxhZ2BcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmxhZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gY2FtZWxjYXNlKGZsYWcpIHtcbiAgcmV0dXJuIGZsYWcuc3BsaXQoJy0nKS5yZWR1Y2UoZnVuY3Rpb24oc3RyLCB3b3JkKSB7XG4gICAgcmV0dXJuIHN0ciArIHdvcmRbMF0udG9VcHBlckNhc2UoKSArIHdvcmQuc2xpY2UoMSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIFBhZCBgc3RyYCB0byBgd2lkdGhgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gcGFkKHN0ciwgd2lkdGgpIHtcbiAgdmFyIGxlbiA9IE1hdGgubWF4KDAsIHdpZHRoIC0gc3RyLmxlbmd0aCk7XG4gIHJldHVybiBzdHIgKyBBcnJheShsZW4gKyAxKS5qb2luKCcgJyk7XG59XG5cbi8qKlxuICogT3V0cHV0IGhlbHAgaW5mb3JtYXRpb24gaWYgbmVjZXNzYXJ5XG4gKlxuICogQHBhcmFtIHtDb21tYW5kfSBjb21tYW5kIHRvIG91dHB1dCBoZWxwIGZvclxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgb2Ygb3B0aW9ucyB0byBzZWFyY2ggZm9yIC1oIG9yIC0taGVscFxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gb3V0cHV0SGVscElmTmVjZXNzYXJ5KGNtZCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9wdGlvbnNbaV0gPT0gJy0taGVscCcgfHwgb3B0aW9uc1tpXSA9PSAnLWgnKSB7XG4gICAgICBjbWQub3V0cHV0SGVscCgpO1xuICAgICAgcHJvY2Vzcy5leGl0KDApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRha2VzIGFuIGFyZ3VtZW50IGFuIHJldHVybnMgaXRzIGh1bWFuIHJlYWRhYmxlIGVxdWl2YWxlbnQgZm9yIGhlbHAgdXNhZ2UuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFyZ1xuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gaHVtYW5SZWFkYWJsZUFyZ05hbWUoYXJnKSB7XG4gIHZhciBuYW1lT3V0cHV0ID0gYXJnLm5hbWUgKyAoYXJnLnZhcmlhZGljID09PSB0cnVlID8gJy4uLicgOiAnJyk7XG5cbiAgcmV0dXJuIGFyZy5yZXF1aXJlZFxuICAgID8gJzwnICsgbmFtZU91dHB1dCArICc+J1xuICAgIDogJ1snICsgbmFtZU91dHB1dCArICddJ1xufVxuXG4vLyBmb3IgdmVyc2lvbnMgYmVmb3JlIG5vZGUgdjAuOCB3aGVuIHRoZXJlIHdlcmVuJ3QgYGZzLmV4aXN0c1N5bmNgXG5mdW5jdGlvbiBleGlzdHMoZmlsZSkge1xuICB0cnkge1xuICAgIGlmIChmcy5zdGF0U3luYyhmaWxlKS5pc0ZpbGUoKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2NvbW1hbmRlci9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNjc1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDMgNyIsImV4cG9ydCBjb25zdCBERUZBVUxUID0geyBpc0RlZmF1bHQ6IHRydWUgfVxuXG5leHBvcnQgY29uc3QgTElTVCA9ICdsaXN0J1xuZXhwb3J0IGNvbnN0IExJU1RfREVTQyA9ICdsaXN0IGFsbCB5b3VyIHRhc2tzJ1xuXG5leHBvcnQgY29uc3QgQUREID0gJ2FkZCdcbmV4cG9ydCBjb25zdCBBRERfREVTQyA9ICdhZGQgYSB0YXNrIGluIHlvdXIgbGlzdCdcblxuZXhwb3J0IGNvbnN0IERFTCA9ICdkZWwgW2lkXSdcbmV4cG9ydCBjb25zdCBERUxfREVTQyA9ICdkZWxldGUgYSB0YXNrIGZyb20geW91IHRhc2tsaXN0J1xuZXhwb3J0IGNvbnN0IERFTF9PUFRJT04gPSAnLWEsIC0tYWxsJ1xuZXhwb3J0IGNvbnN0IERFTF9PUFRJT05fREVTQyA9ICdkZWxldGUgYWxsIHRhc2tzIGZyb20gZGF0YWJhc2UnXG5cbmV4cG9ydCBjb25zdCBMQU5HID0gJ2xhbmcnXG5leHBvcnQgY29uc3QgTEFOR19ERVNDID0gJ1BpY2sgYSBsYW5ndWFnZSBmb3IgeW91ciBwYWRhJ1xuXG5leHBvcnQgY29uc3QgRE9ORSA9ICdkb25lIFtpZF0nXG5leHBvcnQgY29uc3QgRE9ORV9ERVNDID0gJ01hcmsgYSB0YXNrIGFzIGNvbXBsZXRlJ1xuXG5leHBvcnQgY29uc3QgQ09ORklHID0gJ2NvbmZpZydcbmV4cG9ydCBjb25zdCBDT05GSUdfREVTQyA9ICdzZXQgdXNlcm5hbWUgYW5kIGVtYWlsJ1xuZXhwb3J0IGNvbnN0IENPTkZJR19PUFRJT05fVSA9ICctdSwgLS11c2VybmFtZSdcbmV4cG9ydCBjb25zdCBDT05GSUdfT1BUSU9OX1VfREVTQyA9ICdzZXQgdXNlcm5hbWUnXG5leHBvcnQgY29uc3QgQ09ORklHX09QVElPTl9FID0gJy1lLCAtLWVtYWlsJ1xuZXhwb3J0IGNvbnN0IENPTkZJR19PUFRJT05fRV9ERVNDID0gJ3NldCBlbWFpbCwgeW91IHdpbGwgYmUgZW1haWxlZCBpZiB5b3VyIHRhc2sgdGltZVxcJ3MgdXAgJ1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyPz9yZWYtLTEhLi9zcmMvY29tbWFuZExpc3QudHMiLCJpbXBvcnQgcHJvZ3JhbSA9IHJlcXVpcmUoJ2NvbW1hbmRlcicpXG5cbmNvbnN0IHtcbiAgREVGQVVMVCxcbiAgQURELFxuICBBRERfREVTQyxcbiAgTElTVCxcbiAgTElTVF9ERVNDLFxuICBERUwsXG4gIERFTF9ERVNDLFxuICBERUxfT1BUSU9OLFxuICBERUxfT1BUSU9OX0RFU0MsXG4gIExBTkcsXG4gIExBTkdfREVTQyxcbiAgRE9ORSxcbiAgRE9ORV9ERVNDLFxuICBDT05GSUcsXG4gIENPTkZJR19ERVNDXG59ID0gcmVxdWlyZSgnLi8uLi9jb21tYW5kTGlzdCcpXG5jb25zdCB2ZXJzaW9uID0gcmVxdWlyZSgnLi8uLi8uLi9wYWNrYWdlLmpzb24nKVsndmVyc2lvbiddXG5jb25zdCBub2RlVmVyc2lvbjogc3RyaW5nID0gcHJvY2Vzcy52ZXJzaW9uLm1hdGNoKC9cXGQrL2cpWzBdXG5cbnByb2dyYW1cbiAgLnZlcnNpb24odmVyc2lvbiwgJy12LCAtLXZlcnNpb24nKVxuXG5wcm9ncmFtXG4gIC5jb21tYW5kKExJU1QsIExJU1RfREVTQylcbiAgLmFsaWFzKCdscycpXG5cbnByb2dyYW1cbiAgLmNvbW1hbmQoQURELCBBRERfREVTQylcbiAgLmFsaWFzKCdhJylcblxucHJvZ3JhbVxuICAuY29tbWFuZChERUwsIERFTF9ERVNDKVxuICAuYWxpYXMoJ2QnKVxuXG5wcm9ncmFtXG4gIC5jb21tYW5kKExBTkcsIExBTkdfREVTQylcblxucHJvZ3JhbVxuICAuY29tbWFuZChET05FLCBET05FX0RFU0MpXG5cbnByb2dyYW1cbiAgLmNvbW1hbmQoQ09ORklHLCBDT05GSUdfREVTQylcblxucHJvZ3JhbS5wYXJzZShwcm9jZXNzLmFyZ3YpXG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vZGVfbW9kdWxlcy90c2xpbnQtbG9hZGVyPz9yZWYtLTEhLi9zcmMvYmluL3BhZGEudHMiLCJtb2R1bGUuZXhwb3J0cyA9IHtcIm5hbWVcIjpcInBhZGFcIixcInZlcnNpb25cIjpcIjAuMS4yXCIsXCJkZXNjcmlwdGlvblwiOlwiQ29tbWFuZCBsaW5lIGludGVyZmFjZSBmb3IgY3J1bCB5b3VyIHRvZG8gbGlzdC5cIixcInNjcmlwdHNcIjp7XCJzdGFydFwiOlwid2VicGFjayAtLWNvbmZpZyAuL3dlYnBhY2suY29uZmlnLmpzIC0tcHJvZ3Jlc3MgLS13YXRjaFwiLFwidGVzdFwiOlwiZWNobyBcXFwiRXJyb3I6IG5vIHRlc3Qgc3BlY2lmaWVkXFxcIiAmJiBleGl0IDFcIixcImJ1aWxkXCI6XCJ3ZWJwYWNrIC0tY29uZmlnIC4vd2VicGFjay5jb25maWcuanNcIn0sXCJiaW5cIjp7XCJwYWRhXCI6XCJkaXN0L0BwYWRhL3BhZGEuanNcIn0sXCJrZXl3b3Jkc1wiOltcInBhZGFcIixcInBhZGEtdG9kby1saXN0XCIsXCJub2RlLXRvZG8tbGlzdFwiXSxcImF1dGhvclwiOlwiSGFvd2VuIDxoYW93ZW43MzdAZ21haWwuY29tPlwiLFwibGljZW5zZVwiOlwiTUlUXCIsXCJkZXBlbmRlbmNpZXNcIjp7XCJAdHlwZXMvY2xpLXRhYmxlMlwiOlwiXjAuMi4xXCIsXCJAdHlwZXMvbW9tZW50XCI6XCJeMi4xMy4wXCIsXCJAdHlwZXMvbm9kZVwiOlwiXjkuNC4wXCIsXCJjaGFsa1wiOlwiXjIuMy4wXCIsXCJjbGktdGFibGUyXCI6XCJeMC4yLjBcIixcImNvbW1hbmRlclwiOlwiXjIuMTMuMFwiLFwiaW5xdWlyZXJcIjpcIl41LjEuMFwiLFwibW9tZW50XCI6XCJeMi4yMC4xXCIsXCJub2RlLWVtb2ppXCI6XCJeMS44LjFcIixcIm5vZGUtdGltZXRlclwiOlwiXjEuMC40XCIsXCJzcWwuanNcIjpcIl4wLjUuMFwiLFwidHMtbG9hZGVyXCI6XCJeMy40LjBcIixcInR5cGVzY3JpcHRcIjpcIl4yLjYuMlwiLFwid2VicGFja1wiOlwiXjMuMTAuMFwifSxcImRldkRlcGVuZGVuY2llc1wiOntcImVzbGludC1jb25maWctc3RhbmRhcmRcIjpcIl4xMS4wLjAtYmV0YS4wXCIsXCJlc2xpbnQtbG9hZGVyXCI6XCJeMS45LjBcIixcImVzbGludC1wbHVnaW4taW1wb3J0XCI6XCJeMi44LjBcIixcImVzbGludC1wbHVnaW4tbm9kZVwiOlwiXjYuMC4wXCIsXCJlc2xpbnQtcGx1Z2luLXByb21pc2VcIjpcIl4zLjYuMFwiLFwiZXNsaW50LXBsdWdpbi1zdGFuZGFyZFwiOlwiXjMuMC4xXCIsXCJ0c2xpbnRcIjpcIl41LjkuMVwiLFwidHNsaW50LWxvYWRlclwiOlwiXjMuNS4zXCJ9fVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcGFja2FnZS5qc29uXG4vLyBtb2R1bGUgaWQgPSA2ODNcbi8vIG1vZHVsZSBjaHVua3MgPSA3IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiZXZlbnRzXCJcbi8vIG1vZHVsZSBpZCA9IDgwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDciXSwic291cmNlUm9vdCI6IiJ9