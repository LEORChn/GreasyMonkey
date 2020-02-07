// ==UserScript==
// @name         Simple Faster Flash
// @name:zh-CN   Flash 简单优化
// @namespace    https://greasyfork.org/users/159546
// @version      1.0.2
// @description  Faster flash from simple way.
// @description:zh-CN 略微提升 Flash 元素的性能。
// @author       LEORChn
// @include      *
// @run-at       document-start
// @grant        none
// ==/UserScript==
var done=0,countdown=10 *5;// 10 sec
(function(){
	recheck();
})();
function recheck(){
    __object();
    __embed();
    addDebugSuit();
    if(pageloaded() && finaly())return;
    setTimeout(recheck,200);
}
function __object(){
    try{
        for(var i=0,v=ft('object'),len=v.length;i<len;i++){
            if(v[i].type.toLowerCase().includes('flash')){
                var qNode;
                for(var i2=0,v2=v[i].childNodes,l2=v2.length;i2<l2;i2++){
                    if(v2[i2].name && v2[i2].name.includes('quality')){//maybe multi object elements nesting. Like news.163.com
                        qNode=v2[i2];
                        break;
                    }
                }
                if(qNode==undefined){
                    qNode=ct('param');
                    qNode.name='quality';
                    v[i].appendChild(qNode);
                }
                if(qNode.value!='low'){
                    qNode.value='low';
                    done++;
                }
            }
        }
    }catch(e){}
}
function __embed(){
    for(var i=0,v=ft('embed'),len=v.length;i<len;i++){
        if(v[i].type.toLowerCase().includes('flash') && !v[i].outerHTML.includes('quality="low"')){
            v[i].outerHTML=v[i].outerHTML.replace('<embed','<embed quality="low"');
            done++;
        }
    }
}
function pageloaded(){ return document.readyState.toLowerCase()=='complete'; }
function finaly(){
    countdown--;//Use count down because some flash element using js to add in page. Like live.bilibili.com...
    if(countdown>0)return false;
    try{pl('Simple Faster Flash: Faster '+done+' flash element(s).');}catch(e){}
    return true;
}
//----- add debug suit
var ID_DIV_DEBUG_SUIT = 'leorchn_lib_debugsuit_block';
function addDebugSuit(){
    if(fv(ID_DIV_DEBUG_SUIT)) return;
    var inject;
    try{
        inject = ft('body')[0];
        inject.tagName; // test the element valid or not
    }catch(e){
        return;
    }
    var suitstr='function fv(id){return document.getElementById(id);}function ft(tag){return document.getElementsByTagName(tag);}function fc(cname){return document.getElementsByClassName(cname);}function ct(tag, t){var d=document.createElement(tag); if(t)d.innerText=t; return d;}function pl(s){console.log(s);}';
    var newdiv = ct('script');
    newdiv.id = ID_DIV_DEBUG_SUIT;
    newdiv.innerHTML = suitstr;
    inject.appendChild(newdiv);
}

//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag){return document.createElement(tag);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}