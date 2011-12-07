define.unordered = true;

define("bread", function(require, exports, module) {
    exports.name = 'bread';
    exports.ingredient = require('yeast').name;
});

define("yeast", function(require,exports,module){
    module.exports = {
        name: 'yeast'
    };
});

//Using sync require, but callback-require([], function(){}) is suggested.
//This form only used in some particular CommonJS module bundling.
var bread = require('bread');
