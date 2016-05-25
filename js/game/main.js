var canvas, canvasContext;

var gameTime = 0;
var timeH = 0;
var timeM = 0;
var timeS = 0;

var slideDir = DIR_NONE;
var slidePx = 0;
const ROOM_PAN_SPEED = 10;

var countdown = 0;
var timeSCD = 30;
var timeMCD = 2;
var wobble = 1;

var paused = false;

var gameGoing = false;
var isWinner = false;

const NEW_BUTTON_X = 25;
const NEW_BUTTON_Y = 432;
const CONTINUE_BUTTON_X = 25;
const CONTINUE_BUTTON_Y = 516;

const MENU_BUTTON_WIDTH = 289;
const MENU_BUTTON_HEIGHT = 74;

function updateTime () {
  gameTime ++;
  if (gameTime == 30) {
    gameTime = 0;
    timeS ++;
  }
  if (timeS == 60) {
    timeS = 0;
    timeM ++;
    wobble += 2;
  }
  if (timeM == 60) {
    timeM = 0;
    timeH ++;
  }
}

function loadProgress(){
  if(typeof(Storage) !== "undefined") {
    if(localStorage.localMoney) {
      money = JSON.parse(localStorage.localMoney);
    } else {
      money = 0;
    }
    if(localStorage.localHasPistol){
      hasPistol = JSON.parse(localStorage.localHasPistol);
    } else {
      hasPistol = false;
    }
    if(localStorage.localHasRifle){
      hasRifle = JSON.parse(localStorage.localHasRifle);
    } else {
      hasRifle = false;
    }
    if(localStorage.localHasArmor){
      hasArmor = JSON.parse(localStorage.localHasArmor);
    } else {
      hasArmor = false;
    }
  } else {
    console.log("web storage not supported on your browser!");
  }
}

function saveProgress(){
  if(typeof Storage !== "undefined") {
      localStorage.localMoney = JSON.stringify(money);
      localStorage.localHasPistol = JSON.stringify(hasPistol);
      localStorage.localHasRifle = JSON.stringify(hasRifle);
      localStorage.localHasArmor = JSON.stringify(hasArmor);
  } else {
    console.log("web storage not supported");
  }
}

function pauseGame(){
  if(paused){
    paused = false;
  } else {
    paused = true;
  }
}

function startGame(){
  loadLevel(); // load stage for game's location in the overall world grid
//   loadLevel(loadedLevelJSON); // uncomment to test hand-coded/added stage in levels.js
  playerStoreRoomEntry();
  playerReset(); // only calling this for first room player starts in.
  gameGoing = true;
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  initInput();

  loadLevelsBesidesFirstOne();

  // these next few lines set up our game logic and render to happen 30 times per second
  var framesPerSecond = 30;
  setInterval(function() {
      if(gameGoing) {
        moveEverything();
        drawEverything();
        updateTime();
        // if (health <= 0) {
        //   canvasContext.drawImage(deadScreen, 0, 0);
        // }
      } else {
        if (isWinner) {
          canvasContext.drawImage(endScreen, 0, 0);
          canvasContext.fillStyle = 'Green';
          canvasContext.fillText("Total Time:" ,400, 240);
          canvasContext.fillText(timeH + ":" + timeM + ":" + timeS ,400, 260);
          canvasContext.fillText("Bonuse Keys:" ,400, 340);
          canvasContext.fillText(numberOfPizzas ,480, 340);
        } else {
          canvasContext.drawImage(startScreen, 0, 0);
          if(!allImagesLoaded){
          canvasContext.fillStyle = "red";
          canvasContext.fillText("Images Loading", 15, 15);
          }
        }
      }
    }, 1000/framesPerSecond);
  loadImages();
}

function moveEverything() {
  if(slideDir != DIR_NONE){
      return;
  }
  if(paused){
    return;
  }

  playerMove();

  cameraFollow();
  if (abilityCoolDown > 0) {
    abilityCoolDown --;
  }

  if (damagedRecentely > 0) {
    damagedRecentely --;
  }
  if (resetTimer != 0) {
    resetTimer --;
  }
  
  for(var i=0;i<enemyList.length;i++) {
    enemyList[i].enemyMove();
  }
  
  for(var i=enemyList.length-1;i>=0;i--) {
    if(enemyList[i].readyToRemove){
        enemyList.splice(i,1);
    }
  }
  
}

