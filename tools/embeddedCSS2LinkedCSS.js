//  /private/var/www/vhosts/testrelease.lightinthebox.com/httpdocs/resource/dev_v2/templateCSS/
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

//排除basename以.或者_开头的目录|文件(如.svn等)
function filter(uri) {
	var start = path.basename(uri).charAt(0);
	return start !== '.' && start !== '_';
}

/**
 * 把<style>内嵌css转换成外链<link>.
 * 生成 style_0_xyz.css（压缩优化后css,xyz是style_0.css内容的16位或32位 md5 hash值）
 */
function embedded2Linked(uri){
	var sContent = fs.readFileSync(uri, 'utf-8');
	var sCSS,hash,file,handled = false;
	sContent = sContent.replace(/<style>(.*)<\/style>/g,function(){
		if(RegExp.$1){
			handled = true;

			sCSS = new Buffer(RegExp.$1);
			hash = md5Hash(sCSS);
			file = uri.replace('.php', '_' + hash + '.css');
			fs.writeFileSync(file, sCSS);
			return '';
		}
	});
	if(handled){
		sContent = '<link rel="stylesheet" type="text/css" href="' + file + '"' + sContent;
		fs.writeFileSync(uri, sContent);
	}
	sContent = sCSS = hash = file = handled = null;
}

function walk(uri, filter) {
	var stat = fs.lstatSync(uri);
	if(filter(uri)) {
		if(stat.isFile()) {
			//转换成绝对路径
			uri = path.resolve(uri);
			if(path.extname(uri) === '.php') {
				console.log(uri);
				embedded2Linked(uri);
			}
		}
		if(stat.isDirectory()) {
			fs.readdirSync(uri).forEach(function(part) {
				walk(path.join(uri, part), filter);
			});
		}
	}
}

function removeBOMChar(str) {
	return str.replace(/^\xef\xbb\xbf/, '');
};

//删除文件UTF-8 BOM 头
function removeFileBOMChar(filePath) {
	return removeBOMChar(fs.readFileSync(filePath));
};

function md5Hash(sCSS){
	var hash = crypto.createHash('md5').update(sCSS).digest("hex").substr(0,16);//hex为32位
	return hash;
};

var cssDir  = process.argv[2];
if(!cssDir){
	console.error('Usage: node embeddedCSS2LinkedCss.js templateCSSDir');
	console.info('for example:\nnode embeddedCSS2LinkedCss.js /var/www/vhosts/testrelease.lightinthebox.com/httpdocs/resource/dev_v2/templateCSS/');
	process.exit(1);
}else{
	walk(cssDir,filter);
	process.exit(0);
}