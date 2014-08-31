
var simplegrammar = require('simplegrammar'),
    contexts = require('./contexts');

var get = simplegrammar.get;
var peek = simplegrammar.peek;

var methods = {
    number: {
        to_s: function () { return this.toString(); }
    },
    string: {
        to_i: function () { return parseInt(this); }
    }
};

function isFalse(value) {
    return value === null || value === false || value === undefined;
}

function getInstanceMethod(obj, fnname) {
    return methods[typeof obj][fnname];
}

function ClassClass(cls) {
    var instanceMethods = {
        'new': function () {
            var newobj = new Object();
            newobj.$class = cls;
            return newobj;
        }
    };
    
    this.getInstanceMethod = function (name) {
        return instanceMethods[name];
    };
}

function ModuleClass(cls) {
    var instanceMethods = { };
    
    this.getInstanceMethod = function (name) {
        return instanceMethods[name];
    };
}

function Class(name) {
    var instanceMethods = { };
    
    this.$class = new ClassClass(this);
    this.$constants = contexts.createContext();
    
    this.getName = function () { return name; };
    
    this.getInstanceMethod = function (name) {
        return instanceMethods[name];
    };
    
    this.setInstanceMethod = function (name, method) {
        instanceMethods[name] = method;
    }
}

function Module(name) {
    var instanceMethods = { };
    
    this.$class = new ModuleClass(this);
    this.$constants = contexts.createContext();
    
    this.getName = function () { return name; };
    
    this.getInstanceMethod = function (name) {
        return instanceMethods[name];
    };
    
    this.setInstanceMethod = function (name, method) {
        instanceMethods[name] = method;
    }
}

function ClassExpression(name, expr) {
    this.getName = function () { return name; }
    
    this.evaluate = function (context) {
        var cls = new Class(name);
        var newcontext = contexts.createContext(context);
        newcontext.$module = cls;
        expr.evaluate(newcontext);
        context.setLocalValue(name, cls);
        return cls;
    }
}

function ModuleExpression(name, expr) {
    this.getName = function () { return name; }
    
    this.evaluate = function (context) {
        var mod = new Module(name);
        var newcontext = contexts.createContext(context);
        newcontext.$module = mod;
        expr.evaluate(newcontext);
        context.setLocalValue(name, mod);
        return mod;
    }
}

function JavaScriptNamespaceExpression() {
    var value;

    if (typeof global != 'undefined')
        value = global;
    else if (typeof window != 'undefined')
        value = window;
        
    this.evaluate = function (context) {
        return value;
    }
}

function JavaScriptQualifiedNameExpression(expr, name) {
    this.evaluate = function (context) {
        return expr.evaluate(context)[name];
    }
    
    this.getExpression = function () { return expr; }
    
    this.getName = function () { return name; }
}

function JavaScriptCallExpression(expr, exprs) {
    this.evaluate = function (context) {
        var obj = expr.getExpression().evaluate(context);
        var name = expr.getName();
        var args = [];
        
        exprs.forEach(function (expr) {
            args.push(expr.evaluate(context));
        });
        
        return obj[name].apply(obj, args);
    }
}

function DefExpression(name, parnames, expr) {
    this.evaluate = function (context) {
        var fun = function() { 
            var newcontext = contexts.createContext(context);
            newcontext.$self = this;
            for (n in parnames)
                newcontext.setLocalValue(parnames[n], arguments[n]);
            return expr.evaluate(newcontext); 
        };
        if (context.$module)
            context.$module.setInstanceMethod(name, fun);
        else
            context.setLocalValue(name, fun);
        return fun;
    }
}

function CallExpression(name, exprs) {
    this.evaluate = function (context) {
        var fun = context.getValue(name);
        var args = [];
        
        exprs.forEach(function (expr) {
            args.push(expr.evaluate(context));
        });
        
        return fun.apply(null, args);
    }
}

function ArrayExpression(exprs) {
    this.evaluate = function (context) {
        var array = [];
        
        exprs.forEach(function (expr) {
            array.push(expr.evaluate(context));
        });
        
        return array;
    }
}

