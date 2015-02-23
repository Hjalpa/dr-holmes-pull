// ==UserScript==
// @name          TagPro Player Count
// @description   Shows number of players on each team when someone joins/leaves/switches teams.
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com* 
// @include       http://*.newcompte.fr* 
// @author        Dr. Holmes
// ==/UserScript==

tagpro.ready(function(){
	var $chatHistory = $('#chatHistory');
	setTimeout(function(){
		for (i=1; i<=$chatHistory.find('div').length; i++){
			var $temp = $chatHistory.find(':nth-child('+i+') .message'),
				chatText = $temp.text(),
				myName = tagpro.players[tagpro.playerId].name
			
			if (chatText.indexOf(myName +' has joined the') > -1){
				chatText = chatText.replace('team.', ' team: '+ teamCount());
				$temp.text(chatText);
			}
		}
		
		tagpro.socket.on('chat',function(e){
			setTimeout(function(){
				var message = e.message;
				
				if (message.indexOf("the group") == -1){
					if ((message.indexOf("has switched to the") + message.indexOf("has joined the") + message.indexOf("left the")) > -3){
						var $lastMsg = $('#chatHistory div:last-child');
						
						var lastMsgHTML = $lastMsg.html();
						lastMsgHTML = lastMsgHTML.replace('team.', ' team: '+ teamCount());
						$lastMsg.html(lastMsgHTML);
					}
				}
			},50);
		});
	}, 500);
		
	function teamCount(){
		var ball,
			team,
			red = 0,
			blue = 0;
		
		for (ball in tagpro.players){
			if (tagpro.players[ball].team == 1){
				red += 1;
			}
			else if (tagpro.players[ball].team == 2){
				blue += 1;
				}
		}
		
		team = adjustForTeam(red, blue, team);
		return team;
	}

	function adjustForTeam(red, blue, team){		
		if (tagpro.players[tagpro.playerId].team == 1){
			team = "["+red+" v "+blue+"]";
		} else if (tagpro.players[tagpro.playerId].team == 2){
			team = "["+blue+" v "+red+"]";
		}
		return team;
	}
	
});
