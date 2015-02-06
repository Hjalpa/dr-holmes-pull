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
	var me = tagpro.players[tagpro.playerId];
	
	if (me.degree){
		var deg = parseInt(me.degree);
		var rad = convert(deg);
		
		me.sprites.degreesRad = tr.prettyText(rad+'π');
		me.sprites.degreesRad.x = 36;
		me.sprites.degreesRad.y = -5;
		
		me.sprites.info.removeChild(me.sprites.degrees);
		me.sprites.info.addChild(me.sprites.degreesRad);
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