function drawEverything() {
//   colorRect(0, 0, canvas.width, canvas.height, "#704000");

  canvasContext.save(); // needed to undo this .translate() used for scroll

  switch(slideDir){
      case DIR_N:
        canvasContext.translate(0, slidePx - canvas.height);
        break;
      case DIR_E: // this works!
        canvasContext.translate(canvas.width + slidePx, 0);
        break;
      case DIR_S: // woohoo! ^
        canvasContext.translate(0, slidePx + canvas.height);
        break;
      case DIR_W:
        canvasContext.translate(slidePx - canvas.width, 0);
        break;
  }
  
  // canvasContext.drawImage(backgroundPic,0, 0);

  drawOnlyBricksOnScreen();

  if(paused){
    canvasContext.drawImage(pausedPic, 200, canvas.height / 3);
    return;
  }
  
  for(var i=0;i<enemyList.length;i++) {
    enemyList[i].enemyDraw();
  }

  if(slideDir == DIR_NONE) {
    drawplayer();
  }

  drawShot();

  drawHealthHud();

  drawFunds();

  canvasContext.fillStyle = 'white';

  if (timerDelay > 0) {
    timerDelay --;
  }

  if (hasMap && tutorialTimerMap < 200) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Press M to bring up the Map",playerX - camPanX -60, playerY -20 - camPanY);
    tutorialTimerMap ++;
  }
  if (showMap) {
    canvasContext.drawImage(hudMapPic, 0, 0)
    mapDotX = 2 + (88 * roomsOverC)
    mapDotY = 5 + (66 * roomsDownR)
    canvasContext.drawImage(mapDotPic, mapDotX, mapDotY)
  }

  if (showTimer == true) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(timeH + ":" + timeM + ":" + timeS ,400, 40);
  }

  if (numberOfPizzas > 0) {
    var keyArtDim = tilePizzaPic.height;
    for (var i = 1; i < numberOfPizzas + 1; i++) {
      canvasContext.drawImage(tilePizzaPic,
        0, 0, // don't animtate, just set top-left corner of tile art
        keyArtDim,keyArtDim, // get full tile size from source
        720 - (60 * i),0, // x,y top-left corner for image destination
        keyArtDim, keyArtDim);
    }

  }

  if (damagedRecentely > 0) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Ow",playerX - camPanX -5, playerY - camPanY + (damagedRecentely/5  ));
  }

  if(whichBrickAtPixelCoord(playerX,playerY+PLAYER_RADIUS,true) == TILE_PISTOL && money < 15){
    canvasContext.fillStyle = 'black';
    canvasContext.fillText("Not enough money!",playerX - camPanX -5, playerY - camPanY + 50);
  }
    if(whichBrickAtPixelCoord(playerX,playerY+PLAYER_RADIUS,true) == TILE_RIFLE && money < 15){
    canvasContext.fillStyle = 'black';
    canvasContext.fillText("Not enough money!",playerX - camPanX -5, playerY - camPanY + 50);
  }
    if(whichBrickAtPixelCoord(playerX,playerY+PLAYER_RADIUS,true) == TILE_ARMOR && money < 15){
    canvasContext.fillStyle = 'black';
    canvasContext.fillText("Not enough money!",playerX - camPanX -5, playerY - camPanY + 50);
  }
  
  canvasContext.restore(); // undoes the .translate() used for cam scroll

  switch (slideDir){
      case DIR_N:
        canvasContext.drawImage(canvas, 0, ROOM_PAN_SPEED);
        slidePx += ROOM_PAN_SPEED;
        if (slidePx > canvas.height){
            slideDir = DIR_NONE;
            slidePx = 0;
        }
        break;
      case DIR_E:
        canvasContext.drawImage(canvas, -ROOM_PAN_SPEED, 0);
        slidePx -= ROOM_PAN_SPEED;
        if (slidePx < -canvas.width){
            slideDir = DIR_NONE;
            slidePx = 0;
        }
        break;
      case DIR_S:
        canvasContext.drawImage(canvas, 0, -ROOM_PAN_SPEED);
        slidePx -= ROOM_PAN_SPEED;
        if (slidePx < -canvas.height){
            slideDir = DIR_NONE;
            slidePx = 0;
        }
        break;
      case DIR_W:
        canvasContext.drawImage(canvas, ROOM_PAN_SPEED, 0);
        slidePx += ROOM_PAN_SPEED;
        if (slidePx > canvas.width){
            slideDir = DIR_NONE;
            slidePx = 0;
        }
        break;
  }
  

} // end draw everything

