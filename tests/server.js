var connect = require('connect'),
    serveStatic = require('serve-static');
var server = connect();
server.use(serveStatic(__dirname + '/..'));
server.listen(1986);
require('fs').writeFileSync(__dirname + '/pid.txt', process.pid);
