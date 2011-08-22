#almond

A replacement [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) loader for
[RequireJS](http://requirejs.org). It is a smaller "shim" loader, providing the
minimal AMD API footprint that includes [loader plugin](http://requirejs.org/docs/plugins.html) support.

## Why

Some developers like to use the AMD API to code modular JavaScript, but after doing an optimized build,
they do not want to include a full AMD loader like RequireJS, since they do not need all that functionality.
Some use cases, like mobile, are very sensitive to file sizes.

By including almond in the built file, there is no need for RequireJS.
almond is **948 bytes** when minified with Closure Compiler and gzipped.

Since it can support certain types of loader plugin-optimized resources, it is a great
fit for a library that wants to use [text templates](http://requirejs.org/docs/api.html#text)
or [CoffeeScript](https://github.com/jrburke/require-cs) as part of
their project, but get a tiny download in one file after using the
[RequireJS Optimizer](http://requirejs.org/docs/optimization.html).

If you are building a library, the wrap=true support in the RequireJS optimizer
(available after the 0.26.0 release, [dev snapshot here](https://raw.github.com/jrburke/r.js/master/dist/r-20110821.js))
will wrap the optimized file in a closure, so the define/require AMD API does not
escape the file. Users of your optimized file will only see the global API you decide
to export, not the AMD API. See the usage section below for more details.

So, you get great code cleanliness with AMD and the use of powerful loader plugins
in a tiny wrapper that makes it easy for others to use your code even if they do not use AMD.

## Restrictions

It is best used for libraries or apps that use AMD and:

* optimize all the modules into one file -- no dynamic code loading.
* all modules have IDs and dependency arrays in their define() calls -- the RequireJS optimizer will take care of this for you.
* do not use requirejs.ready(). If you use explicit dependencies for all modules, and you place
the optimized file in a script tag before the ending body tag, then this should not be a problem.
* the modules avoid circular dependencies. Some kinds may work, but you will likely have to manually control
the module listing order in the optimizer build profile.
* do not use [RequireJS multiversion support/contexts](http://requirejs.org/docs/api.html#multiversion).
* do not use require.toUrl() or require.nameToUrl().
* do not use [packages/packagePaths config](http://requirejs.org/docs/api.html#packages).

What is supported:

* dependencies with relative IDs.
* define('id', {}) definitions.
* define(), require() and requirejs() calls.
* loader plugins that can inline their resources into optimized files, and
can access those inlined resources synchronously after the optimization pass.
The [text](http://requirejs.org/docs/api.html#text) and
[CoffeeScript](https://github.com/jrburke/require-cs) plugins are two such plugins.


## Current Release

[Version 0.0.1](https://github.com/jrburke/almond/tree/master/dist/almond-0.0.1.js)

## Usage

[Download this snapshot of the optimizer](https://raw.github.com/jrburke/r.js/master/dist/r-20110821.js)
to get a version of the optimizer with wrap=true support
(release 0.27.0 or later will have wrap=true support).

Download the current release of almond.js: [0.0.1](https://github.com/jrburke/almond/tree/master/dist/almond-0.0.1.js).

Run the optimizer using [Node](http://nodejs.org) (also [works in Java](https://github.com/jrburke/r.js/blob/master/README.md)):

    node r.js -o baseUrl=. name=path/to/almond.js include=main out=main-built.js wrap=true

This assumes your project's top-level script file is called main.js and the command
above is run from the directory containing main.js.

wrap=true will add this wrapper around the main-built.js contents (which will be minified by UglifyJS:

    (function () {
        //almond will be here
        //main and its nested dependencies will be here
    }());

If you do not want that wrapper, leave off the wrap=true argument.

These optimizer arguments can also be used in a build config object, so it can be used
in [runtime-generated server builds](https://github.com/jrburke/r.js/blob/master/build/tests/http/httpBuild.js).

## How to get help

* Contact the [requirejs list](https://groups.google.com/group/requirejs).
* Open issues in the [issue tracker](https://github.com/jrburke/almond/issues).
