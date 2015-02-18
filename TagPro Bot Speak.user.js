tagpro.ready(function(){
    function toBinary(str, spaceSeparatedOctets){
        return str.replace(/[\s\S]/g, function(str) {
            str = zeroPad(str.charCodeAt().toString(2));
            return !1 == spaceSeparatedOctets ? str : str + " "
        });
        function zeroPad(num){
            return "00000000".slice(String(num).length) + num
        }
    }

    var socketEmit = tagpro.socket.emit;
    tagpro.socket.emit = function(t,n) {
        if (t=='chat'){
            var message = n.message.split('');
            var send = setInterval (function(){
                if (message.length > 0){
                    var word = message.splice(0, 7).join('');
                    var newChat = {message: toBinary(word), toAll: n.toAll};
                    console.log(newChat);
                    socketEmit('chat', newChat);
                }
                else {
                    clearInterval(send)
                }
            }, 500);
        }
        else {
            socketEmit(t, n);
        }
    }
});
