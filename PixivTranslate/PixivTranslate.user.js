// ==UserScript==
// @name         Pixiv 辅助翻译
// @namespace    https://greasyfork.org/users/159546
// @version      1.0.2
// @description  目前只有标签翻译这样。以及作品详情页对标题和说明使用的谷歌翻译
// @author       LEORChn
// @include      *://www.pixiv.net/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// ==/UserScript==
var tag_trans=[
    '漫画','漫画',
    'うごイラ','动图',
    '厚塗り','多层上色',
    'UTAU獣人','兽人虚拟歌手',
    '狼音アロ','狼音阿罗',
    'ケモノ','野兽',
    'wolf','狼',
    'kemono','毛怪',
    'furry','兽人',
    '獣人','兽人', // 这个是日文的
    '獸人','兽人', // 这个是繁体的
    'オスケモ','雄兽',
    'デブケモ','胖兽',
    'ケモホモ','兽人同性向',
    'ケモ交尾','兽性',
    '東京放課後サモナーズ','东京放课后召唤师',
    '放サモ','东放',
    'housamo','东放',
    'モリタカ','犬塚戍孝',
    '犬塚モリタカ','犬塚戍孝',
    'ホロケウカムイ','狼神神威', //ID为 20880639 的作者似乎打错了这个标签所以替换不到
    'テムジン','铁木真',
    'ガルム','加姆',
    'ノーマッド(放サモ)','诺曼德（东放）', // 东京放课后里的虎兽人所用的化名
    '主5','5号主人公（东放）',
    'ふんどし','兜裆布',
    '褌','兜裆布',
    '腹筋','腹肌',
    'ㄋㄟㄋㄟ','胸部',
    '金的','捣蛋',
    '猿轡','封口',
    '拘束','捆绑Play'
];
(function(){
    recheck();
})();
function recheck(){
    init();
    if(load())return;
    setTimeout(recheck,100);
}
function init(){ // call once when start loading page
    if(ft('body').length==0) return;
    main_do();
    //inited=true; //
}
function load(){ // call once when loaded page
    if(document.readyState.toLowerCase()=='complete'){
        main_do();// write code here
        return true;
    }
}
function main_do(){
    tagTranslate_illust(); // 个人空间的作品列表页面的标签
    tagTranslate_illust_single(); // 作品页面的标签
    tagTranslate_bookmark(); // 个人空间的收藏列表页面的标签
    tagTranslate_addBookmark(); // 添加收藏时的可选择标签
    tagTranslate_member_tag_all();
    detailTranslate_illust();
}
// ----- （接近全站的）标签分界线
function tagTranslate_illust_single(){
    if(location.pathname != '/member_illust.php')return;
    var tags=ft('footer');
    if(tags.length==0)return;
    tags=tags[0].childNodes[0].childNodes;
    for(var li=0;li<tags.length;li++){
        var c=tags[li].childNodes,
            tt=tagDict(c[0].innerText);
        tags[li].style.display='inline-block';
        if(tt){
            c[0].childNodes[0].innerText=tt;
            if(c.length>1) c[1].remove();
        }
    }
}
function tagTranslate_illust(){
    if(location.pathname != '/member_illust.php')return;
    tagTranslate_mode_tagCloud();
}
function tagTranslate_bookmark(){
    if(location.pathname != '/bookmark.php')return;
    tagTranslate_mode_tagCloud();
}
function tagTranslate_member_tag_all(){
    if(location.pathname != '/member_tag_all.php')return;
    tagTranslate_mode_tagCloud();
    var tags=fc('tag-list');
    if(tags.length==0)return;
    tags=tags[0].getElementsByTagName('dd');
    for(var dd=0;dd<tags.length;dd++){
        var c=tags[dd].childNodes[0].childNodes;
        for(var li=0;li<c.length;li++){
            var tt=tagDict(c[li].innerText);
            if(tt){
                var atag= c[li].getElementsByTagName('a')[0];
                atag.innerText=tt;
                atag.style.backgroundColor='#ffd040';
            }
        }
    }
}
function tagTranslate_mode_tagCloud(){
    var tags=fc('tagCloud');
    if(tags.length==0)return;
    tags=tags[0].childNodes;
    for(var li=0;li<tags.length;li++){
        try{
            if(tags[li].className.includes('level0')) continue;
        }catch(e){ continue; }
        tags[li].style.display='inline-block';
        var c=tags[li].childNodes[0].childNodes,
            tt=tagDict(c[0].nodeValue);
        if(tt) c[0].nodeValue=tt;
    }
}
function tagTranslate_addBookmark(){
    if(location.pathname != '/bookmark_add.php')return;
    var tags=fc('tag-cloud');
    if(tags.length==0)return;
    for(var g=0,gt=tags;g<gt.length;g++){
        tags=gt[g].childNodes;
        for(var li=0;li<tags.length;li++){
            try{ // 作品自带标签的列表中，“原创”后面竟然跟一个空白的元素不知道为啥
                var c=tags[li].childNodes[0].childNodes,
                    cl=c.length-1,
                    tt=tagDict(c[cl].nodeValue);
                if(tt) c[cl].nodeValue=tt;
            }catch(e){}
        }
    }
}
function tagDict(origin){
    for(var i=0;i<tag_trans.length;i+=2)
        if(origin==tag_trans[i])
            return tag_trans[i+1];
}
// ----- 作品页标题和说明分界线
function detailTranslate_illust(){
    if(location.pathname != '/member_illust.php')return;
    if(!location.href.includes('mode=medium'))return;
    var tags=ft('footer');
    if(tags.length==0 || fv('icon_google_translate'))return;
    tags=tags[0].parentNode;
    var img=ct('img');
    img.id='icon_google_translate';
    img.src='https://translate.google.cn/favicon.ico';
    img.style.cssText='width:24px;float:right';
    tags.childNodes[0].appendChild(img);
    img.onclick=function(){}
    trans_launcher=img;
    if(!stat_title) trans_title();
    if(!stat_desc) trans_desc();
}
var trans_launcher;
var stat_title,
    stat_desc;
