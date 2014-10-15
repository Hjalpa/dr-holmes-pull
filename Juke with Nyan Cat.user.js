// ==UserScript==
// @name          Juke with Nyan Cat
// @description   Plays Nyan Cat when flag is grabbed and aslo does other crazy things
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       3.3
// ==/UserScript==
 
nyanMusic = [
    "http://k007.kiwi6.com/hotlink/mfz86avv7x/nyan.mp3",
    "http://k007.kiwi6.com/hotlink/mfz86avv7x/nyan.mp3",
    "http://k007.kiwi6.com/hotlink/mfz86avv7x/nyan.mp3",
    "http://k007.kiwi6.com/hotlink/mfz86avv7x/nyan.mp3",
    "http://k007.kiwi6.com/hotlink/z3cqmvyocq/retarded_nyan.mp3"
    ]

colors = [
    ['orange', '255, 153, 0'],
    ['yellow', '255, 255, 0'],
    ['green', '68, 122, 66'],
    ['lightGreen', '8, 255, 0'],
    ['lightBlue', '0, 238, 255'],
    ['blue', '34, 0, 255'],
    ['purple', '179, 0, 255'],
    ['pink', '255, 0, 217'],
    ['red', '255, 0, 0']
	]

// Nyan Music
tempNyan = nyanMusic[0]
nyan = document.createElement('audio');
nyan.setAttribute('id', 'nyan');
nyan.setAttribute('preload', 'auto');
nyan.setAttribute('loop', '');
assets.appendChild(nyan)
nyan.volume = 0.6
nyan.innerHTML = '<source src="' + tempNyan + '" type="audio/' + tempNyan.split('.').pop() + '">';

// Ball
$("body").find("#sound").after('<img id="colors"></img>');
img = document.getElementById('colors');
img.setAttribute('src','http://i.imgur.com/i8styCM.gif');

img.style.position = 'absolute';
img.style.top = '48.65%';
img.style.left = '49.33%';
img.style.visibility = 'hidden';

// Background
$("body").find("#sound").after('<div class="backgroundClr"></div>');
var backgroundCSS = {
    height:"100%",
    width:"100%",
    position:"fixed",
    background:"rgba(0,0,0,0)",
    transition:"background 0.2s linear 0s"
}
$(".backgroundClr").css(backgroundCSS)

// Script
function nyanSound() {
    var flag = tagpro.players[tagpro.playerId].flag
    if (flag) {
        var nyanCat = document.getElementById('nyan');
        var musicth = document.getElementById('music');
        var rand = Math.floor(Math.random() * (5));
        
        if (document.getElementById('soundMusic').getAttribute('class') !== 'off') {
            musicth.pause();
        	
        };
        
      	nyanCat.innerHTML = '<source src="' + nyanMusic[rand] + '" type="audio/' + nyanMusic[rand].split('.').pop() + '">';
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
 
function colorOn() {
    var flag = tagpro.players[tagpro.playerId].flag
    if (flag) {
    	var img = document.getElementById('colors');
        img.style.visibility = '';
    };
}

function backgroundOn() {
    setInterval(function() {
        var flag = tagpro.players[tagpro.playerId].flag
        if (flag) {
            var randClr = Math.floor(Math.random() * (8));
            $('.backgroundClr').css("background","rgba(" + colors[randClr][1] + ",0.25)")
        }
        else {
            clearInterval();
            $('.backgroundClr').css("background","rgba(0,0,0,0.2)")
        }
    }, 201);
}
 
tagpro.socket.on("sound", function(message) {
    sound = message.s
    if (["friendlyalert","placeholder"].indexOf(sound)>-1) {
        setTimeout(function(){nyanSound();}, 30);
        setTimeout(function(){colorOn();}, 4090);
        setTimeout(function(){backgroundOn();}, 3890);
       
    } else if (["friendlydrop","placeholder"].indexOf(sound)>-1) {
        nyanOff();
        img.style.visibility = 'hidden';
    } else if (["cheering","placeholder"].indexOf(sound)>-1) {
        nyanOff();
        img.style.visibility = 'hidden';
    }
});
