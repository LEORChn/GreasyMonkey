// ==UserScript==
// @name              狼之乐园辅助
// @namespace         https://greasyfork.org/users/159546
// @version           1.0.3
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
    ChatWindowWH = [770, 530],
    ID_LEORCHN_WOLFBBS_CHATROOM_CSS = 'leorchn_chatroom_css',
    ID_LEORCHN_WOLFBBS_CHATROOM_CSS_MORE_FUNCTION = 'leorchn_chatroom_css_more_function',
    ID_LEORCHN_WOLFBBS_CHATROOM_MORE_FUNCTION = 'leorchn_chatroom_more_function';
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
            chatwindow = window.open('/chat.php', '_blank', 'location=no,resizable=no,width='+ChatWindowWH[0]+',height='+ChatWindowWH[1]+',left='+window.screenX+',top='+window.screenY);
            window.cwin = chatwindow;
            return false;
        };
    }else if(lpn.startsWith('/chat.php')){
        ChatRoomImpl_injectCss();
        ChatRoomImpl_injectMoreFunction();
    }
}
function ChatRoomImpl_injectCss(){
    if(fv(ID_LEORCHN_WOLFBBS_CHATROOM_CSS)) return;
    var cssdiv = ct('style#'+ID_LEORCHN_WOLFBBS_CHATROOM_CSS),
        css = 'html body{ width:100vw; min-width:770px; overflow:hidden; background-position-x:-20px; background:rgb(247,246,228) }' +
        'body>div.body_wrapper{ width:100vw; padding:0; margin:0 }' +
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
        '#pfc_container #pfc_errors:not(:empty){ position:fixed; left:0; top:0; width:100vw; line-height:100vh; background:rgba(0,0,0,0.5);font-weight:bold; font-style:normal; text-align:center; font-size:24px; z-index:999}' + // 错误信息样式
        "#pfc_errors:after{ content:' '; position:absolute; width:60vw; height:40vh; left:20vw; top:30vh; background:#fec; z-index:-9999 }" + // 错误信息样式：新对话框界面
        '#pfc_content_expandable>#pfc_smileys{ position:absolute; bottom:0px; right:0px; width:166px; padding:0 0 3px; margin-bottom:55px; z-index:99 }' + // 表情选择栏
        "#pfc_smileys:after{ content:' '; position:absolute; display:block; width:10px; height:10px; right:74px; bottom:-5px; transform:rotate(45deg); z-index:-1; background:#fff }"; // 表情选择栏的小箭头
    cssdiv.innerText = css;
    document.head.appendChild(cssdiv);
}
function ChatRoomImpl_injectMoreFunction(){
    var root = fv('pfc_bbcode_container');
    if(fv(ID_LEORCHN_WOLFBBS_CHATROOM_MORE_FUNCTION)) return;
    if(!root) return;
    var divid = '#' + ID_LEORCHN_WOLFBBS_CHATROOM_MORE_FUNCTION,
        cssdiv = ct('style#' + ID_LEORCHN_WOLFBBS_CHATROOM_CSS_MORE_FUNCTION),
        css = divid + '{ position:relative }' + // 按钮样式
        divid + '>div{ position:absolute; bottom:calc(100% + 10px); width:100px; padding:5px; transform:translateX(-25%); background:#fff; border:#000 solid 1px; z-index:99 }' + // 扩展界面样式
        divid + ">div:after{ content:' '; position:absolute; display:block; width:10px; height:10px; left:50%; bottom:-6px; transform:translateX(-50%) rotate(45deg); z-index:-2; background:#fff; border:#000 solid 1px; border-top:none; border-left:none }" + // 扩展界面的对话框小箭头
        divid + ':not(:hover)>div{ display:none }' + // 鼠标离开按钮和扩展界面后，扩展界面消失
        divid + ":hover:after{ content:' '; position:absolute; display:block; width:100%; height:100%; bottom:100% }" + // 在按钮和扩展界面之间搭建一个隐形界面，使用户在将鼠标从按钮移动到扩展界面的过程中，不被判定为“离开按钮和扩展界面”，从而防止扩展界面消失
        divid + ' a{ cursor:pointer }'; // 由于 a标签 没有 href属性 会使用默认指针样式，变为手形
    cssdiv.innerText = css;
    document.head.appendChild(cssdiv);
    var rootbtn = ct('button' + divid, '更多功能'),
        listdiv = ct('div'),
        functions = {
            '复位窗口大小': ChatRoomImpl_resizeWindow
        };
    for(var f in functions){
        var a = ct('a', f),
            fun = functions[f];
        a.onclick = function(){
            fun();
            return false;
        };
        listdiv.appendChild(a);
    }
    rootbtn.appendChild(listdiv);
    root.appendChild(rootbtn);
}
function ChatRoomImpl_resizeWindow( DO_NOT_ADD_PARAM ){
    var windowW = window.outerWidth - window.innerWidth + ChatWindowWH[0],
        windowH = window.outerHeight - window.innerHeight + ChatWindowWH[1];
    window.resizeTo(windowW, windowH);
    if(arguments.length == 0){ // 在200毫秒后重复调用一次，因为如果此前窗口是最大化的，那么边框将会无法正确计算
        setTimeout(function(){
            ChatRoomImpl_resizeWindow(0);
        }, 200);
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