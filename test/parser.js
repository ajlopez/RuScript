
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
    test.equal(result.value.getName(), "name");
    test.equal(result.type, "Name");
    
    test.equal(parser.parse("Name"), null);
}

exports['Get name with spaces'] = function (test) {
    var parser = parsers.createParser("  name   ");
    
    var result = parser.parse("Name");
    
    test.ok(result);
    test.equal(result.value.getName(), "name");
    test.equal(result.type, "Name");
    
    test.equal(parser.parse("Name"), null);
}

exports['Get statement with end of line'] = function (test) {
    var parser = parsers.createParser("1+2\n");
    
    var result = parser.parse("Statement");
    test.ok(result);
    test.equal(parser.parse("Statement"), null);
}

exports['Get two statements with end of line'] = function (test) {
    var parser = parsers.createParser("1+2\n3+2\n");
    
    var result = parser.parse("Statement");
    test.ok(result);
    
    result = parser.parse("Statement");
    test.ok(result);
    
    test.equal(parser.parse("Statement"), null);
}

exports['Get two statements with semicolon'] = function (test) {
    var parser = parsers.createParser("1+2;3+2;");
    
    var result = parser.parse("Statement");
    test.ok(result);
    
    result = parser.parse("Statement");
    test.ok(result);
    
    test.equal(parser.parse("Statement"), null);
}

exports['Get while expression'] = function (test) {
    var parser = parsers.createParser("while 1\na=1\nend");
    
    var result = parser.parse("Expression");
    test.ok(result);
    
    test.equal(parser.parse("Expression"), null);
}
