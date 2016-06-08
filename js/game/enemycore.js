

// Facing direction 
const DIR_E = 0;
const DIR_S = 1;
const DIR_W = 2;
const DIR_N = 3;
const DIR_NONE = 4;
const DIR_RAND_COUNT = 4;
function randDir(){
    return Math.floor(Math.random() * DIR_RAND_COUNT);
}

const ENEMY_SPEED = 1.0;
const ANT_GROUND_HEIGHT_OFFSET = 14;

const HEALTH_GANGER = 2;
const HEALTH_GANGER_PISTOL = 4;
const HEALTH_GANGER_KNIFE = 3;

enemyList = [];

function EnemyClass() {
  // these reflect which overworld room coord the creature exists in
  this.myRoomC = 0;
  this.myRoomR = 0;

  this.x = 50;
  this.y = 50;
  this.xv = 0;
  this.yv = 0;
  this.facingDir = DIR_E;
  this.myID = enemyList.length;

    //health
  this.readyToRemove = false;
  this.hitRecently = 0;

    this.allShots_enemy = [];




  this.initFromEnemyKind =  function() {
      switch (this.myKind) {
          case TILE_GANGER:
              this.myPic = gangerPic;
              this.gangerHealth = HEALTH_GANGER;
              break;
          case TILE_PISTOL_GANGER:
              this.myPic = gangerPistolPic;
              this.gangerHealth = HEALTH_GANGER_PISTOL;
              break;
          case TILE_KNIFE_GANGER:
              this.myPic = gangerKnifePic;
              this.gangerHealth = HEALTH_GANGER_KNIFE;
          default:
              this.gangerHealth = 2;
              break;
      }

      this.myHitPic = gangerHitPic;

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

    this.initFromEnemyKind();
  }
  
  this.enemyPlacement = function(tileLoadIndex,xv,yv,myImg) {
    this.xv = xv;
    this.yv = yv;
    this.myKind = tileLoadIndex;
      this.myPic = myImg;
    this.initFromEnemyKind();
    this.facingDir = DIR_E;

    for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
      for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

        if( whichBrickAtTileCoord(eachCol, eachRow) == tileLoadIndex) {
          this.x = eachCol * BRICK_W + BRICK_W/2;
          this.y = (eachRow * BRICK_H + BRICK_H/2) + ANT_GROUND_HEIGHT_OFFSET;
          var changeAt = brickTileToIndex(eachCol, eachRow);
          brickGrid[changeAt] = TILE_NONE; // remove tile where player started
          console.log("enemy spawned from tile");
          this.myRoomC = roomsOverC;
          this.myRoomR = roomsDownR;

          return true;
        } // end of player start found
      } // end of row
    } // end of col

    return false;
  } // end of function

this.enemyDraw = function() {
    if(this.myRoomC != roomsOverC || this.myRoomR != roomsDownR) {
      return; // not in this room, skip this one
    }
    
    // var enemyFrame = animFrame % ENEMY_FRAMES;
    // if(this.xv == 0) {
    //   enemyFrame = 0; // no animation on fly
    // }
    var enemyFrame = this.facingDir;
    
    if (this.hitRecently > 0) {
        drawFacingLeftOption(this.myHitPic, this.x, this.y, false, enemyFrame);
    } else {
        drawFacingLeftOption(this.myPic, this.x, this.y, false, enemyFrame);
    }

    drawShot_enemy(this.allShots_enemy);

}



