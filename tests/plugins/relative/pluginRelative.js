
define('plugin', {
    load: function (id, require, load, config) {
        throw new Error("Dynamic load not allowed: " + id);
    }
});

define('plugin!src/b', [], function () {
	return {
		name: 'b'
	};
});


define('plugin!src/a', ['plugin!./b'], function (b) {
	return {
		name: 'a',
		b: b
	};
});

require(['plugin!src/a'], function (a) {

    doh.register(
        'pluginRelative',
        [
            function pluginRelative(t){
                t.is('a', a.name);
                t.is('b', a.b.name);
            }
        ]
    );
    doh.run();

});

define("pluginRelative-tests", function(){});
