
var parsers = require('./parsers');
var contexts = require('./contexts');
var fs = require('fs');
var path = require('path');
    
function execute(text, context) {
    var parser = parsers.createParser(text);
    var expr = parser.parse('Program');
    return expr.value.evaluate(context);
}

function executeFile(filename, context) {
    var text = fs.readFileSync(filename).toString();
    return execute(text, context);
}

function puts() {
    console.log.apply(console, arguments);
}

function requirefn(filename, context, required) {
    var p = filename.indexOf('.');
    
    if (p < 0)
        try {
            return require(filename);
        }
        catch (ex) {
        }
        
    filename = path.resolve(filename);
    
    if (required[filename])
        return required[filename];
                
    var result = executeFile(filename, context);
    
    required[filename] = result;
    
    return result;
}

function createContext() {
    var ctx = contexts.createContext();
    ctx.setLocalValue('puts', puts);
    var required = { };
    ctx.setLocalValue('require', function (filename) { return requirefn(filename, ctx, required); });
    return ctx;
}
    
module.exports = {
    execute: execute,
    executeFile: executeFile,
    context: createContext
}

