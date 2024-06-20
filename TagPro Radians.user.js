// ==UserScript==
// @name          TagPro Radians
// @namespace     Dr. Holmes
// @description   Convert TagPro degrees into Radians.
// @include	  https://*.koalabeast.com/game*
// @author        Dr. Holmes, Hjalpa
// @downloadurl   https://github.com/Hjalpa/dr-holmes-pull/raw/master/TagPro%20Radians.user.js
// @updateurl     https://github.com/Hjalpa/dr-holmes-pull/raw/master/TagPro%20Radians.user.js
// @version       0.11
// ==/UserScript==

/* globals tagpro */

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
			return n.toFixed(2);
		}
	}
});
