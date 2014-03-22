
var rs = require('..');

exports['execute integer'] = function (test) {
    test.equal(rs.execute("42"), 42);
}

