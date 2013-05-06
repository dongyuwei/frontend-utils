var obj = {
    get a() {
        return "something"
    }, 
    set a() {
        console.log(this.a)
    }
};
obj.__defineGetter__('foo',function(){
    return 'bar'
});

obj.a = 123;
console.log(obj.a, obj.foo);