this.enemyMove = function() {
    if(this.myRoomC != roomsOverC || this.myRoomR != roomsDownR) {
      return; // not in this room, skip this one
    }

    shotDetection(this);

    if (this.hitRecently > 0) {
        this.hitRecently--;
    }

	  // movement for the one hard coded enemy red ant
    this.x += this.xv;
    this.y += this.yv;

    if(isTileHereSolid(this.x+PLAYER_RADIUS*this.xv,this.y+PLAYER_RADIUS*this.yv)) { // bumping wall?
      this.facingDir ++;
      if(this.facingDir >= DIR_NONE){
          this.facingDir = DIR_E;
      }
    } else if(hasPizza) { // this will randomly move towards the player
        if (Math.random() < 0.05) {
          if (Math.random() < 0.5){ // Vertical
              if(this.y < playerY){
                  this.facingDir = DIR_S;
              } else {
                  this.facingDir = DIR_N;
              } // ends North/South if
          } else {  // Horizontal
              if (this.x < playerX){
                  this.facingDir = DIR_E;
              } else {
                  this.facingDir = DIR_W;
              } 
          } // ends East/West if
        } // random odds toward player 
    } else { // if player doesn't have pizza
            if(Math.random() < 0.02){
              this.facingDir = randDir();
            }
    }  // end of player didn't have pizza else 

    switch(this.facingDir){
          case DIR_N:
            this.xv = 0;
            this.yv = -ENEMY_SPEED;
            break;
          case DIR_E:
            this.xv = ENEMY_SPEED;
            this.yv = 0;
            break;
          case DIR_S:
            this.xv = 0;
            this.yv = ENEMY_SPEED;
            break;
          case DIR_W:
            this.xv = -ENEMY_SPEED;
            this.yv = 0;
            break;
      }  
    
    this.x += this.xv;
    this.y += this.yv;

    if (this.myKind === TILE_PISTOL_GANGER && hasPizza && slideDir == DIR_NONE) {
        if (this.hasLineOfSightToPlayer()) {
            addShotToPistol_enemy(this.allShots_enemy);
            firePistol_enemy(this.x, this.y, this.allShots_enemy, this.facingDir);
        }
    }

    hitDetection(this.x, this.y, this.allShots_enemy, this.myKind);
}

    this.removeHealthAndKill = function() {
        this.gangerHealth--;
        this.hitRecently = 10;
        audio_ganger_shot.play();
        if (this.gangerHealth <= 0) {
            money += 5;
            this.readyToRemove = true;
        }
    }

    this.hasLineOfSightToPlayer = function() {
        var sr = 50;
        if(this.facingDir === DIR_E && this.x < playerX && this.y > playerY - sr && this.y < playerY + sr ||
           this.facingDir === DIR_W && this.x > playerX && this.y > playerY - sr && this.y < playerY + sr ||
           this.facingDir === DIR_N && this.y > playerY && this.x > playerX - sr && this.x < playerX + sr ||
           this.facingDir === DIR_S && this.y < playerY && this.x > playerX - sr && this.x < playerX + sr){
          var LOSTesterX = this.x;
          var LOSTesterY = this.y;
          var LOSTesterXJump = 0;
          var LOSTesterYJump = 0;

          switch (this.facingDir){
            case DIR_E:
                LOSTesterXJump = BRICK_W;
                break;
            case DIR_S:
                LOSTesterYJump = BRICK_H;
                break;
            case DIR_W:
                LOSTesterXJump = -BRICK_W;
                break;
            case DIR_N:
                LOSTesterYJump = -BRICK_H;
                break;
          }
          // console.log("Xjump = " + LOSTesterXJump + " Yjump = " + LOSTesterYJump);
          var playerIdx = whichIndexAtPixelCoord(playerX, playerY);
          var shotTesterIdx = whichIndexAtPixelCoord(LOSTesterX, LOSTesterY);

          while (playerIdx != shotTesterIdx && shotTesterIdx != -1){
              if(isTileHereSolid(LOSTesterX, LOSTesterY)){
                  return false;
              }
              LOSTesterX += LOSTesterXJump;
              LOSTesterY += LOSTesterYJump;
              shotTesterIdx = whichIndexAtPixelCoord(LOSTesterX, LOSTesterY);
              // console.log("LOSTesterX = " + LOSTesterX + " LOSTesterY = " + LOSTesterY);
          } 
          if(playerIdx == shotTesterIdx){
              return true;
          }
        }
        return false;
    }
}
