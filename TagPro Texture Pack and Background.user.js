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

var texturePack = getTexture();
if (tagpro.loadAssets){
    tagpro.loadAssets({
        "tiles": texturePack.tiles,
        "speedpad": texturePack.speedpad,
        "speedpadRed": texturePack.speedpadRed,
        "speedpadBlue": texturePack.speedpadBlue,
        "portal": texturePack.portal,
        "splats": texturePack.splats
    });
}

$(window).ready(function(){
	if (window.location.port){
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
    
   	if (window.location.pathname == '/'){
       	$('div.flag-carrier').css('backgroundImage', 'url('+texturePack.tiles+')');
       	$('div.flag').css('backgroundImage', 'url('+texturePack.tiles+')');
       	$('div.goal').css('backgroundImage', 'url('+texturePack.tiles+')');

       	var	image = null,
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
			image = $(this).attr('value');
			$drop.css('background', 'url('+texturePack[image]+') center / 100% no-repeat')
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
			confirmText();
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
					console.log(image);
					$drop.css('background', 'url('+texturePack[image]+') center / 100% no-repeat')
				});
			},1500);
		}
  	}
    
    $('html').css('backgroundImage', "url('"+texturePack.wallpaper+"')");
    $('body').append('<div style="position:fixed; width: 100%; height:100%; opacity:0.4; background-color:black;top:0px;left:0px;z-index:-1"></div>');
});

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
	return texture;
}
