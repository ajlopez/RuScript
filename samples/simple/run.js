
var ruscript = require('../..');

var context = ruscript.context();

for (var k = 2; k < process.argv.length; k++)
    ruscript.executeFile(process.argv[k], context);

