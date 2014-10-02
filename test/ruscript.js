
var ruscript = require('..');

exports['context has puts'] = function (test) {
    var ctx = ruscript.context();
    
    test.ok(ctx);
    test.ok(ctx.getValue('puts'));
    test.equal(typeof ctx.getValue('puts'), 'function');
}

