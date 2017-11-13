var game_loop;
var canvas;
var ctx;
var player;
var imgCoin;
var coin;
var imgCoin;
var timer; 
var score;
var enemy;
var imgEnemy;
var numberOfEnemies;
var spawnEnemy;
var shoots;
var hearts;
var imgLife;

$(document).ready(main_game);

function main_game(){
    
    //Inicializar variables globales
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    
    timer = 0;
    score = 0;
    numberOfEnemies = 0;
    spawnEnemy = 5;
    hearts = 3;
    
    enemy = new Array(2);
    imgEnemy = new Array(2);
    shoots = new Array(4);
    
    
    imgPlayer = new Image();
    imgPlayer.src = "img/astronaut.png";
    
    imgCoin = new Image();
    imgCoin.src = "img/coin.png";
    
    imgEnemy[0] = new Image();
    imgEnemy[0].src = "img/ship_l.png";
    
    imgEnemy[1] = new Image();
    imgEnemy[1].src = "img/ship_r.png";
    
    
    imgPlayer.onload = function () {
        player = {direction:"s", posX:Math.floor((canvas.width/2)), posY:Math.floor((canvas.height/2)), width:30, height:38};        
    };   
    
    imgCoin.onload = function () {
        coin = {draw: false, posX:0, posY:0, width:30, height:29};
    };
    
    imgEnemy[0].onload = function () {
        enemy[0] = {velocity:5, direction:"d", posX:5, posY:5, width:60, height:60};        
    };
    
    imgEnemy[1].onload = function () {
        enemy[1] = {velocity:5, direction:"t", posX:canvas.width-60-5, posY:canvas.height-60-5, width:60, height:60};       
    };
    
    for (var i=0; i<shoots.length; i++){
        if (i%2===0){
            shoots[i] = {draw: false, direction:"r", timer:0, velocity:10, posX:0, posY:0, width:20, height:5};    
        }else{
            shoots[i] = {draw: false, direction:"l", timer:0, velocity:10, posX:0, posY:0, width:20, height:5};
        }
    }
    
    imgLife = new Image();
    imgLife.src = "img/life.png";

    init();
    
};

function cleanCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
};

/* DRAW */
function drawPlayer (){    
    ctx.drawImage(imgPlayer, player.posX, player.posY, player.width, player.height);    
};

function drawCoin(){
                    
    if (coin.draw){
        
        ctx.drawImage(imgCoin, coin.posX, coin.posY, coin.width, coin.height);   
        timer ++;
        if (timer > 300){
            coin.draw = false;
            timer = 0;
        }
    }
}

function drawScore(){
    var text = "Score: " + score;
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(text,10,30);     
};

function drawLifes(){
    for (var i=0; i<hearts; i++){
        ctx.drawImage(imgLife, 10 + (i*35), 40, 35, 35); 
    }
}

function drawEnemies (){
                    
    for (var i=0; i<numberOfEnemies; i++){  
            ctx.drawImage(imgEnemy[i], enemy[i].posX, enemy[i].posY, enemy[i].width, enemy[i].height);   
    }
}

function drawShoot (){
    for (i=0; i<shoots.length; i++){
        if (shoots[i].draw){
            ctx.save();                    
            ctx.fillStyle = "red";
            ctx.fillRect(shoots[i].posX,shoots[i].posY,shoots[i].width,shoots[i].height);
            ctx.restore();
        }
    }
}

/* MOVE */
function movePlayer(){
                    
    switch(player.direction){
        case "r":
            player.posX += 5; 
            break;
        case "l":
            player.posX -= 5; 
            break;
        case "t":
            player.posY -= 5;
            break;
        case "d":
            player.posY += 5;
            break;
    }                                                           
};

function moveEnemies(){
                    
    for (var i=0; i<numberOfEnemies; i++){
        switch(enemy[i].direction){
            case "t":
                enemy[i].posY -= enemy[i].velocity;
                break;
            case "d":
                enemy[i].posY += enemy[i].velocity;
                break;
        }
    }                                                                                                   
}

function moveShoots(){
                    
    for (var i=0; i<shoots.length; i++){
        if (shoots[i].draw){
            switch(shoots[i].direction){
                case "r":
                    shoots[i].posX += shoots[i].velocity;
                    break;
                case "l":
                    shoots[i].posX -= shoots[i].velocity;
                    break;
            }
        }        
    }                                                                                                   
}

