// ==UserScript==
// @name          TagPro Profanity Censor
// @description   Adds a censor button on the page that censors all words specified.
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com* 
// @include       http://*.newcompte.fr* 
// @author        Dr. Holmes
// ==/UserScript==

tagpro.ready(function(){

////////////////////////////////
// FILL IN YOUR DATA HERE
///////////////////////////////

	var Profanity_List = [];


///////////////////////////////
//  EXAMPLE
// 
// var Profanity_List = ['word1', 'word2'];
//////////////////////////////

	var $censor = '',
		$chatHistory = $('#chatHistory'),
		chatHTML = $chatHistory.html();
	
	Profanity_List.sort(function(a,b){
		return b.length - a.length;
	});
	
	tagpro.socket.on('chat',function(message){
		chatHTML = $chatHistory.html();
		
		if ($censor.hasClass("on")){
			$chatHistory.html(censor(chatHTML));
		}
	});
	
	$(document).ready(function(){
		$('body').append('<img id="censor"><div>');
		var censorCSS = {
			position: 'absolute',
			margin: 'auto',
			right: '70px',
			top: '68px',
			cursor: 'pointer',
			width: '32px',
			height: '32px'
		}
		
		$censor = $('#censor');
		
		$censor.css(censorCSS);
		$censor.attr('src','http://i.imgur.com/Q2UIei6.png');
		$censor.addClass('off');
		
		$censor.click(function(){
			if ($censor.hasClass("on")){
				$(this).attr("class","off")
				$(this).attr('src','http://i.imgur.com/Q2UIei6.png');
			} else {
				$(this).attr("class","on")
				$censor.attr('src','http://i.imgur.com/H6RUigK.png');
				chatHTML = $chatHistory.html();
				$chatHistory.html(censor(chatHTML));
			}
		});
	});		
	
	function censor(html){
		for (i=0; i<Profanity_List.length; i++){
			if (html.indexOf(Profanity_List[i])> -1){
				var regex = new RegExp(Profanity_List[i],'g');
				var length = Profanity_List[i].length;
				var censor = Array(length+1).join('*');
				html = html.replace(regex,censor);
			}
		}
		
		for (i=0;i<$chatHistory.find('div').length;i++){
			var $div =$chatHistory.find('div:eq('+i+')');
			if ($div.text().indexOf('*')){
				setTimeout(function(){
					$div.remove();
				}, 30000);
			}
		}
		return html;
	}
});
