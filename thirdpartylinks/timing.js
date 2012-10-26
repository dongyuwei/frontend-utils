var path = require('path');
var fs = require('fs');

/**
 * 对每个http请求按时间消耗排序
 * @param  {[type]} harFile    [description]
 * @param  {[type]} range      [description]
 * @param  {[type]} saveToFile [description]
 * @return {[type]}            [description]
 */
function timingReport(harFile, range, saveToFile) {
	var links = JSON.parse(fs.readFileSync(harFile, 'utf-8'));
	var timingList = [];
	links.log.entries.splice(0, range).forEach(function(entry) {
		var initiatorURL;
		if(entry.request.initiator.type === 'parser') {
			initiatorURL = entry.request.initiator.url;
		}
		if(entry.request.initiator.type === 'script') {
			initiatorURL = entry.request.initiator.stackTrace[0].url;
		}

		timingList.push({
			url : entry.request.url,
			initiatorURL: initiatorURL,
			// timings : entry.timings,
			time: timing(entry.timings),
			startedDateTime : entry.startedDateTime
		});
	});

	timingList.sort(function(a,b){
		return b.time - a.time;
	});

	fs.writeFileSync(saveToFile, JSON.stringify(timingList, null, 3), 'utf-8');
}

function timing(timings) {
	return [timings.blocked, timings.dns, timings.connect, timings.send, timings.wait, timings.receive, timings.ssl].reduce(function(prev, current) {
		return prev + (current !== -1 ? current : 0);
	});
}
timingReport('initiator/index.har',50,'/tmp/index_timing.txt');