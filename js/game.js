var pantallaActual=1;
var cabezaSerpiente;
var colaSerpiente=[];
var agujero=[];
var cantAgujeros=2;
var agujeroActual;
var punto=new component(1,1, colorPunto,-50,-50,0,0,1,1);//punto inicial para tenerlo antes del load
var huevo=[];
var vecesHuevo=1;
var w = 700;//800
var h = 350;//400
var anchoCanvas;
var altoCanvas;
var anchoArea;
var altoArea;
var orientacion=1; //1: mas ancha, 2: mas alto
var largo=20;
var lado=10;
var direccion=0; //0:quieto, 1:izquierda, 2:arriba, 3:derecha, 4:abajo
var colorActual=1;
var puntoPintado=true;
var xRnd;
var yRnd;
var pRnd;
var colisiones=0;
var maxColisiones=10;
var piezas=0;
var puntos=0;
var restador=3;
var esperar=0;
var reposicionando=false;
var colisiono=false;
var xIni;
var yIni;
var colorSerpiente="#05D21A";
var colorPunto="#348DEC";
var comenzar=false;
var pausar=false;
var game_over=false;
var sonido_catch;
var sonido_crash;
var sonido_hole;
var sonido_huevo;
var sonido_terminado;
var sonido_activado=true;

var myVar; //para cargar pagina
window.onload = function(){ 
	var res = document.createElement("link");
	res.rel = "preload";
	res.as = "style";
	res.href = "css/estilo.css";
	document.head.appendChild(res);
	myVar = setTimeout(startGame, 500);
}

function startGame() {
	dimensionarElementos();
	actualizarDatos();
	//--
	$("#menuPausa").hide();
	$("#juego").hide();
	$("#guardar").hide();
	$("#instrucciones").hide();
	$("#botonera").hide();
	$("#transparente").hide();
	$("#gameOver").hide();
	$("#cabecera").hide();
	
	
	sonido_catch = new sound("sound/sfx_movement_footsteps5.wav",0.6);
	sonido_crash = new sound("sound/sfx_sounds_impact11.wav",0.2);
	sonido_hole = new sound("sound/sfx_sounds_powerup4_hole.wav",0.3);
	sonido_huevo = new sound("sound/sfx_sounds_powerup6_huevo.wav",0.1);
	sonido_terminado= new sound("sound/sfx_sound_shutdown2_game_over.wav",0.2);
	myGameArea.start();
	xIni=0;
	yIni=0;
    cabezaSerpiente = new component(lado, lado, colorSerpiente, xIni, yIni, xIni-lado, yIni,1,1);
	colaSerpiente[0]= new component(lado,lado, colorSerpiente, xIni-lado, yIni,xIni-(lado*2), yIni,1,1);
	huevo[0]= new component(lado, lado,"black",-40,-40,0,0,1,1);
	var valX=xIni-lado;
	for (i=1;i<largo;i++){
		valX=valX-lado;
		colaSerpiente[i]=new component(lado,lado,colorSerpiente, valX, yIni, valX-lado, yIni,1,1);
	}
	
	//agujero
	if(orientacion==1){//pc/horizontal
		agujero[0]= new RoundComponent((lado*3),(lado*3),"black",5*lado+(lado/2),17*lado+(lado/2),0,0);
		agujero[1]= new RoundComponent((lado*3),(lado*3),"black",anchoCanvas-(5*lado+(lado/2)),17*lado+(lado/2),0,0);
		
	}else{//celular/vertical
		agujero[0]= new RoundComponent((lado*3),(lado*3),"black",17*lado+(lado/2),5*lado+(lado/2),0,0);
		agujero[1]= new RoundComponent((lado*3),(lado*3),"black",17*lado+(lado/2),altoCanvas-(5*lado+(lado/2)),0,0);
	}
	//Punto
	pRnd = aleatorioEntre(3);
	xRnd = numeroAleatorio(anchoCanvas/lado)*lado;
	yRnd = numeroAleatorio(altoCanvas/lado)*lado;
	if(validaPosicionPunto(xRnd, yRnd, pRnd)==true){
		punto= new component(lado,lado,colorPunto,xRnd,yRnd,0,0,pRnd,1);
	}else{
		while(validaPosicionPunto(xRnd, yRnd, pRnd)==false){
			xRnd = numeroAleatorio(anchoCanvas/lado)*lado;
			yRnd = numeroAleatorio(altoCanvas/lado)*lado;
			pRnd = aleatorioEntre(3);
		}
		punto= new component(lado,lado, colorPunto,xRnd,yRnd,0,0,pRnd,1);
	}
	actualizarDatos();
	//placard.start();
	
	//-- aparece pagina cargada
	document.getElementById("preload").style.display = "none";
  	document.getElementById("contenedor").style.display = "block";
}

