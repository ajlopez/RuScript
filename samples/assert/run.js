
var ruscript = require('../..');

var context = ruscript.context();

context.setLocalValue('assert', function (test, msg) {
    if (test)
        return;
        
    if (msg)
        throw msg;
        
    throw "assertion failure";
});

for (var k = 2; k < process.argv.length; k++)
    ruscript.executeFile(process.argv[k], context);

