
var parsers = require('../lib/parsers'),
    contexts = require('../lib/contexts');

function evaluate(text, term, context, test) {
    var parser = parsers.createParser(text);
    var expr = parser.parse(term);
    var result = expr.value.evaluate(context);
    test.equal(parser.parse(term), null);
    return result;
}
    
exports['Evaluate integer'] = function (test) {
    var result = evaluate("123", "Integer", null, test);
    
    test.ok(result);
    test.equal(result, 123);
};

exports['Evaluate integer method'] = function (test) {
    var result = evaluate("123.to_s", "Expression", null, test);
    
    test.ok(result);
    test.strictEqual(result, "123");
};

exports['Evaluate true'] = function (test) {
    var result = evaluate("true", "Expression", null, test);
    
    test.ok(result);
    test.strictEqual(result, true);
};

exports['Evaluate false'] = function (test) {
    var result = evaluate("false", "Expression", null, test);
    
    test.ok(result);
    test.strictEqual(result, false);
};

exports['Evaluate logical or'] = function (test) {
    var result = evaluate("false || true", "Expression", null, test);
    
    test.ok(result);
    test.strictEqual(result, true);

    result = evaluate("false || false", "Expression", null, test);
    
    test.strictEqual(result, false);
};

exports['Evaluate logical and'] = function (test) {
    var result = evaluate("true && true", "Expression", null, test);
    
    test.ok(result);
    test.strictEqual(result, true);

    result = evaluate("true && false", "Expression", null, test);
    
    test.strictEqual(result, false);
};

exports['Evaluate string'] = function (test) {
    var result = evaluate('"foo"', "String", null, test);
    
    test.ok(result);
    test.equal(result, "foo");
};

exports['Evaluate string method'] = function (test) {
    var result = evaluate('"123".to_i', "Expression", null, test);
    
    test.ok(result);
    test.strictEqual(result, 123);
};

exports['Evaluate string concatenation'] = function (test) {
    var result = evaluate('"Hello, " + "World"', "Expression", null, test);
    
    test.ok(result);
    test.equal(result, "Hello, World");
};

exports['Evaluate integer as term'] = function (test) {
    var result = evaluate("123", "Term", null, test);
    
    test.ok(result);
    test.equal(result, 123);
};

exports['Evaluate array'] = function (test) {
    var result = evaluate("[1,2,3]", "Expression", null, test);
    
    test.ok(result);
    test.ok(Array.isArray(result));
    test.deepEqual(result, [1,2,3]);
};

exports['Evaluate array expression'] = function (test) {
    var context = contexts.createContext();
    context.setLocalValue("a", [1,2,3]);
    
    var result = evaluate("a[1]", "Expression", context, test);
    
    test.ok(result);
    test.equal(result, 2);
};

exports['Evaluate false'] = function (test) {
    var result = evaluate("false", "Expression", null, test);
    test.strictEqual(result, false);
};

exports['Evaluate true'] = function (test) {
    var result = evaluate("true", "Expression", null, test);
    test.strictEqual(result, true);
};

