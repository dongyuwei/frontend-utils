var obj = {
    __noSuchMethod__: function(methodName, args) {
        console.info(methodName, args);
        obj[methodName] = function(args){//define method dynamically!
            console.warn(methodName + ' invoked with args:',args);
        };
    }
};
obj.testFunction(1,'abc',234);//run it in firebug!
obj.testFunction({
    "test" : 123
});//run it in firebug!