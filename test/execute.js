
var rs = require('..');
var path = require('path');

exports['execute integer'] = function (test) {
    test.equal(rs.execute("42"), 42);
}

exports['execute puts'] = function (test) {
    var context = rs.context();
    var argument = null;
    context.setLocalValue('puts', function (arg) { argument = arg; return arg; });
    test.equal(rs.execute("puts 42\n", context), 42);
    test.equal(argument, 42);
}

exports['execute foo with parenthesis with puts'] = function (test) {
    var context = rs.context();
    var argument = null;
    context.setLocalValue('puts', function (arg) { argument = arg; return arg; });
    test.equal(rs.execute("def foo\nputs 42\nend\nfoo()\n", context), 42);
    test.equal(argument, 42);
}

exports['execute foo with puts'] = function (test) {
    var context = rs.context();
    var argument = null;
    context.setLocalValue('puts', function (arg) { argument = arg; return arg; });
    test.equal(rs.execute("def foo\nputs 42\nend\nfoo\n", context), 42);
    test.equal(argument, 42);
}

exports['execute incr'] = function (test) {
    var context = rs.context();
    test.equal(rs.execute("def incr(a)\na+1\nend\nincr(1)\n", context), 2);
}

exports['execute add'] = function (test) {
    var context = rs.context();
    test.equal(rs.execute("def add(a,b)\na+b\nend\nadd(1, 2)\n", context), 3);
}

exports['execute add without parenthesis'] = function (test) {
    var context = rs.context();
    test.equal(rs.execute("def add(a,b)\na+b\nend\nadd 1, 2\n", context), 3);
}

exports['execute file with integer'] = function (test) {
    test.equal(rs.executeFile(path.join(__dirname, "fortytwo.rb")), 42);
}

