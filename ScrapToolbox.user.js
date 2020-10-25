// ==UserScript==
// @name              ScrapToolbox
// @description       what a scrap!
// @name:zh-CN        乱七八糟工具箱
// @description:zh-CN 这里面有一堆用来兼容旧浏览器的垃圾！包括：大圣盘直链显示、微博新版界面修复、百度知道展开折叠
// @version           1.0.1
// @namespace         https://greasyfork.org/users/159546
// @author            LEORChn
// @include           *://zhidao.baidu.com/*
// @include           *://weibo.com/*
// @include           *://www.dashengpan.com/detail/*
// @require           https://greasyfork.org/scripts/401996-baselib/code/baseLib.js?version=835697
// @run-at            document-body
// @grant             GM_xmlHttpRequest
// @connect           translate.google.cn
// ==/UserScript==
var DEBUG = 1
? 'http://127.0.0.1:81': 'https://leorchn.github.io';
var IntervalTime = 2000;
function onIntervalFunction(){
    zhidao.baidu.com();
    weibo.com();
    www.dashengpan.com();
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
    var eid = 'leorchn_weibo_stylesheet';
    if($('#' + eid)) return;
    appendCSS(DEBUG + '/app/external/weibo.com.css').id = eid;
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
}}};

// ===== =====
setInterval(onIntervalFunction, IntervalTime);

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
