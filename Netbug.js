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
function formatHTML(html){
	html=html.toLowerCase().replace(/>[\n\r\t ]*</g,'<');
	html=html.toLowerCase().replace(/\'/g,'"');
	html=html.toLowerCase().replace(/\s+=\s/g,'=');
	html=html.split(/</g);
	html.shift();
	return html;
}
function getValueInArray(thing,keys=[]){
	let temp=key=>{
		if(Array.isArray(thing)&&key){
			return key<thing.length?thing[key]:undefined;
		}else{
			return thing;
		}
	}
	/////////////////////////
	return Array.isArray(keys)?keys.forEach(temp):temp(keys);
}
function analyzeTag(tag){
	let info={};
	info.tagName=tag.match(/\w+/i)[0];
	info.text=getValueInArray(tag.match(/>(\S+)/),[1]);
	info.text=getValueInArray(tag.match(/(\S+)=(\S+)/),[1,2]);
	debug(info.text);
	return info;
}
function getGene(){
	return {
		tagName:null,
		text:null,
		childNode:null,
		parentNode:null,
		prevNode:null,
		nextNode:null,
		attribute:[]
	}
}
function createDOM(html){
	html=formatHTML(html);
	let dom=null,node=null,stack=[],temp=[];
	debug(html);
	html.forEach((tag)=>{
		let tagInfo=analyzeTag(tag);
		// debug(tagInfo);
		if(/^\//.test(tagInfo.tagName)){
			//标签出栈
			stack.pop();
		}else if(['doctype','br','hr','input','img','link','meta','param'].includes(tagInfo.tagName)){
			//直接分析空元素
		}else{
			//标签入栈
			dom=getGene();
			dom.tagName=tagInfo.tagName;
			stack.push(tagInfo.tagName);
		}
	});
}
function debug(info){
	console.log(info);
}