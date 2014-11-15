// ==UserScript==
// @name          Juke with Nyan Cat
// @namespace     Dr. Holmes
// @description   Plays Nyan Cat when flag is grabbed
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       2.2
// ==/UserScript==
 
soundCondition = "flag" //or "all" or "pup"
 
nyanMusic = [
    "http://k007.kiwi6.com/hotlink/mfz86avv7x/nyan.mp3",
    "http://k007.kiwi6.com/hotlink/mfz86avv7x/nyan.mp3",
    "http://k007.kiwi6.com/hotlink/mfz86avv7x/nyan.mp3",
    "http://k007.kiwi6.com/hotlink/mfz86avv7x/nyan.mp3",
    "http://k007.kiwi6.com/hotlink/z3cqmvyocq/retarded_nyan.mp3"
    ]

tempNyan = nyanMusic[0]

$(document).ready(function(){
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
            $(this).attr("class","off")
            $(this).css("background-image","url(http://i.imgur.com/Gqv1TeM.png)");
            $("#nyan").trigger("pause");
		} else {
            $(this).attr("class","on")
            $(this).css("background-image","url(http://i.imgur.com/TYoihYf.png)")
    	}
    });
   	
    nyan = document.createElement('audio');
    nyan.setAttribute('id', 'nyan');
    nyan.setAttribute('preload', 'auto');
    assets.appendChild(nyan)
    nyan.innerHTML = '<source src="' + tempNyan + '" type="audio/' + tempNyan.split('.').pop() + '">';
});

tagpro.ready(function(){
	if (soundCondition == "all"){
		if (!($("#soundMusic").hasClass("off"))){
			$("#soundMusic").trigger("pause");
			nyanSound();
		}
		
		$("#soundMusic").click(function(){
			if ($("#soundMusic").hasClass("off")){
				nyanSound();
			}
			else {
				nyanOff();
			}
		});		
	}
	
	else {
		tagpro.socket.on("p" ,function(message)){
			if (soundCondition == "pup"){
				try {
					var pup = message.u[0]	
					if (!(pup.tagpro && pup.bomb && pup.grip)){
						nyanOff();
					}
				}
				catch{
				}
			}
		});
			
		tagpro.socket.on("sound", function(message){
			sound = message.s
			if (soundCondition == "flag"){
				if (["friendlyalert","placeholder"].indexOf(sound)>-1) {
					setTimeout(function(){
					nyanSound();}, 30)
					
				} else if (["friendlydrop","placeholder"].indexOf(sound)>-1) {
					nyanOff();
				} else if (["cheering","placeholder"].indexOf(sound)>-1) {
					nyanOff();
				}
			}
		});
	}
});

 
function nyanSound() {
    var flag = tagpro.players[tagpro.playerId].flag
    if (flag) {
        var nyan = document.getElementById("nyan");
        var musicth = document.getElementById("music");
        var rand = Math.floor(Math.random() * (5));
        
        if ($("#soundMusic").hasClass("on")){
        	if (!($("#soundMusic").hasClass("off"))) {
            	musicth.pause();
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
}

function nyanOff() {
    $("#nyan").trigger("pause");
    if (!($("#soundMusic").hasClass("off")) {
		$("#soundMusic").trigger("play");
    }
}
