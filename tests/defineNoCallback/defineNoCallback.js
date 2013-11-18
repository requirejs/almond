
var obj = {};

define('c', false);

//Test undefined exports.
define('a', function () {
    obj.a = 'a';
});

define('b', ['c'], function(c) {
    obj.b = 'b';
    obj.c = c;
});

define('obj', ['a', 'b']);

require(['obj'], function () {
    doh.register(
        'defineNoCallback',
        [
            function defineNoCallback(t){
                t.is('a', obj.a);
                t.is('b', obj.b);
                t.is(false, obj.c);
            }
        ]
    );
    doh.run();
});
