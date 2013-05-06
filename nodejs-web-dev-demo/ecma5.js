["a","b","c"].forEach(function(item,index){
    console.log(item,index);
});

var obj = {
    'name' : 'dyw',
    'test' : function(){
        console.log(this.name);
    }
};
console.log(Object.keys(obj));

setTimeout(obj.test, 10);
setTimeout(obj.test.bind(obj), 10);

