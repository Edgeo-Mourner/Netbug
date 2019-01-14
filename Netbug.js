var http = require('http');
var urls= ['http://localhost/Spider/']; //要爬取的课程ID
var htmls = []; //爬取到的HTML页面集合

// 批量爬取课程页面
urls.forEach(function(url) {
	htmls.push(getRoot(url));
});
// 抓取网页数据
function getRoot(url){
    return new Promise((resolve,reject)=>{
		http.get(url,res=>{
			let root='';
			res.on('data',data=>{
				root+=data;
			});
			res.on('end',()=>{
				console.log('爬取 '+url+' 成功');
				resolve(root);
			});
		}).on('error', function (e) {
			console.log('爬取 '+url+' 失败');
			reject(e);
		});
	});
}
Promise
    .all(htmls)
    .then(html=>{
		createDOM(html[0]);
	});
function analyzeTag
function createDOM(html){
	html=html.replace(/>[\n\r\t ]*</g,'<').split(/</g);
	html.shift();
	let stack=[];
	html.forEach((tag)=>{
		let tagName=tag.match(/\w+/i)[0].toLowerCase();
		if(/^\//.test(tagName)){
			//标签出栈
			stack.pop();
			debug('出：'+tagName);
		}else if(['doctype','br','hr','input','img','link','meta','param'].includes(tagName)){
			//直接分析空元素
			debug('单：'+tagName);
		}else{
			//标签入栈
			stack.push(tagName);
			debug('入：'+tagName);
		}
	});
}
function debug(info){
	console.log(info);
}