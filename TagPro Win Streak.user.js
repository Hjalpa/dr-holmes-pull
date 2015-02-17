// ==UserScript==
// @name          TagPro Win Streak
// @namespace     Dr. Holmes
// @description   Win Streak
// @include       http://tagpro-*.koalabeast.com*
// @include 	  http://maptest*.newcompte.fr*
// @author        Dr. Holmes
// @version       0.1
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_log
// ==/UserScript==

tagpro.ready(function(){
	var winStreak = JSON.parse(GM_getValue('winStreak',JSON.stringify(false)));
    if (winStreak == false){
		newObj = {
			streak: 0,
			high: 0
		};
		GM_setValue('winStreak', JSON.stringify(newObj));
		winStreak = JSON.parse(GM_getValue('winStreak',JSON.stringify(false)));
	};
	
	if (window.location.href.indexOf('com:') > -1){
        var joinTime;
        
        tagpro.socket.on('time', function(message){
            joinTime = new Date().getTime();
        });
        
        function win(streak){
            if (streak >= 0){
                return streak + 1;
            }
            else {
                return 1;
            }
        };
        
        function loss(streak){
            if (streak <= 0){
                return streak -1;
            }
            else {
                return -1;
            }
        };
        
        function highStreak(streak){
            if (streak > winStreak.high){
                winStreak.high = streak;
            }
        };
        
        var time = setInterval(function(){
            if (new Date().getTime() > joinTime+30000){
                var streak = loss(winStreak.streak);
                var newObj = {
                    streak: streak,
                    high: winStreak.high
                };
                GM_setValue('winStreak', JSON.stringify(newObj));
                tagpro.socket.on('end',countStreak);
                clearInterval(time);
            }
        },1000)
        
        function countStreak(){
            var streak;
            if (tagpro.score.r > tagpro.score.b){
                if (tagpro.players[tagpro.playerId].team == 1) streak = win(winStreak.streak);
                else streak = loss(winStreak.streak);
            } 
            else if (tagpro.score.b > tagpro.score.r){
                if (tagpro.players[tagpro.playerId].team == 2) streak = win(winStreak.streak);
                else streak = loss(winStreak.streak);
            }
            else {
                streak = 0;
            }
            highStreak(streak);
            var newObj = {
                streak: streak,
                high: winStreak.high
            };
            GM_setValue('winStreak', JSON.stringify(newObj));
        };
	}

	else if (window.location.pathname.indexOf('profile') > -1){
		var $winStreak = $('<table class="board"><tbody><tr><td></td><td></td></tr></tbody></table>');
		$winStreak.find('td:eq(0)').text('Win Streak: '+ winStreak.streak);
		$winStreak.find('td:eq(1)').text('Highest Streak: '+ winStreak.high);
		$('table:eq(0)').after($winStreak);
	}
});
