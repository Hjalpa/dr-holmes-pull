// ==UserScript==
// @name          Juke with Nyan Cat
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
nyan = document.createElement('audio');
nyan.setAttribute('id', 'nyan');
nyan.setAttribute('preload', 'auto');
nyan.setAttribute('loop', '');
assets.appendChild(nyan)
nyan.volume = 0.6
nyan.innerHTML = '<source src="' + tempNyan + '" type="audio/' + tempNyan.split('.').pop() + '">';
 
function nyanSound() {
    var flag = tagpro.players[tagpro.playerId].flag
    if (flag) {
        var nyanCat = document.getElementById('nyan');
        var musicth = document.getElementById('music');
        var rand = Math.floor(Math.random() * (5));
        
        if (document.getElementById('soundMusic').getAttribute('class') !== 'off') {
            musicth.pause();
        
        
       		nyanCat.innerHTML = '<source src="' + nyanMusic[rand] + '" type="audio/' + nyanMusic[rand].split('.').pop() + '">';
        };
        
       	nyanCat.pause();
        nyanCat.load();
        nyanCat.play();
    }
}
 
function nyanOff() {
    var nyanCat = document.getElementById('nyan');
    var musicth = document.getElementById('music');
    nyanCat.pause();
        if (document.getElementById('soundMusic').getAttribute('class') !== 'off') {
        musicth.play();
    }
}
 
 
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
