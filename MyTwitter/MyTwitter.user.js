// ==UserScript==
// @name         我的推特工具箱
// @namespace    https://greasyfork.org/users/159546
// @version      1.0.2
// @description  视频兼容修复。
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
    //doHideRetweet(); // deprecated
    doAddVideoEntry();
    adaptDoublePhotoHeight();
    doFixImageView();
}

var ID_HIDE_RETWEET_ENTRY = 'leorchn_action_hide_retweet',
    HIDE_RETWEET_ENABLED = false,
    HIDE_RETWEET_ENABLED_V2019 = false;
function doAddEntry(){
    if(fv(ID_HIDE_RETWEET_ENTRY)) return;
    var bar = $('.ProfileHeading-toggle');
    var li = ct('li'), a = ct('a', '隐藏转推');
    if(bar){ // 新布局，登录后强制启用的那种（不知道怎么返回旧布局，新布局真的用着太难过了）
        li.className='ProfileHeading-toggleItem  u-textUserColor';
        a.className='ProfileHeading-toggleLink js-nav';
        a.onclick=function(){
            this.parentNode.className='ProfileHeading-toggleItem  is-active';
            this.outerHTML=this.innerText;
            HIDE_RETWEET_ENABLED = true;
        };
        li.appendChild(a);
    }else{ // 旧布局
        bar = $('[aria-hidden]+div[role=tablist]');
        if(!bar) return; // 真的不知道是什么布局了，return
        li = bar.lastElementChild.cloneNode(true);
        a = li.lastElementChild;
        a.removeAttribute('href');
        a.onclick=function(){
            this.lastElementChild.style.color = 'rgb(29, 161, 242)';
            HIDE_RETWEET_ENABLED = HIDE_RETWEET_ENABLED_V2019 = true;
        };
        var span = li;
        while(span.lastElementChild != null) span = span.lastElementChild;
        span.innerText = '隐藏转推';
    }
    li.id = ID_HIDE_RETWEET_ENTRY;

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
    if( ! HIDE_RETWEET_ENABLED_V2019) return;
    var retweets19 = $$('article');
    try{
        for(var i=retweets19.length-1; i>=0; i--)
            if(retweets19[i].childElementCount > 1 && retweets19[i].firstElementChild.innerText.includes('转推了')){
                retweets19[i].lastElementChild.remove(); //retweets19[i].parentNode.parentNode.parentNode.remove();
                var root = retweets19[i].parentNode.parentNode.parentNode;
                root.appendChild(retweets19[i]);
                root.firstElementChild.remove();
                retweets19[i].outerHTML = '隐藏了一条转推。';
            }
    }catch(e){
        pl(e);
        pl(retweets19);
    }
}
//-----
function doAddVideoEntry(){
    var idvt='LEORCHN_VIDEOPLAY_TRIGGER';
    var r=$('.PlayableMedia--video:only-child'),
        v=ct('video'),
        a=ct('a', '视频无法播放？点此解决');
    if(fv(idvt)) return;
    if(!r){
        r = $('video');
        if(!r) return;
        var rootPadding = r.parentElement,
            videoSlot, videoSlotPadding, videoHolderRoot;
        videoSlot = videoSlotPadding = videoHolderRoot = null;
        while(rootPadding.children.length <= 3){
            videoHolderRoot = videoSlotPadding;
            videoSlotPadding = videoSlot;
            videoSlot = rootPadding;
            rootPadding = rootPadding.parentElement;
        }
        v.id=idvt;
        v.setAttribute('blur', 'v2');
        a.setAttribute('data-permalink-path', location.pathname.substr(1)); // 适配旧版代码
        r=videoSlotPadding;//.appendChild(a); // 适配旧版代码
    }else{
        r=r.parentNode;
    }
    a.style.color = 'rgb(27, 149, 224)';
    v.style.cssText='position:absolute; width:100%; height:100%; top:0; display:none';
    r.appendChild(v);
    r.appendChild(a);
    a.onclick=function(){
        if(v.getAttribute('blur') == 'v2')
            v.parentElement.children[0].style.cssText = '-webkit-filter:blur(20px); filter:blur(20px)';
        v.style.display='';
        var curTweet, curNode = this;
        while(!curNode.hasAttribute('data-permalink-path') && curNode != document.body) curNode = curNode.parentNode;
        if(curNode == document.body) return;
        curTweet = encodeURIComponent('https://twitter.com/'+curNode.getAttribute('data-permalink-path'));
        /*	- more tools:
            https://download-twitter-videos.com/
            https://mydowndown.com/twitter
        */
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
    v.onclick = function(e){
        if(v.duration == 0) return;
        if(v.paused) v.play(); else v.pause();
        e.stopPropagation();
    }
}
//-----
function adaptDoublePhotoHeight(){
    var a = $('.permalink-container .AdaptiveMedia');
    if(a) a.style.maxHeight = '500%'; // 重置设置，突破界限

    a = $$('.permalink-container .AdaptiveMedia-doublePhoto');
    for(var i=0;i<a.length;i++){
        a[i].style.lineHeight = 0; // 修改后的双图底部会多出一点点边框很难看
        a[i].style.height = '100%'; // 重置掉原先固定的大小
    }
    a = $$('.permalink-container .AdaptiveMedia-doublePhoto img');
    for(var b=0;b<a.length;b++){
        a[b].style.top = a[b].style.left = 0; // 重置
        a[b].style.height = ''; // 重置固定高度
        a[b].style.position = 'static'; // 确保图片保持在边框里面
        a[b].style.maxWidth = '100%'; // 限制双图宽度（横向扩展度）
    }
}

function doFixImageView(){
    var t = $$('div[aria-label=上一个]');
    if(t.lengh == 0) return;
    for(var i=0; i<t.length; i++){
        t[i].parentElement.style.position = 'static';
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
