
var parsers = require('./parsers'),
    contexts = require('./contexts');
    
function execute(text, context) {
    var parser = parsers.createParser(text);
    var expr = parser.parse('Program');
    return expr.value.evaluate(context);
}
    
module.exports = {
    execute: execute,
    createContext: contexts.createContext
}