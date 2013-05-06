var Model = {
    'name' : 'dyw'
};

Object.observe(Model, function callback(changes){
    console.log(changes);
});

Model.name = 'mjj';//chrome://flags/ --> Enable Experimental JavaScript 