function IndexedExpression(expr, exprs) {
    this.evaluate = function (context) {
        var value = expr.evaluate(context);
                
        exprs.forEach(function (expr) {
            value = value[expr.evaluate(context)];
        });
        
        return value;
    }
}

function MakeQualifiedCallExpression(expr, exprs) {
    if (exprs == null && (expr instanceof JavaScriptQualifiedNameExpression || expr instanceof JavaScriptNamespaceExpression))
        return expr;
        
    if (exprs == null)
        exprs = [];
        
    if (expr instanceof JavaScriptQualifiedNameExpression || expr instanceof JavaScriptNamespaceExpression)
        return new JavaScriptCallExpression(expr, exprs);

    return new QualifiedCallExpression(expr, exprs);
}

function QualifiedCallExpression(expr, exprs) {
    this.evaluate = function (context) {
        var obj = expr.getTarget().evaluate(context);
        var fun;
        var fnname = expr.getName();
        
        if (obj.$class)
            fun = obj.$class.getInstanceMethod(fnname);
        else
            fun = getInstanceMethod(obj, fnname);
        
        var args = [];
        
        exprs.forEach(function (expr) {
            args.push(expr.evaluate(context));
        });
        
        return fun.apply(obj, args);
    }
}

function IfExpression(condition, thenexpr, elseexpr) {
    this.evaluate = function (context) {
        var value = condition.evaluate(context);
        
        if (isFalse(value))
            if (elseexpr)
                return elseexpr.evaluate(context);
            else
                return null;
            
        return thenexpr.evaluate(context);
    };
}

function UnlessExpression(condition, thenexpr, elseexpr) {
    this.evaluate = function (context) {
        var value = condition.evaluate(context);
        
        if (!isFalse(value))
            if (elseexpr)
                return elseexpr.evaluate(context);
            else
                return null;
            
        return thenexpr.evaluate(context);
    };
}

function WhileExpression(condition, expr) {
    this.evaluate = function (context) {
        while (true) {
            var value = condition.evaluate(context);
        
            if (isFalse(value))
                return null;
            
            expr.evaluate(context);
        }
    };
}

