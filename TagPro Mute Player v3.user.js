// ==UserScript==
// @name          TagPro Mute Player
// @namespace     Dr. Holmes
// @description   Mutes a player when the keyword is typed with the player's name
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com* 
// @include       http://maptest.newcompte.fr* 
// @author        Dr. Holmes
// @version       3.1
// ==/UserScript==

tagpro.ready(function(){
	var players = tagpro.players,
		$input = $('#chat'),
		muteKeyword = 'mute',
		unmuteKeyword = 'unmute',
		chatbox = '',
		playerToMute = '';
		
	
	$(document).keydown(function(e){
		if (e.which == 13){
			if ($input.val().length > 0){
				chatbox = $input.val();
				
				if ((chatbox.indexOf(muteKeyword) + chatbox.indexOf(unmuteKeyword)) > -2){
					playerToMute = searchPlayer(chatbox);
					
					if (playerToMute){
						if (chatbox.indexOf(muteKeyword) > -1){
							players[playerToMute].mute = true;
						} 
						else if (chatbox.indexOf(unmuteKeyword) > -1){
							players[playerToMute].mute = false;
						}
						
						$input.val('');
						var enter = $.Event("keydown", {keyCode: 13});
						$(document).trigger(enter);
					}
				}
			}
		}
	});
	
	function searchPlayer(val){
		var id = false;
		
		val = val.replace(' ','');
		val = val.replace(muteKeyword,'');
		val = val.replace(unmuteKeyword,'');
		
		for (i in players){
			if (players[i].name == val){
				id = players[i].id;
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
	
	tagpro.socket.on('chat',function(message){
		from = message.from;
		
		if (checkIfMuted(from)){
			if (message.from == playerToMute){
				$('#chatHistory div:last-child').remove();
			}
		}
	});
});
