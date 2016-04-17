var playerPic = document.createElement("img");
playerPic.src = "images/player-sheet.png";

var shieldPic = document.createElement("img");
shieldPic.src = "images/shield.png";
var playerSwordPic = document.createElement("img");
playerSwordPic.src = "images/playerSwordPic.png";

const PLAYER_RUN_FRAMES = 4;

var hudHealth1Pic = document.createElement("img");
hudHealth1Pic.src = "images/hudHealth1.png";
var hudHealth2Pic = document.createElement("img");
hudHealth2Pic.src = "images/hudHealth2.png";
var hudHealth3Pic = document.createElement("img");
hudHealth3Pic.src = "images/hudHealth3.png";
var hudHealth0Pic = document.createElement("img");
hudHealth0Pic.src = "images/hudHealth0.png";

var hudMapPic = document.createElement("img");
hudMapPic.src = "images/hudMap.png";
var mapDotPic = document.createElement("img");
mapDotPic.src = "images/mapDotPic.png";
var majorKey = document.createElement("img");
majorKey.src = "images/majorKey.png";

var playerTouchingIndex = -1;
var carryingBlock = false;
var numberOfKeys = 0;

var isFiring = false;
var bashTimer = 10;
var shieldFacingLeft = false;
var shotX = 0;
var shotY = 0;

var tutorialTimerWiz = 0;
var tutorialTimerArmor = 0;
var tutorialTimerCloak = 0;
var tutorialTimerMap = 0;

var camPanX = 0.0;
var camPanY = 0.0;
const PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_X = 150;
const PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_Y = 100;

const GROUND_FRICTION = 0.8; // What's this?
const RUN_SPEED = 4.0;

var playerX = 75, playerY = 75;
var playerSpeedX = 0, playerSpeedY = 0;

var PLAYER_RADIUS = 16;
const START_HEALTH = 3;
var health = START_HEALTH;
var damagedRecentely = 0;

var startedRoomAtX = 0;
var startedRoomAtY = 0;
var startedRoomAtXV = 0;
var startedRoomAtYV = 0;
var startedRoomKeys = 0;
var roomAsItStarted = [];
var enemiesWhenRoomStarted = [];
var blockCarryOnEnter = false;

var hasMap = false;
var mapDotX = 0;
var mapDotY = 0;
var hasGoldKey = false;

function isBlockPickup (tileType) {
  if (whichBrickAtPixelCoord(playerX,playerY+PLAYER_RADIUS,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(playerX, playerY + PLAYER_RADIUS)] = TILE_NONE;
    return true;
  }
  if (whichBrickAtPixelCoord(playerX,playerY-PLAYER_RADIUS,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(playerX, playerY - PLAYER_RADIUS)] = TILE_NONE;
    return true;
  }
  if (whichBrickAtPixelCoord(playerX + PLAYER_RADIUS,playerY,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(playerX + PLAYER_RADIUS, playerY)] = TILE_NONE;
    return true;
  }
  if (whichBrickAtPixelCoord(playerX - PLAYER_RADIUS,playerY,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(playerX - PLAYER_RADIUS, playerY)] = TILE_NONE;
    return true;
  }
}

function drawShot () {
  if (isFiring) {
    bashTimer --;
    shotX = playerX + 8*(5-Math.abs(bashTimer-5)) * (shieldFacingLeft ? -1 : 1);
    shotY = playerY;
    if (bashTimer <0){
      isFiring = false;
      bashTimer = 10;
    }

    if (whichBrickAtPixelCoord(shotX,shotY,false) == TILE_CRUMBLE) {
      brickGrid[whichIndexAtPixelCoord(shotX,shotY)] = TILE_NONE;
    }

  }
}

function drawHealthHud() {
  if (health == 1) {
    canvasContext.drawImage(hudHealth1Pic, 0,0);
  }
  if (health == 2) {
    canvasContext.drawImage(hudHealth2Pic,0,0);
  }
  if (health == 3) {
    canvasContext.drawImage(hudHealth3Pic,0,0);
  }
  if (health < 1) {
    canvasContext.drawImage(hudHealth0Pic, 0,0)
  }
}

function playerIsDead() {
  return (health <= 0);
}

