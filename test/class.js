
var rs = require('..');

exports['empty class'] = function (test) {
    var context = rs.createContext();
    rs.execute("class Dog\n\end", context);
    
    var result = context.getLocalValue("Dog");
    
    test.ok(result);
    test.equal(result.getName(), "Dog");
}

exports['class with def'] = function (test) {
    var context = rs.createContext();
    rs.execute("class Dog\n\def value\n42\end\nend", context);
    
    var result = context.getLocalValue("Dog");
    
    test.ok(result);
    test.equal(result.getName(), "Dog");
}
