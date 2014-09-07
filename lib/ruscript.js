
var parsers = require('./parsers');
var contexts = require('./contexts');
var fs = require('fs');
    
function execute(text, context) {
    var parser = parsers.createParser(text);
    var expr = parser.parse('Program');
    return expr.value.evaluate(context);
}

function executeFile(filename, context) {
    var text = fs.readFileSync(filename).toString();
    return execute(text, context);
}
    
module.exports = {
    execute: execute,
    executeFile: executeFile,
    createContext: contexts.createContext
}