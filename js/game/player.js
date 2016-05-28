
var hasPistol = true;
var hasRifle = false;
var hasArmor = false;

var isShooting = false;

var pistolCost = 350;
var rifleCost = 550;
var armorCost = 250;

var isFiring = false;
var bashTimer = 10;
var shieldFacingLeft = false;
var shotX = 0;
var shotY = 0;
var playerLastWalkedIn = DIR_S;

var tutorialTimerWiz = 0;
var tutorialTimerArmor = 0;
var tutorialTimerCloak = 0;
var tutorialTimerMap = 0;

var camPanX = 0.0;
var camPanY = 0.0;
const PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_X = 150;
const PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_Y = 100;

const GROUND_FRICTION = 0.8;
const RUN_SPEED = 4.0;

var playerX = 75, playerY = 75;
var playerSpeedX = 0, playerSpeedY = 0;

var PLAYER_RADIUS = 16;
const START_HEALTH = 0;
var health = START_HEALTH;
var damagedRecentely = 0;

var startedRoomAtX = 0;
var startedRoomAtY = 0;
var startedRoomAtXV = 0;
var startedRoomAtYV = 0;
var roomAsItStarted = [];
var enemiesWhenRoomStarted = [];
var blockCarryOnEnter = false;

var hasMap = false;
var mapDotX = 0;
var mapDotY = 0;

var money = 0;

var replacementTile = TILE_NONE;


var shotList = [];

var shotTimer = 0;

function fireWeapon() {
    
    if (hasPistol) {
        addShotToPistol();
        firePistol();
    }

    if (hasRifle) {
        if (shotTimer % 5 == 0) {
            addShotToRifle();
            fireRifle();
        }
        shotTimer++;
    }
}



function isBlockPickup (tileType) {  // this allows for picking up health, etc.
    if(tileType == TILE_PIZZA){
        replacementTile = TILE_PIZZA;
    } else {
        replacementTile = TILE_NONE;
    }
  if (whichBrickAtPixelCoord(playerX,playerY+PLAYER_RADIUS,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(playerX, playerY + PLAYER_RADIUS)] = replacementTile;
    return true;
  }
  if (whichBrickAtPixelCoord(playerX,playerY-PLAYER_RADIUS,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(playerX, playerY - PLAYER_RADIUS)] = replacementTile;
    return true;
  }
  if (whichBrickAtPixelCoord(playerX + PLAYER_RADIUS,playerY,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(playerX + PLAYER_RADIUS, playerY)] = replacementTile;
    return true;
  }
  if (whichBrickAtPixelCoord(playerX - PLAYER_RADIUS,playerY,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(playerX - PLAYER_RADIUS, playerY)] = replacementTile;
    return true;
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
      canvasContext.drawImage(hudHealth0Pic, 0, 0);
  }
}

function drawWeapons(){
  if (hasRifle){
    canvasContext.drawImage(tileRifleHudPic, 180, 0);
  } else if(hasPistol){
    canvasContext.drawImage(tilePistolHudPic, 180, 0);
  } else {
    canvasContext.drawImage(emptyHand, 180, 0);
  }
}


function drawFunds(){
  canvasContext.font = "20px Comic Sans MS";
  canvasContext.fillStyle = "black";
    canvasContext.fillText("$" + money, canvas.width / 2, 20);
}

