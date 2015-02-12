// ==UserScript==
// @name          TagPro Win Streak
// @namespace     Dr. Holmes
// @description   Win Streak
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       0.1
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_log
// ==/UserScript==

$(document).ready(function(){
	var winStreak = JSON.parse(GM_getValue('winStreak',JSON.stringify(false)));
	
	if (winStreak == false){
		createObj();
	};
	
	if (window.location.pathname.indexOf(':') > -1){
		inGame();
	}
	else if (window.location.pathname.indexOf('profile') > -1){
		profilePage();
	}
	
	function inGame(){
		tagpro.ready(function(){
			var joinTime = new Date().getTime();
			var streak = winStreak.streak;
			
			socket.on('time', function(message){
				joinTime = message.startTime.getTime();
			});
			
			function win(){
				if (winStreak.streak >= 0){
					winStreak.streak++;
				}
				else {
					winStreak.streak = 0;
				}
			};
			
			function loss(){
				if (winStreak.streak <= 0){
					winStreak.streak--;
				}
				else {
					winStreak.streak = 0;
				}
			};
			
			function highStreak(){
				if (winStreak.streak > winStreak.high){
					winStreak.high = winStreak.streak;
				}
				GM_setValue('winStreak', winStreak);
			};
			
			var time = setInterval(function(){
				if (new Date().getTime() > joinTime+30000){
					loss();
					highStreak();
					clearInterval(time);
				}
			},1000)
			
			socket.on('end', function(message){
				winStreak.streak = streak;
				if (tagpro.score.r > tagpro.score.b){
					if (tagpro.players[tagpro.playerId].team == 1) win();
					else loss();
				} 
				else if (tagpro.score.b > tagpro.score.b){
					if (tagpro.players[tagpro.playerId].team == 2) win();
					else loss();
				}
				else {
					winStreak.streak = 0;
				}
				
				highStreak();
			});

		})
	}
	
	function createObj(){
		newObj = {
			streak: 0,
			high: 0
		}
		GM_setValue('winStreak', JSON.stringify(newObj));
		winStreak = JSON.parse(GM_getValue('winStreak',JSON.stringify(false)));
	}
	
	function profilePage(){
		var $winStreak = $('<table class="board"><tbody><tr><td></td><td></td></tr></tbody></table>');
		$winStreak.find('td:eq(0)').text('Win Streak: '+ winStreak.streak);
		$winStreak.find('td:eq(1)').text('Highest Streak: '+ winStreak.high);
		$('table:eq(0)').after($winStreak);
	}
});