exports['Evaluate subtract integers'] = function (test) {
    var result = evaluate("1-2", "Expression", null, test);
    
    test.ok(result);
    test.equal(result, -1);
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

exports['Evaluate modulus'] = function (test) {
    var parser = parsers.createParser("3 % 2");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, 1);
    
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

exports['Evaluate add with parenthesis and multiply'] = function (test) {
    var parser = parsers.createParser("(2+3)*4");
    var expr = parser.parse("Expression");
    test.ok(expr);
    var result = expr.value.evaluate(null);
    
    test.ok(result);
    test.equal(result, (2 + 3) * 4);
    
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
    test.ok(expr);
    test.ok(expr.value);
    test.ok(expr.value.evaluate);
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

exports['Evaluate unless with false condition'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("unless false\n1\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, 1);
};

exports['Evaluate unless at end with true condition'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("1 unless true");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.strictEqual(result, null);
};

exports['Evaluate unless at end with else and false condition'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("1 unless false");
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

exports['Evaluate simple while with do'] = function (test) {
    var context = contexts.createContext();
    context.setLocalValue("a", 1);
    var parser = parsers.createParser("while a < 10 do\na = 10\nend");
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

exports['Evaluate empty class'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("class Dog\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.ok(result);
    test.equal(result.getName(), "Dog");
    
    var cls = context.getLocalValue("Dog");
    
    test.ok(cls);
    test.equal(cls.getName(), "Dog");
};

exports['Evaluate empty module'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("module Dog\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.ok(result);
    test.equal(result.getName(), "Dog");
    
    var mod = context.getLocalValue("Dog");
    
    test.ok(mod);
    test.equal(mod.getName(), "Dog");
};

exports['Evaluate empty def'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("def foo\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.ok(result);
    test.equal(typeof result, "function");
    
    var fun = context.getLocalValue("foo");
    
    test.ok(fun);
    test.strictEqual(result, fun);
};

exports['Evaluate and call def with integer return value'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("def answer\n42\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.ok(result);
    test.equal(typeof result, "function");
    
    var fun = context.getLocalValue("answer");
    
    test.ok(fun);
    test.strictEqual(result, fun);
    
    test.equal(fun(), 42);
};

exports['Evaluate call with argument'] = function (test) {
    var context = contexts.createContext();
    var argument = null;
    
    context.setLocalValue('puts', function (arg) { argument = arg; return arg; });
    
    var parser = parsers.createParser("puts 42");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.equal(result, 42);
    test.equal(argument, 42);
}

exports['Evaluate call with argument and parentheses'] = function (test) {
    var context = contexts.createContext();
    var argument = null;
    
    context.setLocalValue('puts', function (arg) { argument = arg; return arg; });
    
    var parser = parsers.createParser("puts(42)");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.equal(result, 42);
    test.equal(argument, 42);
}

exports['Evaluate call with two arguments'] = function (test) {
    var context = contexts.createContext();
    
    context.setLocalValue('add', function (x, y) { return x + y; });
    
    var parser = parsers.createParser("add 3, 5");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    
    test.equal(result, 8);
}

exports['Evaluate begin end'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("begin\n1\n42\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    test.equal(result, 42);
}

exports['Evaluate begin end with assignment'] = function (test) {
    var context = contexts.createContext();
    var parser = parsers.createParser("begin\n1\nfoo = 41\nfoo = 42\nfoo\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    test.equal(result, 42);
}

exports['Evaluate begin end with assignment and instance variable'] = function (test) {
    var context = contexts.createContext();
    context.$self = { };
    var parser = parsers.createParser("begin\n1\n@foo = 42\nend");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    test.ok(context.$self.$vars);
    test.equal(context.$self.$vars.foo, 42);
    test.equal(result, 42);
}

exports['Evaluate JavaScript namespace and name'] = function (test) {
    global.myglobal = 42;
    var context = contexts.createContext();
    var parser = parsers.createParser("js.myglobal");
    //parser.options({ log: true });
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    test.equal(result, 42);
}

exports['Evaluate JavaScript global name'] = function (test) {
    global.myglobal = 42;
    var context = contexts.createContext();
    var parser = parsers.createParser("js.myglobal");
    //parser.options({ log: true });
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    test.equal(result, 42);
}

exports['Evaluate JavaScript global object property'] = function (test) {
    global.myglobal = { name: 'Adam' };
    var context = contexts.createContext();
    var parser = parsers.createParser("js.myglobal.name");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    test.equal(result, 'Adam');
}

exports['Evaluate JavaScript global object call'] = function (test) {
    global.myglobal = 42;
    var context = contexts.createContext();
    var parser = parsers.createParser("js.myglobal.toString()");
    var expr = parser.parse("Expression");
    var result = expr.value.evaluate(context);
    test.strictEqual(result, '42');
}
