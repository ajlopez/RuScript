
var simplegrammar = require('simplegrammar');

var get = simplegrammar.get;

function IntegerExpression(text) {
    var value = parseInt(text);
    
    this.evaluate = function () {
        return value;
    };
}

function AddExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) + right.evaluate(context);
    };
}

function SubtractExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) - right.evaluate(context);
    };
}

function MultiplyExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) * right.evaluate(context);
    };
}

function DivideExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) / right.evaluate(context);
    };
}

var rules = [
    get([' ','\t','\r','\n']).oneOrMore().skip(),
    get('0-9').oneOrMore().generate('Integer', function (value) { return new IntegerExpression(value) }),
    get('a-z').oneOrMore().generate('Name'),
    get('+').generate('Plus'),
    get('-').generate('Minus'),
    get('*').generate('Multiply'),
    get('/').generate('Divide'),
    get('Expression0', 'Plus', 'Expression0').generate('Expression', function (values) { return new AddExpression(values[0].value, values[2].value); }),
    get('Expression0', 'Minus', 'Expression0').generate('Expression', function (values) { return new SubtractExpression(values[0].value, values[2].value); }),
    get('Expression0').generate('Expression'),
    get('Term', 'Multiply', 'Term').generate('Expression0', function (values) { return new MultiplyExpression(values[0].value, values[2].value); }),
    get('Term', 'Divide', 'Term').generate('Expression0', function (values) { return new DivideExpression(values[0].value, values[2].value); }),
    get('Term').generate('Expression0'),
    get('Integer').generate('Term')
];

function createParser(text) {
    return simplegrammar.createParser(text, rules);
}

module.exports = {
    createParser: createParser
};

