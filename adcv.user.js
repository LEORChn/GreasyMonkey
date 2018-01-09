// ==UserScript==
// @name         Android Developer Chinese Version
// @name:zh-CN   Android 开发者镜像站重定向
// @namespace
// @version      1.0
// @description  Android 开发者谷歌官方网站自动跳转到无需穿墙的镜像站。
// @author       LEORChn
// @match        http*://developer.android.com/*
// @match        http*://link.zhihu.com/*
// @match        http*://www.jianshu.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
var hf=location.href;
var reg=hf.split('=http');
var newwindow=false;
(function() {
    //alert('detect: '+hf);//知乎的鼠标事件捕捉不到，但是可以加载一点数据，就用读图模式。简书可以抓鼠标事件，就用光标模式
    if(location.host==='developer.android.com') {//源墙站 自跳转，但无法在未加载的情况下跳转。以抢读模式支持
        jump();
    }else if(reg.length==2){//知乎、 ，以抢读模式支持
        prepare();
    }
    if(location.host==='www.jianshu.com'){//简书 ，以光标模式支持
        window.addEventListener('mousedown', function(e){
            //alert(e);
            hf=e.target.toString();//此处的target并非String对象所以需要toString
            reg=hf.split('=http');//hf被重载，所以reg也要一起重载
            newwindow=true;
            if(hf.startsWith('http'))prepare();
        },true);
    }
})();

function prepare(){
    //alert(hf);
    hf= hf.replace(reg[0]+'=','');
    hf= decodeURIComponent(hf);
    //alert(hf);
    jump();
}

function jump(){
    hf=hf.replace('developer.android.com','developer.android.google.cn');
    //alert('-> '+hf);
    if(newwindow) window.open(hf);
    else location.replace(hf);
}