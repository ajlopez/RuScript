
var simplegrammar = require('simplegrammar');
var expressions = require('./expressions');

var get = simplegrammar.get;
var peek = simplegrammar.peek;

var ClassExpression = expressions.ClassExpression,
    ModuleExpression = expressions.ModuleExpression,
    JavaScriptNamespaceExpression = expressions.JavaScriptNamespaceExpression,
    JavaScriptQualifiedNameExpression = expressions.JavaScriptQualifiedNameExpression,
    DefExpression = expressions.DefExpression,
    CallExpression = expressions.CallExpression,
    ArrayExpression = expressions.ArrayExpression,
    IndexedExpression = expressions.IndexedExpression,
    MakeQualifiedCallExpression = expressions.MakeQualifiedCallExpression,
    QualifiedCallExpression = expressions.QualifiedCallExpression,
    IfExpression = expressions.IfExpression,
    UnlessExpression = expressions.UnlessExpression,
    WhileExpression = expressions.WhileExpression,
    UntilExpression = expressions.UntilExpression,
    CompositeExpression = expressions.CompositeExpression,
    AssignmentExpression = expressions.AssignmentExpression,
    MakeQualifiedNameExpression = expressions.MakeQualifiedNameExpression,
    QualifiedNameExpression = expressions.QualifiedNameExpression,
    MakeNameExpression = expressions.MakeNameExpression,
    InstanceVariableExpression = expressions.InstanceVariableExpression,
    ClassVariableExpression = expressions.ClassVariableExpression,
    NameExpression = expressions.NameExpression,
    ConstantExpression = expressions.ConstantExpression,
    IntegerExpression = expressions.IntegerExpression,
    EqualExpression = expressions.EqualExpression,
    NotEqualExpression = expressions.NotEqualExpression,
    LessExpression = expressions.LessExpression,
    GreaterExpression = expressions.GreaterExpression,
    LessEqualExpression = expressions.LessEqualExpression,
    GreaterEqualExpression = expressions.GreaterEqualExpression,
    AddExpression = expressions.AddExpression,
    SubtractExpression = expressions.SubtractExpression,
    MultiplyExpression = expressions.MultiplyExpression,
    DivideExpression = expressions.DivideExpression;


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
    get('InstanceVariable', 'Assign', 'Expression').generate('Expression', function (values) { return new AssignmentExpression(values[0], values[2]); }),
    get('ClassVariable', 'Assign', 'Expression').generate('Expression', function (values) { return new AssignmentExpression(values[0], values[2]); }),
    
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
    get('@@', 'Name').generate('ClassVariable', function (values) { return new ClassVariableExpression(values[1].getName()); }),
    get('@', 'Name').generate('InstanceVariable', function (values) { return new InstanceVariableExpression(values[1].getName()); }),
    get('Name').generate('Term'),
    get('InstanceVariable').generate('Term'),
    get('ClassVariable').generate('Term'),
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