function UntilExpression(condition, expr) {
    this.evaluate = function (context) {
        while (true) {
            var value = condition.evaluate(context);
        
            if (!isFalse(value))
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

function MakeQualifiedNameExpression(target, name) {
    if (target instanceof JavaScriptNamespaceExpression ||
        target instanceof JavaScriptQualifiedNameExpression)
        return new JavaScriptQualifiedNameExpression(target, name);

    return new QualifiedNameExpression(target, name);
}

function QualifiedNameExpression(target, name) {
    this.evaluate = function (context) {
        var obj = target.evaluate(context);
        
        if (obj.$class)
            return obj.$class.getInstanceMethod(name);
        
        return obj[name];
    };
    
    this.getName = function () { return name; };
    
    this.getTarget = function () { return target; };
}

function MakeNameExpression(name) {
    if (name == 'js')
        return new JavaScriptNamespaceExpression();
    return new NameExpression(name);
}

function NameExpression(name) {
    this.evaluate = function (context) {
        var value = context.getValue(name);
        
        if (typeof value == 'function')
            return value();
        
        return value;
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

// escape character function

function escape(ch) {
    if (ch === 't')
        return '\t';
    if (ch === 'r')
        return '\r';
    if (ch === 'n')
        return '\n';

    return ch;
}

var rules = [
    get([' ','\t','\r']).oneOrMore().skip(),
    get('#').upTo('\n').skip(),
    get('"').upTo('"', '\\', escape).generate('String', function (value) { return new ConstantExpression(value.substring(1, value.length - 1)); }),
    get('0-9').oneOrMore().generate('Integer', function (value) { return new IntegerExpression(value) }),
    get(['a-z', 'A-Z', '_'], get(['a-z', 'A-Z', '0-9', '_']).zeroOrMore()).generate('Name', function (value) { return MakeNameExpression(value) }),
    
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
    
    // Punctuation
    get('(').generate('LeftParenthesis'),
    get(')').generate('RightParenthesis'),
    get('[').generate('LeftBracket'),
    get(']').generate('RightBracket'),
    get(',').generate('Comma'),
    get('.').generate('Dot'),
    
    // Booleans
    
    get('false').generate('Expression', function() { return new ConstantExpression(false); }),
    get('true').generate('Expression', function() { return new ConstantExpression(true); }),
    
    // Program
    
    get('StatementList').generate('Program', function (value) { return new CompositeExpression(value); }),
    get('StatementList', 'Statement').generate('StatementList', function (values) { if (values[1] == null) return values[0]; var list = values[0]; list.push(values[1]); return list; }),
    get('Statement').generate('StatementList', function (value) { if (value == null) return []; return [value]; }),
    
    // Class
    
    get('class', 'Name', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new ClassExpression(values[1].getName(), new CompositeExpression(values[3])); }),

    // Module
    
    get('module', 'Name', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new ModuleExpression(values[1].getName(), new CompositeExpression(values[3])); }),
    
    // Def
    get('def', 'Name', 'LeftParenthesis', 'RightParenthesis', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new DefExpression(values[1].getName(), [], new CompositeExpression(values[5])); }),
    get('def', 'Name', 'LeftParenthesis', 'NameList', 'RightParenthesis', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new DefExpression(values[1].getName(), values[3], new CompositeExpression(values[6])); }),
    get('def', 'Name', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new DefExpression(values[1].getName(), [], new CompositeExpression(values[3])); }),

    get('Name', 'Comma', 'NameList').generate('NameList', function (values) { var list = values[2]; list.unshift(values[0].getName()); return list; }),
    get('Name', peek('RightParenthesis')).generate('NameList', function (values) { return [values[0].getName()]; }),
    
    // If, Unless and Suite
    get('if', 'Expression', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new IfExpression(values[1], new CompositeExpression(values[3])); }),
    get('if', 'Expression', 'EndOfStatement', 'Suite', 'else', 'Suite', 'end').generate('Expression', function (values) { return new IfExpression(values[1], new CompositeExpression(values[3]), new CompositeExpression(values[5])); }),
    get('unless', 'Expression', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new UnlessExpression(values[1], new CompositeExpression(values[3])); }),
    get('unless', 'Expression', 'EndOfStatement', 'Suite', 'else', 'Suite', 'end').generate('Expression', function (values) { return new UnlessExpression(values[1], new CompositeExpression(values[3]), new CompositeExpression(values[5])); }),
    peek('end').generate('Suite', function (values) { return []; }),
    peek('else').generate('Suite', function (values) { return []; }),
    get('Statement', 'Suite').generate('Suite', function (values) { if (values[0] == null) return values[1]; var vals = values[1]; vals.unshift(values[0]); return vals; }),
    //get('Expression', 'Suite').generate('Suite', function (values) { var vals = values[1]; vals.unshift(values[0]); return vals; }),
    
    // While and Suite
    get('while', 'Expression', 'do', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new WhileExpression(values[1], new CompositeExpression(values[4])); }),
    get('while', 'Expression', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new WhileExpression(values[1], new CompositeExpression(values[3])); }),
    
    // Until and Suite
    get('until', 'Expression', 'do', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new UntilExpression(values[1], new CompositeExpression(values[4])); }),
    get('until', 'Expression', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new UntilExpression(values[1], new CompositeExpression(values[3])); }),

    // Begin to End
    get('begin', 'EndOfStatement', 'Suite', 'end').generate('Expression', function (values) { return new CompositeExpression(values[2]); }),

    // Call
