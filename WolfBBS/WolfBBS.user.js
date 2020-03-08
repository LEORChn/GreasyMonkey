// ==UserScript==
// @name              狼之乐园辅助
// @namespace         https://greasyfork.org/users/159546
// @version           1.0
// @description       包含功能有：聊天室辅助。
// @author            LEORChn
// @include           *://wolfbbs.net/*
// @run-at            document-start
// @grant             GM_xmlHttpRequest
// @connect           translate.google.cn
// ==/UserScript==
registerPrototype();
var IntervalTimeout = 1000;
function onInterval(){ // daemon
    ChatRoom();
}
var chatwindow = null,
    ID_LEORCHN_WOLFBBS_CHATROOM_CSS = 'leorchn_chatroom_css';
function ChatRoom(){
    var lpn = location.pathname;
    if(lpn.startsWith('/forum.php')){
        var a = $('a[href*="chat.php"]');
        if(!a) return;
        a.onclick = function(){
            if(chatwindow){
                if(!chatwindow.closed && !confirm('您已经打开了一个聊天窗口！\n\n要重新打开吗？')) return false;
                if(!chatwindow.closed) chatwindow.close();
            }
            chatwindow = window.open('/chat.php', '_blank', 'location=no,resizable=no,width=910,height=673,left='+window.screenX+',top='+window.screenY);
            window.cwin = chatwindow;
            return false;
        };
    }else if(lpn.startsWith('/chat.php')){
        if(fv(ID_LEORCHN_WOLFBBS_CHATROOM_CSS)) return;
        var cssdiv = ct('style#'+ID_LEORCHN_WOLFBBS_CHATROOM_CSS);
        var css = 'html body{ width:910px; overflow:hidden; background-position-x:-20px }' +
            'body>.body_wrapper{ padding:0; margin:0 }' +
            'body>.above_body,' +
            '#breadcrumb, form#notices, #pagetitle, #wgo, #footer, .below_body{ display:none }';
        cssdiv.innerText = css;
        document.head.appendChild(cssdiv);
    }
}

(function(){
    setInterval(onInterval, IntervalTimeout);
})();
//----- my ezjs lib
function fv(id){return document.getElementById(id);}
function ft(tag){return document.getElementsByTagName(tag);}
function fc(cname){return document.getElementsByClassName(cname);}
function $(s){return document.querySelector(s);}
function $$(s){return document.querySelectorAll(s);}
function msgbox(msg){alert(msg);}
function inputbox(title,defalt){return prompt(title,defalt);}
function pl(s){console.log(s);}
function ct(tag, t){
	if(arguments.length > 2) pl(new Error('Somewhere might using old version to create Elements. PLEASE UPDATE YOUR CODE.'));
	tag = {
		entity: null,
		raw: tag,
		data: tag.split(/[#\.\s]/g)
	};
	var nextStart = 0;
	tag.data.forEach(function(e){
		nextStart ++;
		if(e.length == 0) return; // continue
		nextStart --;
		switch(tag.raw.charAt(nextStart)){
			case ' ': case '.':
				addClass(tag.entity, e); break;
			case '#':
				tag.entity.id = e; break;
			default:
				tag.entity = document.createElement(e);
				nextStart --;
		}
		nextStart += e.length + 1;
	});
	if(t) tag.entity.innerText = t;
	return tag.entity;
}
function hasClass(e,n){ return new RegExp("(\\s|^)"+n+"(\\s|$)").test(e.className); }
function addClass(e,n){ if(!hasClass(e,n)) e.className=(e.className+' '+n).trim(); }
function registerPrototype(){
    Array.prototype.forEach = function(func){ for(var i=0; i<this.length; i++) try{ if(func(this[i], i, this)) return true; }catch(e){ pl(e); } };
    pl('UserScript is hooked: Array.forEach');
}