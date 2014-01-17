
var parsers = require('../lib/parsers'),
    contexts = require('../lib/contexts');

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

exports['Evaluate integer as term'] = function (test) {
    var parser = parsers.createParser("123");
    var expr = parser.parse("Term");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 123);
    
    test.equal(parser.parse("Term"), null);
};

exports['Evaluate false'] = function (test) {
    var parser = parsers.createParser("false");
    var expr = parser.parse("Expression");
    test.ok(expr);
    test.strictEqual(expr.value.evaluate(null), false);
};

exports['Evaluate true'] = function (test) {
    var parser = parsers.createParser("true");
    var expr = parser.parse("Expression");
    test.ok(expr);
    test.strictEqual(expr.value.evaluate(null), true);
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

exports['Evaluate add and multiply'] = function (test) {
    var parser = parsers.createParser("2+3*4");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 14);
    
    test.equal(parser.parse("Expression"), null);
};

exports['Evaluate add and divide'] = function (test) {
    var parser = parsers.createParser("2+3/4");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 2 + 3 / 4);
    
    test.equal(parser.parse("Expression"), null);
};

exports['Evaluate multiply and add'] = function (test) {
    var parser = parsers.createParser("2*3+4");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 10);
    
    test.equal(parser.parse("Expression"), null);
};

exports['Evaluate divide and subtract'] = function (test) {
    var parser = parsers.createParser("2/3-4");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 2/3-4);
    
    test.equal(parser.parse("Expression"), null);
};

exports['Evaluate local variable'] = function (test) {
    var parser = parsers.createParser("one");
    var context = contexts.createContext();
    context.setLocalValue('one', 1);
    
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.ok(result);
    test.equal(result, 1);
    
    test.equal(parser.parse("Expression"), null);
};

exports['Evaluate simple true equality'] = function (test) {
    var parser = parsers.createParser("1 == 1");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.strictEqual(result, true);
};

exports['Evaluate simple false equality'] = function (test) {
    var parser = parsers.createParser("1 == 2");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.strictEqual(result, false);
};

exports['Evaluate simple false not equality'] = function (test) {
    var parser = parsers.createParser("1 != 1");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.strictEqual(result, false);
};

exports['Evaluate simple true not equality'] = function (test) {
    var parser = parsers.createParser("1 != 2");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.strictEqual(result, true);
};

exports['Evaluate simple less comparison'] = function (test) {
    var parser = parsers.createParser("1 < 2");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.strictEqual(result, true);
};

exports['Evaluate simple less comparison to false'] = function (test) {
    var parser = parsers.createParser("1 < 1");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.strictEqual(result, false);
};

exports['Evaluate simple less or equal comparison'] = function (test) {
    var parser = parsers.createParser("1 <= 1");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.strictEqual(result, true);
};

exports['Evaluate simple less or equal comparison to false'] = function (test) {
    var parser = parsers.createParser("1 <= 0");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.strictEqual(result, false);
};

exports['Evaluate simple greater comparison'] = function (test) {
    var parser = parsers.createParser("3 > 2");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.strictEqual(result, true);
};

exports['Evaluate simple greater comparison to false'] = function (test) {
    var parser = parsers.createParser("1 > 2");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.strictEqual(result, false);
};

exports['Evaluate simple greater or equal comparison'] = function (test) {
    var parser = parsers.createParser("2 >= 2");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.strictEqual(result, true);
};

exports['Evaluate simple greater or equal comparison to false'] = function (test) {
    var parser = parsers.createParser("1 >= 2");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.strictEqual(result, false);
};

exports['Evaluate simple assignment'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("one = 1");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, 1);
    test.strictEqual(context.getLocalValue("one"), 1);
};

exports['Evaluate simple if'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("if 1\n1\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, 1);
};

exports['Evaluate simple if with false condition'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("if false\n1\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, null);
};

exports['Evaluate simple if with else and true condition'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("if true\n1\nelse\n2\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, 1);
};

exports['Evaluate simple if with else and false condition'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("if false\n1\nelse\n2\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, 2);
};

exports['Evaluate unless with false condition'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("unless false\n1\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, 1);
};

exports['Evaluate unless with true condition'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("unless true\n1\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, null);
};

exports['Evaluate unless with else and false condition'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("unless false\n1\nelse\n2\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, 1);
};

exports['Evaluate unless with else and true condition'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("unless true\n1\nelse\n2\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, 2);
};

exports['Evaluate if with two expressions'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("if 1\n1\n2\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, 2);
};

exports['Evaluate simple while'] = function (test) {
    var context = contexts.createContext();
    context.setLocalValue("a", 1);
    var parser = parsers.createParser("while a < 10\na = 10\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, null);
    
    test.equal(context.getLocalValue("a"), 10);
};

exports['Evaluate while with two expressions'] = function (test) {
    var context = contexts.createContext();
    context.setLocalValue("a", 1);
    var parser = parsers.createParser("while a < 10\na = 10\nb = 42\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, null);
    
    test.equal(context.getLocalValue("a"), 10);    
    test.equal(context.getLocalValue("b"), 42);
};

exports['Evaluate simple until'] = function (test) {
    var context = contexts.createContext();
    context.setLocalValue("a", 1);
    var parser = parsers.createParser("until a >= 10\na = 10\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, null);
    
    test.equal(context.getLocalValue("a"), 10);
};

