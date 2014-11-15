// ==UserScript==
// @name          TagPro Censor Profanity
// @namespace     Dr. Holmes
// @description   Censors profanity specified
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       0.1
// ==/UserScript==

Profanity_List = [
	"example",
	"example2"
	];
	
tagpro.ready(function(){
    var prettyTextOriginal = tagpro.prettyText;
    if ($("#censor").hasClass("on")){
	    tagpro.prettyText = function(e,t,n,r,s,o,u) {
			for (i=0; i<Profanity_List.length; i++){
				if (e.search(Profanity_List[i])> -1){
					var length = Profanity_List[i].length;
					var censor = Array(length+1).join('*');
					e=e.replace(Profanity_List[i],censor);
				}
	        }
	        return prettyTextOriginal(e,t,n,r,s,o,u);
	    }
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
    
	$('#censor').css(censorCSS);
	$('#censor').css('background-image','url(http://i.imgur.com/Q2UIei6.png)');
	$('#censor').addClass('off');
	
    $("#censor").click(function(){
    	if ($("#censor").hasClass("on")){
            $(this).attr("class","off")
            $(this).css("background-image","url(http://i.imgur.com/Q2UIei6.png)");
		} else {
            $(this).attr("class","on")
            $("#censor").css("background-image","url(http://i.imgur.com/H6RUigK.png)")
    	}
    });
});		
