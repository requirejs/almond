define('awesome', function(){
    return " foo!";
});

extend('foo', ["awesome"], function(awesome){
  return function(foo){
    foo.name += awesome;
    return foo;
  };
});

define('foo', {
    name: 'foo'
});

define('bar', [], function() {
    return {
        name: 'bar'
    }
});

define('baz', ['require', 'exports', 'module', './bar'], function (require, exports, module) {
    var bar = require('./bar');

    exports.name = 'baz';
    exports.barName = bar.name;

    exports.callIt = function (callback) {
        require(['./bar'], function (bar) {
            callback(bar);
        });
    }
});
