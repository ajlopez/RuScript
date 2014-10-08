
var rs = require('..');
var path = require('path');

exports['execute require'] = function (test) {
    var context = rs.context();
    rs.execute('require("test/seta.rb")', context);
    
    test.equal(42, context.getValue("a"));
}

exports['execute native require'] = function (test) {
    var context = rs.context();
    var result = rs.execute('require("http")', context);
    
    test.strictEqual(require('http'), result);
}

exports['execute require only once'] = function (test) {
    var context = rs.context();
    context.setLocalValue("a", 0);
    
    rs.execute('require("test/inca.rb")', context);
    rs.execute('require("test/inca.rb")', context);
        
    test.equal(1, context.getValue("a"));
}

