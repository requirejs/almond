#!/bin/bash
cat almond.js > tests/simple-built.js
cat tests/simple.js >> tests/simple-built.js

cat almond.js > tests/plugins/plugins-built.js
cat tests/plugins/plugins.js >> tests/plugins/plugins-built.js