function playerMove() {
  // used for returning player to valid position if bugged through wall
  var playerNonSolidX = -1;
  var playerNonSolidY = -1;

  if ( playerIsDead() ) {
    playerSpeedX = 0;
    return;
  }

  
  playerSpeedX *= GROUND_FRICTION;
  playerSpeedY *= GROUND_FRICTION;


  if(holdLeft) {
    playerSpeedX = -RUN_SPEED;
  }
  if(holdRight) {
    playerSpeedX = RUN_SPEED;
  }
  if(holdUp) {
    playerSpeedY = -RUN_SPEED;
  }
  if(holdDown) {
    playerSpeedY = RUN_SPEED;
  }

    // is player center not inside a brick prior to move? if so save it to restore after move
  if(isTileHereSolid(playerX,playerY) == false) {
    playerNonSolidX = playerX;
    playerNonSolidY = playerY;
  }

  playerTouchingIndex = -1;

  
  if (isBlockPickup(TILE_HEALTH)) {
    if (health < 3) {
      health ++;
    }
  }
  if (isBlockPickup(TILE_KEY)) {
    numberOfKeys ++;
  }

  if (numberOfKeys > 0) {
    if (isBlockPickup(TILE_DOOR)) {
        numberOfKeys --;
    }
  }

  if (isBlockPickup(TILE_MAP)) {
    hasMap = true;
  }
  
  if (isBlockPickup(TILE_KNIFE)) {
    hasSword = true;
  }
  
  // collision detection #TODO fine tune when player graphic is created
  if(wall_clipping_cheat == false){
    if(playerSpeedX < 0 && isTileHereSolid(playerX-PLAYER_RADIUS,playerY)) {
        // playerX = (Math.floor( playerX / BRICK_W )) * BRICK_W + PLAYER_RADIUS;
        playerSpeedX = 0.0;
    }
    if(playerSpeedX > 0 && isTileHereSolid(playerX+PLAYER_RADIUS,playerY)) {
        // playerX = (1+Math.floor( playerX / BRICK_W )) * BRICK_W - PLAYER_RADIUS;
        playerSpeedX = 0.0;
    }
    if(playerSpeedY < 0 && isTileHereSolid(playerX,playerY-0.4*PLAYER_RADIUS)) {
        // playerY = (Math.floor( playerY / BRICK_H )) * BRICK_H + 0.4*PLAYER_RADIUS;
        playerSpeedY = 0.0;
    }
    if(playerSpeedY > 0 && isTileHereSolid(playerX,playerY+0.8*PLAYER_RADIUS)) {
        // playerY = (Math.floor( playerY / BRICK_H )) * BRICK_H - 0.4*PLAYER_RADIUS;
        playerSpeedY = 0.0;
    }
  }

  playerX += playerSpeedX; // move the player based on its current horizontal speed
  playerY += playerSpeedY; // same as above, but for vertical
  
  // checking whether both are positive values to avoid the death glitch of them not having been set above
  if(wall_clipping_cheat == false){
  if(isTileHereSolid(playerX,playerY) && playerNonSolidX > 0 && playerNonSolidY > 0) {
    playerX = playerNonSolidX;
    playerY = playerNonSolidY;
    if(playerSpeedY < 0) { // banged head?
      playerSpeedY = 0;
    }
  }
 }
  checkIfChangingRooms();
}

function checkIfChangingRooms() {
  // saving these in case we need to reverse due to non-existing level
  var wasROC = roomsOverC;
  var wasRDR = roomsDownR;
  var wasJX = playerX;
  var wasJY = playerY;

  var tryToReloadLevel = false;
  // edge of world checking to change rooms:
  if(playerX < BRICK_W/2) {
    roomsOverC--;
    playerX = (BRICK_COLS-1)*BRICK_W;
    tryToReloadLevel = true;
  }
  if(playerX > (BRICK_COLS-1)*BRICK_W+BRICK_W/2) {
    roomsOverC++;
    playerX = BRICK_W;
    tryToReloadLevel = true;
  }
  if(playerY < BRICK_H/4 && playerSpeedY<0) {
    roomsDownR--;
    playerY = (BRICK_ROWS-1)*BRICK_H-BRICK_H/2;
    tryToReloadLevel = true;
  }
  if(playerY > (BRICK_ROWS-1)*BRICK_H+BRICK_H/2 && playerSpeedY>0) {
    roomsDownR++;
    playerY = BRICK_H/2;
    tryToReloadLevel = true;
  }
  if( tryToReloadLevel ) {
    if( loadLevel() == false ) {  // didn't exist, womp womp, undo shift
     roomsOverC = wasROC;
     roomsDownR = wasRDR;
     playerX = wasJX;
     playerY = wasJY;
    }
  }
}

function playerRestoreFromStoredRoomEntry() {
  holdRight = holdLeft = false; // hacky fix to interrupt incorrect key held state after level reload
  if (wasStabbed) {

  }

  var loadingRoomName = levelCRToFilename(roomsOverC,roomsDownR);
  brickGrid = window[loadingRoomName].gridspaces = roomAsItStarted.slice(0);
  enemyList = [];
  var enemyRespawnData = JSON.parse(enemiesWhenRoomStarted); // deep copy needed for positions etc.
  for(var i=0;i<enemyRespawnData.length;i++) {
    var newEnem = new enemySlideAndBounce();
    newEnem.respawnEnemy(enemyRespawnData[i]);
    enemyList.push( newEnem );
  }
  // enemyList = enemiesWhenRoomStarted.slice(0);
  processBrickGrid();
  carryingBlock = blockCarryOnEnter;
  damagedRecentely = 0;
  health = START_HEALTH;
  numberOfKeys = startedRoomKeys;
  playerX = startedRoomAtX;
  playerY = startedRoomAtY;
  playerSpeedX = startedRoomAtXV;
  lastFacingLeft = playerSpeedX < 0;
  playerSpeedY = startedRoomAtYV;
  countdown = 0;
  timeSCD = 00;
  timeMCD = 2;
  hasSword = false;
  wobble = 1;
}

