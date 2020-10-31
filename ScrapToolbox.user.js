// ==UserScript==
// @name              ScrapToolbox
// @description       what a scrap!
// @name:zh-CN        乱七八糟工具箱
// @description:zh-CN 这里面有一堆用来兼容旧浏览器的垃圾！包括：推特界面修复、Github新版布局修复、微软待办布局修复、超能搜布局修复、大圣盘直链显示、微博新版界面修复、百度知道展开折叠
// @version           1.0.5
// @namespace         https://greasyfork.org/users/159546
// @author            LEORChn
// @include           *://zhidao.baidu.com/*
// @include           *://weibo.com/*
// @include           *://www.dashengpan.com/detail/*
// @include           *://www.chaonengsou.com/*
// @include           *://to-do.live.com/tasks/*
// @include           *://github.com/*
// @include           *://gist.github.com/*
// @include           *://greasyfork.org/*
// @include           *://www.bilibili.com/read/*
// @include           *://twitter.com/*
// @require           https://greasyfork.org/scripts/401996-baselib/code/baseLib.js?version=835697
// @run-at            document-body
// @grant             GM_xmlhttpRequest
// @connect           127.0.0.1
// @connect           127.0.0.1:81
// @connect           leorchn.github.io
// ==/UserScript==
var DEBUG = 0
? 'https://127.0.0.1:81': 'https://leorchn.github.io';
var DBG = DEBUG.includes('127.0.0.1')? '?' + Date.now(): '';
var IntervalTime = 2000;
function onIntervalFunction(){
    zhidao.baidu.com();
    weibo.com();
    www.chaonengsou.com();
    www.dashengpan.com();
    todo.live.com();
    github.com();
    greasyfork.org();
    www.bilibili.com();
    twitter.com();
}
var zhidao = { baidu: { com: function(){
    if(location.hostname != 'zhidao.baidu.com') return;
    arr($$('.answer-dispute-hide')).foreach(function(e){
        e.classList.remove('answer-dispute-hide');
    });
    $('.show-hide-dispute>span').style.display = 'inline-block';
}}},
weibo = { com: function (){
    if(location.hostname != 'weibo.com') return;
    if(injectCSS('leorchn_weibo_stylesheet', 'weibo.com.css')) return;
    appendJS(DEBUG + '/app/external/weibo.com.js');
}},
www = { dashengpan: { com: function(){
    if(location.hostname != 'www.dashengpan.com') return;
    if(!__NUXT__) return;
    var id = 'leorchn_dashengpan_direct';
    if(fv(id)) return;
    var info_place = $('p.result-tip');
    var div = ct('div#' + id, '直链：'),
        a = ct('a', __NUXT__.data[0].url);
    a.href = a.innerText;
    a.target = '_blank';
    a.rel = 'noreferrer';
    info_place.appendChild(div);
    div.appendChild(a);
}},
chaonengsou: { com: function(){
    if(location.hostname != 'www.chaonengsou.com') return;
    injectCSS('leorchn_chaonengsou_stylesheet', 'www.chaonengsou.com.css');
}},
bilibili: { com: function(){
    if(location.hostname != 'www.bilibili.com') return;
    injectCSS('leorchn_bilibili_stylesheet', 'www.bilibili.com.css');
}}
},
todo = { live:{ com: function(){
    if(location.hostname != 'to-do.live.com') return;
    injectCSS('leorchn_microsoft_to_do_stylesheet', 'to-do.live.com.css');
}}},
github = { com: function(){
    if((location.hostname != 'github.com') && (location.hostname != 'gist.github.com')) return;
    injectInlineCSS('leorchn_github_stylesheet', 'github.com.css' + DBG);
    injectInlineCSS('leorchn_github_profile',    'github.com.profile.css' + DBG);
    injectInlineCSS('leorchn_github_repository', 'github.com.repository.css' + DBG);
}},
greasyfork = { org: function(){
    if(location.hostname != 'greasyfork.org') return;
    injectCSS('leorchn_greasyfork_stylesheet', 'greasyfork.org.css');
}},
twitter = { com: function(){
    if(location.hostname != 'twitter.com') return;
    injectInlineCSS('leorchn_twitter_stylesheet', 'twitter.com.css' + DBG);
}};
// ===== =====
setInterval(onIntervalFunction, IntervalTime);

function injectCSS(id, cssName){
    if($('#' + id)) return true;
    appendCSS(DEBUG + '/app/external/' + cssName).id = id;
}
function injectInlineCSS(id, cssName){
    if($('#' + id)) return true;
    http2('get', DEBUG + '/app/external/' + cssName, '', function(e){
        var s = ct('style');
        s.id = id;
        s.innerHTML = e.responseText;
        htmlhead.appendChild(s);
    });
}
function appendCSS(url){
    var s = ct('link');
    s.rel = 'stylesheet';
    s.href = url;
    htmlhead.appendChild(s);
    return s;
}
function appendJS(url){
    var s = ct('script');
    s.src = url;
    htmlhead.appendChild(s);
    return s;
}
function http2(_method, _url, formdata, dofun, dofail){
    console.log(_method.toUpperCase()+' '+_url+(formdata && formdata.length > 0 ? '\nform: '+formdata:'') +'\n\n.');
    GM_xmlhttpRequest({
        method: _method.toUpperCase(),
        url: _url,
        data: formdata,
        // headers: { "Content-Type": "application/x-www-form-urlencoded" },
        onload: dofun,
        onerror: dofail
    });
}