function dimensionarElementos(){
	w=window.innerWidth;
	h=window.innerHeight;
	
	if(w<=h){
		//es mas alto que ancho --> celular
		orientacion=2;
		anchoArea=w*0.9;
		altoArea=h*0.75;
		anchoCanvas=parseInt(anchoArea/10)*10;
		lado=parseInt(anchoCanvas/35);
		anchoCanvas=lado*35;
		altoCanvas=parseInt(altoArea/lado)*lado;
	}else{
		//es mas ancho que alto --> pc o horizontal	
		orientacion=1;
		altoArea=h*0.6;
		anchoArea=w*0.5;
		altoCanvas=parseInt(altoArea/10)*10;
		lado=parseInt(altoCanvas/35);
		altoCanvas=lado*35;
		anchoCanvas=lado*50;
	}
	$("#contenedor").css("height",""+h*0.95+"");
	$("#contenedor").css("width",""+anchoArea+"");
	$("#cabecera").css("width",""+anchoArea+"");
	$("#cabecera").css("height",""+h*0.05+"");
	$("#tablaCabecera").css("width",""+anchoArea+"");
	$("#tablaCabecera").css("height",""+h*0.05+"");
	$("#tablaCabecera").css("text-align","center");
	$(".tituloChico").css("padding-top",""+h*0.05*0.1+"px");
	$("#areaJuego").css("width",""+anchoArea+"");
	$("#areaJuego").css("height",""+altoArea+"");
	$("#menuInicio").css("width",""+anchoArea+"");
	$("#menuInicio").css("height",""+altoArea+"");
	$("#menuPausa").css("width",""+anchoArea+"");
	$("#menuPausa").css("height",""+altoArea+"");
	$("#textoMenu").css("width",""+anchoArea+"");
	$("#textoMenu").css("height",""+altoArea*0.2+"");
	$("#textoMenu").css("padding-top",""+altoArea*0.2+"px");
	$(".boton").css("height",altoArea*0.3*0.2+"");
	$(".boton").css("padding-top",altoArea*0.3*0.2*0.5+"px");
	$("#instrucciones").css("width",""+anchoArea+"");
	$("#instrucciones").css("height",""+altoArea+"");
	$("#gameOver").css("width",""+anchoArea+"");
	$("#gameOver").css("height",""+altoArea+"");
	$("#guardar").css("width",""+anchoArea+"");
	$("#guardar").css("height",""+altoArea+"");
	$("#juego").css("width",""+anchoCanvas+"");
	$("#juego").css("height",""+altoCanvas+"");
	
	$("#botonera").css("width",""+anchoArea+"");
	$("#botonera").css("height",""+h*0.15+"");
	
	$("#tablaBotones").css("width",""+anchoArea+"");
	$("#tablaBotones").css("height",""+h*0.15+"");
	$("#botonIzquierda").css("text-align","right");
	$("#botonDerecha").css("text-align","left");
	$("#botonArriba").css("text-align","center");
	$("#botonAbajo").css("text-align","center");
	
	$("#espacioMedio").css("width",""+(h*0.15)/3+"");
	$(".botonDireccion").css("height",""+(h*0.15)/3+"");
	$(".botonDireccion").css("width",""+(h*0.15)/3+"");
	$("#tablaInstrucciones").css("padding-bottom",anchoCanvas/20+"px");
	$("#tablaInstrucciones td").css("height",anchoCanvas/20+"px");
	$("#imgPunto").css("width",anchoCanvas/35+"");
	$("#imgPunto").css("height",anchoCanvas/35+"");
	$("#imgHuevo").css("width",anchoCanvas/35+"");
	$("#imgHuevo").css("height",anchoCanvas/35+"");
	$("#imgHole").css("min-width",(anchoCanvas/35)*3+"");
	$("#imgHole").css("max-height",(anchoCanvas/35)*3+"");
	$("#imgPad").css("min-width",(anchoCanvas/35)*3+"");
	$("#imgPad").css("max-height",(anchoCanvas/35)*3+"");
		
	$("#logoInicio").css("height",""+h/2.5+"");
	$("#logoInicio").css("padding-top",""+h/6+"px");
}

