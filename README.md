#almond

An AMD a replacement loader for RequireJS that is only good for apps
that use AMD modules and:

* have already optimized all the modules into one file.
* therefore, all modules have IDs and dependency arrays in their define() calls.
* do not use loader plugins.
* do not use requirejs.ready().
* avoid circular dependencies.
* do not use RequireJS multiversion support/contexts.
* does not use require.toUrl() or require.nameToUrl().
* does not use packages/packagePaths config.
* no auto-detection of jQuery as a module, only uses the global jQuery object.

What is supported:

* dependencies with relative IDs
* define('id', {}) definitions.
* define(), require() and requirejs() calls.

Still under development.

