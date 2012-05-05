#!/bin/bash
cat almond.js > tests/simple-built.js
cat tests/simple.js >> tests/simple-built.js

cat almond.js > tests/moduleConfig/moduleConfig-built.js
cat tests/moduleConfig/moduleConfig.js >> tests/moduleConfig/moduleConfig-built.js

cat almond.js > tests/plugins/plugins-built.js
cat tests/plugins/plugins.js >> tests/plugins/plugins-built.js

cat almond.js > tests/plugins/coffee-built.js
cat tests/plugins/coffee.js >> tests/plugins/coffee-built.js

cat almond.js > tests/plugins/text-built.js
cat tests/plugins/text.js >> tests/plugins/text-built.js

node ../r.js/r.js -o baseUrl=tests/plugins/order include=../../../almond,order\!one,order\!two out=tests/plugins/order/order-built.js optimize=none
