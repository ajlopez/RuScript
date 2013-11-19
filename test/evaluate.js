
var parsers = require('../lib/parsers');

exports['Evaluate integer'] = function (test) {
    var parser = parsers.createParser("123");
    var expr = parser.parse("Integer");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 123);
    
    test.equal(parser.parse("Integer"), null);
};