/* COLLISION */
function borderCollision (){
    //Colisión borde superior
    if(player.posY <= 5 && player.direction === "t") {
        player.posY = 5;
        player.direction = "s";
    }
    //Colisión borde inferior
    if(player.posY + player.height >= canvas.height - 5 && player.direction === "d") {
        player.posY = canvas.height - player.height - 5;
        player.direction = "s";
    }
    //Colisión borde izquierdo
    if(player.posX <= 5 && player.direction === "l"){
        player.posX = 5;
        player.direction = "s";
    }
    //Colisión borde derecho   
    if(player.posX + player.width >= canvas.width - 5 && player.direction === "r") {
        player.posX = canvas.width - player.width - 5;
        player.direction = "s";
    }
    
    for (var i=0; i<numberOfEnemies; i++){
                        
        if(enemy[i].posY <= 5 && enemy[i].direction === "t") {
            enemy[i].posY = 0;
            enemy[i].direction = "d";
        }

        if(enemy[i].posY + enemy[i].height >= canvas.height-5 && enemy[i].direction === "d") {
            enemy[i].posY = canvas.height - enemy[i].height - 5;
            enemy[i].direction = "t";
        }
    }   
    
    for (var i=0; i<shoots.length; i++){
        
        if (shoots[i].draw){
            if ((shoots[i].posX <= 5 && shoots[i].direction === "l") || (shoots[i].posX + shoots[i].width >= canvas.width - 5 && shoots[i].direction === "r")){               
                shoots[i].timer = 0;    
                shoots[i].draw = false;
            }
        }
        
    }
}

function coinCollision (){
    
    var colisionT = player.posY <= coin.posY + coin.height;
    var colisionD = player.posY + player.height >= coin.posY;
    var colisionL = player.posX + player.width >= coin.posX;
    var colisionR = player.posX <= coin.posX + coin.width;
    
    if (coin.draw && colisionT && colisionD && colisionL && colisionR) {
        coin.draw = false;
        timer = 0;
        score += 5;
        
        if (player.height < 100 && score%25 === 0){
            player.height = Math.floor(1.25*player.height);
            player.width = Math.floor(1.25*player.width);
            shoots[0].velocity++;
            shoots[1].velocity++;
            shoots[2].velocity++;
            shoots[3].velocity++;
        }
        
        increaseEnemies();
    }
}

function shootCollision (){
    
    var colisionL, colisionR, colisionT, colisionD;
    
    for (var i=0; i<shoots.length; i++){
        if(shoots[i].draw){
            colisionL = player.posX + player.width >= shoots[i].posX;
            colisionR = player.posX <= shoots[i].posX + shoots[i].width;
            colisionT = player.posY <= shoots[i].posY + shoots[i].height;
            colisionD = player.posY + player.height >= shoots[i].posY;
            
            if (colisionL && colisionR && colisionT && colisionD){
                shoots[i].timer = 0;    
                shoots[i].draw = false;
                hearts--;
            }
                                 
        }
        
    }
    
    
}

/* OTRAS */
function coinProbability(){
    if (!coin.draw && Math.floor((Math.random()*10)+1) < 4 ){
        coin.posX = Math.floor(Math.random()*(canvas.width - coin.width));
        coin.posY = Math.floor(Math.random()*(canvas.height - coin.height));
        coin.draw = true;
    }
}

function increaseEnemies(){
    if(spawnEnemy<score && numberOfEnemies < enemy.length){
        enemy[numberOfEnemies].velocity = Math.floor(Math.random()*4)+1;
        enemy[numberOfEnemies].draw = true;
        numberOfEnemies++;
        spawnEnemy+=5;
    }
}

function shotter(){
    for (var i=0; i<shoots.length; i++){
        
        if (!shoots[i].draw && enemy[i%2].draw){
        
            if ((shoots[i].timer > 50 && i < 2) ||(shoots[i].timer > 100 && i >= 2)){                            
                shoots[i].draw = true;
                ReiniciarPosicion(i);
            }else{
                shoots[i].timer++;
            }
        }
    }
}

function ReiniciarPosicion (indice){   
    shoots[indice].posY = enemy[indice%2].posY + Math.floor(enemy[indice%2].height/2);
    
    if (shoots[indice].direction === "r"){
        shoots[indice].posX = 60;
    }else{
        shoots[indice].posX = canvas.width-60;
    }
    
}

function checkLife (){
    if (hearts===0){
        cleanCanvas();
        
        var text = "FIN DEL JUEGO: Score " + score;
        ctx.font = "50px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign="center";
        ctx.fillText(text,canvas.width/2,canvas.height/2); 
        
        window.clearInterval(game_loop);
    }
}

$(document).keydown(function(event){
    var key = event.which; 

    switch (key){
         case 39:
            player.direction = "r";
            break;
         case 37:
            player.direction = "l";
            break;
         case 38:
            player.direction = "t";
            break;
         case 40:
            player.direction = "d";
            break;                        
    }

 });

function init(){
    if(typeof game_loop !=="undefined"){
        window.clearInterval(game_loop);
    }
    game_loop = setInterval(main_loop,30);
}

function main_loop () {
    cleanCanvas(); 
    
    coinProbability();    
    
    movePlayer();
    moveEnemies();
    shotter();
    moveShoots();
    
    borderCollision();
    coinCollision();
    shootCollision();
    
    drawPlayer();
    drawCoin();
    drawEnemies();
    drawShoot();
    drawScore();
    drawLifes();    
    
    checkLife();
    
}
