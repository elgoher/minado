var mines;
var index = 0,
animaciones = [];

function Animacion (canvas, width, height, image, number_Of_Frames, ticks_per_frame, loop) {
	//se asignan valores
	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	this.width = width;
	this.height = height;
	this.image = image;
	this.number_Of_Frames = number_Of_Frames;
	this.ticks_per_frame = ticks_per_frame;
	this.loop = loop; 
	this.frame_index = 0 ;
	this.animation_id;
	this.tick_count = 0;

	this.render = function ()
	{
	  // se limpia el canvas
		this.context.clearRect(0, 0, this.width, this.height);
		
	  //se dibuja el frame actual
	  //fix para que se pueda ver en FF y en IE
	if (this.width > this.canvas.width) this.width = this.canvas.width;
	if (this.height > this.canvas.height) this.height = this.canvas.height;

	try{
		this.context.drawImage(
			this.image, //imagen
			this.frame_index * this.width , //posicion eje x
			0, // posicion eje y
			this.width ,//ancho frame
			this.height, //alto frame
			0, // destino x
			0, // destino y
			this.width ,//ancho destino
			this.height//alto destino
			);
	}catch (e) {
    	console.log(e);
		}
	}

	this.update = function ()
	{
		
		this.tick_count += 1;	
		
		if (this.tick_count > this.ticks_per_frame) {
			
			this.tick_count = 0;			
			// si el frame actual esta en rango
            if (this.frame_index < this.number_Of_Frames - 1) {
            	// ir al sgte frame
                this.frame_index += 1; 
                
             }else if (this.loop == 1) {             	
              	this.frame_index = 0;
              	            	
             }
         }
	}
}


function start () {
	var animation = animaciones.pop();
	
	animation.animation_id = window.requestAnimationFrame(start);  
	animation.update();
	animation.render();
	if (animation.frame_index == animation.number_Of_Frames -1 && animation.loop == 0) {
		//animation.context.clearRect(0, 0, animation.width, animation.height);
		stop(animation);
	} 		
	animaciones.push(animation);

}

function stop (animation) {
		console.log("stop");
		var continuar;
		window.cancelAnimationFrame(animation.animation_id);
		animaciones.pop();
		continuar = confirm('perdiste!!.. quieres probar otra ves?');
		if (continuar) document.location.reload(true);
		else	$("td a").unbind( "click" );
}


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function makes_mines (event) {
	mines = [
				[ getRandomInt(0,2), getRandomInt(0,2), getRandomInt(0,2) ],
				[ getRandomInt(0,2), getRandomInt(0,2), getRandomInt(0,2) ],
				[ getRandomInt(0,2), getRandomInt(0,2), getRandomInt(0,2) ],
			];
}

$(document).on("ready", function () {
	var canvas_tag;
    var explosion, canvas_list, canvas;
    var explosion_img = new Image();

	makes_mines(this);
	$("td a").on("click", function (event) {
		var cell = $(event.currentTarget);
		var td = cell.parent();
		//frenar evento de <a>
		var evt = event ? event:window.event;
		if (evt.preventDefault)   evt.preventDefault();
		else return false;

	if ( mines[cell.data('fila')-1][cell.data('col')-1] == 1) {		
		canvas_tag = "<canvas id=\""+cell.data('fila')+"-"+cell.data('col')+"\"></canvas>";
		cell.remove();
		td.append(canvas_tag);
		var id = cell.data('fila')+"-"+cell.data('col');
		canvas= document.getElementById(id);

		index +=1;
	    explosion_img.src = "img/Explosion-Sprite-Sheet.png";   	
		
		if (animaciones.length > 0) {
			stop(animaciones[0]);
		} 

		if (canvas) {
	      canvas.width = 120;
	      canvas.height = 110;
	      						//canvas, width, height, image, number_Of_Frames, ticks_per_frame, loop
	      explosion = new Animacion(canvas, 600, 110, explosion_img, 5, 5, 0);
	      animaciones.push(explosion);
	      start();
	  	}	 

	} else{
		cell.remove();
		console.log('safe');
	}
	});
	
});