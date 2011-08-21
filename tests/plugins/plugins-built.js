/**
 * almond 0.0.0 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
/*jslint strict: false, plusplus: false */
/*global setTimeout: false */

var requirejs, require, define;
(function () {

    var defined = {},
        aps = Array.prototype.slice,
        ostring = Object.prototype.toString,
        req;

    function isFunction(it) {
        return ostring.call(it) === "[object Function]";
    }

    function isArray(it) {
        return ostring.call(it) === "[object Array]";
    }

    if (typeof define === "function" && define.amd) {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    /**
     * Trims the . and .. from an array of path segments.
     * It will keep a leading path segment if a .. will become
     * the first path segment, to help with module name lookups,
     * which act like paths, but can be remapped. But the end result,
     * all paths that use this function should look normalized.
     * NOTE: this method MODIFIES the input array.
     * @param {Array} ary the array of path segments.
     */
    function trimDots(ary) {
        var i, part;
        for (i = 0; (part = ary[i]); i++) {
            if (part === ".") {
                ary.splice(i, 1);
                i -= 1;
            } else if (part === "..") {
                if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                    //End of the line. Keep at least one non-dot
                    //path segment at the front so it can be mapped
                    //correctly to disk. Otherwise, there is likely
                    //no path mapping for a path starting with '..'.
                    //This can still fail, but catches the most reasonable
                    //uses of ..
                    break;
                } else if (i > 0) {
                    ary.splice(i - 1, 2);
                    i -= 2;
                }
            }
        }
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseName = baseName.split("/");
                baseName = baseName.slice(0, baseName.length - 1);

                name = baseName.concat(name.split("/"));
                trimDots(name);

                name = name.join("/");
            }
        }
        return name;
    }

    /**
     * Helper function that creates a setExports function for a "module"
     * CommonJS dependency. Do this here to avoid creating a closure that
     * is part of a loop.
     */
    function makeSetExports(moduleObj) {
        return function (exports) {
            moduleObj.exports = exports;
        };
    }

    function makeRequire(relName) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);
            args.push(relName);
            return req.apply(null, args);
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    function makeMap(name, relName) {
        var prefix, plugin,
            index = name.indexOf('!');

        if (index !== -1) {
            prefix = normalize(name.substring(0, index), relName);
            name = name.substring(index + 1);
            plugin = defined[prefix];

            //Normalize according
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
        }

        return {
            name: name,
            prefix: prefix,
            plugin: plugin
        };
    }

    function main(name, deps, callback, relName) {
        var args = [],
            usingExports = false,
            cjsModule, depName, i, ret, map;

        //Use name if no relName
        if (!relName) {
            relName = name;
        }

        //Call the callback to define the module, if necessary.
        if (isFunction(callback)) {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            if (deps) {
                for (i = 0; i < deps.length; i++) {
                    map = makeMap(deps[i], relName);
                    depName = map.name;

                    //Fast path CommonJS standard dependencies.
                    if (depName === "require") {
                        args[i] = makeRequire(name);
                    } else if (depName === "exports") {
                        //CommonJS module spec 1.1
                        args[i] = defined[name] = {};
                        usingExports = true;
                    } else if (depName === "module") {
                        //CommonJS module spec 1.1
                        cjsModule = args[i] = {
                            id: name,
                            uri: '',
                            exports: defined[name]
                        };
                        cjsModule.setExports = makeSetExports(cjsModule);
                    } else if (depName in defined) {
                        args[i] = defined[depName];
                    } else if (map.plugin) {
                        map.plugin.load(depName, makeRequire(relName), makeLoad(depName), {});
                        args[i] = defined[depName];
                    } else {
                        args[i] = undefined;
                    }
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undefined) {
                    ret = defined[name] = cjsModule.exports;
                } else if (ret === undefined && usingExports) {
                    //exports already set the defined value.
                    ret = defined[name];
                } else {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    }

    requirejs = req = function (deps, callback, relName) {
        var moduleName, fullName, config;

        //Determine if have config object in the call.
        //Drop the config stuff on the ground.
        if (!isArray(deps) && typeof deps !== "string") {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = arguments[2];
            } else {
                deps = [];
            }
        }

        if (typeof deps === "string") {

            //Just return the module wanted. In this scenario, the
            //second arg (if passed) is just the relModuleMap.
            moduleName = deps;
            relName = callback;

            //Normalize module name, if it contains . or ..
            fullName =  makeMap(moduleName, relName).name;

            if (!(fullName in defined)) {
                throw new Error("Module name '" +
                            fullName +
                            "' has not been loaded.");
            }
            return defined[fullName];
        }

        //Simulate async callback;
        setTimeout(function () {
            main(null, deps, callback, relName);
        }, 15);

        return req;
    };

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
    };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (typeof require === "undefined") {
        require = req;
    }

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = [];
        }

        main(name, deps, callback);
    };

    define.amd = {};
}());

(function () {

    function parse(name) {
        var parts = name.split('?'),
            index = parseInt(parts[0], 10),
            choices = parts[1].split(':'),
            choice = choices[index];

        return {
            index: index,
            choices: choices,
            choice: choice
        };
    }

    define('index',{
        pluginBuilder: './indexBuilder',
        normalize: function (name, normalize) {
            var parsed = parse(name),
                choices = parsed.choices;

            //Normalize each path choice.
            for (i = 0; i < choices.length; i++) {
                choices[i] = normalize(choices[i]);
            }

            return parsed.index + '?' + choices.join(':');
        },

        load: function (name, req, load, config) {
            req([parse(name).choice], function (value) {
                load(value);
            });
        }
    });

}());

define('a',{
    name: 'a'
});

define('c',{
    name: "c"
});

define('b',[],function () {
    return {
        name: "b"
    };
});

define('earth',['require','./index!0?./a:./b:./c','./index!2?./a:./b:./c','./index!1?./a:./b:./c'],function (require) {
   return {
        getA: function () {
            return require("./index!0?./a:./b:./c");
        },
        getC: function () {
            return require("./index!2?./a:./b:./c");
        },
        getB: function () {
            return require("./index!1?./a:./b:./c");
        }
   };
});

define('prime/a',{
    name: 'aPrime'
});

define('prime/c',{
    name: "cPrime"
});

define('prime/b',[],function () {
    return {
        name: "bPrime"
    };
});

define('prime/earth',['require','../index!0?./a:./b:./c','../index!2?./a:./b:./c','../index!1?./a:./b:./c'],function (require) {
   return {
        getA: function () {
            return require("../index!0?./a:./b:./c");
        },
        getC: function () {
            return require("../index!2?./a:./b:./c");
        },
        getB: function () {
            return require("../index!1?./a:./b:./c");
        }
   };
});
