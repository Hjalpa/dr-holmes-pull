// ==UserScript==
// @name          TagPro Chatbox
// @description   The new and improved chat box is enabled as long as the extension is enabled.
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com* 
// @include       http://*.newcompte.fr* 
// @author        Dr. Holmes
// ==/UserScript==

tagpro.ready(function() {

///////////////////////////////////
//  FILL IN YOU DATA HERE
//////////////////////////////////
//
// Save chatlog every game?

	var saveChatlog = false; //or true
	 
///////////////////////////////////
// END
///////////////////////////////////

	function injectScript(path) {
		var script = document.createElement('script');
		script.setAttribute("type", "application/javascript");
		script.src = path;
		script.onload = removeScript;
		(document.head||document.documentElement).appendChild(script);
	}
	
	injectScript('//code.jquery.com/ui/1.11.3/jquery-ui.js');
	
	var link = document.createElement("link");
	link.href = "//code.jquery.com/ui/1.11.3/themes/smoothness/jquery-ui.css";
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("head")[0].appendChild(link);

	var chatSettings = {
		position: sessionStorage['ChatPosition'],
		size: sessionStorage['ChatSize']
	}
    var $window = $(window),
		$canvas = $('#viewport'),
		$chatContainer = $('<div id="chatContainer"></div>'),
		$chatHistory = $('<div id="chatHistory"></div>'),
		$chat = $('input#chat'),
		$chatlog = $('<div id="downloadChatlog"></div>'),
		chatPos,
		chatSize,
		t = Infinity;
		
    if (chatSettings) {
		chatPos = JSON.parse(chatSettings.position);
		chatSize = JSON.parse(chatSettings.size);
    }
    else {
        var canvasPos = $canvas.offset(),
			canvasHeight = $canvas.get(0).height;
        chatSize = {
            x: 350,
            y: 175
        };
        chatPos = {
            x: (canvasPos.left + 10 + chatSize.x/2) / $window.width(),
            y: (canvasPos.top + canvasHeight - 200 + chatSize.y/2) / $window.height()
        };
    }
	sessionStorage['ChatPosition'] = JSON.stringify(chatPos);
	sessionStorage['ChatSize'] = JSON.stringify(chatSize);
	
    // Redefine Chat
    $('#chatHistory').remove();

    var containerCSS = {
        display: 'block',
        position: 'fixed',
        top: chatPos.y * $window.height() - chatSize.y/2+ 'px',
        left: chatPos.x * $window.width() - chatSize.x/2+ 'px',
        height: chatSize.y + 'px',
        width: chatSize.x + 'px',
        padding: '5px',
        overflow: 'hidden'
    };
    var chatHistoryCSS = {
        display: 'block',
        position: 'static',
        marginLeft: 'auto',
        marginRight: 'auto',
        top: '0',
        left: '0',
        height: '155px',
        width: '100%',
        overflowY: 'auto'
    };
    var chatCSS = {
        display: 'hidden',
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        top: 'auto',
        bottom: '0px',
        left: '0',
        width: '95%'
    };
    var chatlogCSS = {
        display: 'none',
        position: 'absolute',
        width: '16px',
        height: '16px',
        cursor: 'pointer',
        left: '2px',
        bottom: '3px',
        backgroundRepeat: 'no-repeat'
    };
    $chatContainer.css(containerCSS);
    $chatHistory.css(chatHistoryCSS);
    $chat.css(chatCSS);
    $chatlog.css(chatlogCSS);

    $chatContainer
        .append($chatHistory)
        .append($chat)
        .append($chatlog);
    $('#assets').before($chatContainer);
    $chatContainer
        .draggable({
            drag: function(){
                var offset = $chatContainer.offset();
                chatPos = {
                    x: (offset.left + $chatContainer.width()/2) / $window.width(),
                    y: (offset.top + $chatContainer.height()/2) / $window.height()
                };
                sessionStorage['ChatPosition'] = JSON.stringify(chatPos);
            }
        })
        .resizable({
            resize: function(){
                chatSize = {
                    x: $chatContainer.width(),
                    y: $chatContainer.height()
                };
                sessionStorage['ChatSize'] = JSON.stringify(chatSize);
            },
            stop: function(){
                $chatHistory.css('height', $chatContainer.height()-25 +'px');
            },
            create: function(){
                $('.ui-icon-gripsmall-diagonal-se').attr('class', 'ui-resizable-handle ui-resizable-se ui-icon ui-icon-grip-diagonal-se');

                var iconUrl = $('.ui-icon').css('backgroundImage');
                $chatlog.css('backgroundImage', iconUrl).css('backgroundPosition', '-224px -48px');
            }
        });
    $chatlog.click(saveLog);

    // Handle chat functions
    var $messageTemplate = $("<div><span class='auth'>&#10004</span><span class='name' style='cursor: pointer;'></span><span class='message'></span></div>");
    function handleChat(data) {
        var settings = tagpro.settings.ui || { allChat: true, teamChat: true, groupChat: true, systemChat: true };

        if (!settings.allChat && (data.to == "all" && data.from))
            return;

        if (!settings.teamChat && (data.to == "team"))
            return;

        if (!settings.groupChat && (data.to == "group"))
            return;

        if (!settings.systemChat && (data.to == "all" && !data.from))
            return;

        var player = null,
            nameColor = null,
            $message = $messageTemplate.clone();

        if (typeof(data.from) == "number") {
            player = tagpro.players[data.from];
            $message.find('.name').data("player", player);
        }
        else if (typeof(data.from) == "string") {
            player = {name: data.from, auth: false};
        }
        if (!player || !player.auth)
            $message.children(".auth").remove();

        if (player) {
            if (player.team)
                nameColor = player.team == 1 ? "#FFB5BD" : "#CFCFFF";
            else if (data.to == "group")
                nameColor = "#E7E700";
            else if (data.from == "ADMIN_GLOBAL_BROADCAST") {
                nameColor = "#FF0000";
                player.name = "ANNOUNCEMENT";
            }

            $message.children(".name").css({ color: nameColor }).text(player.name);
        }
        else
            $message.children(".name").remove();

        var messageColor = nameColor;

        if (data.to == "all")
            messageColor = data.c || null;

        if (data.to == "group" && !data.from)
            messageColor = "#E7E700";

        var messageHtml;
        if (data.from == null){
            var temp = $('<span class="message"></span>');
            temp.text(data.message);
            messageHtml = temp.html();
            messageHtml = messageHtml.replace('Red team', '<span style="color:#FFB5BD;">Red team</span>');
            messageHtml = messageHtml.replace('Blue team', '<span style="color:#CFCFFF;">Blue team</span>');
        }
        else {
            messageHtml = hyperlink(data.message);
        }
        $chatHistory.fadeIn();
		t = Infinity;
        $message.children(".message").css({ color: messageColor }).html(messageHtml).end();
        if ($chatHistory.is(':hover')){
            $chatHistory.append($message);
            $chatContainer.css('outline', '#ffff00 auto 5px');
        }
        else {
            $chatHistory.append($message).scrollTop($chatHistory.get(0).scrollHeight);
        }
        $chatContainer.css('overflowY', 'hidden');

        hideChatHistory();
    }

    tagpro.socket.on("chat", handleChat);
    if (tagpro.group.socket) tagpro.group.socket.on("chat", handleChat);

    // Click to report
    $chatHistory.on("click", "span", function() {
        var player = $(this).data("player");

        if (!player)
            return;

        tagpro.kick.player(player);
    });

    tagpro.chat.resize = function(){
        $chatContainer.css('top', chatPos.y * $window.height() - chatSize.y/2 + 'px');
        $chatContainer.css('left', chatPos.x * $window.width() - chatSize.x/2 + 'px');
    };

    // Mouseover
    $chatContainer.mouseenter(showChatHistory);
    $chatContainer.mouseleave(hideChatHistory);

    // Color chat box
    var outline = null,
        border = null;
    $(document).keydown(function (e) {
		console.log(e.which);
        var me = tagpro.players[tagpro.playerId];
        var chatToAll = tagpro.keys.chatToAll,
            chatToTeam = tagpro.keys.chatToTeam,
            chatToGroup = tagpro.keys.chatToGroup,
			cancelChat = tagpro.keys.cancelChat,
			sendChat = tagpro.keys.sendChat;
        var isHidden = $chat.is(':hidden'),
            isFocus = $chat.is(':focus');

        if ((outline && border) == null) {
            if (tagpro.disableControls) {
                if (chatToTeam.indexOf(e.which) > -1) {
                    if (me.team == 1) {
                        outline = '#ff0000 auto 5px';
                        border = '1px solid #ff0000';
                    }
                    if (me.team == 2) {
                        outline = '#0000ff auto 5px';
                        border = '1px solid #0000ff';
                    }
                }
                else if (chatToAll.indexOf(e.which) > -1) {
                    outline = '#ffffff auto 5px';
                    border = '1px solid #ffffff';
                }
                else if (chatToGroup.indexOf(e.which) > -1) {
                    outline = '#ffff00 auto 5px';
                    border = '1px solid #ffff00';
                }
				
				if (chatToTeam.indexOf(e.which) + chatToAll.indexOf(e.which) + chatToGroup.indexOf(e.which) > -3){
					$chatHistory.fadeIn();
					t = Infinity;
					$chatContainer.css('overflowY', 'hidden');
				}
            }
        }
		if (cancelChat.indexOf(e.which) + sendChat.indexOf(e.which) > -2){
			if (isHidden){
				hideChatHistory();
			}
		}
        if ((outline && border) != null) {
            if (isFocus) {
                $chat.css('outline', outline);
                $chat.css('border', border);
            }
        }
        if (isHidden) {
            $chat.css('outline', '#ffffff auto 5px');
            $chat.css('border', '1px solid #ffffff');
            outline = null;
            border = null;
        }

    });
	
    // Save Chatlog
    $window.on('beforeunload', function() {
       if (saveChatlog){
           exportChat();
       }
    });

    function showChatHistory() {
		t = Infinity;
        $chatHistory.fadeIn();
        $chatHistory.css('overflowY', 'auto');
        $chatContainer.css('outline', '#cccccc auto 5px');
        $chatContainer.find('.ui-resizable-handle').show();
        $chatlog.show();
    }
    function hideChatHistory() {
        t = new Date().getTime();
		$chatContainer.css('outline', '#cccccc auto 0px');
		$chatHistory.css('overflowY', 'hidden');
		$chatContainer.find('.ui-resizable-handle').hide();
        $chatlog.hide();
	}
	
	hide = setInterval(function () {
		if (new Date().getTime() > t + 10000) {
			$chatHistory.slideUp(function(){//fadeOut(function () {
				$(this).hide();
				$(this).scrollTop($chatHistory.get(0).scrollHeight);
			});
			$chatContainer.find('.ui-resizable-handle').hide();
			$chatlog.hide();
		}
	}, 1000);
    


    function hyperlink(message){
        var temp = message.split(' ');
        var html;
        for (i in temp) {
            if (temp[i].indexOf('://') > -1) {
                temp[i] = '<a href="' + temp[i] + '" target="_blank">' + temp[i] + '</a>';
            }
        }
        html = temp.join(' ');
        return html;
    }

    function saveLog(){
        saveChatlog = true;
        $saveMessage = $('<span style="position:absolute; left:20px; bottom:4px; color:#FFFF00">');
        $saveMessage.text('The chatlog will be saved at the end of the game');
        $chatHistory.append($saveMessage);
        setTimeout(function(){
            $saveMessage.fadeOut(function(){
                $saveMessage.remove();
            });
        },1000);
    }

    function exportChat() {
        var d = new Date();

        window.URL = window.webkitURL || window.URL;
        var blobDiv = $('<div>').html($chatHistory.html());
        var text = '';

        blobDiv.find('span.name').each(function(){
            $(this).text($(this).text()+': ');
        });
        blobDiv.find('div').each(function(){
            text += $(this).text() + '\r\n';
        });
        var bb = new Blob([text], {type: 'text/plain'});

        var event = document.createEvent('MouseEvents')
        event.initEvent('click', true, false);

        var a = document.createElement('a');
        a.download = d.format("yyyy-MM-dd hh.mm.ss") + ' ' + tagpro.host.replace(':', ' ') + ' chatlog.txt';
        a.href = window.URL.createObjectURL(bb);
        a.dispatchEvent(event);
    }

    Date.prototype.format = function(format) {
        var hours = this.getHours();
        var ttime = "AM";

        if (format.indexOf("t") > -1 && hours > 12) {
            hours = hours - 12;
            ttime = "PM";
        }

        var o = {
            "M+": this.getMonth() + 1,
            //month
            "d+": this.getDate(),
            //day
            "h+": hours,
            //hour
            "m+": this.getMinutes(),
            //minute
            "s+": this.getSeconds(),
            //second
            "q+": Math.floor((this.getMonth() + 3) / 3),
            //quarter
            "S": this.getMilliseconds(),
            //millisecond
            "t+": ttime
        };

        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

        for (var k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));

        return format;
    };
});
