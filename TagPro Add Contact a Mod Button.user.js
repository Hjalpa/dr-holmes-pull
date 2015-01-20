// ==UserScript==
// @name          TagPro Add Contact a Mod Button
// @namespace     Dr. Holmes
// @description   Adds 'Contact a Mod' button on the homepage
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       0.1
// ==/UserScript==

$(document).ready(function(){
	$ircButton = $('<a>');
	$ircButton.attr('href','http://webchat.freenode.net/?channels=tpmods');
	$ircButton.attr('target','_blank');
	$ircButton.css('marginLeft','10px');
	$ircButton.text('Contact a Mod');
	$('article div.section.smaller a[href="/settings"').css('marginRight','10px');
	$('article div.section.smaller:eq(0)').append($ircButton);
});