function trans_title(){
    stat_title=true;
    var p=trans_launcher.parentNode;
    googleTranslate(p.innerText,
      function(r){
        if(!r.responseText || r.responseText.length<20){
            stat_title=false;
            trans_title();
            return;
        }
        trans_launcher.parentNode.appendChild(
            trans_create_block(r.responseText)
        );
      }
    );
}
function trans_desc(){
    stat_desc=true;
    var p=trans_launcher.parentNode.parentNode.childNodes[1];
    googleTranslate(p.innerText,
      function(r){
        if(!r.responseText || r.responseText.length<20){
            stat_desc=false;
            trans_desc();
            return;
        }
        trans_launcher.parentNode.parentNode.childNodes[1].appendChild(
            trans_create_block(r.responseText)
        );
      }
    );
}
function trans_create_block(oriText){
    var n=ct('p');
    n.innerText=googleTranslate_get(oriText);
    n.style.backgroundColor='#d0ffd0';
    return n;
}
//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function ct(tag){return document.createElement(tag);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
function googleTranslate_get(origin){
    return new RegExp('<div\\s.{0,15}class=\\"t0\\".{0,15}>(.*)<\\/div><f').exec(origin)[1];
}
function googleTranslate(word,dofun,dofail){
    http('get','https://translate.google.cn/m?hl=zh-CN&sl=auto&tl=zh-CN&ie=UTF-8&prev=_m&q='+encodeURI(word),'',dofun,dofail);
}
function http(_method,_url,formdata,dofun,dofail){
    GM_xmlhttpRequest({
        method: _method.toUpperCase(),
        url: _url,
        data: formdata,
        headers:{},
        onload: dofun,
        onerror: dofail
    });
}
