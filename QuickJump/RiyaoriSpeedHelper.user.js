// ==UserScript==
// @name         Riyaori Speed Helper
// @name:zh-CN   日曜日辅助
// @namespace    https://greasyfork.org/users/159546
// @version      1.0
// @description  Quicker jump.
// @description:zh-CN 快速方便地从日曜日跳转到度盘。
// @author       LEORChn
// @include      /.{3,7}:\/\/riyaori.com\/archives\/\s*/
// @include      *://pan.baidu.com/share/init?surl=*
// @include      *://pan.baidu.com/s/*
// @run-at       document-start
// @grant        none
// ==/UserScript==
var inited=false;
var pwd='';
(function(){
    recheck();
})();
function recheck(){
    init();
    if(load())return;
    setTimeout(recheck,100);
}
function init(){ // call once when start loading page
    if(inited) return;
    if(ft('body').length==0) return;
    try{
        var isPwd=window.name;
        isPwd=eval('('+isPwd+')')[0];
        if(isPwd.length==4 && /[0-9a-zA-Z]{4}/.test(isPwd)){
            pwd=isPwd;
            window.name='';
        }
    }catch(e){}

    inited=true;
    if(addbox())return;
    paste();
    if(clickSave())return;
    inited=false;
}
function load(){ // call once when loaded page
    if(document.readyState.toLowerCase()=='complete'){
        setTimeout(init,1000);// write code here
        return true;
    }
}
var located=false;
var pwdbox, urlbox;
function addbox(){ // 在日曜日的单资源页面添加两个输入框分别取出度盘网址和密码
    var root=fc('entry-content');
    if(root.length>0){
        root=root[0];
        var loc=/pan\.baidu\.com\/s\/[0-9A-Za-z_-]{7,}/.exec(root.innerText)[0];
        //loc=loc[0].replace(/com\/s\/.{1}/,'com/share/init?surl=');
        var d=urlbox=ct('input'),c=pwdbox=ct('input');
        d.style.width=c.style.width='100%';
        d.value='https://'+loc;
        d.title=d.value;
        //d.ondragend=function(){if(located)return; located=true; openWithOutReferer(d.title); }
        d.onmousemove=function(){ this.select(); }
        d.onmousedown=function(){
            checkPwd();
            openWithOutReferer(this.title);
        }
        root.appendChild(d);
        var origin=(root.innerText.replace(/\n/g,' '));
        //pl('pwd checker area: '+origin);
        var linkTail=loc.substr(loc.length-5);
        //pl('link tail: '+linkTail);
        var reg=new RegExp(linkTail+'.{1,7}([0-9a-zA-Z]{4})');

        var rex=reg.exec(origin);
        //pl('full check: '+rex[0]);
        c.value=rex[1];
        root.appendChild(c);
        return true;
    }
    return false;
}
function checkPwd(){ // 把密码输入到跨站标记，使它在跳转到度盘之后仍然记忆密码
    //if(located)return;
    if(pwdbox.value.length != 4)return;
    if(/[0-9A-Za-z]{4}/.test(pwdbox.value)){
        located=true;
        window.name='["'+pwdbox.value+'"]';
    }
}
function openWithOutReferer(url){ // 当前页面打开 URL 而不带 referer
    document.body.appendChild(document.createElement('iframe')).src='javascript:"<script>top.location.replace(\''+url+'\')<\/script>"';
}
function paste(){ // 将密码从跨站标记中取出，以及自动点击确认密码按钮
    var root=fc('pickpw');
    if(root.length>0){
        root=root[0].getElementsByTagName('input')[0];
        root.onchange=function(){
            if(this.value.length==4 && /[0-9A-Za-z]{4}/.test(this.value)){
                var btn=this.parentNode.getElementsByClassName('g-button')[0];
                btn.click();
            }
        }
        if(pwd.length==4){
            root.value=pwd;
            root.onchange();
            setTimeout(root.onchange,5000);
            setTimeout(root.onchange,10000);
        }
        return true;
    }
    return false;
}

function clickSave(){ // 自动点击保存到我的网盘按钮
    var root=fc('g-button-blue');
    if(root.length>0){
        root=root[0];
        if(root.innerText.includes('保存')){
            saveBtn=root;
            setTimeout(clickSaveButton,1000);
            setTimeout(checkRecentPath,2000);
            return true;
        }
    }
    return false;
}
var saveBtn;
function clickSaveButton(){ // 自动点击保存按钮，该方法被延时1秒
    saveBtn.click();
}
function checkRecentPath(){ // 自动点击保存到最近路径，该方法在自动点击保存按钮的方法后延迟1秒
    try{
        fc('save-path-item')[0].click();
    }catch(e){}
}

//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag){return document.createElement(tag);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}