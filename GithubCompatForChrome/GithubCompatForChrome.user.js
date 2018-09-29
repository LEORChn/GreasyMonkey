// ==UserScript==
// @name         Github Compat For Chrome
// @name:zh-CN   Github兼容性优化，Chrome版
// @namespace    https://greasyfork.org/users/159546
// @version      1.0.3
// @description  Fix Github problem while using Chrome if needed.
// @description:zh-CN 优化Github在Chrome浏览器上的使用体验和兼容性，如果需要这么做。
// @author       LEORChn
// @include      *://github.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
/* Loading order of compat js: (same order can be load by async)
    1 - assets/compat-(*).js
    2 - assets/frameworks-(*).js
    3 - assets/github-(*).js
   Be affected method:
    1 - jsCompat()
    2 - load()
   Use this User-Agent to update js compat packs' link in the HTML page:
    Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko
*/
var inited=false;
(function() {
    recheck();
})();
function recheck(){
    init();
    if(load())return;
    setTimeout(recheck,100);
}
function init(){ // call once when start loading page
    rmViews();
    if(inited) return;
    if(fc('footer').length==0) return; // 找到 footer 就说明网页基本加载完毕，可以开始加载 JS 了
    jsCompat();
    inited=true;
}
function rmViews(){
    tryRemove(fc('signup-prompt-bg'),0); // 登录提示
    tryRemove(fc('unsupported-browser'),0); // 浏览器太旧提示
}
function tryRemove(d,i){
    try{
        if(!isNaN(i) && d[i]) d[i].remove();
        else d.remove();
    }catch(e){}
}
// unsupported-(*).js 可能只是用来激活顶部浏览器太旧提示的，不管他或许也行
/*function jsRemove(){ // remove assets/unsupported-(*).js if needed
    var spt=ft('script');
    for(var i=0,len=spt.length;i<len;i++) if(spt[i].src.includes('unsupported')) spt[i].remove();
}*/
function jsCompat(){
    addjs('https://assets-cdn.github.com/assets/compat-3c69a4d015c4208bce7a9d5e4e15a914.js');
    addjs('https://assets-cdn.github.com/assets/frameworks-c163002918ede72971a36e0025f67a4a.js');
    addjs('https://assets-cdn.github.com/assets/github-8d674aa76ee19b76d61e8afe7d9b1209.js'); // github-(*).js ？去他妈的异步
}
function load(){ // call once when loaded page
    if(document.readyState.toLowerCase()=='complete'){
        return true;
    }
}
function addjs(url,async){
    var d=ct('script');
    if(async) d.async='async';
    d.type='application/javascript';
    d.src=url;
    ft('body')[0].appendChild(d);
}
//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag){return document.createElement(tag);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
