// ==UserScript==
// @name              狼之乐园辅助
// @namespace         https://greasyfork.org/users/159546
// @version           1.0.2
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
    if(lpn == '/' || lpn.startsWith('/forum.php')){
        var a = $('#wgo_chat a');
        if(!a) return;
        a.onclick = function(){
            if(chatwindow){
                if(!chatwindow.closed && !confirm('您已经打开了一个聊天窗口！\n\n要重新打开吗？')) return false;
                if(!chatwindow.closed) chatwindow.close();
            }
            chatwindow = window.open('/chat.php', '_blank', 'location=no,resizable=no,width=770,height=530,left='+window.screenX+',top='+window.screenY);
            window.cwin = chatwindow;
            return false;
        };
    }else if(lpn.startsWith('/chat.php')){
        if(fv(ID_LEORCHN_WOLFBBS_CHATROOM_CSS)) return;
        var cssdiv = ct('style#'+ID_LEORCHN_WOLFBBS_CHATROOM_CSS);
        var css = 'html body{ width:100vw; min-width:770px; overflow:hidden; background-position-x:-20px; background:rgb(247,246,228) }' +
            'body>.body_wrapper{ width:100vw; padding:0; margin:0 }' +
            'body>.above_body,' +
            '#breadcrumb, form#notices, #pagetitle, #pfc_minmax, #pfc_title, #wgo, #footer, .below_body{ display:none }' + // 隐藏元素
            'div.body_wrapper>#pfc_container{ position:absolute; top:0; padding:0; z-index:-9 }' + // 外边框：去除padding
            '#pfc_channels_content .pfc_online{ width:170px }' + // 在线列表：最小宽度
            '#pfc_channels_content .pfc_chat{ width:calc(100% - 170px) }' + // 聊天窗：由在线列表减去的宽度
            '#pfc_input_container{ position:relative }' + // 调整输入框及其之后的布局方法
            '#pfc_input_container>table:first-child{ max-width:calc(100% - 175px) }' + // 限制聊天输入框大小
            '#pfc_input_container #pfc_words{ width:calc(100% - 20px); height:100%; padding:0 10px; border-radius:20px }' + // 美化聊天输入框
            '#pfc_input_container>#pfc_cmd_container{ position:absolute; width:170px; height:40px; right:2px; top:0 }' + // 表情等功能按钮设置位置
            '#pfc_input_container #pfc_logo{ position:absolute; bottom:0 }' + // 调整聊天组件（PFC）的LOGO位置
            '#pfc_input_container #pfc_ping{ position:absolute; bottom:0; right:0; margin:0; padding:0 5px; background:rgb(251,244,225) }' + // 调整延迟值显示位置
            '#pfc_content_expandable>#pfc_smileys{ position:absolute; bottom:0px; right:0px; width:166px; padding:0 0 3px; margin-bottom:55px; z-index:99 }' + // 表情选择栏
            "#pfc_smileys:after{ content:' '; position:absolute; display:block; width:10px; height:10px; right:74px; bottom:-5px; transform:rotate(45deg); z-index:-1; background:#fff }"; //
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