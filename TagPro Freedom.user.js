// ==UserScript==
// @name          TagPro Freedom
// @namespace     Dr. Holmes
// @description   More freedom to TagPro
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       0.1
// ==/UserScript==

tagpro.ready(function(){
	var stop = false;
	var $div = $('<div id="freedomHolder"></div>');
	
	var $sound = $('<audio>');
	$sound.attr('id','eagleSound');
	$sound.attr('preload','auto');
	
	var $source = $('<source>');
	$source.attr('type','audio/mp3');
	$source.attr('src','http://k003.kiwi6.com/hotlink/lb02cfln0i/hawk_screech_valley-Mike_Koenig-2128875647.mp3');
	
	$sound.append($source);
	$div.append($sound);
	$('body').append($div);
	
	createImg();

	function createImg(){
		if (!stop){
			var time = Math.random()*1000*5*60;
			console.log(time/1000);
			setTimeout(function(){
				var imgurl = 'http://i.imgur.com/dBzEC75.png';
				var $img = $('<img>');
				$img.attr('id','freedom');
				$img.attr('src',imgurl);
				$img.css('position','absolute');
				$img.css('top', '0');
				$img.css('left', '0');
				
				$('#freedomHolder').append($img);
				$('#eagleSound').trigger('load');
				$('#eagleSound').trigger('play');
				
				$('#freedom').animate({
					top:'+='+$(document).height(),
					left:'+='+$(document).width()
				}, 2300, function(){
					$('#freedom').remove();
					createImg();
				})
			},time);
		}
	}
	
	tagpro.socket.on('end',function(){stop = true});
});
