// ==UserScript==
// @name          TagPro Chat Save
// @namespace     Dr. Holmes
// @description   Saves incomplete chat
// @include       http://tagpro-*.koalabeast.com*
// @author        Dr. Holmes
// @version       0.1
// ==/UserScript==

exit_key = 0;

tagpro.ready(function(){
    var chat = [
        ["all",false,""],
        ["team",false,""],
        ["group",false,""]
    ],
        exitKey = [37,38,39,40,exit_key],
        tagpro.keys.chatToAll = all,
        tagpro.keys.chatToTeam = team,
        tagpro.keys.chatToGroup = group;
    
    $(document).keydown(function(e){

        if ($("#chat").val().length > 0){
            chatSave(chat);
            
            if (exitKey.indexOf(e.which) > -1){
                if ($("#chat").css("display")!="none"){
                    $("#chat").val("");
                    
                    var enter = $.Event("keydown", { keyCode: 13});
                    $("body").trigger(enter);
                    tagpro.disableControls = false;
                    
                    chat[0][1] = false;
                    chat[1][1] = false;
                    chat[2][1] = false;
                }
            }
            else if (e.which == 13){
                    reset(chat);
        	}
		}
        
		else if (e.which == 13 || e.which == 84 || e.which == 71){
            if ($("#chat").css("display")!="none"){
                if (e.which == 13){
                    chat[0][1] = true;
                } else if (e.which == 84){
                    chat[1][1] = true;
                } else if (e.which == 71){
                    chat[2][1] = true;
                }
                
                loadSave(chat);
            }
            else {
                reset(chat);
            }
		}
	});
});

function chatSave(chat){
    if(chat[0][1]){
        chat[0][2] = $("#chat").val();
    } 
    else if (chat[1][1]){
        chat[1][2] = $("#chat").val();
    } 
    else if (chat[2][1]){
    	chat[2][2] = $("#chat").val();
    }
}

function loadSave(chat){
    if (chat[0][1]){
        $("#chat").val(chat[0][2]);
    } 
    else if (chat[1][1]){
        $("#chat").val(chat[1][2]);
    } 
    else if (chat[2][1]){
        $("#chat").val(chat[2][2]);
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