function playerStoreRoomEntry() {
  var loadingRoomName = levelCRToFilename(roomsOverC,roomsDownR);
  roomAsItStarted = window[loadingRoomName].gridspaces.slice(0);
  enemyListDataOnly = [];
  for(var i=0;i<enemyList.length;i++) {
    var dataHolder = {};
    dataHolder.myRoomC = enemyList[i].myRoomC;
    dataHolder.myRoomR = enemyList[i].myRoomR;

    dataHolder.x = enemyList[i].x;
    dataHolder.y = enemyList[i].y;
    dataHolder.xv = enemyList[i].xv;
    dataHolder.yv = enemyList[i].yv;
    dataHolder.facingLeft = enemyList[i].facingLeft;
    dataHolder.myID = enemyList[i].myID;
    dataHolder.myKind = enemyList[i].myKind;
    enemyListDataOnly.push(dataHolder);
  }

  enemiesWhenRoomStarted = JSON.stringify(enemyListDataOnly); // deep copy needed for positions etc.
  // enemiesWhenRoomStarted = enemyList.slice(0);
  startedRoomKeys = numberOfKeys;
  startedRoomAtX = playerX;
  startedRoomAtY = playerY;
  startedRoomAtXV = playerSpeedX;
  startedRoomAtYV = playerSpeedY;
}

function playerReset() {
  for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
    for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

      if( whichBrickAtTileCoord(eachCol, eachRow) == TILE_PLAYERSTART) {
        playerX = eachCol * BRICK_W + BRICK_W/2;
        playerY = eachRow * BRICK_H + BRICK_H/2;
        var changeAt = brickTileToIndex(eachCol, eachRow);
        brickGrid[changeAt] = TILE_NONE; // remove tile where player started
        playerSpeedY = playerSpeedX = 0;
        playerStoreRoomEntry();
      } // end of player start found
    } // end of row
  } // end of col
}

function shotDetection (theEnemy) {
  var enemyX = theEnemy.x;
  var enemyY = theEnemy.y;

  if(isFiring) {
    if (enemyX > shotX - 20 && enemyX < shotX + 20) {
      if (enemyY > shotY - 20 && enemyY < shotY + 20) {
        if(enemyX > shotX) {
          theEnemy.x += BRICK_W;
          if( brickGrid[whichIndexAtPixelCoord(theEnemy.x, theEnemy.y)] != TILE_NONE) {
            theEnemy.x -= BRICK_W;
          }
        } else {
          theEnemy.x -= BRICK_W;
          if( brickGrid[whichIndexAtPixelCoord(theEnemy.x, theEnemy.y)] != TILE_NONE) {
            theEnemy.x += BRICK_W;
          }
        }
      }
    }
  }
}

function hitDetection (enemyX, enemyY) {
  if (damagedRecentely > 0 || playerIsDead() || wasStabbed ) {
    return;
  }
  if (enemyX > playerX - PLAYER_RADIUS && enemyX < playerX + PLAYER_RADIUS) {
    if (enemyY > playerY - PLAYER_RADIUS && enemyY < playerY + PLAYER_RADIUS) {
      health --;
      damagedRecentely = 50;
    }
  }
}

function drawplayer() {

  if (playerIsDead()) {
    return;
  }
  
  var playerFrame;
  var isMoving = Math.abs(playerSpeedX)>1;
  if (isMoving) {
    playerFrame = animFrame % PLAYER_RUN_FRAMES;
  } else {
    playerFrame = 0;
  }
  drawFacingLeftOption(playerPic,playerX,playerY,lastFacingLeft, playerFrame);

  if (hasSword) {  
    drawFacingLeftOption(playerSwordPic,playerX,playerY,lastFacingLeft);
  }
}

function instantCamFollow() {
  camPanX = playerX - canvas.width/2;
  camPanY = playerY - canvas.height/2;
}

function cameraFollow() {
  var cameraFocusCenterX = camPanX + canvas.width/2;
  var cameraFocusCenterY = camPanY + canvas.height/2;

  var playerDistFromCameraFocusX = Math.abs(playerX-cameraFocusCenterX);
  var playerDistFromCameraFocusY = Math.abs(playerY-cameraFocusCenterY);

  if(playerDistFromCameraFocusX > PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_X) {
    if(cameraFocusCenterX < playerX)  {
      camPanX += RUN_SPEED;
    } else {
      camPanX -= RUN_SPEED;
    }
  }
  if(playerDistFromCameraFocusY > PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_Y) {
    if(cameraFocusCenterY < playerY)  {
      camPanY += RUN_SPEED;
    } else {
      camPanY -= RUN_SPEED;
    }
  }

  instantCamFollow();

  if(camPanX < 0) {
    camPanX = 0;
  }
  if(camPanY < 0) {
    camPanY = 0;
  }
  var maxPanRight = BRICK_COLS * BRICK_W - canvas.width;
  var maxPanTop = BRICK_ROWS * BRICK_H - canvas.height;
  if(camPanX > maxPanRight) {
    camPanX = maxPanRight;
  }
  if(camPanY > maxPanTop) {
    camPanY = maxPanTop;
  }
}
