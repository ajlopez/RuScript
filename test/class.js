
var rs = require('..');

exports['empty class'] = function (test) {
    var context = rs.createContext();
    rs.execute("class Dog\n\end", context);
    
    var result = context.getLocalValue("Dog");
    
    test.ok(result);
    test.equal(result.getName(), "Dog");
    test.ok(result.$class);
    test.ok(result.$class.getInstanceMethod("new"));
}

exports['new object from empty class'] = function (test) {
    var context = rs.createContext();
    var result = rs.execute("class Dog\n\end\nDog.new", context);
    
    test.ok(result);
    test.ok(result.$class)
    test.strictEqual(result.$class, context.getValue("Dog"));
}

exports['class with def'] = function (test) {
    var context = rs.createContext();
    rs.execute("class Dog\n\def get_value\n42\end\nend", context);
    
    var result = context.getLocalValue("Dog");
    
    test.ok(result);
    test.equal(result.getName(), "Dog");
    test.ok(result.getInstanceMethod("get_value"));
}
