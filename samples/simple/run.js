
var ruscript = require('../..'),
    fs = require('fs');

var text = fs.readFileSync(process.argv[2]).toString();
var context = ruscript.createContext();
context.setLocalValue('puts', function (arg) { console.log(arg); return arg; });
ruscript.execute(text, context);

