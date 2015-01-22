// ==UserScript==
// @name          TagPro IRC Buttons
// @namespace     Dr. Holmes and Moosen
// @description   Adds 'Contact a Mod' and 'Chat with friends' buttons on the homepage
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes and Moosen
// @version       0.1
// ==/UserScript==

$(document).ready(function(){
	var $friendsButton = $('<a>');
	$friendsButton.attr('href','http://webchat.freenode.net/?channels=tagpro');
	$friendsButton.attr('target','_blank');
	$friendsButton.css('marginLeft','10px');
	$friendsButton.text('Chat with Friends');
	
	var $modButton = $('<a>');
	$modButton.attr('href','http://webchat.freenode.net/?channels=tpmods');
	$modButton.attr('target','_blank');
	$modButton.css('marginLeft','20px');
	$modButton.text('Contact a Mod');
	
	$('article div.section.smaller a[href="/settings"').css('marginRight','10px');
	$('article div.section.smaller:eq(0)').append($friendsButton);
	$('article div.section.smaller:eq(0)').append($modButton);
});
