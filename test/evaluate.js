
var parsers = require('../lib/parsers');

exports['Evaluate integer'] = function (test) {
    var parser = parsers.createParser("123");
    var expr = parser.parse("Integer");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 123);
    
    test.equal(parser.parse("Integer"), null);
};

exports['Evaluate integer as term'] = function (test) {
    var parser = parsers.createParser("123");
    var expr = parser.parse("Term");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 123);
    
    test.equal(parser.parse("Term"), null);
};

exports['Evaluate add integers'] = function (test) {
    var parser = parsers.createParser("1+2");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 3);
    
    test.equal(parser.parse("Expression"), null);
};

exports['Evaluate subtract integers'] = function (test) {
    var parser = parsers.createParser("1-2");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, -1);
    
    test.equal(parser.parse("Expression"), null);
};

exports['Evaluate multiply integers'] = function (test) {
    var parser = parsers.createParser("2*3");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 6);
    
    test.equal(parser.parse("Expression"), null);
};

exports['Evaluate divide integers'] = function (test) {
    var parser = parsers.createParser("2/3");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 2/3);
    
    test.equal(parser.parse("Expression"), null);
};

