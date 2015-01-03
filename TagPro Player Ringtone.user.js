// ==UserScript==
// @name          TagPro Player Ringtone
// @namespace     Dr. Holmes
// @description   Plays a desired sound when a specific player joins the game
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com* 
// @include       http://maptest.newcompte.fr* 
// @author        Dr. Holmes
// @version       0.1
// ==/UserScript==

///// Enter your players and the sounds below /////
///// 	 separating each pair with a comma    /////

// Players_And_Sound = [
//    ['Player name', 'sound url'],
//    ['Dr. Holmes', 'http://econ1B03lecture04.mp3']
// ]
 
Players_And_Sound = [
	['Abram','http://k003.kiwi6.com/hotlink/tzzc33ombi/Abram_Unstoppable_Edit.mp3']
	];
	
	
////////////////////////////////////////////////////

tagpro.ready(function(){
	tagpro.socket.on("p", function(message) { 
		try {
			var p = message[0].name;
			var id = message[0].id;
			
			if (tagpro.players[id].auth){
				var soundMP3 = check(p);
				
				if (soundMP3){
				playSound(p, soundMP3);
				}
			}
		} 
		catch(error){
		}
	});
});
	
function playSound(p,m){
	addSound(p,m)
	var tagproSound = document.getElementById('soundEffects');
	var tagproMusic = document.getElementById('soundMusic');
	if (tagproSound.getAttribute('class')!='off'){
		if (tagproMusic.getAttribute('class')!='off'){
			tagproMusic.pause();
			tagproMusic.load();
		}
		document.getElementById('playerSound').play();
	}				
}


function addSound(p,m){    
	var soundMP3 = m
	playerSound.innerHTML = '<source src="' + soundMP3 + '" type="audio/' + soundMP3.split('.').pop() + '">';
}


function check(p){
    var pNm = Players_And_Sound;
    for (i=0; i<pNm.length; i++){
		if (pNm[i][0] == p){
			soundMP3 = pNm[i][1];
            return soundMP3;
        } else {
            return false;
        }
    }
} 


playerSound = document.createElement('audio');
playerSound.setAttribute('id', 'playerSound');
playerSound.setAttribute('preload', 'auto');
assets.appendChild(playerSound);
