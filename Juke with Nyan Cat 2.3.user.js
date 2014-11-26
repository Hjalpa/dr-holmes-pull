// ==UserScript==
// @name          Juke with Nyan Cat
// @namespace     Dr. Holmes
// @description   Plays Nyan Cat in various conditions
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       2.3
// ==/UserScript==
 
soundCondition = "pups" // "flag" or "all" or "pups"

// Adding Nyan Cat music
nyanMusic = [
    "http://k007.kiwi6.com/hotlink/mfz86avv7x/nyan.mp3",
    "http://k007.kiwi6.com/hotlink/mfz86avv7x/nyan.mp3",
    "http://k007.kiwi6.com/hotlink/mfz86avv7x/nyan.mp3",
    "http://k007.kiwi6.com/hotlink/mfz86avv7x/nyan.mp3",
    "http://k007.kiwi6.com/hotlink/z3cqmvyocq/retarded_nyan.mp3"
    ]

tempNyan = nyanMusic[0]

$(document).ready(function(){
	
    // Nyan Cat icon
    $("#sound").css("width","120px");
	$("#sound").find("#soundEffects").before('<div id="soundNyan"></div>');
    var soundNyanCSS = {
        background:"transparent",
        cursor:"pointer",
        display:"block",
        float:"left",
        width:"56px",
        height:"32px"
    }
    $("#soundNyan").css(soundNyanCSS)
    $("#soundNyan").css("background-image","url(http://i.imgur.com/TYoihYf.png)")
    $("#soundNyan").addClass("on")
    
    $("#soundNyan").click(function(){
    	if ($(this).hasClass("on")){
            $(this).attr("class","off");
            $(this).css("background-image","url(http://i.imgur.com/Gqv1TeM.png)");
            $("#nyan").trigger("pause");
		} else {
            $(this).attr("class","on");
            $(this).css("background-image","url(http://i.imgur.com/TYoihYf.png)")
    	}
    });
   
    // Adding audio
    nyan = document.createElement('audio');
    nyan.setAttribute('id', 'nyan');
    nyan.setAttribute('preload', 'auto');
    assets.appendChild(nyan)
    nyan.innerHTML = '<source src="' + tempNyan + '" type="audio/' + tempNyan.split('.').pop() + '">';
});


// Script
tagpro.ready(function(){
	
	// When codition is all
	if (soundCondition == "all"){
		if (!($("#soundNyan").hasClass("off"))){
			nyanSound();
		}
		
		$("#soundNyan").click(function(){
			if ($("#soundNyan").hasClass("off")){
				nyanOff();
			}
			else {
				nyanSound();
			}
		});		
	}
	
	else {
		// When codition is pups
		setInterval(function(){
			tagpro.socket.on("p" ,function(message){
				if (soundCondition == "pups"){
					var nyan = document.getElementById("nyan");
					var me = tagpro.players[tagpro.playerId];
                    var result = checkForPups(message.u[0]);
                    
                    if (result){
                        if (me.tagpro || me.bomb || me.grip){
                            if (nyan.currentTime == 0){
                                nyanSound();
                            }
                    	}
                        else if (!me.tagpro && !me.bomb && !me.grip){
                            nyanOff();
                        }
                	}
				}
			});
		}, 1000);
        
        function checkForPups(message){
            var result = false
            for(elements in message){
                var pupTypes = ["tagpro", "bomb", "grip"];
                if(pupTypes.indexOf(elements) > -1){
                    result = true;
                }
            }
            return result;
        }
		
		// When codition is flag
		tagpro.socket.on("sound", function(message){
			sound = message.s
			if (soundCondition == "flag"){
				if (["friendlyalert","placeholder"].indexOf(sound)>-1) {
					setTimeout(function(){
						if(tagpro.players[tagpro.playerId].flag){
							nyanSound();
						}
					}, 30);
					
				} else if (["friendlydrop","placeholder"].indexOf(sound)>-1) {
					nyanOff();
				} else if (["cheering","placeholder"].indexOf(sound)>-1) {
					nyanOff();
				}
			}
		});
	}
});

// Play music
function nyanSound() {
	var nyan = document.getElementById("nyan");
    var rand = Math.floor(Math.random() * (5));
        
    if ($("#soundNyan").hasClass("on")){
        if (!($("#soundMusic").hasClass("off"))) {
        	$("#music").trigger("pause");
        }
        
        nyan.innerHTML = '<source src="' + nyanMusic[rand] + '" type="audio/' + nyanMusic[rand].split('.').pop() + '">';
			
		nyan.addEventListener("ended", function(){
			this.currentTime = 0;
			this.play();
		}, false);
        
        nyan.pause();
        nyan.load();
        nyan.play();
    }
}

// Stop music
function nyanOff() {
    $("#nyan").trigger("pause");
    $("#nyan").trigger("load");
    if (!($("#soundMusic").hasClass("off"))) {
		$("#music").trigger("play");
    }
}
