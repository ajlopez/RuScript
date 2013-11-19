
var simplegrammar = require('simplegrammar');

var get = simplegrammar.get;

function IntegerExpression(text) {
    var value = parseInt(text);
    
    this.evaluate = function () {
        return value;
    };
}

var rules = [
    get([' ','\t','\r','\n']).oneOrMore().skip(),
    get('0-9').oneOrMore().generate('Integer', function (value) { return new IntegerExpression(value) }),
    get('a-z').oneOrMore().generate('Name')
];

function createParser(text) {
    return simplegrammar.createParser(text, rules);
}

module.exports = {
    createParser: createParser
};

