// ==UserScript==
// @name         QuickJump
// @name:zh-CN   快速跳转
// @namespace    https://greasyfork.org/users/159546
// @version      1.0.2
// @description  pointless for english user. this is just source filename
// @description:zh-CN  快速跳转。支持酷安开发者中心快速跳过欢迎界面、CSDN跳转到谷歌缓存、微博自动跳转QQ登录。
// @author       LEORChn
// @include      *://developer.coolapk.com/*
// @include      *://passport.csdn.net/*
// @include      *://blog.csdn.net/*
// @include      *://www.google.com.hk/*
// @include      *://weibo.com/
// @run-at       document-start
// @grant        none
// ==/UserScript==
var inited=false;
(function(){
    recheck();
})();
function recheck(){
    init();
    if(load())return;
    setTimeout(recheck,100);
}
function init(){ // call once when start loading page
    //if(inited) return;
    checkIfCoolApk();
    checkIfCsdn();
    checkIfCsdnBlog();
    checkIfWeibo();
    if(ft('body').length==0) return;
    inited=true;
}
function load(){ // call once when loaded page
    if(document.readyState.toLowerCase()=='complete'){
        checkIfCsdn();// write code here
        checkIfCsdnBlog();
        return true;
    }
}
function checkIfCoolApk(){
    if(location.host=='developer.coolapk.com')
        if(location.pathname=='/')
            location.href='do?c=apk&m=myList';
}
var loadedtogoogle=false;
function checkIfCsdn(){
    var prmName='qcjmp=',
        googleHost='www.google.com.hk';
    if(location.host=='passport.csdn.net' &&
      location.pathname.includes('/login') &&
      location.href.includes('from=')){
        if(loadedtogoogle) return;
        location.href = 'https://'+googleHost+'/?gws_rd=ssl&'+prmName+encodeURI('cache:'+location.href.split('from=')[1]);
        loadedtogoogle = true;
        return;
    }
    if(ft('body').length==0) return;
    if(location.host.includes(googleHost) && location.pathname=='/' ){
        if(location.href.includes(prmName)){
            var evt=new MouseEvent("click",{bubbles:false, cancelable:true, view:window}),
                bar=document.getElementById('lst-ib'),
                btn=document.getElementsByName('btnI')[0];
            if(btn) btn=btn.previousSibling;
            else return;
            bar.value= decodeURI(location.href.split(prmName)[1]);
            bar.select();
            btn.dispatchEvent(evt);
            // 本来这里想做一个自动点击按钮，但是发现在输入后似乎无论怎么样
            //   都要额外点击一次该页面任意位置，或者让标签页获得焦点然后
            //   才能允许此处的脚本自动点击按钮
            // 奇怪的是在测试环境没有跳转，但是实际应用之后却能跳转
        }
    }
}
function openWithoutReferer(url){ // 当前页面打开 URL 而不带 referer
    document.body.appendChild(document.createElement('iframe')).src='javascript:"<script>top.location.replace(\''+url+'\')<\/script>"';
}
function checkIfCsdnBlog(){
    if(location.host=='blog.csdn.net'){
        try{
            fv('article_content').style.height='';
        }catch(e){}
        try{
            fc('hide-article-box')[0].remove();
        }catch(e){}
        try{
            fc('recommend-box')[0].style.cssText='height:200px;overflow:hidden';
        }catch(e){}
    }
}
function checkIfWeibo(){
    if(location.host == 'weibo.com' && location.pathname == '/'){
        try{
            location.href = $('a[href*="passport.weibo.com"][href*="site=qq"]').href;
        }catch(e){}
    }
}
//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag){return document.createElement(tag);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
function $(s){return document.querySelector(s);}
