var playerPic = document.createElement("img");
playerPic.src = "images/player-sheet.png";

var shieldPic = document.createElement("img");
shieldPic.src = "images/shield.png";
var playerSwordPic = document.createElement("img");
playerSwordPic.src = "images/playerSwordPic.png";

const ANT_RUN_FRAMES = 4;

var hudHealth1Pic = document.createElement("img");
hudHealth1Pic.src = "images/hudHealth1.png";
var hudHealth2Pic = document.createElement("img");
hudHealth2Pic.src = "images/hudHealth2.png";
var hudHealth3Pic = document.createElement("img");
hudHealth3Pic.src = "images/hudHealth3.png";
var hudHealth0Pic = document.createElement("img");
hudHealth0Pic.src = "images/hudHealth0.png";

var rescuedHudPic = document.createElement("img");
rescuedHudPic.src = "images/rescuedHud.png";
var hudMapPic = document.createElement("img");
hudMapPic.src = "images/hudMap.png";
var mapDotPic = document.createElement("img");
mapDotPic.src = "images/mapDotPic.png";
var majorKey = document.createElement("img");
majorKey.src = "images/majorKey.png";

var playerTouchingIndex = -1;
var carryingBlock = false;
var numberOfKeys = 0;

var iceBolt = false;
var iceBoltX = 0;
var iceBoltY = 0;
var iceBoltSpeed = 0;
var iceFacingLeft = false;

var isBashing = false;
var bashTimer = 10;
var shieldFacingLeft = false;
var shieldX = 0;
var shieldY = 0;

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

var jumperX = 75, jumperY = 75;
var jumperSpeedX = 0, jumperSpeedY = 0;

var JUMPER_RADIUS = 16;
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
  if (whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(jumperX, jumperY + JUMPER_RADIUS)] = TILE_NONE;
    return true;
  }
  if (whichBrickAtPixelCoord(jumperX,jumperY-JUMPER_RADIUS,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(jumperX, jumperY - JUMPER_RADIUS)] = TILE_NONE;
    return true;
  }
  if (whichBrickAtPixelCoord(jumperX + JUMPER_RADIUS,jumperY,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(jumperX + JUMPER_RADIUS, jumperY)] = TILE_NONE;
    return true;
  }
  if (whichBrickAtPixelCoord(jumperX - JUMPER_RADIUS,jumperY,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(jumperX - JUMPER_RADIUS, jumperY)] = TILE_NONE;
    return true;
  }
}

