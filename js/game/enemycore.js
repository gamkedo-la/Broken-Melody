var gangerPic = document.createElement("img");
gangerPic.src = "images/ganger-sheet.png";
const ENEMY_FRAMES = 4;

// Facing direction 
const DIR_N = 0;
const DIR_E = 1;
const DIR_S = 2;
const DIR_W = 3;
const DIR_NONE = 4;

const EVIL_BUG_SPEED = 1.0;
const ANT_GROUND_HEIGHT_OFFSET = 14;

enemyList = [];

function enemySlideAndBounce() {
  // these reflect which overworld room coord the creature exists in
  this.myRoomC = 0;
  this.myRoomR = 0;

  this.x = 50;
  this.y = 50;
  this.xv = 0;
  this.yv = 0;
  this.facingDir = DIR_E;
  this.myID = enemyList.length;

  this.restoreImgFromKind =  function() {
      this.myPic = gangerPic;
  }


  this.respawnEnemy = function(jsonInfo) {
    this.myRoomC = jsonInfo.myRoomC;
    this.myRoomR = jsonInfo.myRoomR;

    this.x = jsonInfo.x;
    this.y = jsonInfo.y;
    this.xv = jsonInfo.xv;
    this.yv = jsonInfo.yv;
    this.facingDir = jsonInfo.facingDir;
    this.myID = jsonInfo.myID;

    this.restoreImgFromKind();
  }
// JK ask Chris about enemyPlacementAnt
  this.enemyPlacementAnt = function(tileLoadIndex,xv,yv,myImg) {
    this.xv = xv;
    this.yv = yv;
    this.myKind = tileLoadIndex;
    this.restoreImgFromKind();
    this.facingDir = DIR_E;

    for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
      for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

        if( whichBrickAtTileCoord(eachCol, eachRow) == tileLoadIndex) {
          this.x = eachCol * BRICK_W + BRICK_W/2;
          this.y = (eachRow * BRICK_H + BRICK_H/2) + ANT_GROUND_HEIGHT_OFFSET;
          var changeAt = brickTileToIndex(eachCol, eachRow);
          brickGrid[changeAt] = TILE_NONE; // remove tile where player started

          this.myRoomC = roomsOverC;
          this.myRoomR = roomsDownR;

          return true;
        } // end of player start found
      } // end of row
    } // end of col

    return false;
  } // end of function

this.enemyCollideAndDraw = function() {
    if(this.myRoomC != roomsOverC || this.myRoomR != roomsDownR) {
      return; // not in this room, skip this one
    }

    shotDetection (this);

    if(whichBrickAtPixelCoord(this.x,this.y,false) == TILE_SPIKES) { // ant fell on spikes
      return;
    }

	  // movement for the one hard coded enemy red ant
    this.x += this.xv;
    this.y += this.yv;

    if(whichBrickAtPixelCoord(this.x+PLAYER_RADIUS*this.xv,this.y+PLAYER_RADIUS*this.yv,false) != TILE_NONE) {
      this.facingDir ++;
      if(this.facingDir >= DIR_NONE){
          this.facingDir = DIR_N;
      }
      switch(this.facingDir){
          case DIR_N:
            this.xv = 0;
            this.yv = -EVIL_BUG_SPEED;
            break;
          case DIR_E:
            this.xv = EVIL_BUG_SPEED;
            this.yv = 0;
            break;
          case DIR_S:
            this.xv = 0;
            this.yv = EVIL_BUG_SPEED;
            break;
          case DIR_W:
            this.xv = -EVIL_BUG_SPEED;
            this.yv = 0;
            break;
      }  
    }
    this.x += this.xv;
    this.y += this.yv;

    hitDetection (this.x, this.y);

    var enemyFrame = animFrame % ENEMY_FRAMES;
    if(this.xv == 0) {
      enemyFrame = 0; // no animation on fly
    }

    drawFacingLeftOption(this.myPic,this.x,this.y, false, enemyFrame);
  }
}
