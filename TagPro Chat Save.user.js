// ==UserScript==
// @name          TagPro Chat Save
// @description   When the chat is exited before it is sent, it is saved and loaded next time the chat is opened.
// @include       http://tagpro-*.koalabeast.com*
// @include       http://tangent.jukejuice.com* 
// @include       http://*.newcompte.fr* 
// @author        Dr. Holmes
// ==/UserScript==

tagpro.ready(function(){
	var chat = [
		["all",false,""],
		["team",false,""],
		["group",false,""]
		],
		
		exitKey = [37,38,39,40,exit_key],
		
		all = tagpro.keys.chatToAll,
		team = tagpro.keys.chatToTeam,
		group = tagpro.keys.chatToGroup,
		
		$input = $("#chat");
	
	 $(document).keydown(function(e){

        if ($input.val().length > 0){
            chatSave(chat);
            
            if (exitKey.indexOf(e.which) > -1){
                if ($input.css("display")!="none"){
                    $input.val("");
                    
                    var enter = $.Event("keydown", { keyCode: 13});
                    $("body").trigger(enter);
                    tagpro.disableControls = false;
                    
                    chat[0][1] = false;
                    chat[1][1] = false;
                    chat[2][1] = false;
                }
            }
            else if (all.indexOf(e.which) > -1){
                    reset(chat);
        	}
	    }
        
		else if (all.indexOf(e.which) + team.indexOf(e.which) + group.indexOf(e.which) > -3){
			
            if ($input.css("display")!="none"){
                if (all.indexOf(e.which) > -1){
                    chat[0][1] = true;
                } else if (team.indexOf(e.which) > -1){
                    chat[1][1] = true;
                } else if (group.indexOf(e.which) > -1){
                    chat[2][1] = true;
                }
                
                loadSave(chat);
            }
            else {
                reset(chat);
            }
		}
	});

	$($input).keydown(function(e){
		if (e.which == exit_key){
			e.preventDefault();
		}
	});
	
	function chatSave(chat){
	    if(chat[0][1]){
	        chat[0][2] = $input.val();
	    } 
	    else if (chat[1][1]){
	        chat[1][2] = $input.val();
	    } 
	    else if (chat[2][1]){
	    	chat[2][2] = $input.val();
	    }
	}
	
	function loadSave(chat){
	   	if (chat[0][1]){
	        $input.val(chat[0][2]);
	    } 
	    else if (chat[1][1]){
	        $input.val(chat[1][2]);
	    } 
	    else if (chat[2][1]){
	        $input.val(chat[2][2]);
	    }
	}
	
	function reset(chat){
	    for (i=0;i<3;i++){
	        if (chat[i][1]){
	            chat[i][1] = false;
	            chat[i][2] ="";
	        }
	    }
	}
});	
