// ==UserScript==
// @name          TagPro Live Stats
// @namespace     Dr. Holmes
// @include		  http://tagpro-*.koalabeast.com:*
// @include		  http://tangent.jukejuice.com:*
// @include       http://*.newcompte.fr:*
// @author        Dr. Holmes
// @version       0.1 
// ==/UserScript==

tagpro.ready(function(){
	var option = {1:'s-tags',2:'s-pops'};
	
	var tr = tagpro.renderer;
	
	 tr.drawName = function (player) {
		var statsRaw = getStats(player);
		var stats = handleStats(statsRaw);
        if (!player.sprites.name || player.sprites.name.text != player.name || player.sprites.stats.text != stats) {
            if (player.sprites.nameStats) player.sprites.info.removeChild(player.sprites.nameStats);
            var color = player.auth ? "#BFFF00" : "#ffffff";
			player.sprites.stats = tr.prettyText(stats);
            player.sprites.name = tr.prettyText(player.name, color);
			player.sprites.nameStats = tr.prettyText(player.name+'  '+stats, color);
            player.sprites.info.addChild(player.sprites.nameStats);
        }
        player.sprites.nameStats.x = 32;
        player.sprites.nameStats.y = -17;
		
    };
		
	function getStats(player){
		var stats = [];
		if (option[1]) stats.push(player[option[1]]);
		if (option[2]) stats.push(player[option[2]]);
		return stats;
	};
	
	function handleStats(stats){
		return '['+stats[0]+', '+stats[1]+']'; 
	};
});
