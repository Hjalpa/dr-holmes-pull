// ==UserScript==
// @name          TagPro Auto Chat
// @namespace     Dr. Holmes
// @description   Auto chats assigned messages when a specific event occurs in game.
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com* 
// @include       http://*.newcompte.fr* 
// @author        Dr. Holmes
// ==/UserScript==

tagpro.ready(function(){

//////////////////////////////////
// FILL IN YOUR DATA HERE 
//////////////////////////////////

	var data = {
	}


///// EXAMPLE /////
//
//	var data = {
//		0: {
//			on: true,
//			type: 'GameStart',
//			toAll: true,
//     		message: 'gl;hf'	
//		},
//		1: {		
//			on: true,
//    		type: 'GameEnd',
//			toAll: true,
//			message: 'gg',
//			win: true,
//			lose: true
//		},
//		2: {
//			on: true,
//			type: 'Powerup',
//			toAll: false,
//			message: 'I got tagpro',
//			tagpro: true,
//			bomb: false,
//			grip: false,
//		},
//		3: {
//			on: true,
//			type: 'FriendlyCap',
//			toAll: false,
//			message: 'GJ team!'
//		},
//		4: {
//			on: true,
//			type: 'EnemyCap',
//			toAll: true,
//			message: 'We got next cap'
//		},
//		5: {
//			on: true,
//			type: 'JoinGame',
//			toAll: true,
//			message: 'Dr. Holmes is here!'
//		}
//}
//
///////////////////
//
// Data types:
//	- 'GameStart'
// 	- 'GameEnd'
// 	- 'FriendlyCap'
// 	- 'EnemyCap'
// 	- 'Powerup'
// 	- 'JoinGame'
//
////////////////////

	var gameStartList = [],
		gameEndList = [],
		friendlyCapList = [],
		enemyCapList = [],
		powerupList = [],
		joinGameList = [];
	
	var gotPup = '';
		
	//Sort data
	(function(events){
		for (i in events){
			switch (events[i].type){
				case 'GameStart':
					gameStartList.push(events[i]);
					break;
				
				case 'GameEnd':
					gameEndList.push(events[i]);
					break;
					
				case 'FriendlyCap':
					friendlyCapList.push(events[i]);
					break;
					
				case 'EnemyCap':
					enemyCapList.push(events[i]);
					break;
				
				case 'Powerup':
					powerupList.push(events[i]);
					break;
				
				case 'JoinGame':
					joinGameList.push(events[i]);
					break;
			}
		}
	}(data));
	
	
	setTimeout(function(){
		//GameEnd
		tagpro.socket.on('end', gameEnd);
		
		//Get powerup
		tagpro.socket.on('p', getPowerup);
		
		//Sound on
		tagpro.socket.on('sound', soundOn);
		
		//Game Start
		tagpro.socket.on('time', gameStart);
		
		//Join Game
		for (i=0; i<joinGameList.length; i++){
			emitChat(joinGameList[i]);
		}
	},500);
	
	function gameStart(message){
		if (gameStartList.length > 0){
			var time = message.time;
			if (time == 720000){
				for (i=0;i<gameStartList.length;i++){
					emitChat(gameStartList[i]);
				}
			}
		}
	}
	
	function soundOn(message){
		var sound = message.s;
		
		switch (sound){
			//Friendly Cap
			case 'cheering':
				if (friendlyCapList.length > 0){
					for (i=0;i<friendlyCapList.length;i++){
						emitChat(friendlyCapList[i]);
					}
				}
				break;
			
			//Enemy Cap
			case 'sigh':
				if (enemyCapList.length > 0){
					for (i=0;i<enemyCapList.length;i++){
						emitChat(enemyCapList[i]);
					}
				}
				break;
			
			//Powerup
			case 'powerup':
				if (powerupList.length > 0){
					setTimeout(function(){
						for (i=0;i<powerupList.length;i++){
							var event = powerupList[i];
							if (event.tagpro && gotPup == 'tagpro'){
								emitChat(powerupList[i]);
							};
							if (event.bomb && gotPup == 'bomb'){
								emitChat(powerupList[i]);
							};
							if (event.grip && gotPup == 'grip'){
								emitChat(powerupList[i]);
							};
						}
					},100);
				}
				break;
		}	
	}
	
	function getPowerup(message){
		var u = false;
		
		for (key in message){
			if (key == 'u'){
				u = true;
			}
		}
		
		if (u){
			if (message.u[0].id == tagpro.playerId){
				for (i in message.u[0]){
					switch (i){
						case 'tagpro':
							if (message.u[0].tagpro){
								gotPup = 'tagpro';
							}
							break;
						case 'bomb':
							if (message.u[0].bomb){
								gotPup = 'bomb';
							}
							break;
						case 'grip':
							if (message.u[0].grip){
								gotPup = 'grip';
							}
							break;
					}
				}
			}
		}
	}
	
	function gameEnd(message){
		if (gameEndList.length > 0){
			var team = tagpro.players[tagpro.playerId].team;
			var winner = message.winner;
			
			if (winner == 'red'){
				winner = 1;
			}
			else {
				winner = 2;
			}
			
			for (i=0;i<gameEndList.length;i++){
				var event = gameEndList[i];
				var win = gameEndList[i].win;
				var lose = gameEndList[i].lose;
				
				if (win && winner == team){
					setTimeout(function(){
						emitChat(event);
					},500);
				}
				else if (lose && winner != team){
					setTimeout(function(){
						emitChat(event);
					},500);
				}
			}
		}
	}
	

	function emitChat(event){
		var message = event.message,
			toAll = event.toAll,
			on = event.on;
			
		if (on){
			tagpro.socket.emit('chat',{
				message: message,
				toAll: toAll
			});
		}
	}
	
});
