//Taken from requirejs/tests/shim/built/basic-tests.js

(function (root) {
    root.A = {
        name: 'a'
    };
}(this));

define("a", (function (global) {
    return function () {
        var func = function (){return this.A.name};
        return func.apply(global, arguments);
    }
}(this)));

function D() {
    this.name = 'd';
};

define("d", function(){});

var B = {
    name: 'b',
    aValue: A.name,
    dValue: new D()
};

define("b", function(){});

var C = {
    name: 'c',
    a: A,
    b: B
};

define("c", ["a","b"], (function (global) {
    return function () {
        return global["C"];
    }
}(this)));

