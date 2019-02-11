// ==UserScript==
// @name         Github Compat For Chrome
// @name:zh-CN   Github兼容性优化，Chrome版
// @namespace    https://greasyfork.org/users/159546
// @version      1.1.1
// @description  Fix Github problem while using Chrome if needed.
// @description:zh-CN 优化Github在Chrome浏览器上的使用体验和兼容性，如果需要这么做。
// @author       LEORChn
// @include      *://github.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
var showNoticeWhenLaunched = 1
; // 成功加载这个脚本后在左上角显示绿色OK字样，数字1为显示，其他数字为隐藏
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
    window.http=http2;
    init();
    if(load())return;
    setTimeout(recheck,100);
}
function init(){ // call once when start loading page
    rmViews();
    if(inited) return;
    //if(fc('footer').length==0) return; // 找到 footer 就说明网页基本加载完毕，可以开始加载 JS 了
    //jsCompat();
    //inited=true;
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
function load(){ // call once when loaded page
    if(document.readyState.toLowerCase()=='complete'){
        //-- 首页
        fixDashboardFeed();
        //-- 个人资料
        fixSetPinnedRepositories();
        //-- 仓库
        fixWatcherInline();
        fixBranchSwitch();
        fixLanguageDetail();
        fixPopularContent();
        whateverDaemon();
        launchedNotice();
        return true;
    }
}
//============== 不知道什么时候会加载完成，但先注册守护
function whateverDaemon(){
    unblockButtons();
    fixCommitDetail();
    fixCommitDetailButton();
    setTimeout(whateverDaemon,3000);
}
//============== 通用界面 以下
function unblockButtons(){
    var t=$$('[disabled]');
    for(var p=0; p<t.length; p++) t[p].removeAttribute('disabled');
}
//============== 通用界面 以上
//============== 首页 以下
function fixDashboardFeed(){
    var t=$('div.news>.js-all-activity-header+div.js-dashboard-deferred');
    if(t) { t.setAttribute('src', t.getAttribute('data-src')); insertItsSrc(t); fixDashboardFeedNext(); }
}
function fixDashboardFeedNext(){
    var t= $('form.js-ajax-pagination>button.ajax-pagination-btn');
    if(t) t.onclick=function(){ var p=this.parentElement; p.setAttribute('src', p.getAttribute('action')); repItsSrc(p); return false;}
    var y= $$('button.js-details-target.text-gray-dark');
    for(var i=0;i<y.length;i++)
        y[i].onclick=function(){
            var p=this.parentElement.parentElement.getElementsByClassName('Details-content--hidden dashboard-rollup-items')[0];
            p.style.cssText= p.style.cssText==''? 'display:block !important': '';
        }
    setTimeout(fixDashboardFeedNext,3000);
}
//============== 首页 以上
//============== 个人资料界面 以下
//------ 自己资料
function fixSetPinnedRepositories(){
    var t=$('details>summary+details-dialog>include-fragment.octocat-spinner');
    if(t){ t.setAttribute('src', t.parentElement.parentElement.getAttribute('data-deferred-details-content-url')); repItsSrc(t); }
}

//============== 个人资料界面 以上
//============== 仓库内界面 以下
//------ 仓库 > 通用
function fixWatcherInline(){
    var t=$('ul.pagehead-actions>li>form');
    if(t) t.style.display='table-row-group';
}
//------ 仓库 > code
function fixBranchSwitch(){
    var t=$('details-menu[src]');
    if(t) insertItsSrc(t);//http('get',t.getAttribute('src'),'',function(){t.innerHTML=this.responseText;});
}
function fixLanguageDetail(){
    var t=$('button.repository-lang-stats-graph');
    if(t) t.onclick=function(){ var p=$('.stats-switcher-wrapper>.numbers-summary'); if(p) p.style.display= p.style.display == 'none'? '': 'none';}
}
function fixCommitDetail(){
    var t=$('include-fragment.commit-loader>div.loader-error');
    if(t) repItsSrc(t.parentElement);
}
function fixCommitDetailButton(){
    var t=$('button.ellipsis-expander');
    if(t) t.onclick=function(){ var p=$('.commit-desc'); if(p) p.style.display= p.style.display == ''? 'block': ''; } // 本身会被class隐藏所以跟上面那个反着来
}
//------ 仓库 > Insights > Traffic
function fixPopularContent(){
    insertItsSrc($('include-fragment.top-lists[src]'));
}
//============== 仓库内界面 以上
function launchedNotice(){
    if(showNoticeWhenLaunched != 1) return;
    var t=ct('div', 'ok :)');
    t.style.cssText='position:fixed; left:0; top:0; color:#0f0; z-index:99999999';
    document.body.appendChild(t);
}
function repItsSrc(t){
    insertItsSrc(t,true);
}
function insertItsSrc(t,repMode){
    if(t) http('get',t.getAttribute('src'),'',function(){if(repMode) t.outerHTML=this.responseText; else t.innerHTML=this.response;});
}
//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag,t){var p=document.createElement(tag); if(t)p.innerText=t; return p;}
function $(s){return document.querySelector(s);}
function $$(s){return document.querySelectorAll(s);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
function http2(method,url,formed,dofun,dofail){
	var x=new XMLHttpRequest();
	x.timeout=60000;
	x.responseType="text";
	if(location.protocol.includes('https')) url=url.replace('^http:','https:');
	x.open(method.toUpperCase(),url,true);
	x.onload=dofun;
	x.ontimeout=x.onerror= dofail? dofail: null;
	x.send(formed?formed:'');
}
//废弃代码备份用 鬼知道什么时候要参考看看的
//========================================================================================================
// unsupported-(*).js 可能只是用来激活顶部浏览器太旧提示的，不管他或许也行
/*function jsRemove(){ // remove assets/unsupported-(*).js if needed
    var spt=ft('script');
    for(var i=0,len=spt.length;i<len;i++) if(spt[i].src.includes('unsupported')) spt[i].remove();
}*/
var baseUrl='https://github.com/LEORChn/LEORChn.github.io/raw/master/archive/assets-cdn.github.com/assets/';
function jsCompat(){
    addjs(baseUrl+'compat-1c66c88316e8e9eacfac51af6ff01eac.js');
    addjs(baseUrl+'frameworks-a2e17e1bb4b33f83985c8bddfee72bc7.js');
    setTimeout(githubJs,5000);
}
function githubJs(){ // 有时这个该死的玩意加载顺序不对
    addjs(baseUrl+'github-a62aa302e53c46b4501ee9c8c591ed18.js'); // github-(*).js ？去他妈的异步
}
function addjs(url,async){
    var d=ct('script');
    if(async) d.async='async';
    d.type='application/javascript';
    d.src=url;
    //ft('body')[0].appendChild(d);
    //document.write('<script src="'+url+'"></script>');
}