function drawShield () {
  if (isBashing) {
    bashTimer --;
    shieldX = jumperX + 8*(5-Math.abs(bashTimer-5)) * (shieldFacingLeft ? -1 : 1);
    shieldY = jumperY;
    if (bashTimer <0){
      isBashing = false;
      bashTimer = 10;
    }

    if (whichBrickAtPixelCoord(shieldX,shieldY,false) == TILE_CRUMBLE) {
      brickGrid[whichIndexAtPixelCoord(shieldX,shieldY)] = TILE_NONE;
    }

  } else {
    shieldX = jumperX;
    shieldY = jumperY;
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

function jumperMove() {
  // used for returning player to valid position if bugged through wall
  var playerNonSolidX = -1;
  var playerNonSolidY = -1;

  if ( playerIsDead() ) {
    jumperSpeedX = 0;
    return;
  }

  
  jumperSpeedX *= GROUND_FRICTION;
  jumperSpeedY *= GROUND_FRICTION;


  if(holdLeft) {
    jumperSpeedX = -RUN_SPEED;
  }
  if(holdRight) {
    jumperSpeedX = RUN_SPEED;
  }
  if(holdUp) {
    jumperSpeedY = -RUN_SPEED;
  }
  if(holdDown) {
    jumperSpeedY = RUN_SPEED;
  }

    // is player center not inside a brick prior to move? if so save it to restore after move
  if(isTileHereSolid(jumperX,jumperY) == false) {
    playerNonSolidX = jumperX;
    playerNonSolidY = jumperY;
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
  
  if (isBlockPickup(TILE_SWORD)) {
    hasSword = true;
  }
  
  // collision detection #TODO fine tune when player graphic is created
  if(wall_clipping_cheat == false){
    if(jumperSpeedX < 0 && isTileHereSolid(jumperX-JUMPER_RADIUS,jumperY)) {
        // jumperX = (Math.floor( jumperX / BRICK_W )) * BRICK_W + JUMPER_RADIUS;
        jumperSpeedX = 0.0;
    }
    if(jumperSpeedX > 0 && isTileHereSolid(jumperX+JUMPER_RADIUS,jumperY)) {
        // jumperX = (1+Math.floor( jumperX / BRICK_W )) * BRICK_W - JUMPER_RADIUS;
        jumperSpeedX = 0.0;
    }
    if(jumperSpeedY < 0 && isTileHereSolid(jumperX,jumperY-0.4*JUMPER_RADIUS)) {
        // jumperY = (Math.floor( jumperY / BRICK_H )) * BRICK_H + 0.4*JUMPER_RADIUS;
        jumperSpeedY = 0.0;
    }
    if(jumperSpeedY > 0 && isTileHereSolid(jumperX,jumperY+0.8*JUMPER_RADIUS)) {
        // jumperY = (Math.floor( jumperY / BRICK_H )) * BRICK_H - 0.4*JUMPER_RADIUS;
        jumperSpeedY = 0.0;
    }
  }

  jumperX += jumperSpeedX; // move the jumper based on its current horizontal speed
  jumperY += jumperSpeedY; // same as above, but for vertical
  
  // checking whether both are positive values to avoid the death glitch of them not having been set above
  if(wall_clipping_cheat == false){
  if(isTileHereSolid(jumperX,jumperY) && playerNonSolidX > 0 && playerNonSolidY > 0) {
    jumperX = playerNonSolidX;
    jumperY = playerNonSolidY;
    if(jumperSpeedY < 0) { // banged head?
      jumperSpeedY = 0;
    }
  }
 }
  checkIfChangingRooms();
}

function checkIfChangingRooms() {
  // saving these in case we need to reverse due to non-existing level
  var wasROC = roomsOverC;
  var wasRDR = roomsDownR;
  var wasJX = jumperX;
  var wasJY = jumperY;

  var tryToReloadLevel = false;
  // edge of world checking to change rooms:
  if(jumperX < BRICK_W/2) {
    roomsOverC--;
    jumperX = (BRICK_COLS-1)*BRICK_W;
    tryToReloadLevel = true;
  }
  if(jumperX > (BRICK_COLS-1)*BRICK_W+BRICK_W/2) {
    roomsOverC++;
    jumperX = BRICK_W;
    tryToReloadLevel = true;
  }
  if(jumperY < BRICK_H/4 && jumperSpeedY<0) {
    roomsDownR--;
    jumperY = (BRICK_ROWS-1)*BRICK_H-BRICK_H/2;
    tryToReloadLevel = true;
  }
  if(jumperY > (BRICK_ROWS-1)*BRICK_H+BRICK_H/2 && jumperSpeedY>0) {
    roomsDownR++;
    jumperY = BRICK_H/2;
    tryToReloadLevel = true;
  }
  if( tryToReloadLevel ) {
    if( loadLevel() == false ) {  // didn't exist, womp womp, undo shift
     roomsOverC = wasROC;
     roomsDownR = wasRDR;
     jumperX = wasJX;
     jumperY = wasJY;
    }
  }
}

function jumperRestoreFromStoredRoomEntry() {
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
  jumperX = startedRoomAtX;
  jumperY = startedRoomAtY;
  jumperSpeedX = startedRoomAtXV;
  lastFacingLeft = jumperSpeedX < 0;
  jumperSpeedY = startedRoomAtYV;
  countdown = 0;
  timeSCD = 00;
  timeMCD = 2;
  hasSword = false;
  wobble = 1;
}

function jumperStoreRoomEntry() {
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
  startedRoomAtX = jumperX;
  startedRoomAtY = jumperY;
  startedRoomAtXV = jumperSpeedX;
  startedRoomAtYV = jumperSpeedY;
}

function jumperReset() {
  for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
    for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

      if( whichBrickAtTileCoord(eachCol, eachRow) == TILE_PLAYERSTART) {
        jumperX = eachCol * BRICK_W + BRICK_W/2;
        jumperY = eachRow * BRICK_H + BRICK_H/2;
        var changeAt = brickTileToIndex(eachCol, eachRow);
        brickGrid[changeAt] = TILE_NONE; // remove tile where player started
        jumperSpeedY = jumperSpeedX = 0;
        jumperStoreRoomEntry();
      } // end of player start found
    } // end of row
  } // end of col
}

function iceAndShieldDetection (theEnemy) {
  var enemyX = theEnemy.x;
  var enemyY = theEnemy.y;

  if(isBashing) {
    if (enemyX > shieldX - 20 && enemyX < shieldX + 20) {
      if (enemyY > shieldY - 20 && enemyY < shieldY + 20) {
        if(enemyX > shieldX) {
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

  if(iceBolt == false) {
    return;
  }

  if (enemyX > iceBoltX - 20 && enemyX < iceBoltX + 20) {
    if (enemyY > iceBoltY - 20 && enemyY < iceBoltY + 20) {
      console.log("CHILL OUT")
      // freezing location of enemy (not the ice ball)
      brickGrid[whichIndexAtPixelCoord(enemyX, enemyY)] = TILE_ICE;
      iceBolt = false; // stop the bolt
    }
  }
}

function hitDetection (enemyX, enemyY) {
  if (damagedRecentely > 0 || playerIsDead() || wasStabbed ) {
    return;
  }
  if (enemyX > jumperX - JUMPER_RADIUS && enemyX < jumperX + JUMPER_RADIUS) {
    if (enemyY > jumperY - JUMPER_RADIUS && enemyY < jumperY + JUMPER_RADIUS) {
      health --;
      damagedRecentely = 50;
    }
  }
}

function drawJumper() {

  if (playerIsDead()) {
    return;
  }
  
  var antFrame;
  var isMoving = Math.abs(jumperSpeedX)>1;
  if (isMoving) {
    antFrame = animFrame % ANT_RUN_FRAMES;
  } else {
    antFrame = 0;
  }
  drawFacingLeftOption(playerPic,jumperX,jumperY,lastFacingLeft, antFrame);

  if (hasSword) {  
    drawFacingLeftOption(playerSwordPic,jumperX,jumperY,lastFacingLeft);
  }
}

function instantCamFollow() {
  camPanX = jumperX - canvas.width/2;
  camPanY = jumperY - canvas.height/2;
}

function cameraFollow() {
  var cameraFocusCenterX = camPanX + canvas.width/2;
  var cameraFocusCenterY = camPanY + canvas.height/2;

  var playerDistFromCameraFocusX = Math.abs(jumperX-cameraFocusCenterX);
  var playerDistFromCameraFocusY = Math.abs(jumperY-cameraFocusCenterY);

  if(playerDistFromCameraFocusX > PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_X) {
    if(cameraFocusCenterX < jumperX)  {
      camPanX += RUN_SPEED;
    } else {
      camPanX -= RUN_SPEED;
    }
  }
  if(playerDistFromCameraFocusY > PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_Y) {
    if(cameraFocusCenterY < jumperY)  {
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
