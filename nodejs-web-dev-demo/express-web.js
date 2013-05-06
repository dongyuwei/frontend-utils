//npm install -g express
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('hello express!');
});

app.listen(3000);