
var simplegrammar = require('simplegrammar');

var get = simplegrammar.get;

function IfExpression(condition, expr) {
    this.evaluate = function (context) {
        var value = condition.evaluate(context);
        
        if (value === null || value === false || value === undefined)
            return null;
            
        return expr.evaluate(context);
    };
}

function CompositeExpression(exprs) {
    this.evaluate = function (context) {
        var result = null;
        
        exprs.forEach(function (expr) {
            result = expr.evaluate(context);
        });
        
        return result;
    };
}

function AssignmentExpression(leftvalue, expr) {
    this.evaluate = function (context) {
        var value = expr.evaluate(context);
        leftvalue.setValue(context, value);
        return value;
    };
    
    this.getName = function () { return name; };
}

function NameExpression(name) {
    this.evaluate = function (context) {
        return context.getLocalValue(name);
    };
    
    this.getName = function () { return name; };
    
    this.setValue = function (context, value) {
        context.setLocalValue(name, value);
    }
}

function IntegerExpression(text) {
    var value = parseInt(text);
    
    this.evaluate = function () {
        return value;
    };
}

function EqualExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) == right.evaluate(context);
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
    get([' ','\t','\r']).oneOrMore().skip(),
    get('0-9').oneOrMore().generate('Integer', function (value) { return new IntegerExpression(value) }),
    get('a-z').oneOrMore().generate('Name', function (value) { return new NameExpression(value) }),
    get('+').generate('Plus'),
    get('-').generate('Minus'),
    get('*').generate('Multiply'),
    get('/').generate('Divide'),
    get('==').generate('Equals'),
    get('=').generate('Assign'),
    get('if', 'Expression', 'EndOfStatement', 'Suite').generate('Expression', function (values) { return new IfExpression(values[1], new CompositeExpression(values[3])); }),
    get('end').generate('Suite', function (values) { return []; }),
    get('Statement', 'Suite').generate('Suite', function (values) { var vals = values[1]; vals.unshift(values[0]); return vals; }),
    get('Expression', 'Suite').generate('Suite', function (values) { var vals = values[1]; vals.unshift(values[0]); return vals; }),
    get('Name', 'Assign', 'Expression').generate('Expression', function (values) { return new AssignmentExpression(values[0], values[2]); }),
    get('Expression', 'Equals', 'Expression').generate('Expression', function (values) { return new EqualExpression(values[0], values[2]); }),
    get(get('\n').oneOrMore(), 'Expression').generate('Expression', function (values) { return values[1] }),
    get('Expression0', 'Plus', 'Expression0').generate('Expression', function (values) { return new AddExpression(values[0], values[2]); }),
    get('Expression0', 'Minus', 'Expression0').generate('Expression', function (values) { return new SubtractExpression(values[0], values[2]); }),
    get('Expression0').generate('Expression'),
    get('Term', 'Multiply', 'Term').generate('Expression0', function (values) { return new MultiplyExpression(values[0], values[2]); }),
    get('Term', 'Divide', 'Term').generate('Expression0', function (values) { return new DivideExpression(values[0], values[2]); }),
    get('Term').generate('Expression0'),
    get('Integer').generate('Term'),
    get('Name').generate('Term'),
    get(['\n', ';']).generate('EndOfStatement'),
    get('Expression', 'EndOfStatement').generate('Statement', function (values) { return values[0] })
];

function createParser(text) {
    return simplegrammar.createParser(text, rules);
}

module.exports = {
    createParser: createParser
};