var myGameArea = {
    canvas : document.getElementById("juego"),
    start : function() {
		this.canvas = document.getElementById("juego");
        this.canvas.width = anchoCanvas;
		this.canvas.height = altoCanvas;
		this.canvas.style.cursor="none";
		//this.canvas.id="juego";
		this.context = this.canvas.getContext("2d");
		/*var container=document.getElementById("contenedor");
		container.appendChild(this.canvas);*/
		this.interval = setInterval(updateGameArea, 120);
		window.addEventListener('keydown', function (e) {
			myGameArea.key = e.keyCode;
			//console.log("tecla: "+e.keyCode);
		})
		window.addEventListener('keyup', function (e) {
			myGameArea.key = false;
		})
    },
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.context.font = "5em myPrStart";
		this.context.fillStyle = "rgb(20,20,20)";
		//this.context.strokeStyle = "rgb(20,20,20)";
		this.context.textAlign ="center"
		this.context.fillText(pantallaActual, (anchoCanvas/2), (altoCanvas/2));
		//this.context.strokeText(pantallaActual, (anchoCanvas/2), (altoCanvas/2),120);
		
	},
	mensaje : function() {
		
	},
	pausado: function(){
		
	},
	terminado: function(){
		$("#menuPausa").hide();
		$("#juego").hide();
		$("#transparente").hide();
		$("#botonera").hide();
		$("#menuInicio").hide();
		$("#gameOver").show();
		
	}
}

function sound(src,vol) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.volume=vol;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function(){
		if(sonido_activado==true){
			this.sound.play();
		}	
	}
	this.stop = function(){
	  this.sound.pause();
	}
  }

  function activarSonido(){
	if(sonido_activado==true){
		sonido_activado=false;
		imagen=document.getElementById("sonido");
		imagen.src="../img/sonido_off.png";
	}else{
		sonido_activado=true;
		imagen=document.getElementById("sonido");
		imagen.src="../img/sonido_on.png";
	}
  }

function component(width, height, color, x, y, xAnt, yAnt, pantalla, pantallaAnt) {
    this.width = width;
    this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.color=color;
    this.x = x;
    this.y = y;
	this.xAnt = xAnt;
	this.yAnt = yAnt;
	this.pantalla=pantalla;
	this.pantallaAnt=pantallaAnt;
	this.tipo="";
	this.update = function(){
		if(this.pantalla==pantallaActual){
			ctx = myGameArea.context;
			if(this.tipo=="huevo"){
				ctx.fillStyle="black";
				ctx.fillRect(this.x, this.y, this.width, this.height)
				ctx.strokeStyle = "white";
				ctx.lineWidth=0.7;
				ctx.strokeRect(this.x, this.y, this.width, this.height);
			}else{
				ctx.fillStyle = this.color;
				ctx.fillRect(this.x, this.y, this.width, this.height);
			}
			
		}
		
	}
	this.newPos = function() {
		
	}
}
function RoundComponent(width, height, color, x, y, xAnt, yAnt) {
    this.width = width;
    this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.color=color;
    this.x = x;
    this.y = y;
	this.xAnt = xAnt;
	this.yAnt = yAnt;	
	this.update = function(){
		ctx = myGameArea.context;
		//primero la sombra
		ctx.shadowColor="white";
		ctx.shadowBlur=10;
		//despues el agujero
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(x, y, (this.width/2), 0, 2 * Math.PI);
		ctx.fill();
		ctx.shadowBlur=0;
	}
}

