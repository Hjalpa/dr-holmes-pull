// ==UserScript==
// @name          TagPro Smart Macros
// @description   Adds special commands to chat.
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com* 
// @include       http://*.newcompte.fr* 
// @author        Dr. Holmes
// ==/UserScript==

tagpro.ready(function(){
	var emitOriginal = tagpro.socket.emit;
	
	tagpro.socket.emit = function(t,n){
		if (t == 'chat'){
			var message = n.message;
			var smartWords = {
				1: {key:'{my.pups}',func:myPups},
				2: {key:'{view.opp}',func:viewOpp},
				3: {key:'{opp.pups}',func:oppPups},
				4: {key:'{s',func:seconds},
				5: {key:'{my.location',func:myLocation},
				6: {key:'{ping}',func:ping}
				};
			
			for (word in smartWords){
				if (message.indexOf(smartWords[word].key)>-1){
					message = smartWords[word].func(message);
				}
			}
			var newChat = {message: message, toAll:n.toAll}
			emitOriginal('chat',newChat);
		}
		else {
			emitOriginal(t,n);
		}
	}
	
	function myPups(message){
		var me = tagpro.players[tagpro.playerId];
		var pups = [];
		if (me.tagpro){
			pups.push('tagpro');
		};
		if (me.bomb){
			pups.push('rolling bomb');
		};
		if (me.grip){
			pups.push('juke juice');
		}
		
		if (pups.length < 3 && pups.length > 0){
			pups = pups.join(' and ');
		} 
		else if (pups.length == 0){
			pups = 'no powerups';
		}
		else {
			pups = pups[0]+', '+pups[1]+' and '+pups[2];
		}
			
		return message.replace('{my.pups}',pups);
	}
	
	function viewOpp(message){
		var me = tagpro.players[tagpro.playerId];
		var enemy = 1;
		if (me.team == 1){
			enemy = 2;
		};
		var numOpp = 0;
		for (player in tagpro.players){
			if (tagpro.players[player].team == enemy){
				if (tagpro.players[player].draw){
					numOpp++;
				}
			}
		}
		return message.replace('{view.opp}',numOpp);
	}
		
	function oppPups(message){
		var me = tagpro.players[tagpro.playerId];
		var enemy = 1;
		if (me.team == 1){
			enemy = 2;
		};
		var tagpros = 0,
			bombs = 0,
			grips = 0;
			
		for (player in tagpro.players){
			var enemyPlayer = tagpro.players[player];
			if (enemyPlayer.team == enemy){
				if (enemyPlayer.draw == true){
					var enemyPlayer = tagpro.players[player]
					if (enemyPlayer.tagpro){
						tagpros++;
					};
					if (enemyPlayer.bomb){
						bombs++;
					};
					if (enemyPlayer.grip){
						grips++;
					};
				}
			}
		}
		
		var tagproString = tagpros+' tagpro',
			bombString = bombs+' rolling bomb',
			gripString = grips+' juke juice';
		var oppPups = [];
			
		if (tagpros > 1){tagproString = tagproString.replace('tagpro','tagpros')};
		if (bombs > 1){bombString = bombString.replace('bomb','bombs')};
		if (grips > 1){gripString = gripString.replace('grip','grips')};
		
		if (tagpros > 0){
			oppPups.push(tagproString);
		};
		if (bombs > 0){
			oppPups.push(bombString);
		};
		if (grips > 0){
			oppPups.push(gripString);
		};
		
		if (tagpros + bombs + grips > 0){
			oppPups = oppPups.join(', ');
		}
		else {oppPups = 'no powerups';}
		
		return message.replace('{opp.pups}',oppPups);
	}
	
	function seconds(message){
		var currentSeconds = 0,
			messageList = message.split(' ');
		
		for (i=0;i<messageList.length;i++){
			if (messageList[i].indexOf('{s')>-1){
				messageList[i] = messageList[i].replace('{s','');
				messageList[i] = messageList[i].replace('}','');
				
				if (messageList[i]){
					var add = parseInt(messageList[i]);
					currentSeconds = Math.round((((tagpro.gameEndsAt-new Date())/1000)+add)%60);
				}
				else {
					currentSeconds = Math.round(((tagpro.gameEndsAt-new Date())/1000)%60);
				}
				messageList[i] = currentSeconds;
			}
		}
		return messageList.join(' ');
	}
	
	function myLocation(message){
		var me = tagpro.players[tagpro.playerId];
		var myPos = {x: me.x/40, y: me.y/40};
		var mapPos ={
			1:{x:null,y:null},
			2:{x:null,y:null}
		}
		var location;
		
		for (x=0;x<tagpro.map.length;x++){
			for (y=0;y<tagpro.map[x].length;y++){
				if (tagpro.map[x][y] == 1){
					console.log(x+', '+y);
					mapPos[1].x = x+1;
					mapPos[1].y = y+1;
					break;
				}
			}
			if (mapPos[1].x != null) break;
		}
		for (x=tagpro.map.length-1;x>=0;x--){
			for (y=tagpro.map[x].length-1;y>=0;y--){
				if (tagpro.map[x][y] == 1){
					mapPos[2].x = x-1;
					mapPos[2].y = y-1;
				}
			}
			if (mapPos[2].x != null) break;
		}
		var startingPt = {
			x: mapPos[1].x,
			y: mapPos[1].y
		}
		
		var increment = {
			x: Math.abs(mapPos[2].x-mapPos[1].x)/3, 
			y: Math.abs(mapPos[2].y-mapPos[1].y)/3
		};
		
		if (myPos.y < startingPt.y + increment.y){
			location = 'TOP';
			
			if (myPos.x < startingPt.x + increment.x){
				location += '-LEFT';
			}
			else if (myPos.x > startingPt.x + 2*increment.x){
				location += '-RIGHT';
			}
		}
		else if (startingPt.y +increment.y < myPos.y && myPos.y < startingPt.y + 2*increment.y){
			if (myPos.x < startingPt.x + increment.x){
				location = 'LEFT';
			}
			else if (startingPt.x + increment.x < myPos.x && myPos.x < startingPt.x + 2*increment.x){
				location = 'CENTER';
			}
			else if (myPos.x > startingPt.x + 2*increment.x){
				location = 'RIGHT';
			}
		}
		else if (myPos.y > startingPt.y + 2*increment.y){
			location = 'BOTTOM';
			
			if (myPos.x < startingPt.x + increment.x){
				location += '-LEFT';
			}
			else if (myPos.x > startingPt.x + 2*increment.x){
				location += '-RIGHT';
			}
		}
		
		return message.replace('{my.location}',location);
	}
	
	function ping(mesage){
		return message.replace('{ping}',tagpro.ping.avg);
	}
});
