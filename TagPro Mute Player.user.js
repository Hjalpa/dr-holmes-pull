// ==UserScript==
// @name          TagPro Mute Player
// @description   Mute and unmute players.
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com* 
// @include       http://*.newcompte.fr* 
// @author        Dr. Holmes
// ==/UserScript==

tagpro.ready(function(){
	var players = tagpro.players,
		$input = $('#chat'),
		muteKeyword = 'mute',
		unmuteKeyword = 'unmute',
		chatbox = '',
		playerToMute = '';
			
	$($input).keydown(function(e){
		if (e.which == 13){
			if ($input.val().length > 0){
				chatbox = $input.val();
				var chatboxList = [];
				var m = chatbox.split(' ')[0];
				chatboxList.push(m);
				chatboxList.push(chatbox);
				
				if (chatboxList.length == 2){
					if ((chatboxList.indexOf(muteKeyword) + chatboxList.indexOf(unmuteKeyword)) > -2){
						$input.val('');
						playerToMute = searchPlayer(chatbox);
						if (playerToMute){
							if (chatboxList.indexOf(muteKeyword) > -1){
								if (players[playerToMute].mute){
									warningMessage('Player has already been muted.');
								}
								else {
									warningMessage('Player muted.');
								}
								players[playerToMute].mute = true;
							} 
							else if (chatboxList.indexOf(unmuteKeyword) > -1){
								if (!players[playerToMute].mute){
									warningMessage('Player is not muted.');
								}
								else {
									warningMessage('Player unmuted.');
								}
								players[playerToMute].mute = false;
							}
						}
						else {
							warningMessage('Player could not be found.');
						}
					}
				}
			}
		}
	});
	
	function searchPlayer(val){
		var id = false;
		
		val = val.replace(' ','');
		val = val.replace(unmuteKeyword,'');
		val = val.replace(muteKeyword,'');
		
		for (i in players){
			if (players[i].name == val){
				id = players[i].id;
				
				var noMuteKey = true;
				for (key in players[i]){
					if (key == 'mute'){
						noMuteKey = false;
					}
				}
				if (noMuteKey){
					players[i].mute = false;
				}
			}
		}
		return id;
	}
	
	function checkIfMuted(p){
		var mute = false;
		
		for (i in players[p]){
			if (i == 'mute'){
				mute = players[p].mute;
			}
		}
		
		return mute;
	}
	
	function warningMessage(message){
		var $div = $('<div>');
		$div.append('<span class="message"></span>');
		$div.find('span').text(message);

		$("#chatHistory").append($div);
		setTimeout(function(){
			$div.remove();
		},3000);
	}
	
	tagpro.socket.on('chat',function(message){
		from = message.from;
		
		if (checkIfMuted(from)){
			if (message.from == playerToMute){
				$('#chatHistory div:last-child').remove();
			}
		}
	});
});