function updateGameArea() {
	if(game_over==false){
		if (comenzar==true){
			if(pausar==false){
				myGameArea.clear();
				for(i=0;i<cantAgujeros;i++){
					agujero[i].update();
				}
				cabezaSerpiente.update();
				for (i=0;i<largo;i++){
					colaSerpiente[i].update();
				}
				for (i=0;i<huevo.length;i++){
					huevo[i].update();
				}
				controlColisionSerpiente();
				if(reposicionando==false){
					moverSerpiente();
				}else{
					reposicionar();
				}
				//Control colision punto
				if(cabezaSerpiente.x==punto.x && cabezaSerpiente.y==punto.y && cabezaSerpiente.pantalla==punto.pantalla){
					puntoPintado=false;
					sonido_catch.play();
					crece();
					puntos=puntos+10;
					piezas=piezas+1;
					actualizarDatos();
				}
				pintarPunto();
				//controlar colision con agujeros
				if(controlColisionAgujeros()==true){
					sonido_hole.play();
					cambiarPosicion();
					actualizarDatos();
				}
				if (myGameArea.key && myGameArea.key == 32 && reposicionando==false) {pausa();} //barra espaciadora --> pausa
				controlGameOver();
				if (myGameArea.key && myGameArea.key == 37 && reposicionando==false) {moverIzquierda();} //izquierda
				if (myGameArea.key && myGameArea.key == 39 && reposicionando==false) {moverDerecha();} //derecha
				if (myGameArea.key && myGameArea.key == 38 && reposicionando==false) {moverArriba();} //arriba
				if (myGameArea.key && myGameArea.key == 40 && reposicionando==false) {moverAbajo();} //abajo
			}else{
				if (myGameArea.key && myGameArea.key == 13 && reposicionando==false) {reanudar();} //enter --> reanudar
				//myGameArea.pausado();
			}
		}else{
			if (myGameArea.key && myGameArea.key == 13) {empezar();} //enter --> empezar
			//myGameArea.mensaje();
		}
	}else{
		//game over
		if (myGameArea.key && myGameArea.key == 13) {reiniciar();} //enter --> empezar
		myGameArea.terminado();
	}
	
}

function actualizarDatos(){
	$("#txtPuntos").text(""+puntos);
	$("#txtColisiones").text(colisiones+"/"+maxColisiones);
	$("#txtUbicacion").text(""+punto.pantalla);
}

function pausa(){
	$("#juego").hide();
	$("#transparente").hide();
	$("#botonera").hide();
	$("#menuPausa").show();
	document.getElementById("textoMenu").innerHTML = "PAUSADO";
	pausar=true;
}

function reanudar(){
	$("#menuPausa").hide();
	$("#juego").show();
	$("#transparente").show();
	$("#botonera").show();
	$("#cabecera").show();
	pausar=false;
}

function empezar(){
	if (comenzar==false){
		direccion=3;
		comenzar=true;
		$("#menuInicio").hide();
		$("#juego").show();
		$("#transparente").show();
		$("#botonera").show();
		$("#cabecera").show();
		pausar=false;
	}
}
function reiniciar(){
	pausar=false;
	comenzar=true;
	largo=20;
	maxColisiones=10;
	colisiones=0;
	puntos=0;
	piezas=0;
	restador=3;
	vecesHuevo=1;
	huevo.splice(0, huevo.length);
	reposicionando=true;
	reposicionar();
	actualizarDatos();
	game_over=false;
	$("#menuPausa").hide();
	$("#juego").show();
	$("#transparente").show();
	$("#botonera").show();
	$("#cabecera").show();
}
function inicio(){
	pausar=false;
	comenzar=false;
	largo=20;
	maxColisiones=10;
	colisiones=0;
	puntos=0;
	piezas=0;
	restador=3;
	vecesHuevo=1;
	huevo.splice(0, huevo.length);
	reposicionando=true;
	reposicionar();
	game_over=false;
	actualizarDatos();
	$("#menuPausa").hide();
	$("#juego").hide();
	$("#transparente").hide();
	$("#botonera").hide();
	$("#gameOver").hide();
	$("#menuInicio").show();
	$("#cabecera").hide();
}

function mostrarInstrucciones(){
	$("#menuPausa").hide();
	$("#menuInicio").hide();
	$("#juego").hide();
	$("#transparente").hide();
	$("#botonera").hide();
	$("#instrucciones").show();
	$("#cabecera").hide();
}
//vuelve de las instrucciones al menu
function volver(){
	$("#instrucciones").hide();
	if(comenzar==false){
		$("#menuInicio").show();
		$("#cabecera").hide();
	}else{
		$("#menuPausa").show();
		$("#cabecera").show();
	}
}

