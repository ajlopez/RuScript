
var rs = require('..');
var path = require('path');

exports['execute require'] = function (test) {
    var context = rs.context();
    rs.execute('require("test/seta.rb")', context);
    
    test.equal(42, context.getValue("a"));
}
