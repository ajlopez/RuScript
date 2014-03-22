
var rs = require('..');

exports['execute integer'] = function (test) {
    test.equal(rs.execute("42"), 42);
}

exports['execute puts'] = function (test) {
    var context = rs.createContext();
    var argument = null;
    context.setLocalValue('puts', function (arg) { argument = arg; return arg; });
    test.equal(rs.execute("puts 42\n", context), 42);
    test.equal(argument, 42);
}

exports['execute foo with puts'] = function (test) {
    var context = rs.createContext();
    var argument = null;
    context.setLocalValue('puts', function (arg) { argument = arg; return arg; });
    test.equal(rs.execute("def foo\nputs 42\nend\nfoo()\n", context), 42);
    test.equal(argument, 42);
}
