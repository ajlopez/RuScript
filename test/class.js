
var rs = require('..');

exports['empty class'] = function (test) {
    var context = rs.context();
    
    var text = [
        "class Dog",
        "end"
    ].join('\n');
    
    rs.execute(text, context);
    
    var result = context.getLocalValue("Dog");
    
    test.ok(result);
    test.equal(result.getName(), "Dog");
    test.ok(result.$class);
    test.ok(result.$class.getInstanceMethod("new"));
}

exports['new object from empty class'] = function (test) {
    var context = rs.context();
    
    var text = [
        "class Dog",
        "end",
        "Dog.new"
    ].join('\n');
    
    var result = rs.execute(text, context);
    
    test.ok(result);
    test.ok(result.$class)
    test.strictEqual(result.$class, context.getValue("Dog"));
}

exports['class with def'] = function (test) {
    var context = rs.context();
    
    var text = [
        "class Dog",
        "  def get_value",
        "    42",
        "  end",
        "end"
    ].join('\n');
    
    rs.execute(text, context);
    
    var result = context.getLocalValue("Dog");
    
    test.ok(result);
    test.equal(result.getName(), "Dog");
    test.ok(result.getInstanceMethod("get_value"));
}

exports['new object from class with def'] = function (test) {
    var context = rs.context();
    
    var text = [
        "class Dog",
        "  def get_value",
        "    42",
        "  end",
        "end",
        "fido = Dog.new"
    ].join('\n');
    
    var result = rs.execute(text, context);
    
    test.ok(result);
    test.ok(result.$class)
    test.strictEqual(result.$class, context.getValue("Dog"));
    test.ok(result.$class.getInstanceMethod("get_value"));
}

exports['invoke new object method'] = function (test) {
    var context = rs.context();
    
    var text = [
        "class Dog",
        "  def get_value",
        "    42",
        "  end",
        "end",
        "fido = Dog.new",
        "fido.get_value"
    ].join('\n');
    
    var result = rs.execute(text, context);
    
    test.ok(result);
    test.equal(result, 42)
}

exports['use instance variable'] = function (test) {
    var context = rs.context();
    
    var text = [
        "class Dog",
        "  def get_value",
        "    @foo = 42",
        "    @foo",
        "  end",
        "end",
        "fido = Dog.new",
        "fido.get_value"
    ].join('\n');
    
    var result = rs.execute(text, context);
    
    test.ok(result);
    test.equal(result, 42);
    test.ok(context.getLocalValue('fido'));
    
    var fido = context.getLocalValue('fido');
    
    test.ok(fido.$class);
    test.ok(fido.$vars);
    test.ok(fido.$vars.foo);
    test.equal(fido.$vars.foo, 42);
}

exports['use class variable'] = function (test) {
    var context = rs.context();
    
    var text = [
        "class Dog",
        "  def get_value",
        "    @@foo = 42",
        "    @@foo",
        "  end",
        "end",
        "fido = Dog.new",
        "fido.get_value"
    ].join('\n');
    
    var result = rs.execute(text, context);
    
    test.ok(result);
    test.equal(result, 42);
    test.ok(context.getLocalValue('fido'));
    
    var fido = context.getLocalValue('fido');
    
    test.ok(fido.$class);
    test.ok(fido.$class.$vars);
    test.ok(fido.$class.$vars.foo);
    test.equal(fido.$class.$vars.foo, 42);
}
