// ==UserScript==
// @name          TagPro Texture Pack & Background
// @include       http://tagpro-*.koalabeast.com*
// @include       http://*.newcompte.fr*
// @author        Dr. Holmes
// @version       0.1
// ==/UserScript==

/////// Set to TRUE or FALSE //////////////

var Transparent_Background = true;

///////////////////////////////////////////


(function(){
	var Texture_Pack = JSON.parse(getCookie('texturePack'));

	if (tagpro.loadAssets){
	    tagpro.loadAssets({
	        "tiles": Texture_Pack.tiles,
	        "speedpad": Texture_Pack.speedpad,
	        "speedpadRed": Texture_Pack.speedpadRed,
	        "speedpadBlue": Texture_Pack.speedpadBlue,
	        "portal": Texture_Pack.portal,
	        "splats": Texture_Pack.splats
	    });
	}

	$('html').css('backgroundImage', "url('"+Texture_Pack.wallpaper+"')");
    $('body').append('<div style="position:fixed; width: 100%; height:100%; opacity:0.4; background-color:black;top:0px;left:0px;z-index:-1"></div>');

	function getCookie(cname){
		var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	    }
	    return false;
	}
})();

$(window).ready(function(){
	tagpro.ready(function(){
		if (window.location.port && Transparent_Background){
	       	var oldCanvas = $(tagpro.renderer.canvas);
	       	var newCanvas = $('<canvas id="viewport" width="1280" height="800"></canvas>');
	       	oldCanvas.after(newCanvas);
	       	oldCanvas.remove();
	       	tagpro.renderer.canvas = newCanvas.get(0);
	       	tagpro.renderer.options.transparent = true;
	       	tagpro.renderer.renderer = tagpro.renderer.createRenderer();
	       	tagpro.renderer.resizeAndCenterView();
	       	newCanvas.show();
	   	}
	});
    
   	if (!window.location.port){
   		var texturePack = getTexture();

       	$('div.flag-carrier').css('backgroundImage', 'url('+texturePack.tiles+')');
       	$('div.flag').css('backgroundImage', 'url('+texturePack.tiles+')');
       	$('div.goal').css('backgroundImage', 'url('+texturePack.tiles+')');

		var	image = 'tiles',
			$ball = $('div.flag-carrier');

		var dropContainerCSS = {
			display: 'none',
			position: 'relative',
			backgroundColor: '#DADFE1',
			opacity: '1',
			height: '200px',
			width: '400px',
			borderRadius: '5px',
			margin: '15px auto'
		},
		dropCSS = {
			display: 'block',
			position: 'absolute',
			width: '248px',
			height: '192px',
			backgroundColor: '#000000',
			zIndex: '1',
			top: '0',
			right: '0',
			margin: '4px'
		},
		exitCSS = {
			position: 'absolute',
			color: '#000000',
			top: '0px',
			right: '5px',
			fontWeight: 'bold',
			fontSize: '16px',
			opacity: '0.4',
			cursor: 'pointer',
			textDecoration: 'none',
			zIndex: '2',
		};

		
		var $table = $('<table class="board smaller"></table>').append($('<tbody/>')).css({width:'30px',height:'100%'}),
		$drop = $('<div id="drop"></div>').css(dropCSS);
		$exit = $('<a/>').text('x').css(exitCSS);

		for (i in texturePack){
			var heading; 
			switch(i){
				case 'tiles': heading = 'Tiles'; break;
				case 'speedpad': heading = 'Speedpad Neutral'; break;
				case 'speedpadRed': heading = 'Speedpad Red'; break;
				case 'speedpadBlue': heading = 'Speedpad Blue'; break;
				case 'portal': heading = 'Portal'; break;
				case 'splats': heading = 'Splats'; break;
				case 'wallpaper': heading = 'Wallpaper'; break;
			}
			var $tr = $('<tr/>').append($('<th/>').text(heading).attr('value',i).css({cursor:'pointer'}));
			$table.find('tbody').append($tr);
		}

		$('div.hideIfExternal.section').before('<div class="drop container"></div>');
		$('.drop.container').css(dropContainerCSS)
			.append($exit)
			.append($table)
			.append($drop);

		$('.drop.container').find('table th:eq(0)').css({backgroundColor:'#DADFE1',color:'#000000'});
		$drop.css('background', 'url('+texturePack[image]+') center / 100% no-repeat');


		$ball
			.mousedown(function(){
				hold = setTimeout(openDrop, 300);
			})
			.mouseup(function(){
				clearTimeout(hold);
			});

		$drop
			.on('dragover', function(e) {
				e.preventDefault();
				$(this).css({opacity:'0.6',outline:'#ffffff solid 2px'});

			})
			.on('dragleave', function(e) {
				e.preventDefault();
				$(this).css({opacity:'1',outline:'none'});
			})
			.on('drop', function(e) {
			    e.preventDefault();
				$drop.css({opacity:'1',outline:'none'});
			    e.originalEvent.dataTransfer.items[0].getAsString(function(url){
			        setTexture(image,url)
			    });
			});

		$('.drop.container').find('table th').click(function(){
			$('.drop.container table th').css({backgroundColor:'#535353',color:'#ffffff'});
			$(this).css({backgroundColor:'#DADFE1',color:'#000000'});
			image = $(this).attr('value');
			$drop.css('background', 'url('+texturePack[image]+') center / 100% no-repeat');
		});

		$('.drop.container th').hover(function(){
			$(this).css('opacity','0.7');
		}, function(){
			$(this).css('opacity','1');
		});

		$('.drop.container a')
			.hover(function(){
				$(this).css('opacity','0.8');
			}, function(){
				$(this).css('opacity','0.4');
			})
			.click(function(){
				$(this).parent().slideUp();
			});


		function openDrop(){
			$('.drop.container').slideDown();
		}

		function setTexture(image, url){
			texturePack[image] = url;
			localStorage.setItem('texturePack', JSON.stringify(texturePack));
			setCookie('texturePack', JSON.stringify(texturePack));
			confirmText();
		}

		function getTexture(){
			var texture = JSON.parse(localStorage.getItem('texturePack'));
			if (!texture){
				texture = {
					"tiles": "/images/tiles.png",
			        "speedpad": "/images/speedpad.png",
			        "speedpadRed": "/images/speedpadred.png",
			        "speedpadBlue": "/images/speedpadblue.png",
			        "portal": "/images/portal.png",
			        "splats": "/images/splats.png",
			        "wallpaper": "/images/background.jpg"
				};
				localStorage.setItem('texturePack', JSON.stringify(texture));
			}
			setCookie('texturePack', JSON.stringify(texture));
			return texture;
		}

		function confirmText(){
			var textCSS = {
			  	top: '5px',
			  	width: '100%',
			  	position: 'absolute',
			  	color: '#FF0000',
			  	display: 'none',
			  	textAlign: 'center',
			  	fontSize: '20px',
			  	fontWeight: 'bold'
			}
			$text = $('<span/>').text('Added').css(textCSS);
			$drop.append($text);
			$text.fadeIn();
			setTimeout(function(){
				$text.fadeOut(function(){
					$text.remove();
					$drop.css('background', 'url('+texturePack[image]+') center / 100% no-repeat')
				});
			},900);
		}

		function setCookie(name, value){
			document.cookie = name + '=' + value;
		}
  	}
});