function moverIzquierda(){
		if (direccion!=3){
			direccion=1;
		}
}
function moverArriba(){
		if (direccion!=4){
			direccion=2;
		}
}
function moverDerecha(){
		if (direccion!=1){
			direccion=3;
		}
}
function moverAbajo(){
		if (direccion!=2){
			direccion=4;
		}
}

function moverCola(xA,yA,pA){
	colaSerpiente[0].xAnt=colaSerpiente[0].x;
	colaSerpiente[0].yAnt=colaSerpiente[0].y;
	colaSerpiente[0].pantallaAnt=colaSerpiente[0].pantalla;
	colaSerpiente[0].x=xA;
	colaSerpiente[0].y=yA;
	colaSerpiente[0].pantalla=pA;
	for (i=1;i<largo;i++){
		colaSerpiente[i].xAnt=colaSerpiente[i].x;
		colaSerpiente[i].x=colaSerpiente[i-1].xAnt;
		colaSerpiente[i].yAnt=colaSerpiente[i].y;
		colaSerpiente[i].y=colaSerpiente[i-1].yAnt;
		colaSerpiente[i].pantallaAnt=colaSerpiente[i].pantalla;
		colaSerpiente[i].pantalla=colaSerpiente[i-1].pantallaAnt;
	}		
}
function controlGameOver(){
	if (puntos<=500){
		maxColisiones=10;
	}else if(puntos>500 && puntos<=1000){
		maxColisiones=15;
	}else if(puntos>1000 && puntos<=2000){
		maxColisiones=20;
	}else{
		maxColisiones=25;
	}

	if(colisiones>=maxColisiones){
		game_over=true;
		sonido_terminado.play();
	}
}
function controlColisionSerpiente(){
	if(reposicionando==false){
		if((cabezaSerpiente.x<=0 && direccion==1)|| (cabezaSerpiente.x+cabezaSerpiente.width>=anchoCanvas && direccion==3) || (cabezaSerpiente.y<=0 && direccion==2) || (cabezaSerpiente.y+cabezaSerpiente.height>=altoCanvas && direccion==4) || controlAutocolision()==true || colisionHuevo()==true){
			sonido_crash.play();
			cambiarColor(colorActual);
			colisiono=true;
			direccion=0;
			cabezaSerpiente.speedX=0;
			cabezaSerpiente.speedY=0;
			reposicionando=true;
		}
	}else{
		reposicionar();
	}
	
}
function moverSerpiente(){
	switch(direccion){
		case 1:
			cabezaSerpiente.xAnt=cabezaSerpiente.x;
			cabezaSerpiente.yAnt=cabezaSerpiente.y;
			cabezaSerpiente.x = cabezaSerpiente.x-lado;
			break;
		case 2:
			cabezaSerpiente.xAnt=cabezaSerpiente.x;
			cabezaSerpiente.yAnt=cabezaSerpiente.y;
			cabezaSerpiente.y = cabezaSerpiente.y-lado;
			break;
		case 3:
			cabezaSerpiente.xAnt=cabezaSerpiente.x;
			cabezaSerpiente.yAnt=cabezaSerpiente.y;
			cabezaSerpiente.x = cabezaSerpiente.x+lado;
			break;
		case 4:
			cabezaSerpiente.xAnt=cabezaSerpiente.x;
			cabezaSerpiente.yAnt=cabezaSerpiente.y;
			cabezaSerpiente.y = cabezaSerpiente.y+lado;
			break;
	}
	cabezaSerpiente.pantallaAnt=cabezaSerpiente.pantalla;
	moverCola(cabezaSerpiente.xAnt,cabezaSerpiente.yAnt,cabezaSerpiente.pantallaAnt);
}

