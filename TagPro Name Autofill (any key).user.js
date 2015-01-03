// ==UserScript==
// @name          TagPro Name Autofill (any key)
// @namespace     Dr. Holmes
// @description   Autofills a player's name when the assigned key is pressed
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       0.1
// ==/UserScript==

tagpro.ready(function(){

//////////////////////////////////////////////

	var Search_Player_Keycode = 48;

//////////////////////////////////////////////
	
	var $input = $("#chat"),
		typingName = true,	
		input = '',
		player = '',
		name = '';
		
	$(document).keydown(function(key){
		if ($input.val().length > 0){
			if (key.which == Search_Player_Keycode){
				if (typingName){
					input = $input.val();
					input = input.split(' ');
					player = input[input.length-1];
					
					name = searchForPlayer(player);
				}
			}
			else if (key.which == 13){
				typingName = true;
			}
			else {
				if (name.length > 0){
					replaceInput(name);
					typingName = false;
					name = '';
				}
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

	function replaceInput(name){
		var prevInput = input.splice(0, input.length-1);
		prevInput = prevInput.join(' ');
		$input.val(prevInput + ' ' + name);
	}
});
