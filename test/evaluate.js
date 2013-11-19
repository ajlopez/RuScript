
var parsers = require('../lib/parsers');

exports['Evaluate integer'] = function (test) {
    var parser = parsers.createParser("123");
    var expr = parser.parse("Integer");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 123);
    
    test.equal(parser.parse("Integer"), null);
};

exports['Evaluate add integers'] = function (test) {
    var parser = parsers.createParser("1+2");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 3);
    
    test.equal(parser.parse("Expression"), null);
};