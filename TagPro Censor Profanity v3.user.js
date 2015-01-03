// ==UserScript==
// @name          TagPro Censor Profanity
// @namespace     Dr. Holmes
// @description   Censors profanities specified
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com* 
// @include       http://maptest.newcompte.fr* 
// @author        Dr. Holmes
// @version       3.1
// ==/UserScript==

tagpro.ready(function(){

///////////////////////////////////
// ADD YOUR PROFANITIES HERE //////

	var Profanity_List = [
			"example",
			"example2"
			];
			
////////////////////////////////////

			
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
		$('body').find('#sound').before('<div id="censor"><div>');
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
		$censor.css('background-image','url(http://i.imgur.com/Q2UIei6.png)');
		$censor.addClass('off');
		
		$censor.click(function(){
			if ($censor.hasClass("on")){
				$(this).attr("class","off")
				$(this).css("background-image","url(http://i.imgur.com/Q2UIei6.png)");
			} else {
				$(this).attr("class","on")
				$censor.css("background-image","url(http://i.imgur.com/H6RUigK.png)");
				
				$chatHistory.html(censor(chatHTML));
			}
		});
	});		
	
	function censor(html){
		for (i=0; i<Profanity_List.length; i++){
			if (html.indexOf(Profanity_List[i])> -1){
				var length = Profanity_List[i].length;
				var censor = Array(length+1).join('*');
				html = html.replace(Profanity_List[i],censor);
			}
		}
		return html;
	}
});
