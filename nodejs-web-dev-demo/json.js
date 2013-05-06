var Tree = {
    "name" : 'root',
    "children" : [
        {
            "name" : "node-level-1"
        },
        {
            "name" : "sub-node-1"
        }
    ]
};
console.log('stringified :',JSON.stringify(Tree));
console.log('stringified :',JSON.stringify(Tree,null,3));//beautify print
console.log('parsed : ',JSON.parse(JSON.stringify(Tree)));