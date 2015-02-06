// ==UserScript==
// @name          TagPro Radians
// @namespace     Dr. Holmes
// @description   Convert TagPro degrees into Radians.
// @include		  http://tagpro-*.koalabeast.com:*
// @include		  http://tangent.jukejuice.com:*
// @include       http://*.newcompte.fr:*
// @author        Dr. Holmes
// @version       0.1
// ==/UserScript==

tagpro.ready(function(){
	var tr = tagpro.renderer;
	
	tr.drawDegree = function(player){
		if (!player.sprites.degrees && player.degree) {
            player.sprites.degrees = tr.prettyText(convert(player.degree) + "π");
            player.sprites.info.addChild(player.sprites.degrees);
        }
        if (player.sprites.degrees) {
            player.sprites.degrees.x = 36;
            player.sprites.degrees.y = -5;
        }
	}
	
	function convert(deg){
		var n = deg/180;
		if (n == 1){
			return;
		}
		else {
			return n.toFixed(4);
		}
	}
});
