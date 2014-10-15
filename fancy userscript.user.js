// ==UserScript==
// @name          fancy userscript
// @description   userscript
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       1.0
// ==/UserScript==

p = 20

function time(){
    timer = setInterval(function(){
        tagpro.players[tagpro.playerId].cache.context.clearRect(0,19,30,35);
        if(p> 1){
            p = p -1
            tagpro.prettyText(p, 0, 35, "#FFFFFF", false, false, tagpro.players[tagpro.playerId].cache.context);
        }
        else {
            clearInterval(timer);
        }
    }, 1000);
}

tagpro.ready(function(){
	tagpro.socket.on("sound", function(message) {
   		sound = message.s
    	if (["powerup","placeholder"].indexOf(sound)>-1) {
            p = 20;
            tagpro.prettyText(p, 0, 35, "#FFFFFF", false, false, tagpro.players[tagpro.playerId].cache.context);
            time();
        }
    });
});
