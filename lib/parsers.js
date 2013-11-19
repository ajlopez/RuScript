
var simplegrammar = require('simplegrammar');

var get = simplegrammar.get;

var rules = [
    get([' ','\t','\r','\n']).oneOrMore().skip(),
    get('0-9').oneOrMore().generate('Integer'),
    get('a-z').oneOrMore().generate('Name')
];

function createParser(text) {
    return simplegrammar.createParser(text, rules);
}

module.exports = {
    createParser: createParser
};

