//v8(nodejs),firefox 支持Proxy
//node --harmony harmony-proxy.js 
var model = Proxy.create({
    get: function(proxy, name) {
        return 'Hello, ' + name;
    }
});

console.log(model.dyw); // should print 'Hello, dyw'

/*
var simpleHandler = {
  get: function(proxy, name) {
    // we can intercept access to the 'prototype' slot of the function
    if (name === 'prototype') return Object.prototype;
    return 'Hello, '+ name;
  }
};
var fproxy = Proxy.createFunction(
  simpleHandler,
  function() { // call trap
    return arguments; 
  }, 
  function() { // construct trap
    return arguments; 
  }); 

console.log(fproxy(1,2)); 
console.log(new fproxy(1,2));
console.log(fproxy.foo);
*/

var p = Proxy.create({
  get:    function(receiver, name) { 
    console.log(name);
  },
  invoke: function(receiver, name, args) { 
    // console.log(name, args);
    // console.log('invoked')
  },
});
p.x;
p.testMethod('abc');
// get(p,'x')
// invoke(p, 'm', [a])