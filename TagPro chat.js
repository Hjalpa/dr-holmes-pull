tagpro.ready(function() {

    var chatState = false,
        sendChatToTeam = false,
        sendChatToGroup = false,
        $chatHistory = $("div#chatHistory"),
        $chatInput = $("input#chat"),
        $canvas = $("canvas"),
        canvasPos = $canvas.offset(),
        canvasHeight = $canvas.get(0).height,
        socket = tagpro.socket,
        chatSave = "";

    $(document).keydown(function(e) {
        var chatToTeam = tagpro.keys.chatToTeam.indexOf(e.keyCode) != -1;
        var chatToGroup = (tagpro.keys.chatToGroup.indexOf(e.keyCode) != -1 && tagpro.group.socket);
        var chatToAll = tagpro.keys.chatToAll.indexOf(e.keyCode) != -1;

        if ( ( chatToTeam || chatToGroup || chatToAll ) && !chatState) {
            if ($("#name").is(":focus")) return;
            getChatInput(chatToTeam, chatToGroup);
            e.preventDefault();
        }
        else if (tagpro.keys.sendChat.indexOf(e.keyCode) != -1 && chatState){
            sendChat();
	} else {
		chatSave = $chatInput.val();
		console.log(chatSave);
	}
    });

    var $messageTemplate = $("<div><span class='auth'>&#10004</span><span class='name'></span><span class='message'></span></div>");

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
            $message.data("player", player);
        }
        else if (typeof(data.from) == "string")
            player = { name: data.from, auth: false };

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

        $message.children(".message").css({ color: messageColor }).text(data.message).end();
        $chatHistory.append($message).scrollTop($chatHistory.get(0).scrollHeight);

        setTimeout(function() {
            $message.slideUp(function() {
                $message.remove();
            });
        }, 20000);
    }

    socket.on("chat", handleChat);

    if (tagpro.group.socket)
        tagpro.group.socket.on("chat", handleChat);

    function getChatInput(toTeam, toGroup) {
        chatState = true;
        tagpro.disableControls = true;
        sendChatToTeam = toTeam;
        sendChatToGroup = toGroup;
	
	console.log(chatSave);
        $chatInput
            .val(chatSave)
            .show()
            .focus();
    }

    function sendChat() {
		chatSave = "";
		
        if (chat.length > 70 || chat == "") {
            cancelChat();
            return;
        }

        if (sendChatToGroup) {
            if (tagpro.group.socket) {
                tagpro.group.socket.emit("chat", chat);
            }
        } else {
            socket.emit("chat", {
                toAll: !sendChatToTeam,
                message: chat
            });
        }

        cancelChat();
    };

    function cancelChat() {
        chatState = false;
        tagpro.disableControls = false;
        $chatInput.hide();
    };

    $chatInput.keydown(function(e) {
        if ([37, 38, 39, 40].indexOf(e.keyCode) >= 0) {
            e.preventDefault();
        }

        if (tagpro.keys.cancelChat.indexOf(e.keyCode) > -1) {
            cancelChat();
        }
    });

    tagpro.chat.resize = function() {
        canvasPos = $canvas.offset();
        canvasHeight = $canvas.get(0).height;

        $chatInput.css({
            left: canvasPos.left + 10,
            top: canvasPos.top + canvasHeight - 40
        });

        $chatHistory.css({
            left: canvasPos.left + 10,
            top: canvasPos.top + canvasHeight - $chatHistory.outerHeight() - 50
        });
    };

    $chatHistory.on("click", "div", function() {
        var player = $(this).data("player");

        if (!player)
            return;

        tagpro.kick.player(player);
    });
});
