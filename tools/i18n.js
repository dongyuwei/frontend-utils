var fs = require('fs');
var path = require('path');
var jsdom = require("jsdom");
var cheerio = require('cheerio');

function parseHTML(uri) {
	// var jquery = fs.readFileSync(path.join(__dirname,"jquery.js")).toString();
	// jsdom.env({
	// 	html: fs.readFileSync(uri, 'utf-8'),
	// 	src: [jquery],
	// 	scripts: ["http://code.jquery.com/jquery.js"],
	// 	done: function(errors, window) {
	// 		var $ = window.$;
	// 		$("table").each(function() {
	// 			console.log(this.innerHTML);
	// 		});
	// 	}
	// });
	
    $ = cheerio.load(fs.readFileSync(uri, 'utf-8'));
    $('table').each(function(){
    	console.log(this);
    });
}

parseHTML(path.join(__dirname,'静态页整理英语文字及多语言翻译.html'));