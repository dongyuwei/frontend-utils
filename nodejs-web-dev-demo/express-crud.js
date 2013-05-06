//npm install -g express
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('get!');
});
app.post('/', function(req, res){
  res.send('post!');
});
app.put('/', function(req, res){
  res.send('put!');
});
app.delete('/', function(req, res){
  res.send('delete!');
});

app.listen(3000);