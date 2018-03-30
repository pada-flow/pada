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
    .command(LIST, LIST_DESC, DEFAULT)
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

module.exports = {"name":"pada","version":"0.1.6","description":"Command line interface for crul your todo list.","scripts":{"start":"webpack --config ./webpack.config.js --progress --watch","test":"echo \"Error: no test specified\" && exit 1","build":"webpack --config ./webpack.config.js"},"bin":{"pada":"dist/@pada/pada.js"},"keywords":["pada","pada-todo-list","node-todo-list"],"author":"Haowen <haowen737@gmail.com>","license":"MIT","dependencies":{"@types/cli-table2":"^0.2.1","@types/node":"^9.4.0","chalk":"^2.3.0","cli-table2":"^0.2.0","commander":"^2.13.0","inquirer":"^5.1.0","moment":"^2.20.1","node-emoji":"^1.8.1","node-timeter":"^1.0.4","sql.js":"^0.5.0","ts-loader":"^3.4.0","typescript":"^2.6.2","webpack":"^3.10.0"},"devDependencies":{"eslint-config-standard":"^11.0.0-beta.0","eslint-loader":"^1.9.0","eslint-plugin-import":"^2.8.0","eslint-plugin-node":"^6.0.0","eslint-plugin-promise":"^3.6.0","eslint-plugin-standard":"^3.0.1","tslint":"^5.9.1","tslint-loader":"^3.5.3"}}

/***/ }),

