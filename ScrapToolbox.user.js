// ==UserScript==
// @name              ScrapToolbox
// @description       what a scrap!
// @name:zh-CN        乱七八糟工具箱
// @description:zh-CN 这里面有一堆用来兼容旧浏览器的垃圾！包括：百度知道展开折叠
// @version           1.0
// @namespace         https://greasyfork.org/users/159546
// @author            LEORChn
// @include           *
// @require           https://greasyfork.org/scripts/401996-baselib/code/baseLib.js?version=835697
// @run-at            document-body
// @grant             GM_xmlHttpRequest
// @connect           translate.google.cn
// ==/UserScript==
var IntervalTime = 2000;
function onIntervalFunction(){
    zhidao_baidu_com();
}
function zhidao_baidu_com(){
    if(location.hostname != 'zhidao.baidu.com') return;
    arr($$('.answer-dispute-hide')).foreach(function(e){
        e.classList.remove('answer-dispute-hide');
    });
    $('.show-hide-dispute>span').style.display = 'inline-block';
}



// ===== =====
setInterval(onIntervalFunction, IntervalTime);
