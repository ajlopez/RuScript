
var parsers = require('../lib/parsers.js');

exports['Get integer'] = function (test) {
    var parser = parsers.createParser("123");
    
    var result = parser.parse("Integer");
    
    test.ok(result);
    test.equal(result.value.evaluate(null), 123);
    test.equal(result.type, "Integer");
    
    test.equal(parser.parse("Integer"), null);
}

exports['Get integer with spaces'] = function (test) {
    var parser = parsers.createParser("  123   s");
    
    var result = parser.parse("Integer");
    
    test.ok(result);
    test.equal(result.value.evaluate(null), 123);
    test.equal(result.type, "Integer");
    
    test.equal(parser.parse("Integer"), null);
}

exports['Get name'] = function (test) {
    var parser = parsers.createParser("name");
    
    var result = parser.parse("Name");
    
    test.ok(result);
    test.equal(result.value, "name");
    test.equal(result.type, "Name");
    
    test.equal(parser.parse("Name"), null);
}

exports['Get name with spaces'] = function (test) {
    var parser = parsers.createParser("  name   ");
    
    var result = parser.parse("Name");
    
    test.ok(result);
    test.equal(result.value, "name");
    test.equal(result.type, "Name");
    
    test.equal(parser.parse("Name"), null);
}

