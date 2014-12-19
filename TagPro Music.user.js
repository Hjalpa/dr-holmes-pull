// ==UserScript==
// @name          TagPro Music
// @namespace     Dr. Holmes
// @description   Adds more music to the TagPro music playlist
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       0.1
// ==/UserScript==

tagpro.ready(function(){
	var playlist = [];
	var keep_tagpro_music = true;
	
	if (!keep_tagpro_music){
		tagpro.musicPlayer.list = [];
	} else {
		fixTagproMusic();
	}
	
	addPlaylist(playlist);
	
	tagpro.musicPlayer.next = function (){
		if(!tagpro.music)return;
		n = !1;
		if(!r)return;
		
		var i = tagpro.musicPlayer.list.shift();
		
		i.volume=parseFloat(i.volume||.5);
		tagpro.musicPlayer.list.push(i);
		tagpro.musicPlayer.mute();
		tagpro.musicPlayer.current = i;
			
		e=$("<audio id='music' volume='"+i.volume+"' autoplay='true'>").appendTo($(document.body)),
		e[0].volume=i.volume;
		e.append("<source type='audio/mp3' src="+i.url+"></source>")
		
		e.on("ended",tagpro.musicPlayer.next);
	}
	
	function addPlaylist(playlist){
		for (i=0;i<playlist.length;i++){
			var musicURL = playlist[i];
			playlist[i] = {
				name:'',
				author:'',
				url: musicURL;
			};
			
			tagpro.musicPlayer.list.push(playlist[i]);
		}
	}
	
	function fixTagproMusic(){
		var music = tagpro.musicPlayer.list;
		for (i=0;i<music.length;i++){
			var musicURL = music[i].url;
			music[i].url = 'http://'+tagpro.musicHost+'/sound/music/'+musicURL+'.mp3'
		}
	}
});