function cambiarColor(colorActual){
	if (colorActual==1){
		cabezaSerpiente.color="red";
		for (i=0;i<largo;i++){
			colaSerpiente[i].color="red"
		}
		colorActual=2;
	}	
}
function reposicionar(){
	if (esperar<20){
		esperar++;
	}else{
		reposicionando=false;
		esperar=0;
		direccion=3;
		pantallaActual=1;
		cabezaSerpiente.color=colorSerpiente;
		cabezaSerpiente.x=(-1)*lado;//xIni
		cabezaSerpiente.y=yIni;
		cabezaSerpiente.xAnt=cabezaSerpiente.x-lado;
		cabezaSerpiente.yAnt=cabezaSerpiente.y;
		cabezaSerpiente.pantalla=pantallaActual;
		cabezaSerpiente.pantallaAnt=pantallaActual;
		
		colaSerpiente[0].color=colorSerpiente;
		colaSerpiente[0].x=cabezaSerpiente.xAnt;
		colaSerpiente[0].y=cabezaSerpiente.y;
		colaSerpiente[0].xAnt=colaSerpiente[0].x-lado;
		colaSerpiente[0].yAnt=colaSerpiente[0].y;
		colaSerpiente[0].pantalla=pantallaActual;
		colaSerpiente[0].pantallaAnt=pantallaActual;
		for(i=1;i<largo;i++){
			colaSerpiente[i].color=colorSerpiente;
			colaSerpiente[i].x=colaSerpiente[i-1].xAnt;
			colaSerpiente[i].y=colaSerpiente[i-1].y;
			colaSerpiente[i].xAnt=colaSerpiente[i-1].xAnt-lado;
			colaSerpiente[i].yAnt=colaSerpiente[i-1].y;
			colaSerpiente[i].pantalla=pantallaActual;
			colaSerpiente[i].pantallaAnt=pantallaActual;
		}
		if (colisiono==true){
			colisiones=colisiones+1;
			if(puntos<=500){
				restador=3;
			}else if(puntos>500 && puntos <=1000){
				restador=5;
			}else{
				restador=8;
			}
			puntos=puntos-restador;
			colisiono=false;
			actualizarDatos();
		}
	}
	
}	
function validaPosicionPunto(xR, yR, pR){
	var valida=true;
	if(xR==cabezaSerpiente.x && yR==cabezaSerpiente.y && pR==cabezaSerpiente.pantalla){
		valida=false;
	}else{ 
		i=0;
		while(valida==true && i<largo){
			if(xRnd==colaSerpiente[i].x && yRnd==colaSerpiente[i].y && colaSerpiente[i].pantalla==pR){
				valida=false;
			}
			i++;
		}
		i=0;
		while (i<cantAgujeros && valida==true){
			if((xR==(agujero[i].x -(lado/2))) && (yR==agujero[i].y -(lado/2))){
				valida=false;
			}
		i++;
		}
		i=0;
		while (i<huevo.length && valida==true){
			if(xR==huevo[i].x && yR==huevo[i].y && pR==huevo[i].pantalla){
				valida=false;
			}
		i++;
		}
	}
	if(xR<0 || xR>=anchoCanvas || yR<0 || yR>=altoCanvas){
		valida=false;
	}
	return valida;
}

function pintarPunto(){
	if(puntoPintado==false){
		xRnd = numeroAleatorio(anchoCanvas/lado)*lado;
		yRnd = numeroAleatorio(altoCanvas/lado)*lado;
		pRnd = aleatorioEntre(3);
		while(validaPosicionPunto(xRnd, yRnd, pRnd)==false){
			xRnd = numeroAleatorio(anchoCanvas/lado)*lado;
			yRnd = numeroAleatorio(altoCanvas/lado)*lado;
			pRnd = aleatorioEntre(3);
		}
		punto.x=xRnd;
		punto.y=yRnd;
		//console.log("pantalla punto: "+pRnd);
		punto.pantalla=pRnd;
		puntoPintado=true;
		punto.update();
		actualizarDatos();
	}else{
		punto.update();
	}
}

function crece(){
	for (i=0;i<2;i++){
		largo=largo+1;
		colaSerpiente[largo-1]= new component(lado,lado,colorSerpiente,colaSerpiente[largo-2].xAnt,colaSerpiente[largo-2].yAnt,-80,-80,colaSerpiente[largo-2].pantallaAnt,colaSerpiente[largo-2].pantallaAnt);
	}
	//huevo
	if(vecesHuevo<2){
		vecesHuevo+=1;
	}else{
		if((colaSerpiente[largo-3].yAnt==yIni && (colaSerpiente[largo-3].xAnt>=0 && 
			colaSerpiente[largo-3].xAnt<amchoCanvas/5) && colaSerpiente[largo-3].pantallaAnt==1) || 
			cercaAgujeos(colaSerpiente[largo-3].xAnt, colaSerpiente[largo-3].yAnt)==true){
			vecesHuevo=2;
		}else{
			var cantHuevos;
			cantHuevos=huevo.length;
			huevo[cantHuevos]= new component(lado,lado,"#F24602",colaSerpiente[largo-3].xAnt,colaSerpiente[largo-3].yAnt,0,0,colaSerpiente[largo-3].pantallaAnt,colaSerpiente[largo-3].pantallaAnt);
			huevo[cantHuevos].tipo="huevo";
			sonido_huevo.play();
			vecesHuevo=1;
		}
		
	}
	
}

