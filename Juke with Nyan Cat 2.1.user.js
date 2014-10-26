// ==UserScript==
// @name          Juke with Nyan Cat
// @namespace     Dr. Holmes
// @description   Plays Nyan Cat when flag is grabbed
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       2.2
// ==/UserScript==
 
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
    	if ($("#soundNyan").hasClass("on")){
            $(this).attr("class","off")
            $(this).css("background-image","url(http://i.imgur.com/Gqv1TeM.png)");
            document.getElementById("nyan").pause();
		} else {
            $(this).attr("class","on")
            $("#soundNyan").css("background-image","url(http://i.imgur.com/TYoihYf.png)")
    	}
    });
   	
    nyan = document.createElement('audio');
    nyan.setAttribute('id', 'nyan');
    nyan.setAttribute('preload', 'auto');
    assets.appendChild(nyan)
    nyan.innerHTML = '<source src="' + tempNyan + '" type="audio/' + tempNyan.split('.').pop() + '">';
});
 

function nyanSound() {
    var flag = tagpro.players[tagpro.playerId].flag
    if (flag) {
        var nyan = document.getElementById('nyan');
        var musicth = document.getElementById('music');
        var rand = Math.floor(Math.random() * (5));
        
        if ($("#soundNyan").hasClass("on")){
        	if (document.getElementById('soundMusic').getAttribute('class') !== 'off') {
            	musicth.pause();
        	}
        
        	nyan.innerHTML = '<source src="' + nyanMusic[rand] + '" type="audio/' + nyanMusic[rand].split('.').pop() + '">';
        
        	nyan.pause();
            nyan.load();
            nyan.play();
        }
    }
}
 
function nyanOff() {
    var nyan = document.getElementById('nyan');
    var musicth = document.getElementById('music');
    nyan.pause();
        if (document.getElementById('soundMusic').getAttribute('class') !== 'off') {
        musicth.play();
    }
}

tagpro.ready(function(){
 tagpro.socket.on("sound", function(message) {
     sound = message.s
     if (["friendlyalert","placeholder"].indexOf(sound)>-1) {
         setTimeout(function(){
         nyanSound();}, 30)
        
     } else if (["friendlydrop","placeholder"].indexOf(sound)>-1) {
         nyanOff();
     } else if (["cheering","placeholder"].indexOf(sound)>-1) {
         nyanOff();
     }
 });
});
