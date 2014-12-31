tagpro.ready(function(){

//////////////////////////////////////////////

	var Search_Player_Keycode = 48;

//////////////////////////////////////////////
	
	var typingName = true,	
		input = '',
		player = '',
		name = '';
		
	$(document).keydown(function(key){
		if ($input.val().length > 0){
			if (key.which == search_player_keycode){
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
