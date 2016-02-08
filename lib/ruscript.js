
var parsers = require('./parsers');
var contexts = require('./contexts');
var runtime = require('./runtime');
var x = require('./expressions');
var fs = require('fs');
var path = require('path');

function addName(names, name) {
    if (!name)
        return;
        
    if (names.indexOf(name) >= 0)
        return;
        
    names.push(name);
};

function addNames(names, expr) {
    if (expr.getName)
        addName(names, expr.getName());
        
    if (expr.getFunctionName) {
        var name = expr.getFunctionName();
        if (runtime[name])
            addName(names, name);
    }
    
    if (expr.getFunctionNames) {
        var fnnames = expr.getFunctionNames();
        
        fnnames.forEach(function (fnname) {
            if (runtime[fnname])
                addName(names, fnname);
        });
    }   
}

function compile(text, options) {
    options = options || { };
    
    if (!options.requirePath)
        options.requirePath = 'crysjs';
    
    var parser = parsers.createParser(text);
    
    var stmt;
    var result = '';
    var names = [];
    
    while (stmt = parser.parse('Statement')) {
        if (!stmt.value)
            continue;
            
        if (result.length)
            result += ' ';
            
        result += x.asStatement(stmt.value.compile());
        
        var ch = result[result.length - 1];
        
        if (ch !== ';' && ch !== '}')
            result += ';';
            
        addNames(names, stmt.value);
    }
    
    var rnames = '';
    var required = false;
    
    names.forEach(function (name) {
        if (runtime[name]) {
            if (!required) {
                rnames = 'var $crysjs = require("' + options.requirePath + '"); ' + rnames;
                required = true;
            }
            
            rnames += 'var ' + name + ' = $crysjs.runtime.' + name + '; ';
            
            return;
        }
        
        rnames += 'var ' + name + '; ';
    });
        
    return rnames + result;
};
    
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

var requiredir;

function requirefn(filename, context, required) {
    var p = filename.indexOf('.');
    
    if (p < 0)
        try {
            return require(filename);
        }
        catch (ex) {
        }
    
    if (filename[0] == '.')
        filename = path.join(requiredir, filename);
        
    filename = path.resolve(filename);
    
    if (required[filename])
        return required[filename];
    
    var oldrequiredir = requiredir;
    requiredir = path.dirname(filename);
    var result = executeFile(filename, context);
    requiredir = oldrequiredir;
    
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
    context: createContext,
    compile: compile,
    runtime: runtime
}