/***/ 80:
/***/ (function(module, exports) {

module.exports = require("events");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTVkOTY1MTRiMzNjNDNiOWNhZjIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2hpbGRfcHJvY2Vzc1wiIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb21tYW5kZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbW1hbmRMaXN0LnRzIiwid2VicGFjazovLy8uL3NyYy9iaW4vcGFkYS50cyIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlLmpzb24iLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXZlbnRzXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REEsK0I7Ozs7Ozs7QUNBQSxpQzs7Ozs7OztBQ0FBLDBDOzs7Ozs7O0FDQUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixXQUFXLE9BQU87QUFDbEIsWUFBWSxRQUFRO0FBQ3BCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLFFBQVE7QUFDbkIsV0FBVyxNQUFNO0FBQ2pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixvQkFBb0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3BvQ2EsZUFBTyxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRTtBQUU3QixZQUFJLEdBQUcsTUFBTTtBQUNiLGlCQUFTLEdBQUcscUJBQXFCO0FBRWpDLFdBQUcsR0FBRyxLQUFLO0FBQ1gsZ0JBQVEsR0FBRyx5QkFBeUI7QUFFcEMsV0FBRyxHQUFHLFVBQVU7QUFDaEIsZ0JBQVEsR0FBRyxpQ0FBaUM7QUFDNUMsa0JBQVUsR0FBRyxXQUFXO0FBQ3hCLHVCQUFlLEdBQUcsZ0NBQWdDO0FBRWxELFlBQUksR0FBRyxNQUFNO0FBQ2IsaUJBQVMsR0FBRywrQkFBK0I7QUFFM0MsWUFBSSxHQUFHLFdBQVc7QUFDbEIsaUJBQVMsR0FBRyx5QkFBeUI7QUFFckMsY0FBTSxHQUFHLFFBQVE7QUFDakIsbUJBQVcsR0FBRyx3QkFBd0I7QUFDdEMsdUJBQWUsR0FBRyxnQkFBZ0I7QUFDbEMsNEJBQW9CLEdBQUcsY0FBYztBQUNyQyx1QkFBZSxHQUFHLGFBQWE7QUFDL0IsNEJBQW9CLEdBQUcseURBQXlEOzs7Ozs7Ozs7OztBQ3hCN0YsdUNBQXFDO0FBRS9CLGlDQWdCeUIsRUFmN0Isb0JBQU8sRUFDUCxZQUFHLEVBQ0gsc0JBQVEsRUFDUixjQUFJLEVBQ0osd0JBQVMsRUFDVCxZQUFHLEVBQ0gsc0JBQVEsRUFDUiwwQkFBVSxFQUNWLG9DQUFlLEVBQ2YsY0FBSSxFQUNKLHdCQUFTLEVBQ1QsY0FBSSxFQUNKLHdCQUFTLEVBQ1Qsa0JBQU0sRUFDTiw0QkFBVyxDQUNrQjtBQUMvQixJQUFNLE9BQU8sR0FBRyxtQkFBTyxDQUFDLEdBQXNCLENBQUMsQ0FBQyxTQUFTLENBQUM7QUFDMUQsSUFBTSxXQUFXLEdBQVcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRTVELE9BQU87S0FDSixPQUFPLENBQUMsT0FBTyxFQUFFLGVBQWUsQ0FBQztBQUVwQyxPQUFPO0tBQ0osT0FBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDO0tBQ2pDLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFFZCxPQUFPO0tBQ0osT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUM7S0FDdEIsS0FBSyxDQUFDLEdBQUcsQ0FBQztBQUViLE9BQU87S0FDSixPQUFPLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQztLQUN0QixLQUFLLENBQUMsR0FBRyxDQUFDO0FBRWIsT0FBTztLQUNKLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO0FBRTNCLE9BQU87S0FDSixPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQztBQUUzQixPQUFPO0tBQ0osT0FBTyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUM7QUFFL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDOzs7Ozs7OztBQzlDM0Isa0JBQWtCLDJHQUEyRyxzS0FBc0ssUUFBUSw0QkFBNEIsK0hBQStILHVSQUF1UixvQkFBb0IsZ1A7Ozs7Ozs7QUNBanZCLG1DIiwiZmlsZSI6InBhZGEuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA2ODIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDk1ZDk2NTE0YjMzYzQzYjljYWYyIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJmc1wiXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA1IDYgNyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBhdGhcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJwYXRoXCJcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIDIgMyA0IDUgNiA3IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImNoaWxkX3Byb2Nlc3NcIlxuLy8gbW9kdWxlIGlkID0gNTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEgMiAzIDQgNyIsIi8qKlxuICogTW9kdWxlIGRlcGVuZGVuY2llcy5cbiAqL1xuXG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIHNwYXduID0gcmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLnNwYXduO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgZGlybmFtZSA9IHBhdGguZGlybmFtZTtcbnZhciBiYXNlbmFtZSA9IHBhdGguYmFzZW5hbWU7XG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xuXG4vKipcbiAqIEV4cG9zZSB0aGUgcm9vdCBjb21tYW5kLlxuICovXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IG5ldyBDb21tYW5kKCk7XG5cbi8qKlxuICogRXhwb3NlIGBDb21tYW5kYC5cbiAqL1xuXG5leHBvcnRzLkNvbW1hbmQgPSBDb21tYW5kO1xuXG4vKipcbiAqIEV4cG9zZSBgT3B0aW9uYC5cbiAqL1xuXG5leHBvcnRzLk9wdGlvbiA9IE9wdGlvbjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBPcHRpb25gIHdpdGggdGhlIGdpdmVuIGBmbGFnc2AgYW5kIGBkZXNjcmlwdGlvbmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZsYWdzXG4gKiBAcGFyYW0ge1N0cmluZ30gZGVzY3JpcHRpb25cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuZnVuY3Rpb24gT3B0aW9uKGZsYWdzLCBkZXNjcmlwdGlvbikge1xuICB0aGlzLmZsYWdzID0gZmxhZ3M7XG4gIHRoaXMucmVxdWlyZWQgPSB+ZmxhZ3MuaW5kZXhPZignPCcpO1xuICB0aGlzLm9wdGlvbmFsID0gfmZsYWdzLmluZGV4T2YoJ1snKTtcbiAgdGhpcy5ib29sID0gIX5mbGFncy5pbmRleE9mKCctbm8tJyk7XG4gIGZsYWdzID0gZmxhZ3Muc3BsaXQoL1sgLHxdKy8pO1xuICBpZiAoZmxhZ3MubGVuZ3RoID4gMSAmJiAhL15bWzxdLy50ZXN0KGZsYWdzWzFdKSkgdGhpcy5zaG9ydCA9IGZsYWdzLnNoaWZ0KCk7XG4gIHRoaXMubG9uZyA9IGZsYWdzLnNoaWZ0KCk7XG4gIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbiB8fCAnJztcbn1cblxuLyoqXG4gKiBSZXR1cm4gb3B0aW9uIG5hbWUuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuT3B0aW9uLnByb3RvdHlwZS5uYW1lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmxvbmdcbiAgICAucmVwbGFjZSgnLS0nLCAnJylcbiAgICAucmVwbGFjZSgnbm8tJywgJycpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gb3B0aW9uIG5hbWUsIGluIGEgY2FtZWxjYXNlIGZvcm1hdCB0aGF0IGNhbiBiZSB1c2VkXG4gKiBhcyBhIG9iamVjdCBhdHRyaWJ1dGUga2V5LlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbk9wdGlvbi5wcm90b3R5cGUuYXR0cmlidXRlTmFtZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gY2FtZWxjYXNlKCB0aGlzLm5hbWUoKSApO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBgYXJnYCBtYXRjaGVzIHRoZSBzaG9ydCBvciBsb25nIGZsYWcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGFyZ1xuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbk9wdGlvbi5wcm90b3R5cGUuaXMgPSBmdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSB0aGlzLnNob3J0IHx8IGFyZyA9PSB0aGlzLmxvbmc7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgYENvbW1hbmRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbmZ1bmN0aW9uIENvbW1hbmQobmFtZSkge1xuICB0aGlzLmNvbW1hbmRzID0gW107XG4gIHRoaXMub3B0aW9ucyA9IFtdO1xuICB0aGlzLl9leGVjcyA9IHt9O1xuICB0aGlzLl9hbGxvd1Vua25vd25PcHRpb24gPSBmYWxzZTtcbiAgdGhpcy5fYXJncyA9IFtdO1xuICB0aGlzLl9uYW1lID0gbmFtZSB8fCAnJztcbn1cblxuLyoqXG4gKiBJbmhlcml0IGZyb20gYEV2ZW50RW1pdHRlci5wcm90b3R5cGVgLlxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLl9fcHJvdG9fXyA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGU7XG5cbi8qKlxuICogQWRkIGNvbW1hbmQgYG5hbWVgLlxuICpcbiAqIFRoZSBgLmFjdGlvbigpYCBjYWxsYmFjayBpcyBpbnZva2VkIHdoZW4gdGhlXG4gKiBjb21tYW5kIGBuYW1lYCBpcyBzcGVjaWZpZWQgdmlhIF9fQVJHVl9fLFxuICogYW5kIHRoZSByZW1haW5pbmcgYXJndW1lbnRzIGFyZSBhcHBsaWVkIHRvIHRoZVxuICogZnVuY3Rpb24gZm9yIGFjY2Vzcy5cbiAqXG4gKiBXaGVuIHRoZSBgbmFtZWAgaXMgXCIqXCIgYW4gdW4tbWF0Y2hlZCBjb21tYW5kXG4gKiB3aWxsIGJlIHBhc3NlZCBhcyB0aGUgZmlyc3QgYXJnLCBmb2xsb3dlZCBieVxuICogdGhlIHJlc3Qgb2YgX19BUkdWX18gcmVtYWluaW5nLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgcHJvZ3JhbVxuICogICAgICAgIC52ZXJzaW9uKCcwLjAuMScpXG4gKiAgICAgICAgLm9wdGlvbignLUMsIC0tY2hkaXIgPHBhdGg+JywgJ2NoYW5nZSB0aGUgd29ya2luZyBkaXJlY3RvcnknKVxuICogICAgICAgIC5vcHRpb24oJy1jLCAtLWNvbmZpZyA8cGF0aD4nLCAnc2V0IGNvbmZpZyBwYXRoLiBkZWZhdWx0cyB0byAuL2RlcGxveS5jb25mJylcbiAqICAgICAgICAub3B0aW9uKCctVCwgLS1uby10ZXN0cycsICdpZ25vcmUgdGVzdCBob29rJylcbiAqXG4gKiAgICAgIHByb2dyYW1cbiAqICAgICAgICAuY29tbWFuZCgnc2V0dXAnKVxuICogICAgICAgIC5kZXNjcmlwdGlvbigncnVuIHJlbW90ZSBzZXR1cCBjb21tYW5kcycpXG4gKiAgICAgICAgLmFjdGlvbihmdW5jdGlvbigpIHtcbiAqICAgICAgICAgIGNvbnNvbGUubG9nKCdzZXR1cCcpO1xuICogICAgICAgIH0pO1xuICpcbiAqICAgICAgcHJvZ3JhbVxuICogICAgICAgIC5jb21tYW5kKCdleGVjIDxjbWQ+JylcbiAqICAgICAgICAuZGVzY3JpcHRpb24oJ3J1biB0aGUgZ2l2ZW4gcmVtb3RlIGNvbW1hbmQnKVxuICogICAgICAgIC5hY3Rpb24oZnVuY3Rpb24oY21kKSB7XG4gKiAgICAgICAgICBjb25zb2xlLmxvZygnZXhlYyBcIiVzXCInLCBjbWQpO1xuICogICAgICAgIH0pO1xuICpcbiAqICAgICAgcHJvZ3JhbVxuICogICAgICAgIC5jb21tYW5kKCd0ZWFyZG93biA8ZGlyPiBbb3RoZXJEaXJzLi4uXScpXG4gKiAgICAgICAgLmRlc2NyaXB0aW9uKCdydW4gdGVhcmRvd24gY29tbWFuZHMnKVxuICogICAgICAgIC5hY3Rpb24oZnVuY3Rpb24oZGlyLCBvdGhlckRpcnMpIHtcbiAqICAgICAgICAgIGNvbnNvbGUubG9nKCdkaXIgXCIlc1wiJywgZGlyKTtcbiAqICAgICAgICAgIGlmIChvdGhlckRpcnMpIHtcbiAqICAgICAgICAgICAgb3RoZXJEaXJzLmZvckVhY2goZnVuY3Rpb24gKG9EaXIpIHtcbiAqICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGlyIFwiJXNcIicsIG9EaXIpO1xuICogICAgICAgICAgICB9KTtcbiAqICAgICAgICAgIH1cbiAqICAgICAgICB9KTtcbiAqXG4gKiAgICAgIHByb2dyYW1cbiAqICAgICAgICAuY29tbWFuZCgnKicpXG4gKiAgICAgICAgLmRlc2NyaXB0aW9uKCdkZXBsb3kgdGhlIGdpdmVuIGVudicpXG4gKiAgICAgICAgLmFjdGlvbihmdW5jdGlvbihlbnYpIHtcbiAqICAgICAgICAgIGNvbnNvbGUubG9nKCdkZXBsb3lpbmcgXCIlc1wiJywgZW52KTtcbiAqICAgICAgICB9KTtcbiAqXG4gKiAgICAgIHByb2dyYW0ucGFyc2UocHJvY2Vzcy5hcmd2KTtcbiAgKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZGVzY10gZm9yIGdpdC1zdHlsZSBzdWItY29tbWFuZHNcbiAqIEByZXR1cm4ge0NvbW1hbmR9IHRoZSBuZXcgY29tbWFuZFxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5jb21tYW5kID0gZnVuY3Rpb24obmFtZSwgZGVzYywgb3B0cykge1xuICBpZih0eXBlb2YgZGVzYyA9PT0gJ29iamVjdCcgJiYgZGVzYyAhPT0gbnVsbCl7XG4gICAgb3B0cyA9IGRlc2M7XG4gICAgZGVzYyA9IG51bGw7XG4gIH1cbiAgb3B0cyA9IG9wdHMgfHwge307XG4gIHZhciBhcmdzID0gbmFtZS5zcGxpdCgvICsvKTtcbiAgdmFyIGNtZCA9IG5ldyBDb21tYW5kKGFyZ3Muc2hpZnQoKSk7XG5cbiAgaWYgKGRlc2MpIHtcbiAgICBjbWQuZGVzY3JpcHRpb24oZGVzYyk7XG4gICAgdGhpcy5leGVjdXRhYmxlcyA9IHRydWU7XG4gICAgdGhpcy5fZXhlY3NbY21kLl9uYW1lXSA9IHRydWU7XG4gICAgaWYgKG9wdHMuaXNEZWZhdWx0KSB0aGlzLmRlZmF1bHRFeGVjdXRhYmxlID0gY21kLl9uYW1lO1xuICB9XG4gIGNtZC5fbm9IZWxwID0gISFvcHRzLm5vSGVscDtcbiAgdGhpcy5jb21tYW5kcy5wdXNoKGNtZCk7XG4gIGNtZC5wYXJzZUV4cGVjdGVkQXJncyhhcmdzKTtcbiAgY21kLnBhcmVudCA9IHRoaXM7XG5cbiAgaWYgKGRlc2MpIHJldHVybiB0aGlzO1xuICByZXR1cm4gY21kO1xufTtcblxuLyoqXG4gKiBEZWZpbmUgYXJndW1lbnQgc3ludGF4IGZvciB0aGUgdG9wLWxldmVsIGNvbW1hbmQuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5hcmd1bWVudHMgPSBmdW5jdGlvbiAoZGVzYykge1xuICByZXR1cm4gdGhpcy5wYXJzZUV4cGVjdGVkQXJncyhkZXNjLnNwbGl0KC8gKy8pKTtcbn07XG5cbi8qKlxuICogQWRkIGFuIGltcGxpY2l0IGBoZWxwIFtjbWRdYCBzdWJjb21tYW5kXG4gKiB3aGljaCBpbnZva2VzIGAtLWhlbHBgIGZvciB0aGUgZ2l2ZW4gY29tbWFuZC5cbiAqXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5hZGRJbXBsaWNpdEhlbHBDb21tYW5kID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuY29tbWFuZCgnaGVscCBbY21kXScsICdkaXNwbGF5IGhlbHAgZm9yIFtjbWRdJyk7XG59O1xuXG4vKipcbiAqIFBhcnNlIGV4cGVjdGVkIGBhcmdzYC5cbiAqXG4gKiBGb3IgZXhhbXBsZSBgW1wiW3R5cGVdXCJdYCBiZWNvbWVzIGBbeyByZXF1aXJlZDogZmFsc2UsIG5hbWU6ICd0eXBlJyB9XWAuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJnc1xuICogQHJldHVybiB7Q29tbWFuZH0gZm9yIGNoYWluaW5nXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLnBhcnNlRXhwZWN0ZWRBcmdzID0gZnVuY3Rpb24oYXJncykge1xuICBpZiAoIWFyZ3MubGVuZ3RoKSByZXR1cm47XG4gIHZhciBzZWxmID0gdGhpcztcbiAgYXJncy5mb3JFYWNoKGZ1bmN0aW9uKGFyZykge1xuICAgIHZhciBhcmdEZXRhaWxzID0ge1xuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgbmFtZTogJycsXG4gICAgICB2YXJpYWRpYzogZmFsc2VcbiAgICB9O1xuXG4gICAgc3dpdGNoIChhcmdbMF0pIHtcbiAgICAgIGNhc2UgJzwnOlxuICAgICAgICBhcmdEZXRhaWxzLnJlcXVpcmVkID0gdHJ1ZTtcbiAgICAgICAgYXJnRGV0YWlscy5uYW1lID0gYXJnLnNsaWNlKDEsIC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdbJzpcbiAgICAgICAgYXJnRGV0YWlscy5uYW1lID0gYXJnLnNsaWNlKDEsIC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGFyZ0RldGFpbHMubmFtZS5sZW5ndGggPiAzICYmIGFyZ0RldGFpbHMubmFtZS5zbGljZSgtMykgPT09ICcuLi4nKSB7XG4gICAgICBhcmdEZXRhaWxzLnZhcmlhZGljID0gdHJ1ZTtcbiAgICAgIGFyZ0RldGFpbHMubmFtZSA9IGFyZ0RldGFpbHMubmFtZS5zbGljZSgwLCAtMyk7XG4gICAgfVxuICAgIGlmIChhcmdEZXRhaWxzLm5hbWUpIHtcbiAgICAgIHNlbGYuX2FyZ3MucHVzaChhcmdEZXRhaWxzKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogUmVnaXN0ZXIgY2FsbGJhY2sgYGZuYCBmb3IgdGhlIGNvbW1hbmQuXG4gKlxuICogRXhhbXBsZXM6XG4gKlxuICogICAgICBwcm9ncmFtXG4gKiAgICAgICAgLmNvbW1hbmQoJ2hlbHAnKVxuICogICAgICAgIC5kZXNjcmlwdGlvbignZGlzcGxheSB2ZXJib3NlIGhlbHAnKVxuICogICAgICAgIC5hY3Rpb24oZnVuY3Rpb24oKSB7XG4gKiAgICAgICAgICAgLy8gb3V0cHV0IGhlbHAgaGVyZVxuICogICAgICAgIH0pO1xuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtDb21tYW5kfSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuYWN0aW9uID0gZnVuY3Rpb24oZm4pIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbihhcmdzLCB1bmtub3duKSB7XG4gICAgLy8gUGFyc2UgYW55IHNvLWZhciB1bmtub3duIG9wdGlvbnNcbiAgICBhcmdzID0gYXJncyB8fCBbXTtcbiAgICB1bmtub3duID0gdW5rbm93biB8fCBbXTtcblxuICAgIHZhciBwYXJzZWQgPSBzZWxmLnBhcnNlT3B0aW9ucyh1bmtub3duKTtcblxuICAgIC8vIE91dHB1dCBoZWxwIGlmIG5lY2Vzc2FyeVxuICAgIG91dHB1dEhlbHBJZk5lY2Vzc2FyeShzZWxmLCBwYXJzZWQudW5rbm93bik7XG5cbiAgICAvLyBJZiB0aGVyZSBhcmUgc3RpbGwgYW55IHVua25vd24gb3B0aW9ucywgdGhlbiB3ZSBzaW1wbHlcbiAgICAvLyBkaWUsIHVubGVzcyBzb21lb25lIGFza2VkIGZvciBoZWxwLCBpbiB3aGljaCBjYXNlIHdlIGdpdmUgaXRcbiAgICAvLyB0byB0aGVtLCBhbmQgdGhlbiB3ZSBkaWUuXG4gICAgaWYgKHBhcnNlZC51bmtub3duLmxlbmd0aCA+IDApIHtcbiAgICAgIHNlbGYudW5rbm93bk9wdGlvbihwYXJzZWQudW5rbm93blswXSk7XG4gICAgfVxuXG4gICAgLy8gTGVmdG92ZXIgYXJndW1lbnRzIG5lZWQgdG8gYmUgcHVzaGVkIGJhY2suIEZpeGVzIGlzc3VlICM1NlxuICAgIGlmIChwYXJzZWQuYXJncy5sZW5ndGgpIGFyZ3MgPSBwYXJzZWQuYXJncy5jb25jYXQoYXJncyk7XG5cbiAgICBzZWxmLl9hcmdzLmZvckVhY2goZnVuY3Rpb24oYXJnLCBpKSB7XG4gICAgICBpZiAoYXJnLnJlcXVpcmVkICYmIG51bGwgPT0gYXJnc1tpXSkge1xuICAgICAgICBzZWxmLm1pc3NpbmdBcmd1bWVudChhcmcubmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKGFyZy52YXJpYWRpYykge1xuICAgICAgICBpZiAoaSAhPT0gc2VsZi5fYXJncy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgc2VsZi52YXJpYWRpY0FyZ05vdExhc3QoYXJnLm5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXJnc1tpXSA9IGFyZ3Muc3BsaWNlKGkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQWx3YXlzIGFwcGVuZCBvdXJzZWx2ZXMgdG8gdGhlIGVuZCBvZiB0aGUgYXJndW1lbnRzLFxuICAgIC8vIHRvIG1ha2Ugc3VyZSB3ZSBtYXRjaCB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0aGUgdXNlclxuICAgIC8vIGV4cGVjdHNcbiAgICBpZiAoc2VsZi5fYXJncy5sZW5ndGgpIHtcbiAgICAgIGFyZ3Nbc2VsZi5fYXJncy5sZW5ndGhdID0gc2VsZjtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJncy5wdXNoKHNlbGYpO1xuICAgIH1cblxuICAgIGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9O1xuICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQgfHwgdGhpcztcbiAgdmFyIG5hbWUgPSBwYXJlbnQgPT09IHRoaXMgPyAnKicgOiB0aGlzLl9uYW1lO1xuICBwYXJlbnQub24oJ2NvbW1hbmQ6JyArIG5hbWUsIGxpc3RlbmVyKTtcbiAgaWYgKHRoaXMuX2FsaWFzKSBwYXJlbnQub24oJ2NvbW1hbmQ6JyArIHRoaXMuX2FsaWFzLCBsaXN0ZW5lcik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBEZWZpbmUgb3B0aW9uIHdpdGggYGZsYWdzYCwgYGRlc2NyaXB0aW9uYCBhbmQgb3B0aW9uYWxcbiAqIGNvZXJjaW9uIGBmbmAuXG4gKlxuICogVGhlIGBmbGFnc2Agc3RyaW5nIHNob3VsZCBjb250YWluIGJvdGggdGhlIHNob3J0IGFuZCBsb25nIGZsYWdzLFxuICogc2VwYXJhdGVkIGJ5IGNvbW1hLCBhIHBpcGUgb3Igc3BhY2UuIFRoZSBmb2xsb3dpbmcgYXJlIGFsbCB2YWxpZFxuICogYWxsIHdpbGwgb3V0cHV0IHRoaXMgd2F5IHdoZW4gYC0taGVscGAgaXMgdXNlZC5cbiAqXG4gKiAgICBcIi1wLCAtLXBlcHBlclwiXG4gKiAgICBcIi1wfC0tcGVwcGVyXCJcbiAqICAgIFwiLXAgLS1wZXBwZXJcIlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAvLyBzaW1wbGUgYm9vbGVhbiBkZWZhdWx0aW5nIHRvIGZhbHNlXG4gKiAgICAgcHJvZ3JhbS5vcHRpb24oJy1wLCAtLXBlcHBlcicsICdhZGQgcGVwcGVyJyk7XG4gKlxuICogICAgIC0tcGVwcGVyXG4gKiAgICAgcHJvZ3JhbS5wZXBwZXJcbiAqICAgICAvLyA9PiBCb29sZWFuXG4gKlxuICogICAgIC8vIHNpbXBsZSBib29sZWFuIGRlZmF1bHRpbmcgdG8gdHJ1ZVxuICogICAgIHByb2dyYW0ub3B0aW9uKCctQywgLS1uby1jaGVlc2UnLCAncmVtb3ZlIGNoZWVzZScpO1xuICpcbiAqICAgICBwcm9ncmFtLmNoZWVzZVxuICogICAgIC8vID0+IHRydWVcbiAqXG4gKiAgICAgLS1uby1jaGVlc2VcbiAqICAgICBwcm9ncmFtLmNoZWVzZVxuICogICAgIC8vID0+IGZhbHNlXG4gKlxuICogICAgIC8vIHJlcXVpcmVkIGFyZ3VtZW50XG4gKiAgICAgcHJvZ3JhbS5vcHRpb24oJy1DLCAtLWNoZGlyIDxwYXRoPicsICdjaGFuZ2UgdGhlIHdvcmtpbmcgZGlyZWN0b3J5Jyk7XG4gKlxuICogICAgIC0tY2hkaXIgL3RtcFxuICogICAgIHByb2dyYW0uY2hkaXJcbiAqICAgICAvLyA9PiBcIi90bXBcIlxuICpcbiAqICAgICAvLyBvcHRpb25hbCBhcmd1bWVudFxuICogICAgIHByb2dyYW0ub3B0aW9uKCctYywgLS1jaGVlc2UgW3R5cGVdJywgJ2FkZCBjaGVlc2UgW21hcmJsZV0nKTtcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZmxhZ3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBkZXNjcmlwdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbnwqfSBbZm5dIG9yIGRlZmF1bHRcbiAqIEBwYXJhbSB7Kn0gW2RlZmF1bHRWYWx1ZV1cbiAqIEByZXR1cm4ge0NvbW1hbmR9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5vcHRpb24gPSBmdW5jdGlvbihmbGFncywgZGVzY3JpcHRpb24sIGZuLCBkZWZhdWx0VmFsdWUpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gICAgLCBvcHRpb24gPSBuZXcgT3B0aW9uKGZsYWdzLCBkZXNjcmlwdGlvbilcbiAgICAsIG9uYW1lID0gb3B0aW9uLm5hbWUoKVxuICAgICwgbmFtZSA9IG9wdGlvbi5hdHRyaWJ1dGVOYW1lKCk7XG5cbiAgLy8gZGVmYXVsdCBhcyAzcmQgYXJnXG4gIGlmICh0eXBlb2YgZm4gIT0gJ2Z1bmN0aW9uJykge1xuICAgIGlmIChmbiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgdmFyIHJlZ2V4ID0gZm47XG4gICAgICBmbiA9IGZ1bmN0aW9uKHZhbCwgZGVmKSB7XG4gICAgICAgIHZhciBtID0gcmVnZXguZXhlYyh2YWwpO1xuICAgICAgICByZXR1cm4gbSA/IG1bMF0gOiBkZWY7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgZGVmYXVsdFZhbHVlID0gZm47XG4gICAgICBmbiA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLy8gcHJlYXNzaWduIGRlZmF1bHQgdmFsdWUgb25seSBmb3IgLS1uby0qLCBbb3B0aW9uYWxdLCBvciA8cmVxdWlyZWQ+XG4gIGlmIChmYWxzZSA9PSBvcHRpb24uYm9vbCB8fCBvcHRpb24ub3B0aW9uYWwgfHwgb3B0aW9uLnJlcXVpcmVkKSB7XG4gICAgLy8gd2hlbiAtLW5vLSogd2UgbWFrZSBzdXJlIGRlZmF1bHQgaXMgdHJ1ZVxuICAgIGlmIChmYWxzZSA9PSBvcHRpb24uYm9vbCkgZGVmYXVsdFZhbHVlID0gdHJ1ZTtcbiAgICAvLyBwcmVhc3NpZ24gb25seSBpZiB3ZSBoYXZlIGEgZGVmYXVsdFxuICAgIGlmICh1bmRlZmluZWQgIT09IGRlZmF1bHRWYWx1ZSkge1xuICAgICAgc2VsZltuYW1lXSA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgIG9wdGlvbi5kZWZhdWx0VmFsdWUgPSBkZWZhdWx0VmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLy8gcmVnaXN0ZXIgdGhlIG9wdGlvblxuICB0aGlzLm9wdGlvbnMucHVzaChvcHRpb24pO1xuXG4gIC8vIHdoZW4gaXQncyBwYXNzZWQgYXNzaWduIHRoZSB2YWx1ZVxuICAvLyBhbmQgY29uZGl0aW9uYWxseSBpbnZva2UgdGhlIGNhbGxiYWNrXG4gIHRoaXMub24oJ29wdGlvbjonICsgb25hbWUsIGZ1bmN0aW9uKHZhbCkge1xuICAgIC8vIGNvZXJjaW9uXG4gICAgaWYgKG51bGwgIT09IHZhbCAmJiBmbikgdmFsID0gZm4odmFsLCB1bmRlZmluZWQgPT09IHNlbGZbbmFtZV1cbiAgICAgID8gZGVmYXVsdFZhbHVlXG4gICAgICA6IHNlbGZbbmFtZV0pO1xuXG4gICAgLy8gdW5hc3NpZ25lZCBvciBib29sXG4gICAgaWYgKCdib29sZWFuJyA9PSB0eXBlb2Ygc2VsZltuYW1lXSB8fCAndW5kZWZpbmVkJyA9PSB0eXBlb2Ygc2VsZltuYW1lXSkge1xuICAgICAgLy8gaWYgbm8gdmFsdWUsIGJvb2wgdHJ1ZSwgYW5kIHdlIGhhdmUgYSBkZWZhdWx0LCB0aGVuIHVzZSBpdCFcbiAgICAgIGlmIChudWxsID09IHZhbCkge1xuICAgICAgICBzZWxmW25hbWVdID0gb3B0aW9uLmJvb2xcbiAgICAgICAgICA/IGRlZmF1bHRWYWx1ZSB8fCB0cnVlXG4gICAgICAgICAgOiBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGZbbmFtZV0gPSB2YWw7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChudWxsICE9PSB2YWwpIHtcbiAgICAgIC8vIHJlYXNzaWduXG4gICAgICBzZWxmW25hbWVdID0gdmFsO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEFsbG93IHVua25vd24gb3B0aW9ucyBvbiB0aGUgY29tbWFuZCBsaW5lLlxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gYXJnIGlmIGB0cnVlYCBvciBvbWl0dGVkLCBubyBlcnJvciB3aWxsIGJlIHRocm93blxuICogZm9yIHVua25vd24gb3B0aW9ucy5cbiAqIEBhcGkgcHVibGljXG4gKi9cbkNvbW1hbmQucHJvdG90eXBlLmFsbG93VW5rbm93bk9wdGlvbiA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHRoaXMuX2FsbG93VW5rbm93bk9wdGlvbiA9IGFyZ3VtZW50cy5sZW5ndGggPT09IDAgfHwgYXJnO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBQYXJzZSBgYXJndmAsIHNldHRpbmdzIG9wdGlvbnMgYW5kIGludm9raW5nIGNvbW1hbmRzIHdoZW4gZGVmaW5lZC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcmd2XG4gKiBAcmV0dXJuIHtDb21tYW5kfSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbihhcmd2KSB7XG4gIC8vIGltcGxpY2l0IGhlbHBcbiAgaWYgKHRoaXMuZXhlY3V0YWJsZXMpIHRoaXMuYWRkSW1wbGljaXRIZWxwQ29tbWFuZCgpO1xuXG4gIC8vIHN0b3JlIHJhdyBhcmdzXG4gIHRoaXMucmF3QXJncyA9IGFyZ3Y7XG5cbiAgLy8gZ3Vlc3MgbmFtZVxuICB0aGlzLl9uYW1lID0gdGhpcy5fbmFtZSB8fCBiYXNlbmFtZShhcmd2WzFdLCAnLmpzJyk7XG5cbiAgLy8gZ2l0aHViLXN0eWxlIHN1Yi1jb21tYW5kcyB3aXRoIG5vIHN1Yi1jb21tYW5kXG4gIGlmICh0aGlzLmV4ZWN1dGFibGVzICYmIGFyZ3YubGVuZ3RoIDwgMyAmJiAhdGhpcy5kZWZhdWx0RXhlY3V0YWJsZSkge1xuICAgIC8vIHRoaXMgdXNlciBuZWVkcyBoZWxwXG4gICAgYXJndi5wdXNoKCctLWhlbHAnKTtcbiAgfVxuXG4gIC8vIHByb2Nlc3MgYXJndlxuICB2YXIgcGFyc2VkID0gdGhpcy5wYXJzZU9wdGlvbnModGhpcy5ub3JtYWxpemUoYXJndi5zbGljZSgyKSkpO1xuICB2YXIgYXJncyA9IHRoaXMuYXJncyA9IHBhcnNlZC5hcmdzO1xuXG4gIHZhciByZXN1bHQgPSB0aGlzLnBhcnNlQXJncyh0aGlzLmFyZ3MsIHBhcnNlZC51bmtub3duKTtcblxuICAvLyBleGVjdXRhYmxlIHN1Yi1jb21tYW5kc1xuICB2YXIgbmFtZSA9IHJlc3VsdC5hcmdzWzBdO1xuXG4gIHZhciBhbGlhc0NvbW1hbmQgPSBudWxsO1xuICAvLyBjaGVjayBhbGlhcyBvZiBzdWIgY29tbWFuZHNcbiAgaWYgKG5hbWUpIHtcbiAgICBhbGlhc0NvbW1hbmQgPSB0aGlzLmNvbW1hbmRzLmZpbHRlcihmdW5jdGlvbihjb21tYW5kKSB7XG4gICAgICByZXR1cm4gY29tbWFuZC5hbGlhcygpID09PSBuYW1lO1xuICAgIH0pWzBdO1xuICB9XG5cbiAgaWYgKHRoaXMuX2V4ZWNzW25hbWVdICYmIHR5cGVvZiB0aGlzLl9leGVjc1tuYW1lXSAhPSBcImZ1bmN0aW9uXCIpIHtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlU3ViQ29tbWFuZChhcmd2LCBhcmdzLCBwYXJzZWQudW5rbm93bik7XG4gIH0gZWxzZSBpZiAoYWxpYXNDb21tYW5kKSB7XG4gICAgLy8gaXMgYWxpYXMgb2YgYSBzdWJDb21tYW5kXG4gICAgYXJnc1swXSA9IGFsaWFzQ29tbWFuZC5fbmFtZTtcbiAgICByZXR1cm4gdGhpcy5leGVjdXRlU3ViQ29tbWFuZChhcmd2LCBhcmdzLCBwYXJzZWQudW5rbm93bik7XG4gIH0gZWxzZSBpZiAodGhpcy5kZWZhdWx0RXhlY3V0YWJsZSkge1xuICAgIC8vIHVzZSB0aGUgZGVmYXVsdCBzdWJjb21tYW5kXG4gICAgYXJncy51bnNoaWZ0KHRoaXMuZGVmYXVsdEV4ZWN1dGFibGUpO1xuICAgIHJldHVybiB0aGlzLmV4ZWN1dGVTdWJDb21tYW5kKGFyZ3YsIGFyZ3MsIHBhcnNlZC51bmtub3duKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEV4ZWN1dGUgYSBzdWItY29tbWFuZCBleGVjdXRhYmxlLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3ZcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3NcbiAqIEBwYXJhbSB7QXJyYXl9IHVua25vd25cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLmV4ZWN1dGVTdWJDb21tYW5kID0gZnVuY3Rpb24oYXJndiwgYXJncywgdW5rbm93bikge1xuICBhcmdzID0gYXJncy5jb25jYXQodW5rbm93bik7XG5cbiAgaWYgKCFhcmdzLmxlbmd0aCkgdGhpcy5oZWxwKCk7XG4gIGlmICgnaGVscCcgPT0gYXJnc1swXSAmJiAxID09IGFyZ3MubGVuZ3RoKSB0aGlzLmhlbHAoKTtcblxuICAvLyA8Y21kPiAtLWhlbHBcbiAgaWYgKCdoZWxwJyA9PSBhcmdzWzBdKSB7XG4gICAgYXJnc1swXSA9IGFyZ3NbMV07XG4gICAgYXJnc1sxXSA9ICctLWhlbHAnO1xuICB9XG5cbiAgLy8gZXhlY3V0YWJsZVxuICB2YXIgZiA9IGFyZ3ZbMV07XG4gIC8vIG5hbWUgb2YgdGhlIHN1YmNvbW1hbmQsIGxpbmsgYHBtLWluc3RhbGxgXG4gIHZhciBiaW4gPSBiYXNlbmFtZShmLCAnLmpzJykgKyAnLScgKyBhcmdzWzBdO1xuXG5cbiAgLy8gSW4gY2FzZSBvZiBnbG9iYWxseSBpbnN0YWxsZWQsIGdldCB0aGUgYmFzZSBkaXIgd2hlcmUgZXhlY3V0YWJsZVxuICAvLyAgc3ViY29tbWFuZCBmaWxlIHNob3VsZCBiZSBsb2NhdGVkIGF0XG4gIHZhciBiYXNlRGlyXG4gICAgLCBsaW5rID0gZnMubHN0YXRTeW5jKGYpLmlzU3ltYm9saWNMaW5rKCkgPyBmcy5yZWFkbGlua1N5bmMoZikgOiBmO1xuXG4gIC8vIHdoZW4gc3ltYm9saW5rIGlzIHJlbGF0aXZlIHBhdGhcbiAgaWYgKGxpbmsgIT09IGYgJiYgbGluay5jaGFyQXQoMCkgIT09ICcvJykge1xuICAgIGxpbmsgPSBwYXRoLmpvaW4oZGlybmFtZShmKSwgbGluaylcbiAgfVxuICBiYXNlRGlyID0gZGlybmFtZShsaW5rKTtcblxuICAvLyBwcmVmZXIgbG9jYWwgYC4vPGJpbj5gIHRvIGJpbiBpbiB0aGUgJFBBVEhcbiAgdmFyIGxvY2FsQmluID0gcGF0aC5qb2luKGJhc2VEaXIsIGJpbik7XG5cbiAgLy8gd2hldGhlciBiaW4gZmlsZSBpcyBhIGpzIHNjcmlwdCB3aXRoIGV4cGxpY2l0IGAuanNgIGV4dGVuc2lvblxuICB2YXIgaXNFeHBsaWNpdEpTID0gZmFsc2U7XG4gIGlmIChleGlzdHMobG9jYWxCaW4gKyAnLmpzJykpIHtcbiAgICBiaW4gPSBsb2NhbEJpbiArICcuanMnO1xuICAgIGlzRXhwbGljaXRKUyA9IHRydWU7XG4gIH0gZWxzZSBpZiAoZXhpc3RzKGxvY2FsQmluKSkge1xuICAgIGJpbiA9IGxvY2FsQmluO1xuICB9XG5cbiAgYXJncyA9IGFyZ3Muc2xpY2UoMSk7XG5cbiAgdmFyIHByb2M7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSB7XG4gICAgaWYgKGlzRXhwbGljaXRKUykge1xuICAgICAgYXJncy51bnNoaWZ0KGJpbik7XG4gICAgICAvLyBhZGQgZXhlY3V0YWJsZSBhcmd1bWVudHMgdG8gc3Bhd25cbiAgICAgIGFyZ3MgPSAocHJvY2Vzcy5leGVjQXJndiB8fCBbXSkuY29uY2F0KGFyZ3MpO1xuXG4gICAgICBwcm9jID0gc3Bhd24ocHJvY2Vzcy5hcmd2WzBdLCBhcmdzLCB7IHN0ZGlvOiAnaW5oZXJpdCcsIGN1c3RvbUZkczogWzAsIDEsIDJdIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9jID0gc3Bhd24oYmluLCBhcmdzLCB7IHN0ZGlvOiAnaW5oZXJpdCcsIGN1c3RvbUZkczogWzAsIDEsIDJdIH0pO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBhcmdzLnVuc2hpZnQoYmluKTtcbiAgICBwcm9jID0gc3Bhd24ocHJvY2Vzcy5leGVjUGF0aCwgYXJncywgeyBzdGRpbzogJ2luaGVyaXQnfSk7XG4gIH1cblxuICB2YXIgc2lnbmFscyA9IFsnU0lHVVNSMScsICdTSUdVU1IyJywgJ1NJR1RFUk0nLCAnU0lHSU5UJywgJ1NJR0hVUCddO1xuICBzaWduYWxzLmZvckVhY2goZnVuY3Rpb24oc2lnbmFsKSB7XG4gICAgcHJvY2Vzcy5vbihzaWduYWwsIGZ1bmN0aW9uKCl7XG4gICAgICBpZiAoKHByb2Mua2lsbGVkID09PSBmYWxzZSkgJiYgKHByb2MuZXhpdENvZGUgPT09IG51bGwpKXtcbiAgICAgICAgcHJvYy5raWxsKHNpZ25hbCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICBwcm9jLm9uKCdjbG9zZScsIHByb2Nlc3MuZXhpdC5iaW5kKHByb2Nlc3MpKTtcbiAgcHJvYy5vbignZXJyb3InLCBmdW5jdGlvbihlcnIpIHtcbiAgICBpZiAoZXJyLmNvZGUgPT0gXCJFTk9FTlRcIikge1xuICAgICAgY29uc29sZS5lcnJvcignXFxuICAlcygxKSBkb2VzIG5vdCBleGlzdCwgdHJ5IC0taGVscFxcbicsIGJpbik7XG4gICAgfSBlbHNlIGlmIChlcnIuY29kZSA9PSBcIkVBQ0NFU1wiKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdcXG4gICVzKDEpIG5vdCBleGVjdXRhYmxlLiB0cnkgY2htb2Qgb3IgcnVuIHdpdGggcm9vdFxcbicsIGJpbik7XG4gICAgfVxuICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgfSk7XG5cbiAgLy8gU3RvcmUgdGhlIHJlZmVyZW5jZSB0byB0aGUgY2hpbGQgcHJvY2Vzc1xuICB0aGlzLnJ1bm5pbmdDb21tYW5kID0gcHJvYztcbn07XG5cbi8qKlxuICogTm9ybWFsaXplIGBhcmdzYCwgc3BsaXR0aW5nIGpvaW5lZCBzaG9ydCBmbGFncy4gRm9yIGV4YW1wbGVcbiAqIHRoZSBhcmcgXCItYWJjXCIgaXMgZXF1aXZhbGVudCB0byBcIi1hIC1iIC1jXCIuXG4gKiBUaGlzIGFsc28gbm9ybWFsaXplcyBlcXVhbCBzaWduIGFuZCBzcGxpdHMgXCItLWFiYz1kZWZcIiBpbnRvIFwiLS1hYmMgZGVmXCIuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJnc1xuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5ub3JtYWxpemUgPSBmdW5jdGlvbihhcmdzKSB7XG4gIHZhciByZXQgPSBbXVxuICAgICwgYXJnXG4gICAgLCBsYXN0T3B0XG4gICAgLCBpbmRleDtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gYXJncy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGFyZyA9IGFyZ3NbaV07XG4gICAgaWYgKGkgPiAwKSB7XG4gICAgICBsYXN0T3B0ID0gdGhpcy5vcHRpb25Gb3IoYXJnc1tpLTFdKTtcbiAgICB9XG5cbiAgICBpZiAoYXJnID09PSAnLS0nKSB7XG4gICAgICAvLyBIb25vciBvcHRpb24gdGVybWluYXRvclxuICAgICAgcmV0ID0gcmV0LmNvbmNhdChhcmdzLnNsaWNlKGkpKTtcbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSBpZiAobGFzdE9wdCAmJiBsYXN0T3B0LnJlcXVpcmVkKSB7XG4gICAgICByZXQucHVzaChhcmcpO1xuICAgIH0gZWxzZSBpZiAoYXJnLmxlbmd0aCA+IDEgJiYgJy0nID09IGFyZ1swXSAmJiAnLScgIT0gYXJnWzFdKSB7XG4gICAgICBhcmcuc2xpY2UoMSkuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24oYykge1xuICAgICAgICByZXQucHVzaCgnLScgKyBjKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoL14tLS8udGVzdChhcmcpICYmIH4oaW5kZXggPSBhcmcuaW5kZXhPZignPScpKSkge1xuICAgICAgcmV0LnB1c2goYXJnLnNsaWNlKDAsIGluZGV4KSwgYXJnLnNsaWNlKGluZGV4ICsgMSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXQucHVzaChhcmcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59O1xuXG4vKipcbiAqIFBhcnNlIGNvbW1hbmQgYGFyZ3NgLlxuICpcbiAqIFdoZW4gbGlzdGVuZXIocykgYXJlIGF2YWlsYWJsZSB0aG9zZVxuICogY2FsbGJhY2tzIGFyZSBpbnZva2VkLCBvdGhlcndpc2UgdGhlIFwiKlwiXG4gKiBldmVudCBpcyBlbWl0dGVkIGFuZCB0aG9zZSBhY3Rpb25zIGFyZSBpbnZva2VkLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3NcbiAqIEByZXR1cm4ge0NvbW1hbmR9IGZvciBjaGFpbmluZ1xuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUucGFyc2VBcmdzID0gZnVuY3Rpb24oYXJncywgdW5rbm93bikge1xuICB2YXIgbmFtZTtcblxuICBpZiAoYXJncy5sZW5ndGgpIHtcbiAgICBuYW1lID0gYXJnc1swXTtcbiAgICBpZiAodGhpcy5saXN0ZW5lcnMoJ2NvbW1hbmQ6JyArIG5hbWUpLmxlbmd0aCkge1xuICAgICAgdGhpcy5lbWl0KCdjb21tYW5kOicgKyBhcmdzLnNoaWZ0KCksIGFyZ3MsIHVua25vd24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVtaXQoJ2NvbW1hbmQ6KicsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBvdXRwdXRIZWxwSWZOZWNlc3NhcnkodGhpcywgdW5rbm93bik7XG5cbiAgICAvLyBJZiB0aGVyZSB3ZXJlIG5vIGFyZ3MgYW5kIHdlIGhhdmUgdW5rbm93biBvcHRpb25zLFxuICAgIC8vIHRoZW4gdGhleSBhcmUgZXh0cmFuZW91cyBhbmQgd2UgbmVlZCB0byBlcnJvci5cbiAgICBpZiAodW5rbm93bi5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnVua25vd25PcHRpb24odW5rbm93blswXSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBvcHRpb24gbWF0Y2hpbmcgYGFyZ2AgaWYgYW55LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhcmdcbiAqIEByZXR1cm4ge09wdGlvbn1cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLm9wdGlvbkZvciA9IGZ1bmN0aW9uKGFyZykge1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5vcHRpb25zLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKHRoaXMub3B0aW9uc1tpXS5pcyhhcmcpKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zW2ldO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBQYXJzZSBvcHRpb25zIGZyb20gYGFyZ3ZgIHJldHVybmluZyBgYXJndmBcbiAqIHZvaWQgb2YgdGhlc2Ugb3B0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcmd2XG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUucGFyc2VPcHRpb25zID0gZnVuY3Rpb24oYXJndikge1xuICB2YXIgYXJncyA9IFtdXG4gICAgLCBsZW4gPSBhcmd2Lmxlbmd0aFxuICAgICwgbGl0ZXJhbFxuICAgICwgb3B0aW9uXG4gICAgLCBhcmc7XG5cbiAgdmFyIHVua25vd25PcHRpb25zID0gW107XG5cbiAgLy8gcGFyc2Ugb3B0aW9uc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgYXJnID0gYXJndltpXTtcblxuICAgIC8vIGxpdGVyYWwgYXJncyBhZnRlciAtLVxuICAgIGlmIChsaXRlcmFsKSB7XG4gICAgICBhcmdzLnB1c2goYXJnKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICgnLS0nID09IGFyZykge1xuICAgICAgbGl0ZXJhbCA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyBmaW5kIG1hdGNoaW5nIE9wdGlvblxuICAgIG9wdGlvbiA9IHRoaXMub3B0aW9uRm9yKGFyZyk7XG5cbiAgICAvLyBvcHRpb24gaXMgZGVmaW5lZFxuICAgIGlmIChvcHRpb24pIHtcbiAgICAgIC8vIHJlcXVpcmVzIGFyZ1xuICAgICAgaWYgKG9wdGlvbi5yZXF1aXJlZCkge1xuICAgICAgICBhcmcgPSBhcmd2WysraV07XG4gICAgICAgIGlmIChudWxsID09IGFyZykgcmV0dXJuIHRoaXMub3B0aW9uTWlzc2luZ0FyZ3VtZW50KG9wdGlvbik7XG4gICAgICAgIHRoaXMuZW1pdCgnb3B0aW9uOicgKyBvcHRpb24ubmFtZSgpLCBhcmcpO1xuICAgICAgLy8gb3B0aW9uYWwgYXJnXG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbi5vcHRpb25hbCkge1xuICAgICAgICBhcmcgPSBhcmd2W2krMV07XG4gICAgICAgIGlmIChudWxsID09IGFyZyB8fCAoJy0nID09IGFyZ1swXSAmJiAnLScgIT0gYXJnKSkge1xuICAgICAgICAgIGFyZyA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgKytpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZW1pdCgnb3B0aW9uOicgKyBvcHRpb24ubmFtZSgpLCBhcmcpO1xuICAgICAgLy8gYm9vbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbWl0KCdvcHRpb246JyArIG9wdGlvbi5uYW1lKCkpO1xuICAgICAgfVxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gbG9va3MgbGlrZSBhbiBvcHRpb25cbiAgICBpZiAoYXJnLmxlbmd0aCA+IDEgJiYgJy0nID09IGFyZ1swXSkge1xuICAgICAgdW5rbm93bk9wdGlvbnMucHVzaChhcmcpO1xuXG4gICAgICAvLyBJZiB0aGUgbmV4dCBhcmd1bWVudCBsb29rcyBsaWtlIGl0IG1pZ2h0IGJlXG4gICAgICAvLyBhbiBhcmd1bWVudCBmb3IgdGhpcyBvcHRpb24sIHdlIHBhc3MgaXQgb24uXG4gICAgICAvLyBJZiBpdCBpc24ndCwgdGhlbiBpdCdsbCBzaW1wbHkgYmUgaWdub3JlZFxuICAgICAgaWYgKGFyZ3ZbaSsxXSAmJiAnLScgIT0gYXJndltpKzFdWzBdKSB7XG4gICAgICAgIHVua25vd25PcHRpb25zLnB1c2goYXJndlsrK2ldKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIC8vIGFyZ1xuICAgIGFyZ3MucHVzaChhcmcpO1xuICB9XG5cbiAgcmV0dXJuIHsgYXJnczogYXJncywgdW5rbm93bjogdW5rbm93bk9wdGlvbnMgfTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIG9wdGlvbnMgYXMga2V5LXZhbHVlIHBhaXJzXG4gKlxuICogQHJldHVybiB7T2JqZWN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuQ29tbWFuZC5wcm90b3R5cGUub3B0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmVzdWx0ID0ge31cbiAgICAsIGxlbiA9IHRoaXMub3B0aW9ucy5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAgOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIga2V5ID0gdGhpcy5vcHRpb25zW2ldLmF0dHJpYnV0ZU5hbWUoKTtcbiAgICByZXN1bHRba2V5XSA9IGtleSA9PT0gJ3ZlcnNpb24nID8gdGhpcy5fdmVyc2lvbiA6IHRoaXNba2V5XTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gKiBBcmd1bWVudCBgbmFtZWAgaXMgbWlzc2luZy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUubWlzc2luZ0FyZ3VtZW50ID0gZnVuY3Rpb24obmFtZSkge1xuICBjb25zb2xlLmVycm9yKCk7XG4gIGNvbnNvbGUuZXJyb3IoXCIgIGVycm9yOiBtaXNzaW5nIHJlcXVpcmVkIGFyZ3VtZW50IGAlcydcIiwgbmFtZSk7XG4gIGNvbnNvbGUuZXJyb3IoKTtcbiAgcHJvY2Vzcy5leGl0KDEpO1xufTtcblxuLyoqXG4gKiBgT3B0aW9uYCBpcyBtaXNzaW5nIGFuIGFyZ3VtZW50LCBidXQgcmVjZWl2ZWQgYGZsYWdgIG9yIG5vdGhpbmcuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvblxuICogQHBhcmFtIHtTdHJpbmd9IGZsYWdcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLm9wdGlvbk1pc3NpbmdBcmd1bWVudCA9IGZ1bmN0aW9uKG9wdGlvbiwgZmxhZykge1xuICBjb25zb2xlLmVycm9yKCk7XG4gIGlmIChmbGFnKSB7XG4gICAgY29uc29sZS5lcnJvcihcIiAgZXJyb3I6IG9wdGlvbiBgJXMnIGFyZ3VtZW50IG1pc3NpbmcsIGdvdCBgJXMnXCIsIG9wdGlvbi5mbGFncywgZmxhZyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcihcIiAgZXJyb3I6IG9wdGlvbiBgJXMnIGFyZ3VtZW50IG1pc3NpbmdcIiwgb3B0aW9uLmZsYWdzKTtcbiAgfVxuICBjb25zb2xlLmVycm9yKCk7XG4gIHByb2Nlc3MuZXhpdCgxKTtcbn07XG5cbi8qKlxuICogVW5rbm93biBvcHRpb24gYGZsYWdgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBmbGFnXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS51bmtub3duT3B0aW9uID0gZnVuY3Rpb24oZmxhZykge1xuICBpZiAodGhpcy5fYWxsb3dVbmtub3duT3B0aW9uKSByZXR1cm47XG4gIGNvbnNvbGUuZXJyb3IoKTtcbiAgY29uc29sZS5lcnJvcihcIiAgZXJyb3I6IHVua25vd24gb3B0aW9uIGAlcydcIiwgZmxhZyk7XG4gIGNvbnNvbGUuZXJyb3IoKTtcbiAgcHJvY2Vzcy5leGl0KDEpO1xufTtcblxuLyoqXG4gKiBWYXJpYWRpYyBhcmd1bWVudCB3aXRoIGBuYW1lYCBpcyBub3QgdGhlIGxhc3QgYXJndW1lbnQgYXMgcmVxdWlyZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLnZhcmlhZGljQXJnTm90TGFzdCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgY29uc29sZS5lcnJvcigpO1xuICBjb25zb2xlLmVycm9yKFwiICBlcnJvcjogdmFyaWFkaWMgYXJndW1lbnRzIG11c3QgYmUgbGFzdCBgJXMnXCIsIG5hbWUpO1xuICBjb25zb2xlLmVycm9yKCk7XG4gIHByb2Nlc3MuZXhpdCgxKTtcbn07XG5cbi8qKlxuICogU2V0IHRoZSBwcm9ncmFtIHZlcnNpb24gdG8gYHN0cmAuXG4gKlxuICogVGhpcyBtZXRob2QgYXV0by1yZWdpc3RlcnMgdGhlIFwiLVYsIC0tdmVyc2lvblwiIGZsYWdcbiAqIHdoaWNoIHdpbGwgcHJpbnQgdGhlIHZlcnNpb24gbnVtYmVyIHdoZW4gcGFzc2VkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBbZmxhZ3NdXG4gKiBAcmV0dXJuIHtDb21tYW5kfSBmb3IgY2hhaW5pbmdcbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUudmVyc2lvbiA9IGZ1bmN0aW9uKHN0ciwgZmxhZ3MpIHtcbiAgaWYgKDAgPT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRoaXMuX3ZlcnNpb247XG4gIHRoaXMuX3ZlcnNpb24gPSBzdHI7XG4gIGZsYWdzID0gZmxhZ3MgfHwgJy1WLCAtLXZlcnNpb24nO1xuICB0aGlzLm9wdGlvbihmbGFncywgJ291dHB1dCB0aGUgdmVyc2lvbiBudW1iZXInKTtcbiAgdGhpcy5vbignb3B0aW9uOnZlcnNpb24nLCBmdW5jdGlvbigpIHtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShzdHIgKyAnXFxuJyk7XG4gICAgcHJvY2Vzcy5leGl0KDApO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFNldCB0aGUgZGVzY3JpcHRpb24gdG8gYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfENvbW1hbmR9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLmRlc2NyaXB0aW9uID0gZnVuY3Rpb24oc3RyKSB7XG4gIGlmICgwID09PSBhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gdGhpcy5fZGVzY3JpcHRpb247XG4gIHRoaXMuX2Rlc2NyaXB0aW9uID0gc3RyO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogU2V0IGFuIGFsaWFzIGZvciB0aGUgY29tbWFuZFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBhbGlhc1xuICogQHJldHVybiB7U3RyaW5nfENvbW1hbmR9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLmFsaWFzID0gZnVuY3Rpb24oYWxpYXMpIHtcbiAgdmFyIGNvbW1hbmQgPSB0aGlzO1xuICBpZih0aGlzLmNvbW1hbmRzLmxlbmd0aCAhPT0gMCkge1xuICAgIGNvbW1hbmQgPSB0aGlzLmNvbW1hbmRzW3RoaXMuY29tbWFuZHMubGVuZ3RoIC0gMV1cbiAgfVxuXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gY29tbWFuZC5fYWxpYXM7XG5cbiAgaWYgKGFsaWFzID09PSBjb21tYW5kLl9uYW1lKSB0aHJvdyBuZXcgRXJyb3IoJ0NvbW1hbmQgYWxpYXMgY2FuXFwndCBiZSB0aGUgc2FtZSBhcyBpdHMgbmFtZScpO1xuXG4gIGNvbW1hbmQuX2FsaWFzID0gYWxpYXM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBTZXQgLyBnZXQgdGhlIGNvbW1hbmQgdXNhZ2UgYHN0cmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0clxuICogQHJldHVybiB7U3RyaW5nfENvbW1hbmR9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLnVzYWdlID0gZnVuY3Rpb24oc3RyKSB7XG4gIHZhciBhcmdzID0gdGhpcy5fYXJncy5tYXAoZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGh1bWFuUmVhZGFibGVBcmdOYW1lKGFyZyk7XG4gIH0pO1xuXG4gIHZhciB1c2FnZSA9ICdbb3B0aW9uc10nXG4gICAgKyAodGhpcy5jb21tYW5kcy5sZW5ndGggPyAnIFtjb21tYW5kXScgOiAnJylcbiAgICArICh0aGlzLl9hcmdzLmxlbmd0aCA/ICcgJyArIGFyZ3Muam9pbignICcpIDogJycpO1xuXG4gIGlmICgwID09IGFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiB0aGlzLl91c2FnZSB8fCB1c2FnZTtcbiAgdGhpcy5fdXNhZ2UgPSBzdHI7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEdldCBvciBzZXQgdGhlIG5hbWUgb2YgdGhlIGNvbW1hbmRcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcmV0dXJuIHtTdHJpbmd8Q29tbWFuZH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUubmFtZSA9IGZ1bmN0aW9uKHN0cikge1xuICBpZiAoMCA9PT0gYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHRoaXMuX25hbWU7XG4gIHRoaXMuX25hbWUgPSBzdHI7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gdGhlIGxhcmdlc3Qgb3B0aW9uIGxlbmd0aC5cbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5sYXJnZXN0T3B0aW9uTGVuZ3RoID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLm9wdGlvbnMucmVkdWNlKGZ1bmN0aW9uKG1heCwgb3B0aW9uKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KG1heCwgb3B0aW9uLmZsYWdzLmxlbmd0aCk7XG4gIH0sIDApO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gaGVscCBmb3Igb3B0aW9ucy5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5vcHRpb25IZWxwID0gZnVuY3Rpb24oKSB7XG4gIHZhciB3aWR0aCA9IHRoaXMubGFyZ2VzdE9wdGlvbkxlbmd0aCgpO1xuXG4gIC8vIEFwcGVuZCB0aGUgaGVscCBpbmZvcm1hdGlvblxuICByZXR1cm4gdGhpcy5vcHRpb25zLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIHJldHVybiBwYWQob3B0aW9uLmZsYWdzLCB3aWR0aCkgKyAnICAnICsgb3B0aW9uLmRlc2NyaXB0aW9uXG4gICAgICAgICsgKChvcHRpb24uYm9vbCAhPSBmYWxzZSAmJiBvcHRpb24uZGVmYXVsdFZhbHVlICE9PSB1bmRlZmluZWQpID8gJyAoZGVmYXVsdDogJyArIG9wdGlvbi5kZWZhdWx0VmFsdWUgKyAnKScgOiAnJyk7XG4gIH0pLmNvbmNhdChbcGFkKCctaCwgLS1oZWxwJywgd2lkdGgpICsgJyAgJyArICdvdXRwdXQgdXNhZ2UgaW5mb3JtYXRpb24nXSlcbiAgICAuam9pbignXFxuJyk7XG59O1xuXG4vKipcbiAqIFJldHVybiBjb21tYW5kIGhlbHAgZG9jdW1lbnRhdGlvbi5cbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5jb21tYW5kSGVscCA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuY29tbWFuZHMubGVuZ3RoKSByZXR1cm4gJyc7XG5cbiAgdmFyIGNvbW1hbmRzID0gdGhpcy5jb21tYW5kcy5maWx0ZXIoZnVuY3Rpb24oY21kKSB7XG4gICAgcmV0dXJuICFjbWQuX25vSGVscDtcbiAgfSkubWFwKGZ1bmN0aW9uKGNtZCkge1xuICAgIHZhciBhcmdzID0gY21kLl9hcmdzLm1hcChmdW5jdGlvbihhcmcpIHtcbiAgICAgIHJldHVybiBodW1hblJlYWRhYmxlQXJnTmFtZShhcmcpO1xuICAgIH0pLmpvaW4oJyAnKTtcblxuICAgIHJldHVybiBbXG4gICAgICBjbWQuX25hbWVcbiAgICAgICAgKyAoY21kLl9hbGlhcyA/ICd8JyArIGNtZC5fYWxpYXMgOiAnJylcbiAgICAgICAgKyAoY21kLm9wdGlvbnMubGVuZ3RoID8gJyBbb3B0aW9uc10nIDogJycpXG4gICAgICAgICsgKGFyZ3MgPyAnICcgKyBhcmdzIDogJycpXG4gICAgICAsIGNtZC5fZGVzY3JpcHRpb25cbiAgICBdO1xuICB9KTtcblxuICB2YXIgd2lkdGggPSBjb21tYW5kcy5yZWR1Y2UoZnVuY3Rpb24obWF4LCBjb21tYW5kKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KG1heCwgY29tbWFuZFswXS5sZW5ndGgpO1xuICB9LCAwKTtcblxuICByZXR1cm4gW1xuICAgICcnXG4gICAgLCAnICBDb21tYW5kczonXG4gICAgLCAnJ1xuICAgICwgY29tbWFuZHMubWFwKGZ1bmN0aW9uKGNtZCkge1xuICAgICAgdmFyIGRlc2MgPSBjbWRbMV0gPyAnICAnICsgY21kWzFdIDogJyc7XG4gICAgICByZXR1cm4gKGRlc2MgPyBwYWQoY21kWzBdLCB3aWR0aCkgOiBjbWRbMF0pICsgZGVzYztcbiAgICB9KS5qb2luKCdcXG4nKS5yZXBsYWNlKC9eL2dtLCAnICAgICcpXG4gICAgLCAnJ1xuICBdLmpvaW4oJ1xcbicpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gcHJvZ3JhbSBoZWxwIGRvY3VtZW50YXRpb24uXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwcml2YXRlXG4gKi9cblxuQ29tbWFuZC5wcm90b3R5cGUuaGVscEluZm9ybWF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkZXNjID0gW107XG4gIGlmICh0aGlzLl9kZXNjcmlwdGlvbikge1xuICAgIGRlc2MgPSBbXG4gICAgICAnICAnICsgdGhpcy5fZGVzY3JpcHRpb25cbiAgICAgICwgJydcbiAgICBdO1xuICB9XG5cbiAgdmFyIGNtZE5hbWUgPSB0aGlzLl9uYW1lO1xuICBpZiAodGhpcy5fYWxpYXMpIHtcbiAgICBjbWROYW1lID0gY21kTmFtZSArICd8JyArIHRoaXMuX2FsaWFzO1xuICB9XG4gIHZhciB1c2FnZSA9IFtcbiAgICAnJ1xuICAgICwnICBVc2FnZTogJyArIGNtZE5hbWUgKyAnICcgKyB0aGlzLnVzYWdlKClcbiAgICAsICcnXG4gIF07XG5cbiAgdmFyIGNtZHMgPSBbXTtcbiAgdmFyIGNvbW1hbmRIZWxwID0gdGhpcy5jb21tYW5kSGVscCgpO1xuICBpZiAoY29tbWFuZEhlbHApIGNtZHMgPSBbY29tbWFuZEhlbHBdO1xuXG4gIHZhciBvcHRpb25zID0gW1xuICAgICcnXG4gICAgLCAnICBPcHRpb25zOidcbiAgICAsICcnXG4gICAgLCAnJyArIHRoaXMub3B0aW9uSGVscCgpLnJlcGxhY2UoL14vZ20sICcgICAgJylcbiAgICAsICcnXG4gIF07XG5cbiAgcmV0dXJuIHVzYWdlXG4gICAgLmNvbmNhdChkZXNjKVxuICAgIC5jb25jYXQob3B0aW9ucylcbiAgICAuY29uY2F0KGNtZHMpXG4gICAgLmpvaW4oJ1xcbicpO1xufTtcblxuLyoqXG4gKiBPdXRwdXQgaGVscCBpbmZvcm1hdGlvbiBmb3IgdGhpcyBjb21tYW5kXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5Db21tYW5kLnByb3RvdHlwZS5vdXRwdXRIZWxwID0gZnVuY3Rpb24oY2IpIHtcbiAgaWYgKCFjYikge1xuICAgIGNiID0gZnVuY3Rpb24ocGFzc3RocnUpIHtcbiAgICAgIHJldHVybiBwYXNzdGhydTtcbiAgICB9XG4gIH1cbiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY2IodGhpcy5oZWxwSW5mb3JtYXRpb24oKSkpO1xuICB0aGlzLmVtaXQoJy0taGVscCcpO1xufTtcblxuLyoqXG4gKiBPdXRwdXQgaGVscCBpbmZvcm1hdGlvbiBhbmQgZXhpdC5cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNvbW1hbmQucHJvdG90eXBlLmhlbHAgPSBmdW5jdGlvbihjYikge1xuICB0aGlzLm91dHB1dEhlbHAoY2IpO1xuICBwcm9jZXNzLmV4aXQoKTtcbn07XG5cbi8qKlxuICogQ2FtZWwtY2FzZSB0aGUgZ2l2ZW4gYGZsYWdgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZsYWdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGNhbWVsY2FzZShmbGFnKSB7XG4gIHJldHVybiBmbGFnLnNwbGl0KCctJykucmVkdWNlKGZ1bmN0aW9uKHN0ciwgd29yZCkge1xuICAgIHJldHVybiBzdHIgKyB3b3JkWzBdLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBQYWQgYHN0cmAgdG8gYHdpZHRoYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge051bWJlcn0gd2lkdGhcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHBhZChzdHIsIHdpZHRoKSB7XG4gIHZhciBsZW4gPSBNYXRoLm1heCgwLCB3aWR0aCAtIHN0ci5sZW5ndGgpO1xuICByZXR1cm4gc3RyICsgQXJyYXkobGVuICsgMSkuam9pbignICcpO1xufVxuXG4vKipcbiAqIE91dHB1dCBoZWxwIGluZm9ybWF0aW9uIGlmIG5lY2Vzc2FyeVxuICpcbiAqIEBwYXJhbSB7Q29tbWFuZH0gY29tbWFuZCB0byBvdXRwdXQgaGVscCBmb3JcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IG9mIG9wdGlvbnMgdG8gc2VhcmNoIGZvciAtaCBvciAtLWhlbHBcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIG91dHB1dEhlbHBJZk5lY2Vzc2FyeShjbWQsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwgW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChvcHRpb25zW2ldID09ICctLWhlbHAnIHx8IG9wdGlvbnNbaV0gPT0gJy1oJykge1xuICAgICAgY21kLm91dHB1dEhlbHAoKTtcbiAgICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUYWtlcyBhbiBhcmd1bWVudCBhbiByZXR1cm5zIGl0cyBodW1hbiByZWFkYWJsZSBlcXVpdmFsZW50IGZvciBoZWxwIHVzYWdlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhcmdcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGh1bWFuUmVhZGFibGVBcmdOYW1lKGFyZykge1xuICB2YXIgbmFtZU91dHB1dCA9IGFyZy5uYW1lICsgKGFyZy52YXJpYWRpYyA9PT0gdHJ1ZSA/ICcuLi4nIDogJycpO1xuXG4gIHJldHVybiBhcmcucmVxdWlyZWRcbiAgICA/ICc8JyArIG5hbWVPdXRwdXQgKyAnPidcbiAgICA6ICdbJyArIG5hbWVPdXRwdXQgKyAnXSdcbn1cblxuLy8gZm9yIHZlcnNpb25zIGJlZm9yZSBub2RlIHYwLjggd2hlbiB0aGVyZSB3ZXJlbid0IGBmcy5leGlzdHNTeW5jYFxuZnVuY3Rpb24gZXhpc3RzKGZpbGUpIHtcbiAgdHJ5IHtcbiAgICBpZiAoZnMuc3RhdFN5bmMoZmlsZSkuaXNGaWxlKCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9jb21tYW5kZXIvaW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDY3NVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAzIDciLCJleHBvcnQgY29uc3QgREVGQVVMVCA9IHsgaXNEZWZhdWx0OiB0cnVlIH1cblxuZXhwb3J0IGNvbnN0IExJU1QgPSAnbGlzdCdcbmV4cG9ydCBjb25zdCBMSVNUX0RFU0MgPSAnbGlzdCBhbGwgeW91ciB0YXNrcydcblxuZXhwb3J0IGNvbnN0IEFERCA9ICdhZGQnXG5leHBvcnQgY29uc3QgQUREX0RFU0MgPSAnYWRkIGEgdGFzayBpbiB5b3VyIGxpc3QnXG5cbmV4cG9ydCBjb25zdCBERUwgPSAnZGVsIFtpZF0nXG5leHBvcnQgY29uc3QgREVMX0RFU0MgPSAnZGVsZXRlIGEgdGFzayBmcm9tIHlvdSB0YXNrbGlzdCdcbmV4cG9ydCBjb25zdCBERUxfT1BUSU9OID0gJy1hLCAtLWFsbCdcbmV4cG9ydCBjb25zdCBERUxfT1BUSU9OX0RFU0MgPSAnZGVsZXRlIGFsbCB0YXNrcyBmcm9tIGRhdGFiYXNlJ1xuXG5leHBvcnQgY29uc3QgTEFORyA9ICdsYW5nJ1xuZXhwb3J0IGNvbnN0IExBTkdfREVTQyA9ICdQaWNrIGEgbGFuZ3VhZ2UgZm9yIHlvdXIgcGFkYSdcblxuZXhwb3J0IGNvbnN0IERPTkUgPSAnZG9uZSBbaWRdJ1xuZXhwb3J0IGNvbnN0IERPTkVfREVTQyA9ICdNYXJrIGEgdGFzayBhcyBjb21wbGV0ZSdcblxuZXhwb3J0IGNvbnN0IENPTkZJRyA9ICdjb25maWcnXG5leHBvcnQgY29uc3QgQ09ORklHX0RFU0MgPSAnc2V0IHVzZXJuYW1lIGFuZCBlbWFpbCdcbmV4cG9ydCBjb25zdCBDT05GSUdfT1BUSU9OX1UgPSAnLXUsIC0tdXNlcm5hbWUnXG5leHBvcnQgY29uc3QgQ09ORklHX09QVElPTl9VX0RFU0MgPSAnc2V0IHVzZXJuYW1lJ1xuZXhwb3J0IGNvbnN0IENPTkZJR19PUFRJT05fRSA9ICctZSwgLS1lbWFpbCdcbmV4cG9ydCBjb25zdCBDT05GSUdfT1BUSU9OX0VfREVTQyA9ICdzZXQgZW1haWwsIHlvdSB3aWxsIGJlIGVtYWlsZWQgaWYgeW91ciB0YXNrIHRpbWVcXCdzIHVwICdcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvdHNsaW50LWxvYWRlcj8/cmVmLS0xIS4vc3JjL2NvbW1hbmRMaXN0LnRzIiwiaW1wb3J0IHByb2dyYW0gPSByZXF1aXJlKCdjb21tYW5kZXInKVxuXG5jb25zdCB7XG4gIERFRkFVTFQsXG4gIEFERCxcbiAgQUREX0RFU0MsXG4gIExJU1QsXG4gIExJU1RfREVTQyxcbiAgREVMLFxuICBERUxfREVTQyxcbiAgREVMX09QVElPTixcbiAgREVMX09QVElPTl9ERVNDLFxuICBMQU5HLFxuICBMQU5HX0RFU0MsXG4gIERPTkUsXG4gIERPTkVfREVTQyxcbiAgQ09ORklHLFxuICBDT05GSUdfREVTQ1xufSA9IHJlcXVpcmUoJy4vLi4vY29tbWFuZExpc3QnKVxuY29uc3QgdmVyc2lvbiA9IHJlcXVpcmUoJy4vLi4vLi4vcGFja2FnZS5qc29uJylbJ3ZlcnNpb24nXVxuY29uc3Qgbm9kZVZlcnNpb246IHN0cmluZyA9IHByb2Nlc3MudmVyc2lvbi5tYXRjaCgvXFxkKy9nKVswXVxuXG5wcm9ncmFtXG4gIC52ZXJzaW9uKHZlcnNpb24sICctdiwgLS12ZXJzaW9uJylcblxucHJvZ3JhbVxuICAuY29tbWFuZChMSVNULCBMSVNUX0RFU0MsIERFRkFVTFQpXG4gIC5hbGlhcygnbHMnKVxuXG5wcm9ncmFtXG4gIC5jb21tYW5kKEFERCwgQUREX0RFU0MpXG4gIC5hbGlhcygnYScpXG5cbnByb2dyYW1cbiAgLmNvbW1hbmQoREVMLCBERUxfREVTQylcbiAgLmFsaWFzKCdkJylcblxucHJvZ3JhbVxuICAuY29tbWFuZChMQU5HLCBMQU5HX0RFU0MpXG5cbnByb2dyYW1cbiAgLmNvbW1hbmQoRE9ORSwgRE9ORV9ERVNDKVxuXG5wcm9ncmFtXG4gIC5jb21tYW5kKENPTkZJRywgQ09ORklHX0RFU0MpXG5cbnByb2dyYW0ucGFyc2UocHJvY2Vzcy5hcmd2KVxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub2RlX21vZHVsZXMvdHNsaW50LWxvYWRlcj8/cmVmLS0xIS4vc3JjL2Jpbi9wYWRhLnRzIiwibW9kdWxlLmV4cG9ydHMgPSB7XCJuYW1lXCI6XCJwYWRhXCIsXCJ2ZXJzaW9uXCI6XCIwLjEuNlwiLFwiZGVzY3JpcHRpb25cIjpcIkNvbW1hbmQgbGluZSBpbnRlcmZhY2UgZm9yIGNydWwgeW91ciB0b2RvIGxpc3QuXCIsXCJzY3JpcHRzXCI6e1wic3RhcnRcIjpcIndlYnBhY2sgLS1jb25maWcgLi93ZWJwYWNrLmNvbmZpZy5qcyAtLXByb2dyZXNzIC0td2F0Y2hcIixcInRlc3RcIjpcImVjaG8gXFxcIkVycm9yOiBubyB0ZXN0IHNwZWNpZmllZFxcXCIgJiYgZXhpdCAxXCIsXCJidWlsZFwiOlwid2VicGFjayAtLWNvbmZpZyAuL3dlYnBhY2suY29uZmlnLmpzXCJ9LFwiYmluXCI6e1wicGFkYVwiOlwiZGlzdC9AcGFkYS9wYWRhLmpzXCJ9LFwia2V5d29yZHNcIjpbXCJwYWRhXCIsXCJwYWRhLXRvZG8tbGlzdFwiLFwibm9kZS10b2RvLWxpc3RcIl0sXCJhdXRob3JcIjpcIkhhb3dlbiA8aGFvd2VuNzM3QGdtYWlsLmNvbT5cIixcImxpY2Vuc2VcIjpcIk1JVFwiLFwiZGVwZW5kZW5jaWVzXCI6e1wiQHR5cGVzL2NsaS10YWJsZTJcIjpcIl4wLjIuMVwiLFwiQHR5cGVzL25vZGVcIjpcIl45LjQuMFwiLFwiY2hhbGtcIjpcIl4yLjMuMFwiLFwiY2xpLXRhYmxlMlwiOlwiXjAuMi4wXCIsXCJjb21tYW5kZXJcIjpcIl4yLjEzLjBcIixcImlucXVpcmVyXCI6XCJeNS4xLjBcIixcIm1vbWVudFwiOlwiXjIuMjAuMVwiLFwibm9kZS1lbW9qaVwiOlwiXjEuOC4xXCIsXCJub2RlLXRpbWV0ZXJcIjpcIl4xLjAuNFwiLFwic3FsLmpzXCI6XCJeMC41LjBcIixcInRzLWxvYWRlclwiOlwiXjMuNC4wXCIsXCJ0eXBlc2NyaXB0XCI6XCJeMi42LjJcIixcIndlYnBhY2tcIjpcIl4zLjEwLjBcIn0sXCJkZXZEZXBlbmRlbmNpZXNcIjp7XCJlc2xpbnQtY29uZmlnLXN0YW5kYXJkXCI6XCJeMTEuMC4wLWJldGEuMFwiLFwiZXNsaW50LWxvYWRlclwiOlwiXjEuOS4wXCIsXCJlc2xpbnQtcGx1Z2luLWltcG9ydFwiOlwiXjIuOC4wXCIsXCJlc2xpbnQtcGx1Z2luLW5vZGVcIjpcIl42LjAuMFwiLFwiZXNsaW50LXBsdWdpbi1wcm9taXNlXCI6XCJeMy42LjBcIixcImVzbGludC1wbHVnaW4tc3RhbmRhcmRcIjpcIl4zLjAuMVwiLFwidHNsaW50XCI6XCJeNS45LjFcIixcInRzbGludC1sb2FkZXJcIjpcIl4zLjUuM1wifX1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3BhY2thZ2UuanNvblxuLy8gbW9kdWxlIGlkID0gNjgzXG4vLyBtb2R1bGUgY2h1bmtzID0gNyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImV2ZW50c1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImV2ZW50c1wiXG4vLyBtb2R1bGUgaWQgPSA4MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSAyIDMgNCA3Il0sInNvdXJjZVJvb3QiOiIifQ==