function playerMove() {

    if (isShooting) {
        fireWeapon();
    }

  // used for returning player to valid position if bugged through wall
  var playerNonSolidX = -1;
  var playerNonSolidY = -1;
  
  playerSpeedX *= GROUND_FRICTION;
  playerSpeedY *= GROUND_FRICTION;


  if(holdLeft) {
    playerSpeedX = -RUN_SPEED;
    playerLastWalkedIn = DIR_W;
  }
  if(holdRight) {
    playerSpeedX = RUN_SPEED;
    playerLastWalkedIn = DIR_E;
  }
  if(holdUp) {
    playerSpeedY = -RUN_SPEED;
    playerLastWalkedIn = DIR_N;
  }
  if(holdDown) {
    playerSpeedY = RUN_SPEED;
    playerLastWalkedIn = DIR_S;
  }

    // is player center not inside a brick prior to move? if so save it to restore after move
  if(isTileHereSolid(playerX,playerY) == false) {
    playerNonSolidX = playerX;
    playerNonSolidY = playerY;
  }

  
  if (isBlockPickup(TILE_HEALTH)) {
    if (health < 3) {
      health ++;
    }
  }
  
  if(health == 0){
    if (isBlockPickup(TILE_PIZZA)) {
        audio_pizza_picked_up.play();
        health = 3;
      }
  }

  if (health > 0) {
    if (isBlockPickup(TILE_PIZZA_HERE)) {
        audio_pizza_delivered.play();
        money += 20;
        health --;
        saveProgress();
    }
  }

  if (isBlockPickup(TILE_MAP)) {
    hasMap = true;
  }

  if(money > pistolCost && hasPistol == false){
    if (isBlockPickup(TILE_PISTOL)){
      money -= pistolCost;
      hasPistol = true;
      saveProgress();
    }
  }

  if(money > rifleCost && hasRifle == false){
    if (isBlockPickup(TILE_RIFLE)){
      money -= rifleCost;
      hasRifle = true;
      saveProgress();
    }
  }

  if (money > armorCost && hasArmor == false){
    if (isBlockPickup(TILE_ARMOR)){
      money -= armorCost;
      hasArmor = true;
      saveProgress();
    }
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
  // checking if on left side of screen going off
  if(playerX < BRICK_W/2) {
    playerStoreRoomEntry();
    roomsOverC--;
    playerX = (BRICK_COLS-1)*BRICK_W;
    tryToReloadLevel = true;
    slideDir = DIR_W;
  }
  if(playerX > (BRICK_COLS-1)*BRICK_W+BRICK_W/2) { // check if player going off right side of screen
    playerStoreRoomEntry();
    roomsOverC++;
    playerX = BRICK_W;
    tryToReloadLevel = true;
    slideDir = DIR_E;
  }
  if(playerY < BRICK_H/4 && playerSpeedY<0) { // check if player going off top of screen
    playerStoreRoomEntry();
    roomsDownR--;
    playerY = (BRICK_ROWS-1)*BRICK_H-BRICK_H/2;
    tryToReloadLevel = true;
    slideDir = DIR_N;
  }
  if(playerY > (BRICK_ROWS-1)*BRICK_H+BRICK_H/2 && playerSpeedY>0) { // check if player going off bottom of screen
    playerStoreRoomEntry();
    roomsDownR++;
    playerY = BRICK_H/2;
    tryToReloadLevel = true;
    slideDir = DIR_S;
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

  var loadingRoomName = levelCRToFilename(roomsOverC,roomsDownR);
  brickGrid = window[loadingRoomName].gridspaces = roomAsItStarted.slice(0);
  enemyList = [];
  var enemyRespawnData = JSON.parse(enemiesWhenRoomStarted); // deep copy needed for positions etc.
  for(var i=0;i<enemyRespawnData.length;i++) {
    var newEnem = new enemySlideAndBounce();
    newEnem.respawnEnemy(enemyRespawnData[i]);
    enemyList.push( newEnem );
    console.log("Enemy respawned from json");
  }
  // enemyList = enemiesWhenRoomStarted.slice(0);
  processBrickGrid();
  damagedRecentely = 0;
  health = START_HEALTH;
  playerX = startedRoomAtX;
  playerY = startedRoomAtY;
  playerSpeedX = startedRoomAtXV;
  // lastFacingLeft = playerSpeedX < 0;
  playerSpeedY = startedRoomAtYV;
  countdown = 0;
  timeSCD = 00;
  timeMCD = 2;
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
        //myShot.reset();
      } // end of player start found
    } // end of row
  } // end of col
}

function shotDetection (theEnemy) {
  var enemyX = theEnemy.x;
  var enemyY = theEnemy.y;

  if (shotsExist) {

      for (var i = 0; i < allShots.length; i++) {
          myShot = allShots[i];
          if (myShot.isShotActive()) {
              if (enemyX > myShot.x - 20 && enemyX < myShot.x + 20) {
                  if (enemyY > myShot.y - 20 && enemyY < myShot.y + 20) {
                      myShot.bullet_life = 0;
                      theEnemy.removeHealthAndKill();
                  }
              }
          }
      }
  }
}

function hitDetection (enemyX, enemyY) {
  if (damagedRecentely > 0) {
    return;
  }
  if (enemyX > playerX - PLAYER_RADIUS && enemyX < playerX + PLAYER_RADIUS) {
    if (enemyY > playerY - PLAYER_RADIUS && enemyY < playerY + PLAYER_RADIUS) {
      health --;
      audio_player_shot.play();
      damagedRecentely = 50;
    }
  }
}

function drawplayer() {
  
  var playerFrame;
  /*var isMoving = Math.abs(playerSpeedX)>1;
  if (isMoving) {
    playerFrame = animFrame % PLAYER_RUN_FRAMES;
  } else {
    playerFrame = 0;
  }*/
  playerFrame = playerLastWalkedIn;
  drawFacingLeftOption(playerPic,playerX,playerY,false, playerFrame);
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
