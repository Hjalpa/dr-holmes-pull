// ==UserScript==
// @name          TagPro Name Autofill
// @description   Suggests players names as you type. Press "ENTER" or "SPACE" to autofill the suggested name.
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com* 
// @include       http://*.newcompte.fr* 
// @author        Dr. Holmes
// ==/UserScript==

tagpro.ready(function(){

//////////////////////////////////////
// FILL IN YOUR DATA HERE
/////////////////////////////////////
//
// Live autofill?
	
	var autocomplete = true; // or false
  
  
/////////////////////////////////////
// END
/////////////////////////////////////

	var $input = $("#chat"),
		players = tagpro.players,
		playerlist = [];

	function updatePlayers(){
		var list = [];
		for (p in players){
			list.push(players[p].name);
		}
		return list;
	}

	function asuggest(list) {
		$input.asuggest(list, {
			'stopSuggestionKeys': [$.asuggestKeys.RETURN],
			'minChunkSize': 1,
			'delimiters': ' \n',
			'cycleOnTab': true,
			'autoComplete': autocomplete,
			'ignoreCase': true
		});
	}

	setInterval(function(){
		var newList = updatePlayers();
		if (newList.length != playerlist.length){
			playerlist = newList;
			asuggest(playerlist);
		}
	}, 50/3);

});
