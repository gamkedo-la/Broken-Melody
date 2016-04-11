var canvas, canvasContext;

var gameTime = 0;
var timeH = 0;
var timeM = 0;
var timeS = 0;

var countdown = 0;
var timeSCD = 30;
var timeMCD = 2;
var wobble = 1;

var gameGoing = false;
var isWinner = false;

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

  if(wasStabbed) {
    countdown ++;
    if (countdown == 30) {
      countdown = 0;
      timeSCD --;
    }
    if (timeSCD == 0) {
      if (timeMCD == 0) {
        playerRestoreFromStoredRoomEntry();
      } else {
        timeSCD = 59;
        timeMCD --;
      }

    }
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  initInput();

  loadLevelsBesidesFirstOne();

  loadLevel(); // load stage for game's location in the overall world grid
//   loadLevel(loadedLevelJSON); // uncomment to test hand-coded/added stage in levels.js

  playerReset(); // only calling this for first room player starts in
  // enemyPlacementFly();
  // enemyPlacementAnt();

  sliderReset();

  // these next few lines set up our game logic and render to happen 30 times per second
  var framesPerSecond = 30;
  setInterval(function() {
      if(gameGoing) {
        moveEverything();
        drawEverything();
        updateTime();
        if (health <= 0) {
          canvasContext.drawImage(deadScreen, 0, 0);
        }

        if (roomsOverC == 4 && roomsDownR == 0 && playerY < 240 && wasStabbed == true) {
          isWinner = true;
          gameGoing = false;
          audio_music.pause()
        }


      } else {
        if (isWinner) {
          canvasContext.drawImage(endScreen, 0, 0);
          canvasContext.fillStyle = 'Green';
          canvasContext.fillText("Total Time:" ,400, 240);
          canvasContext.fillText(timeH + ":" + timeM + ":" + timeS ,400, 260);
          canvasContext.fillText("Bonuse Keys:" ,400, 340);
          canvasContext.fillText(numberOfKeys ,480, 340);
        } else {
          canvasContext.drawImage(startScreen, 165, 140);
        }
      }
    }, 1000/framesPerSecond);
}

function moveEverything() {
  if(health > 0) {
    playerMove();
  }
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
}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, "#704000");

  canvasContext.save(); // needed to undo this .translate() used for scroll

  // this next line is like subtracting camPanX and camPanY from every
  // canvasContext draw operation up until we call canvasContext.restore
  // this way we can just draw them at their "actual" position coordinates

  // wasStabbed = true; // uncomment to test/tune screen shake for escape route
  if(wasStabbed) {
    canvasContext.translate(-camPanX+Math.random()*wobble,-camPanY+Math.random()*wobble);
  } else {
    canvasContext.translate(-camPanX,-camPanY);
  }

  canvasContext.drawImage(backgroundPic,0, 0);

  if (roomsOverC == 4 && roomsDownR == 2) {
    antQueenState = 1;
  } else {
    antQueenState = 0;
  }

  if (antQueenState == 1) {
    var queenFrame;
    //queenFrame = animFrame % QUEEN_FRAMES;
    //queenWingFrame = animFrame % QUEEN_WING_FRAMES;
    if (wasStabbed) {
      drawFacingLeftOption(queenAntDeadPic,720,520,false);
    } else {
      drawFacingLeftOption(queenAntPic,720,520,false, queenFrame);
    }

    //drawFacingLeftOption(queenAntWingPic,840,700,false, queenWingFrame);
  }

  drawOnlyBricksOnScreen();

  if(wasStabbed ==false) {
    for(var i=0;i<enemyList.length;i++) {
      enemyList[i].enemyCollideAndDraw();
    }
  }

  drawplayer();

  drawShot();

  canvasContext.restore(); // undoes the .translate() used for cam scroll

  drawHealthHud();

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

  if (wasStabbed) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Escape before time runs out!: " + timeMCD + ":" + timeSCD ,300, 20);
  }

  if (numberOfKeys > 0) {
    var keyArtDim = tileKeyPic.height;
    for (var i = 1; i < numberOfKeys + 1; i++) {
      canvasContext.drawImage(tileKeyPic,
        0, 0, // don't animtate, just set top-left corner of tile art
        keyArtDim,keyArtDim, // get full tile size from source
        720 - (60 * i),0, // x,y top-left corner for image destination
        keyArtDim, keyArtDim);
    }

  }

  if (hasGoldKey) {
    canvasContext.drawImage(majorKey, 735, 65)
  }

  if (damagedRecentely > 0) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Ow",playerX - camPanX -5, playerY - camPanY + (damagedRecentely/5  ));
  }

}

function sliderReset() {
  // center slider on screen
  sliderX = canvas.width/2;
  sliderY = canvas.height/2;
}
