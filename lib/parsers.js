
var simplegrammar = require('simplegrammar');

var get = simplegrammar.get;

var rules = [
    get('0-9').oneOrMore().generate('Integer')
];

function createParser(text) {
    return simplegrammar.createParser(text, rules);
}

module.exports = {
    createParser: createParser
};