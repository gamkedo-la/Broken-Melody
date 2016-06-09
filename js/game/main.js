var canvas, canvasContext;
var hudCan, hudCanContext;

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

var mouseOverPlay = false;
var mouseOverContinue = false;

const NEW_BUTTON_X = 426;
const NEW_BUTTON_Y = 366;
const CONTINUE_BUTTON_X = 426;
const CONTINUE_BUTTON_Y = 450;

const MENU_BUTTON_WIDTH = 289;
const MENU_BUTTON_HEIGHT = 74;

const MUTE_BUTTON_X = 570;
const MUTE_BUTTON_Y = 10;

const MUTE_BUTTON_WIDTH = 29;
const MUTE_BUTTON_HEIGHT = 30;

var muted = false;

var pizzaTime = 0;

function displayMerchantText(){
    var textWidth = 250;
    var textHeight = 20;
    var textY = canvas.height - 40;
    var boxY = textY - 16;
    colorRect(canvas.width / 2 - textWidth / 2, boxY, textWidth, textHeight, 'white');
    canvasContext.fillStyle = 'black';
    var savedTextAlign = canvasContext.textAlign;
    canvasContext.textAlign = "center";
    canvasContext.fillText("Would you like to buy something?",canvas.width / 2, textY);
    canvasContext.textAlign = savedTextAlign;
}

function displayRemainingDeliveries(){
    if(isWinner){
        return;
    }
    var textY = 80;
    hudCanContext.fillStyle = "yellow";
    hudCanContext.font = "20px Consolas MS";
    hudCanContext.fillText("Remaining Deliveries: " + remainingDeliveries, 110, textY);
}

function updateTime () {
  gameTime ++;
  if (gameTime == 30) {
    gameTime = 0;
    timeS++;
      if (pizzaTime > 0) {
          pizzaTime--;
      }
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

function drawSpeaker(){
    if(muted){
        hudCanContext.drawImage(speakerMuted, MUTE_BUTTON_X, MUTE_BUTTON_Y);
    } else {
        hudCanContext.drawImage(speakerNotMuted, MUTE_BUTTON_X, MUTE_BUTTON_Y);
    }
}

function loadProgress(){
  if(typeof(Storage) !== "undefined") {
    money = JSON.parse(localStorage.localMoney);
    hasPistol = JSON.parse(localStorage.localHasPistol);
    hasRifle = JSON.parse(localStorage.localHasRifle);
    hasArmor = JSON.parse(localStorage.localHasArmor);
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
  audio_music.play();
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  hudCan = document.getElementById('hudCan');
  hudCanContext = hudCan.getContext('2d');

  canvasContext.font = "14px Merriweather";

  initInput();

  loadLevelsBesidesFirstOne();

  // these next few lines set up our game logic and render to happen 30 times per second
  var framesPerSecond = 30;
  setInterval(function() {
      if(gameGoing) {
        moveEverything();
        drawEverything();
        updateTime();
      } else {
        if (isWinner) {
          canvasContext.drawImage(endScreen, 0, 0);
          hudCanContext.drawImage(endScreen, 0, 0);
        } else {
          canvasContext.drawImage(startScreen, 0, 0);
          if (mouseOverPlay) {
              rect(NEW_BUTTON_X,NEW_BUTTON_Y,MENU_BUTTON_WIDTH,MENU_BUTTON_HEIGHT,2,"#2E86AB");
          }
          if (mouseOverContinue && localStorage.localMoney) {
              rect(CONTINUE_BUTTON_X,CONTINUE_BUTTON_Y,MENU_BUTTON_WIDTH,MENU_BUTTON_HEIGHT,2,"#2E86AB");
          }
          if(!allImagesLoaded){
          canvasContext.fillStyle = "red";
          canvasContext.fillText("Images Loading", 15, 15);
          }
          if(!localStorage.localMoney){
            canvasContext.drawImage(buttonNoWork, CONTINUE_BUTTON_X, CONTINUE_BUTTON_Y);
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
  displayRemainingDeliveries();

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

  canvasContext.fillStyle = 'white';
    hudCanContext.clearRect(0, 0, 800, 600);

  if (timerDelay > 0) {
    timerDelay --;
  }

  if (damagedRecentely > 0) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Ow",playerX - camPanX -5, playerY - camPanY + (damagedRecentely/5  ));
  }

  if(whichBrickAtPixelCoord(playerX,playerY+PLAYER_RADIUS,true) == TILE_PISTOL && money < pistolCost){
    canvasContext.fillStyle = 'black';
    canvasContext.fillText("Not enough money!",playerX - camPanX -5, playerY - camPanY + 50);
  }
    if(whichBrickAtPixelCoord(playerX,playerY+PLAYER_RADIUS,true) == TILE_RIFLE && money < rifleCost){
    canvasContext.fillStyle = 'black';
    canvasContext.fillText("Not enough money!",playerX - camPanX -5, playerY - camPanY + 50);
  }
    if(whichBrickAtPixelCoord(playerX,playerY+PLAYER_RADIUS,true) == TILE_ARMOR && money < armorCost){
    canvasContext.fillStyle = 'black';
    canvasContext.fillText("Not enough money!",playerX - camPanX -5, playerY - camPanY + 50);
  }
    drawShot();
    canvasContext.restore(); // undoes the .translate() used for cam scroll
    displayRemainingDeliveries();
    hudCanContext.save();
    hudCanContext.restore();
    drawHealthHud();
    drawShieldHud();
    drawFunds();
    drawWeapons();
    drawSpeaker();
    
  


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
    if(onMerchant){
        displayMerchantText();
    }

} // end draw everything
