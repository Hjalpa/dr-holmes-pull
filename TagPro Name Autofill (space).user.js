// ==UserScript==
// @name          TagPro Name Autofill (space)
// @namespace     Dr. Holmes
// @description   Autofills a player's name when 'space' is pressed
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com* 
// @include       http://maptest.newcompte.fr* 
// @author        Dr. Holmes
// @version       0.1
// ==/UserScript==

tagpro.ready(function(){
	var $input = $("#chat"),
		typingName = true,
		
		input = '',
		player = '',
		name = '';
		
		
	$(document).keydown(function(key){
		if ($input.val().length > 0){
			if (key.which == 32){
				if (typingName){
					player = $input.val();
					name = searchForPlayer(player);
					
					if (name){
						$input.val(name);
					}

					tyingName = false;
				}
			}
			else if (key.which == 13){
				typingName = true;
			}
		}	
	});
	
	function searchForPlayer(str){
		for (player in tagpro.players){
			player = tagpro.players[player].name;
			if (player.indexOf(str) > -1){
				return player;
			}
			else {
			 return '';
			}
		}
	}	
	
});
