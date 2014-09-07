
var ruscript = require('../..');

var context = ruscript.context();
context.setLocalValue('puts', function (arg) { console.log(arg); return arg; });

for (var k = 2; k < process.argv.length; k++)
    ruscript.executeFile(process.argv[k], context);