function cercaAgujeos(x,y){
	var cerca=false;
	var i=0;
	while(i<cantAgujeros && cerca==false){
		if(x>=agujero[i].x-(agujero[i].width*3) && x<=agujero[i].x+agujero[i].width+(agujero[i].width*3) && 
		y>=agujero[i].y-(agujero[i].height*3) && y<=(agujero[i].y+agujero[i].height)+(agujero[i].height*3)){
			cerca=true;
		}
		i++;
	}
	
	return cerca;
}

function controlAutocolision(){
	var colisiona=false;
	i=0;
	while (i<largo && colisiona==false){
		if(cabezaSerpiente.x==colaSerpiente[i].x && cabezaSerpiente.y==colaSerpiente[i].y && cabezaSerpiente.pantalla==colaSerpiente[i].pantalla){
			colisiona=true;
		}
		i++;
	}
	return colisiona;
}
function controlColisionAgujeros(){
	var colisiona=false;
	i=0;
	while (i<cantAgujeros && colisiona==false){
		if(cabezaSerpiente.x==agujero[i].x-(lado/2) && (cabezaSerpiente.y==agujero[i].y-(lado/2))){
			colisiona=true;
			agujeroActual=i;
		}
		i++;
	}
	return colisiona;
}
function colisionHuevo(){
	var colisiona=false;
	i=0;
	while (i<huevo.length && colisiona==false){
		if(cabezaSerpiente.x==huevo[i].x && cabezaSerpiente.y==huevo[i].y && cabezaSerpiente.pantalla==huevo[i].pantalla){
			colisiona=true;
		}
		i++;
	}
	return colisiona;
}

function cambiarPosicion(){
	var hole=agujeroOpuesto();
	switch(direccion) {
		case 3: //derecha
			cabezaSerpiente.x=agujero[hole].x+(lado/2);
			cabezaSerpiente.y=agujero[hole].y-(lado/2);
			break;
		case 4: //abajo
			cabezaSerpiente.x=agujero[hole].x-(lado/2);
			cabezaSerpiente.y=agujero[hole].y+(lado/2);
			break;
		case 1: //izquierda
			cabezaSerpiente.x=agujero[hole].x-(lado+(lado/2));
			cabezaSerpiente.y=agujero[hole].y-(lado/2);
			break;
		case 2: //arriba
			cabezaSerpiente.x=agujero[hole].x-(lado/2);
			cabezaSerpiente.y=agujero[hole].y-(lado+(lado/2));
			break;
		default:
			// code block
	}
	
}	

function agujeroOpuesto(){
	var opuesto;
	switch(agujeroActual){
		case 0:
			opuesto=1;
			cabezaSerpiente.pantallaAnt=pantallaActual;
			if(pantallaActual==1){
				pantallaActual=3;
			}else if(pantallaActual==2){
				pantallaActual=1;
			}else{
				pantallaActual=2;
			}
			cabezaSerpiente.pantalla=pantallaActual;
			break;
		case 1:
			cabezaSerpiente.pantallaAnt=pantallaActual;
			if(pantallaActual==1){
				pantallaActual=2;
			}else if(pantallaActual==2){
				pantallaActual=3;
			}else{
				pantallaActual=1;
			}
			opuesto=0;
			cabezaSerpiente.pantalla=pantallaActual;
			break;
		case 2:
			opuesto=3;
			break;
		case 3:
			opuesto=2;
			break;
	}
	return opuesto;
}
function numeroAleatorio(cant){
	var aux=0;
	var aleatorio=0;
	aleatorio = Math.floor(Math.random() * cant); // de cero a cant-1
	//aleatorio= Math.round(aux/10)*10;
	return aleatorio;
}
function aleatorioEntre(numero){
	var aleatorio=0;
	aleatorio= parseInt(Math.random() * numero)+1;
	return aleatorio;
}

