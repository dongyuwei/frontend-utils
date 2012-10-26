var fs = require('fs');

var mapping = {};

function parse(file, maxReadyTime, maxLoadTime) {
	var stream = fs.createReadStream(file);
	stream.setEncoding('utf8')

	console.time('log');

	var aTestCount = bTestCount = 0;
	var aReadyTime = bReadyTime = 0;
	var aLoadTime = bLoadTime = 0;
	var readyTime, loadTime;
	stream.on('data', function(data) {
		data.trim().split('\n').forEach(function(line) {
			if(line.match(/(Chrome|Firefox|MSIE 9.0|MSIE 8.0|Safari|MSIE 7.0|MSIE 6.0)/)) {
				var agent = RegExp.$1;
				mapping[agent] = mapping[agent] || {};

				line.match(/&readyTime=(.*?)(&loadTime=(.*?))?&abTestType=(.*?)&/g);
				if(RegExp.$4) {
					mapping[agent][RegExp.$4] = mapping[agent][RegExp.$4] || {
						'readyCount': 0,
						'readyTime': 0,
						'loadTime': 0,
						'loadCount': 0
					};

					readyTime = parseInt(RegExp.$1), loadTime = parseInt(RegExp.$3) || 0;
					if(readyTime <= maxReadyTime && loadTime <= maxLoadTime) { //注意这个过滤条件对统计结果影响非常大
						mapping[agent][RegExp.$4]['readyCount']++;
						mapping[agent][RegExp.$4]['readyTime'] += readyTime;
						if(loadTime !== 0) {
							mapping[agent][RegExp.$4]['loadCount']++;
							mapping[agent][RegExp.$4]['loadTime'] += loadTime;
						}
					}
				}
			}

		});
	});
	stream.on('end', function(data) {
		for(var k in mapping) {
			if(mapping[k]['ATest'] && mapping[k]['BTest']) {
				mapping[k]['ATest'].readyTime = mapping[k]['ATest'].readyTime / mapping[k]['ATest'].readyCount;
				mapping[k]['ATest'].loadTime = mapping[k]['ATest'].loadTime / (mapping[k]['ATest'].loadCount || 1);

				mapping[k]['BTest'].readyTime = mapping[k]['BTest'].readyTime / mapping[k]['BTest'].readyCount;
				mapping[k]['BTest'].loadTime = mapping[k]['BTest'].loadTime / (mapping[k]['BTest'].loadCount || 1);

				mapping[k]['readyTimeReduce'] = mapping[k]['ATest'].readyTime - mapping[k]['BTest'].readyTime;
				mapping[k]['loadTimeReduce'] = mapping[k]['ATest'].loadTime - mapping[k]['BTest'].loadTime;

				mapping[k]['readyTimeReduce百分比'] = mapping[k]['readyTimeReduce']/ mapping[k]['ATest'].readyTime ;
				mapping[k]['loadTimeReduce百分比'] = mapping[k]['loadTimeReduce']  / mapping[k]['ATest'].loadTime ;
			}
		}
		console.log(JSON.stringify(mapping, null, 3))
		console.timeEnd('log');
	});
}

// parse('readyTime.log', 15000, 30000);
parse('./log/loadTime.log', 30000, 60000);