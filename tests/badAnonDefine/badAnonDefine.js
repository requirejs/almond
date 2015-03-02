var throwCount = 0;


try {
  define(['a'], function(a) {
      return a;
  });
} catch (e) {
  throwCount += 1;
}

try {
  define(function(require) {
    return require('b');
  });
} catch (e) {
  throwCount += 1;
}


doh.register(
    'badAnonDefine',
    [
        function badAnonDefine(t){
            t.is(2, throwCount);
        }
    ]
);
doh.run();
