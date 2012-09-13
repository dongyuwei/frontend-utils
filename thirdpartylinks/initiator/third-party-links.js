var path = require('path');
var fs = require('fs');


function parseInitLinks(harFile,saveToFile){
	saveToFile = saveToFile || path.basename(harFile,'.har') + '.txt';
	var links = JSON.parse(fs.readFileSync(harFile,'utf-8'));

	function filter(url) {
		return ['lbox.me', 'lightinthebox.com/', 'ajax.googleapis.com','data:','twitter.com', 'twimg.com', 'facebook.com','fbcdn'].every(function(p) {
			return url.indexOf(p) === -1;
		});
	}
	var initLinks = [];
	links.log.entries.forEach(function(entry){
		if(filter(entry.request.url)){
			var url;
			if(entry.request.initiator.type === 'parser'){
				url = entry.request.initiator.url;
			}
			if(entry.request.initiator.type === 'script'){
				url = entry.request.initiator.stackTrace[0].url;
			}
			if(url === 'http://www.lightinthebox.com/'){
				console.log(entry.request.url);
				initLinks.push(entry.request.url);
			}
		}
	});
	fs.writeFileSync(saveToFile,JSON.stringify(initLinks,null,3),'utf-8');
}

parseInitLinks('index.har');