//    get('Call').generate('Term'),
    get('Name', 'LeftBracket', 'ExpressionList', 'RightBracket').generate('Term', function (values) { return new IndexedExpression(values[0], values[2]); }),
    get('Name', 'ExpressionList').generate('Term', function (values) { return new CallExpression(values[0].getName(), values[1]); }),
    get('Name', 'LeftParenthesis', 'ExpressionList', 'RightParenthesis').generate('Term', function (values) { return new CallExpression(values[0].getName(), values[2]); }),
    get('Name', 'LeftParenthesis', 'RightParenthesis').generate('Term', function (values) { return new CallExpression(values[0].getName(), []); }),
        
    // Assignment
    get('Name', 'Assign', 'Expression').generate('Expression', function (values) { return new AssignmentExpression(values[0], values[2]); }),
    
    // Qualified Call
    get('QualifiedCall').generate('Term'),
    get('QualifiedName', 'ExpressionList').generate('QualifiedCall', function (values) { return MakeQualifiedCallExpression(values[0], values[1]); }),
    get('QualifiedName', 'LeftParenthesis', 'ExpressionList', 'RightParenthesis').generate('QualifiedCall', function (values) { return MakeQualifiedCallExpression(values[0], values[2]); }),
    get('QualifiedName', 'LeftParenthesis', 'RightParenthesis').generate('QualifiedCall', function (values) { return MakeQualifiedCallExpression(values[0], []); }),
    get('QualifiedName').generate('QualifiedCall', function (value) { return MakeQualifiedCallExpression(value, null); }),
    
    // Qualified Name
    get('QualifiedName', 'Dot', 'Name').generate('QualifiedName', function (values) { return MakeQualifiedNameExpression(values[0], values[2].getName()); }),
    get('Name', 'Dot', 'Name').generate('QualifiedName', function (values) { return MakeQualifiedNameExpression(values[0], values[2].getName()); }),
    get('Integer', 'Dot', 'Name').generate('QualifiedName', function (values) { return MakeQualifiedNameExpression(values[0], values[2].getName()); }),
    get('String', 'Dot', 'Name').generate('QualifiedName', function (values) { return MakeQualifiedNameExpression(values[0], values[2].getName()); }),

    // Expression List
    get('Expression').generate('ExpressionList', function (value) { return [value]; }),
    get('ExpressionList', 'Comma', 'Expression').generate('ExpressionList', function (values) { list = values[0]; list.push(values[2]); return list }),
    
    // Comparison
    get('Expression', 'Equal', 'Expression').generate('Expression', function (values) { return new EqualExpression(values[0], values[2]); }),
    get('Expression', 'NotEqual', 'Expression').generate('Expression', function (values) { return new NotEqualExpression(values[0], values[2]); }),
    get('Expression', 'LessEqual', 'Expression').generate('Expression', function (values) { return new LessEqualExpression(values[0], values[2]); }),
    get('Expression', 'GreaterEqual', 'Expression').generate('Expression', function (values) { return new GreaterEqualExpression(values[0], values[2]); }),
    get('Expression', 'Less', 'Expression').generate('Expression', function (values) { return new LessExpression(values[0], values[2]); }),
    get('Expression', 'Greater', 'Expression').generate('Expression', function (values) { return new GreaterExpression(values[0], values[2]); }),
    
    // Skip initial end of lines in Expression
    //get(get('\n').oneOrMore(), 'Expression').generate('Expression', function (values) { return values[1] }),
    
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
    get('Term', 'LeftBracket', 'ExpressionList', 'RightBracket').generate('Term', function (values) { return new IndexedExpression(values[0], values[2]); }),
    get('Integer').generate('Term'),
    get('Name').generate('Term'),
    get('String').generate('Term'),
    get('Array').generate('Term'),
    get('LeftParenthesis', 'Expression', 'RightParenthesis').generate('Expression0', function (values) { return values[1]; }),
    get('LeftBracket', 'RightBracket').generate('Array', function (values) { return new ArrayExpression([]); }),
    get('LeftBracket', 'ExpressionList', 'RightBracket').generate('Array', function (values) { return new ArrayExpression(values[1]); }),
    
    // Statement: Expressiong with end of expression
    get(['\n', ';', '']).generate('EndOfStatement'),
    get('Expression', 'EndOfStatement').generate('Statement', function (values) { return values[0] }),
    get('\n').generate('Statement', function (value) { return null; })
];

function createParser(text) {
    return simplegrammar.createParser(text, rules);
}

module.exports = {
    createParser: createParser
};

