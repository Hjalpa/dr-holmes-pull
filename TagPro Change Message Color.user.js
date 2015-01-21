// ==UserScript==
// @name          TagPro Change Message Color
// @namespace     Dr. Holmes
// @description   Change Red and Blue message colors
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       0.1
// ==/UserScript==

tagpro.ready(function(){
	
/////////////////////////////////////////////////
//    CHANGE COLORS HERE                   
	
	var redColor = 'rgb(225, 181, 189)',
		blueColor = 'rgb(207, 207, 255)';

/////////////////////////////////////////////////


	var $chatHistory = $("chatHistory");
		
	var originalRed = 'rgb(225, 181, 189)',
		originalBlue = 'rgb(207, 207, 255)';
		
	tagpro.socket.on(function(){
		var chat = $chatHistory.find('div').last();
		
		if (chat.find('span.name').css('color') == originalRed){
			chat.find('span.name').css('color',redColor);
			
			if (chat.find('span.message').css('color') == originalRed){
				chat.find('span.message').css('color',redColor);
			}
		}
		else if (chat.find('span.name').css('color') == originalBlue){
			chat.find('span.name').css('color',blueColor);
			
			if (chat.find('span.message').css('color') == originalBlue){
				chat.find('span.message').css('color',blueColor);
			}
		}
	});
});
