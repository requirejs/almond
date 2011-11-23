#!/bin/sh
rm almond-noplugin.min.js.gz
node ../r.js/r.js -o noplugin.build.js
~/scripts/closure.sh almond-noplugin.js almond-noplugin.min.js
gzip almond-noplugin.min.js
ls -la almond-noplugin.min.js.gz

