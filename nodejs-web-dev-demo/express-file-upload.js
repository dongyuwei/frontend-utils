var express = require('express'), http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: '/tmp/express/files' //mkdir -p /tmp/express/files
}));

app.post('/upload',function(req, res){
    console.log(req.files);
    res.send('uploaded');
});
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});