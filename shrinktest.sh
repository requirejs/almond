#!/bin/sh
rm almond.min.js.gz
uglifyjs -c -m -o almond.min.js almond.js
gzip almond.min.js
ls -la almond.min.js.gz

