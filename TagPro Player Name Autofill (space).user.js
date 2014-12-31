// ==UserScript==
// @name          TagPro Player Name Autofill (space)
// @namespace     Dr. Holmes
// @description   Autofills the player's name when the name is typed partially
// @include       http://tagpro-*.koalabeast.com*
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
