// ==UserScript==
// @name              ScrapToolbox
// @description       switch to Chinese for details. this might not for English users.
// @name:zh-CN        乱七八糟工具箱
// @description:zh-CN 这里面有一堆用来兼容旧浏览器的垃圾！包括：知乎屏蔽首屏登录、哔哩哔哩修复B博图片显示、Steam显示永久链接、B博图片修复、必应图片详情页修复、必应滚屏BUG修复、V2EX界面修复、推特界面修复、Github新版布局修复、微软待办布局修复、超能搜布局修复、大圣盘直链显示、微博新版界面修复、百度知道展开折叠
// @version           1.0.12
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
// @include           *://link.bilibili.com/ctool/vtuber/*
// @include           *://t.bilibili.com/*
// @include           *://steamcommunity.com/*
// @include           *://twitter.com/*
// @include           *://www.v2ex.com/*
// @include           *://cn.bing.com/*
// @include           *://zhuanlan.zhihu.com/*
// @require           https://greasyfork.org/scripts/401996-baselib/code/baseLib.js?version=835697
// @require-           https://greasyfork.org/scripts/401997-http/code/http.js?version=797848
// @require-           https://127.0.0.1:81/app/external/github.com.js?16
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
    // microsoft
    com.bing.cn();
    com.live.todo();
    com.github();
    // bilibili
    com.bilibili.www();
    com.bilibili.link();
    com.bilibili.t();
    // baidu
    com.baidu.zhidao();
    // sina
    com.weibo();
    // valve
    com.steamcommunity();
    // twitter
    com.twitter();
    // v2ex 寂智信息科技（上海）有限公司
    com.v2ex.www();
    // zhihu 北京智者天下
    com.zhihu.zhuanlan();
    // greasyfork
    org.greasyfork();
    // other
    com.chaonengsou.www();
    com.dashengpan.www();
}
var com = {
    // ========== microsoft ==========
    bing: { cn: function(){
        if(location.hostname != 'cn.bing.com') return;
        (function(){
            if($('head[leorchn_bing_onfocus_scroll_fix]')) return;
            document.head.setAttribute('leorchn_bing_onfocus_scroll_fix', '');
            pl('LEORChn Bing onfocus scroll fix is protecting.'); // 必应的搜索结果页面有时会在从其他页面返回搜索结果页面时执行 scrollTo(0, 0) 暂且不知原因，因此针对这个bug做了个修复
            var memScrollY = 0;
            window.addEventListener('blur', function(){ // 在离开页面时记录纵向滚动位置
                memScrollY = window.scrollY;
            });
            window.addEventListener('focus', function(){ // 在重返页面时的前 0.5 秒内执行 10 次将将页面纵向滚动到离开前位置
                var count = 0;
                setTimeout(onfocusRun, 50);
                function onfocusRun(){
                    window.scrollTo(window.scrollX, memScrollY);
                    count++;
                    if(count > 9) return;
                    setTimeout(onfocusRun, 50);
                };
            });
        })();
        (function(){
            if(unsafeWindow == unsafeWindow.top) return;
            var host = $('#detailMeta:empty');
            if(!host) return;
            var picid = /\/id\/(.*?)(\?|$)/.exec(document.querySelector('img[aria-label]').src)[1];
            console.log(picid);
            for(var i = 0, a = unsafeWindow.top.document.querySelectorAll('a[m]'); i<a.length; i++){
                var thisinf = a[i].getAttribute('m');
                if(!thisinf.includes(picid)) continue;
                var inf = JSON.parse(thisinf);
                var caption = ct('a.ptitle novid', inf.t);
                caption.href = inf.purl;
                caption.setAttribute('target', '_blank');
                var imagemeta = ct('div#imagemeta'),
                    imgurl = ct('a', inf.murl);
                imgurl.href = inf.murl;
                imgurl.setAttribute('target', '_blank');
                imagemeta.appendChildren(
                    ct('a', caption.hostname),
                    ct('span.meta_sp', '|'),
                    imgurl
                );
                host.appendChildren(caption, imagemeta);
                return;
            }
        })();
    }},
    live: { todo: function(){
        if(location.hostname != 'to-do.live.com') return;
        injectCSS('leorchn_microsoft_to_do_stylesheet', 'to-do.live.com.css');
    }},
    github: function(){
        if((location.hostname != 'github.com') && (location.hostname != 'gist.github.com')) return;
        injectInlineCSS('leorchn_github_stylesheet',         'github.com.css' + DBG);
        injectInlineCSS('leorchn_github_fragment',           'github.com.fragment.css' + DBG);
        injectInlineCSS('leorchn_github_profile',            'github.com.profile.css' + DBG);
        injectInlineCSS('leorchn_github_repository',         'github.com.repository.css' + DBG);
        injectInlineCSS('leorchn_github_repository_code',    'github.com.repository.code.css' + DBG);
        injectInlineCSS('leorchn_github_repository_commits', 'github.com.repository.commits.css' + DBG);
    },

    // ========== bilibili ==========
    bilibili: {
        www: function(){
            if(location.hostname != 'www.bilibili.com') return;
            injectCSS('leorchn_bilibili_stylesheet', 'www.bilibili.com.css');
        },
        link: function(){
            if(location.hostname != 'link.bilibili.com') return;
            injectCSS('leorchn_bilibili_stylesheet', 'link.bilibili.com.ctool.vtuber.css');
        },
        t2: false,
        t: function(){
            if(location.hostname != 't.bilibili.com') return;
            injectCSS('leorchn_bilibili_stylesheet', 't.bilibili.com.css');
            if(!_GET('type')) return;
            if(com.bilibili.t2) return;
            com.bilibili.t2 = true;
            var tid = /\d+/.exec(location.pathname)[0];
            http('get https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?rid=' + tid + '&type=2', function(){
                var j = JSON.parse(this.responseText);
                var k = JSON.parse(j.data.card.card);
                k.item.pictures.map(function(e){
                    var img = ct('img');
                    img.src = e.img_src;
                    img.style.cssText = 'max-width:100%';
                    $('.post-content .imagesbox').appendChild(img);
                });
            })
        }
    },

    // ========== baidu ==========
    baidu: { zhidao: function(){
        if(location.hostname != 'zhidao.baidu.com') return;
        arr($$('.answer-dispute-hide')).foreach(function(e){
            e.classList.remove('answer-dispute-hide');
        });
        $('.show-hide-dispute>span').style.display = 'inline-block';
    }},

    // ========== valve ==========
    steamcommunity: function(){
        if(location.hostname != 'steamcommunity.com') return;
        var plink_id = 'leorchn_steam_permalink';
        if($('#' + plink_id)) return;
        if(!/\/(id|profiles)\/[\w\d_-]+\/?$/.test(location.pathname)) return;
        var permalink = ct('input');
        permalink.id = plink_id;
        permalink.value = 'https://steamcommunity.com/profiles/' + g_rgProfileData.steamid;
        permalink.style.cssText = 'position:absolute; right:0; top:20px; direction:rtl;';
        $('.profile_header_badgeinfo_badge_area').appendChild(permalink);
    },

    // ========== twitter ==========
    twitter: function(){
        if(location.hostname != 'twitter.com') return;
        injectInlineCSS('leorchn_twitter_stylesheet', 'twitter.com.css' + DBG);
    },

    // ========== sina ==========
    weibo: function (){
        if(location.hostname != 'weibo.com') return;
        if(injectCSS('leorchn_weibo_stylesheet', 'weibo.com.css')) return;
        appendJS(DEBUG + '/app/external/weibo.com.js');
    },

    // ========== v2ex ==========
    v2ex: { www: function(){
        if(location.hostname != 'www.v2ex.com') return;
        injectCSS('leorchn_v2ex_stylesheet', 'www.v2ex.com.css');
    }},

    // ========== zhihu ==========
    zhihu: { zhuanlan: function(){
        if(location.hostname != 'zhuanlan.zhihu.com') return;
        if(com.zhihu.zhuanlan.blockedFirstLoginPopup) return;
        var loginPopupCloseButton = $('.signFlowModal button.Modal-closeButton');
        if(loginPopupCloseButton){
            loginPopupCloseButton.click();
            com.zhihu.zhuanlan.blockedFirstLoginPopup = true;
        }
    }},

    // ========== other ==========
    dashengpan: { www: function(){
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
    chaonengsou: { www: function(){
        if(location.hostname != 'www.chaonengsou.com') return;
        injectCSS('leorchn_chaonengsou_stylesheet', 'www.chaonengsou.com.css');
    }}
},
org = {
    // ========== greasyfork ==========
    greasyfork: function(){
        if(location.hostname != 'greasyfork.org') return;
        injectCSS('leorchn_greasyfork_stylesheet', 'greasyfork.org.css');
    }
};
// ===== =====
setInterval(onIntervalFunction, IntervalTime);

function $(s){ return document.querySelector(s); }
function pl(s){ console.log(s); }
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
function injectInlineJS(id, jsName){
    if($('#' + id)) return true;
    http2('get', DEBUG + '/app/external/' + jsName, '', function(e){
        var s = ct('script');
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
function http(){
    var args = Array.prototype.slice.call(arguments);
    if(args.length == 1 && args[0] instanceof Array) args = args[0];
    var pointer = 0,
        method, url, headers, formdata, dofun, dofail, onprogress;
    args.forEach(function(e){
        switch(pointer){
            case 0:
                e = e.split(' ', 2); // 允许在第一个参数中用空格将 http-method 与 url 隔开，而省去 引号+逗号+引号 的麻烦
                method = e[0].toUpperCase();
                if(e.length > 1){
                    pointer++; // 偏移到下一个
                    e = e[1];
                }else break;
            case 1: url = e; break;
            case 2:
            case 3:
                if(e instanceof Function){ // 允许不添加 http-body 而直接撰写行为。
                    pointer = 4; // 偏移到function
                }else{
                    if(pointer == 2)
                        headers = e;
                    else if(pointer == 3)
                        formdata = e;
                    break;
                }
            case 4: dofun = e; break;
            case 5: dofail = e; break;
            case 6: onprogress = e;
        }
        pointer++;
    });
    var x = new XMLHttpRequest()
    if(location.protocol.includes('https')) url = url.replace('^http:', 'https:');
    x.open(method, url, true);
    x.timeout = 60000;
    x.responseType = "text"; // IE要求先open才能设置timeout和responseType
    x.onload = dofun;
    x.ontimeout = x.onerror = dofail? dofail: null;
    x.onprogress = onprogress;
    if(formdata) x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    else formdata = '';
    var headersobj = getHeaders(headers);
    for(var hobj in headersobj) x.setRequestHeader(hobj, headersobj[hobj]);
    x.send(formdata);
}
function getHeaders(t){
    var obj = {};
    if(!t) return obj;
    t.split('\n').forEach(function(e){
        var res, reg = /\s*(\S+)\s*:\s*(.*)/;
        if((res = reg.exec(e)) == null) return;
        obj[res[1]] = res[2];
    });
    return obj;
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
