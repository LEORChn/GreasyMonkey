// ==UserScript==
// @name         我的推特工具箱
// @namespace    https://greasyfork.org/users/159546
// @version      1.0.1
// @description  隐藏转推和视频兼容修复。
// @author       LEORChn
// @include      *://twitter.com/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      download-twitter-videos.com
// ==/UserScript==

(function(){
    setInterval(onIntervalFunction, 2000);
})();
function onIntervalFunction(){
    doAddEntry();
    doHideRetweet();
    doAddVideoEntry();
}

var ID_HIDE_RETWEET_ENTRY = 'leorchn_action_hide_retweet',
    HIDE_RETWEET_ENABLED = false;
function doAddEntry(){
    if(fv(ID_HIDE_RETWEET_ENTRY)) return;
    var bar = $('.ProfileHeading-toggle');
    if(!bar) return;
    var li = ct('li'), a = ct('a', '隐藏转推');
    li.id = ID_HIDE_RETWEET_ENTRY;
    li.className='ProfileHeading-toggleItem  u-textUserColor';
    a.className='ProfileHeading-toggleLink js-nav';
    a.onclick=function(){
        this.parentNode.className='ProfileHeading-toggleItem  is-active';
        this.outerHTML=this.innerText;
        HIDE_RETWEET_ENABLED = true;
    };
    li.appendChild(a);
    bar.appendChild(li);
}
function doHideRetweet(){
    if( ! HIDE_RETWEET_ENABLED ) return;
    try{
        var retweets = fc('js-retweet-text');
        while(retweets.length > 0)retweets[0].parentNode.parentNode.parentNode.parentNode.remove();
    }catch(e){
        pl(e);
    }
}
//-----
function doAddVideoEntry(){
    var r=$('.PlayableMedia--video:only-child');
    if(!r) return; else r=r.parentNode;
    var v=ct('video'),
        a=ct('a', '视频无法播放？点此解决');
    v.style.cssText='position:absolute; width:100%; height:100%; top:0; display:none';
    r.appendChild(v);
    r.appendChild(a);
    a.onclick=function(){
        v.style.display='';
        var curTweet, curNode = this;
        while(!curNode.hasAttribute('data-permalink-path') && curNode != document.body) curNode = curNode.parentNode;
        if(curNode == document.body) return;
        curTweet = encodeURIComponent('https://twitter.com/'+curNode.getAttribute('data-permalink-path'));
        http2('post', 'https://download-twitter-videos.com/zh/core/ajax.php', 'host=twitter&url='+curTweet, function(){
            var res=this.responseText,
                reg=new RegExp('http[^>]*\\.mp4[0-9a-zA-Z\?=%]{0,}','g'),
                rsl=reg.exec(res);
            pl(res); pl(rsl);
            v.autoplay = v.loop = v.controls = true;
            v.src = rsl[0];
        });
    }
    v.onplay = function(){
        if(a) a.remove();
    }
    v.onclick = function(){
        if(v.duration == 0) return;
        if(v.paused) v.play(); else v.pause();
    }
}

//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag, t){var d=document.createElement(tag); if(t)d.innerText=t; return d;}
function $(s){return document.querySelector(s);}
function $$(s){return document.querySelectorAll(s);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
function http(method,url,formed,dofun,dofail){
	var x = new XMLHttpRequest();
	if(location.protocol.includes('https')) url=url.replace('^http:','https:');
	x.open(method.toUpperCase(),url,true);
	x.timeout=60000;
	x.responseType="text"; // IE要求先open才能设置timeout和responseType
	x.onload=dofun;
	x.ontimeout=x.onerror= dofail? dofail: null;
	x.send(formed?formed:'');
}
function getHeaders(){
    return {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', // 如果没有这个，就会默认是 text/plain 并导致错误
        cookie: '__cfduid=d507d0eb58ae7839d11def0ca83e943631553697169',
        referer: 'https://download-twitter-videos.com/'
    };
}
function http2(_method,_url,formdata,dofun,dofail){
    pl('request cross-site http: '+_method+'\nurl: '+_url+'\nform: '+formdata);
    GM_xmlhttpRequest({
        method: _method.toUpperCase(),
        url: _url,
        data: formdata,
        headers: getHeaders(),
        onload: dofun,
        onerror: dofail
    });
}
function mkformdata(arr){
    var f = new FormData();
    for(var i in arr){
        var s = arr[i].split('=');
        pl(s);
        f.append(s[0], decodeURIComponent(s[1]));
    }
    return f;
}
