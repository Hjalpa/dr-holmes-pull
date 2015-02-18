// ==UserScript==
// @name          TagPro Bot Translator
// @namespace     Dr. Holmes
// @description   Translate Binary text into Ascii
// @include       http://tagpro-*.koalabeast.com*
// @include 	  http://maptest*.newcompte.fr*
// @author        Dr. Holmes
// @version       0.1
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_log
// ==/UserScript==

tagpro.ready(function() {
    function toAscii(bin) {
        return bin.replace(/\s*[01]{8}\s*/g, function (bin) {
            return String.fromCharCode(parseInt(bin, 2))
        })
    }

    tagpro.socket.on('chat', function (data) {
        var message = data.message;
        message = message.replace(/[01]|\s/g,'');
        if (message == '') {
            var msgTranslated = toAscii(data.message);
            $('#chatHistory div:last').find('.message').text(msgTranslated + ' (translated)');
        }
    });
});
