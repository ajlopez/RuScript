
var simplegrammar = require('simplegrammar');

var get = simplegrammar.get;
var peek = simplegrammar.peek;

function IfExpression(condition, expr) {
    this.evaluate = function (context) {
        var value = condition.evaluate(context);
        
        if (value === null || value === false || value === undefined)
            return null;
            
        return expr.evaluate(context);
    };
}

function WhileExpression(condition, expr) {
    this.evaluate = function (context) {
        while (true) {
            var value = condition.evaluate(context);
        
            if (value === null || value === false || value === undefined)
                return null;
            
            expr.evaluate(context);
        }
    };
}

function UntilExpression(condition, expr) {
    this.evaluate = function (context) {
        while (true) {
            var value = condition.evaluate(context);
        
            if (value !== null && value !== false && value !== undefined)
                return null;
            
            expr.evaluate(context);
        }
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

function ConstantExpression(value) {
    this.evaluate = function () {
        return value;
    };
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

function NotEqualExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) != right.evaluate(context);
    };
}

function LessExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) < right.evaluate(context);
    };
}

function GreaterExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) > right.evaluate(context);
    };
}

function LessEqualExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) <= right.evaluate(context);
    };
}

function GreaterEqualExpression(left, right) {
    this.evaluate = function (context) {
        return left.evaluate(context) >= right.evaluate(context);
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
    
    // Operators
    get('+').generate('Plus'),
    get('-').generate('Minus'),
    get('*').generate('Multiply'),
    get('/').generate('Divide'),
    get('==').generate('Equal'),
    get('!=').generate('NotEqual'),
    get('<=').generate('LessEqual'),
    get('<').generate('Less'),
    get('>=').generate('GreaterEqual'),
    get('>').generate('Greater'),
    get('=').generate('Assign'),
    
    // Booleans
    
    get('false').generate('Expression', function() { return new ConstantExpression(false); }),
    get('true').generate('Expression', function() { return new ConstantExpression(true); }),
    
    // If and Suite
    get('if', 'Expression', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new IfExpression(values[1], new CompositeExpression(values[3])); }),
    peek('end').generate('Suite', function (values) { return []; }),
    get('Statement', 'Suite').generate('Suite', function (values) { var vals = values[1]; vals.unshift(values[0]); return vals; }),
    get('Expression', 'Suite').generate('Suite', function (values) { var vals = values[1]; vals.unshift(values[0]); return vals; }),
    
    // While and Suite
    get('while', 'Expression', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new WhileExpression(values[1], new CompositeExpression(values[3])); }),
    
    // Until and Suite
    get('until', 'Expression', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new UntilExpression(values[1], new CompositeExpression(values[3])); }),
    
    // Assignment
    get('Name', 'Assign', 'Expression').generate('Expression', function (values) { return new AssignmentExpression(values[0], values[2]); }),
    
    // Comparison
    get('Expression', 'Equal', 'Expression').generate('Expression', function (values) { return new EqualExpression(values[0], values[2]); }),
    get('Expression', 'NotEqual', 'Expression').generate('Expression', function (values) { return new NotEqualExpression(values[0], values[2]); }),
    get('Expression', 'LessEqual', 'Expression').generate('Expression', function (values) { return new LessEqualExpression(values[0], values[2]); }),
    get('Expression', 'GreaterEqual', 'Expression').generate('Expression', function (values) { return new GreaterEqualExpression(values[0], values[2]); }),
    get('Expression', 'Less', 'Expression').generate('Expression', function (values) { return new LessExpression(values[0], values[2]); }),
    get('Expression', 'Greater', 'Expression').generate('Expression', function (values) { return new GreaterExpression(values[0], values[2]); }),
    
    // Skip initial end of lines in Expression
    get(get('\n').oneOrMore(), 'Expression').generate('Expression', function (values) { return values[1] }),
    
    // Expression Level 1
    get('Expression1').generate('Expression'),
    get('Expression1', 'Plus', 'Expression0').generate('Expression1', function (values) { return new AddExpression(values[0], values[2]); }),
    get('Expression1', 'Minus', 'Expression0').generate('Expression1', function (values) { return new SubtractExpression(values[0], values[2]); }),
    
    // Expression Level 0
    get('Expression0').generate('Expression1'),
    get('Expression0', 'Multiply', 'Term').generate('Expression0', function (values) { return new MultiplyExpression(values[0], values[2]); }),
    get('Expression0', 'Divide', 'Term').generate('Expression0', function (values) { return new DivideExpression(values[0], values[2]); }),
    
    // Term
    get('Term').generate('Expression0'),
    get('Integer').generate('Term'),
    get('Name').generate('Term'),
    
    // Statement: Expressiong with end of expression
    get(['\n', ';']).generate('EndOfStatement'),
    get('Expression', 'EndOfStatement').generate('Statement', function (values) { return values[0] })
];

function createParser(text) {
    return simplegrammar.createParser(text, rules);
}

module.exports = {
    createParser: createParser
};

