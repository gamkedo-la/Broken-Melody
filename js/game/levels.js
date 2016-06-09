

// where is the player/gameplay happening in the overworld level grid?
// now automatically set at first by loadLevelsBesidesFirstOne
// should change by which level file is loaded from index.html
var roomsOverC = 4;
var roomsDownR = 0;


var roomsToLoadColsW = 9


var animFrame = 0;
var cyclesTillAnimStep = 0;
const FRAMES_BETWEEN_ANIM = 4;

const BRICK_W = 50;
const BRICK_H = 50;
const BRICK_GAP = 1;
// changed to var to support variable room size in level format, but kept as all
// capitals (implying const) since they're not meant to be changed anywhere else




function isTileHereSolid(atX,atY) {
  var tileKindAt = whichBrickAtPixelCoord(atX,atY,true);
  return (tileKindAt != TILE_NONE && tileKindAt != TILE_SIDEWALK);
}

function isTileHereWalkOnAble(atX,atY) {
  var tileKindAt = whichBrickAtPixelCoord(atX,atY,false);

  return tileKindAt == TILE_SIDEWALK ||
          tileKindAt == TILE_PIZZA_HERE ||
          tileKindAt < 0; // mid-decay
}

/*var loadedLevelJSON = // kept around for ease of one-off testing via override
{"rows":15,"cols":20,"gridspaces":[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
  2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 3, 3, 3, 1, 1, 0, 0, 0, 1,
  1, 0, 0, 0, 1, 1,14, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 4, 1,
  1, 0, 0, 1, 1, 0, 3, 1, 1, 0, 1, 0, 0, 9, 0, 1, 1, 0, 0, 1,
  1, 0, 6, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1,
  1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 2,
  1, 0, 0, 1, 0, 0, 0,14,15,16, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1,
  1,13, 0, 1, 0, 0, 1, 1, 1, 1, 3, 0, 0, 1, 0, 1, 0, 0, 0, 1,
  2, 1, 1, 1, 0, 0, 0, 1, 8, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1,
  1, 0, 0, 1, 3, 0, 0, 1, 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
  1,12, 0, 0, 0, 0, 1, 1, 4, 4, 5, 0, 0,10, 0, 0, 6, 0, 0, 1,
  1, 1,13, 0, 5, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,11, 0, 1,
  1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]};*/

var brickGrid; // now loaded from JSON file

function levelCRToFilename(someC,someR) {
  return "level"+someC + String.fromCharCode(97+someR); // 97 = 'a'
}

function noLevelHere() {
  console.log("no level at this position, skipping it, ignore browser error above for now. TODO: define overworld 9x9 grid for which room R,C are defined, and/or define more room files");
}

function loadLevelsBesidesFirstOne() {
  for(var eachC=0;eachC<9;eachC++) {
    for(var eachR=0;eachR<9;eachR++) {
      var loadingRoomName = levelCRToFilename(eachC,eachR);
      // the only way it isn't null: if it was the one loaded by html
      if(window[loadingRoomName] != null) {
        // now check for player start
        brickGrid = window[loadingRoomName].gridspaces;
        var playerStartFound = false;
        for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
          for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

            if( whichBrickAtTileCoord(eachCol, eachRow) == TILE_PLAYERSTART) {
	        // set this room as first to be in focus
        	roomsOverC = eachC;
	        roomsDownR = eachR;
	        continue;
            } // end of player start found
          } // end of row
        } // end of col
      }
      var roomKind = roomsToLoad[eachC + eachR*roomsToLoadColsW];
      // console.log(eachC + ", " + eachR + ": " + roomKind )
      if(roomKind == 0) {
        continue;
      }
      var imported = document.createElement('script');
      imported.onerror = noLevelHere;
      imported.src = 'levels/'+levelCRToFilename(eachC,eachR)+".js";
      // console.log(imported.src);
      document.head.appendChild(imported);
    }
  }
}

function loadLevel(fromJSON) { // if no test stage argument, load from world grid
  if(fromJSON == undefined) {
    var loadingRoomName = levelCRToFilename(roomsOverC,roomsDownR);
    fromJSON = window[loadingRoomName];

    if(fromJSON == undefined) {
      console.log(loadingRoomName + " room not defined or found, cannot open it");
      return false; // level not found for this coord
    }
  }
  BRICK_COLS = fromJSON.cols;
  BRICK_ROWS = fromJSON.rows;
  brickGrid = fromJSON.gridspaces;

  playerStoreRoomEntry();
  processBrickGrid();

  return true;
}

function processBrickGrid() {

  var tempEnemy = new EnemyClass();
  // enemyList = []; do not clear enemy list, we're keeping old ones around
  while(tempEnemy.enemyPlacement(TILE_GANGER, ENEMY_SPEED, 0.0, gangerPic)) {
    enemyList.push(tempEnemy);
    tempEnemy = new EnemyClass();
  }
   while(tempEnemy.enemyPlacement(TILE_PISTOL_GANGER, ENEMY_SPEED, 0.0, gangerPistolPic)) {
     enemyList.push(tempEnemy);
     tempEnemy = new EnemyClass();
   }
   while (tempEnemy.enemyPlacement(TILE_KNIFE_GANGER, ENEMY_SPEED, 0.0, gangerKnifePic)) {
       enemyList.push(tempEnemy);
       tempEnemy = new EnemyClass();
   }
}

function brickTileToIndex(tileCol, tileRow) {
  return (tileCol + BRICK_COLS*tileRow);
}

function whichBrickAtTileCoord(brickTileCol, brickTileRow) {
  var brickIndex = brickTileToIndex(brickTileCol, brickTileRow);
  return brickGrid[brickIndex];
}

function whichIndexAtPixelCoord(hitPixelX, hitPixelY, forPlayer) {
  var tileCol = hitPixelX / BRICK_W;
  var tileRow = hitPixelY / BRICK_H;

  // using Math.floor to round down to the nearest whole number
  tileCol = Math.floor( tileCol );
  tileRow = Math.floor( tileRow );

  // first check whether the player is within any part of the brick wall
  if(tileCol < 0 || tileCol >= BRICK_COLS ||
     tileRow < 0 || tileRow >= BRICK_ROWS) {
     return -1;
  }

  var brickIndex = brickTileToIndex(tileCol, tileRow);
  return brickIndex;
}

function whichBrickAtPixelCoord(hitPixelX, hitPixelY, forPlayer) {
  var index = whichIndexAtPixelCoord(hitPixelX, hitPixelY);
  if(index < 0) {
     console.log("Hit the edge and the index at pixel cord is " + index);
     return TILE_BUILDING;
  }
  return brickGrid[index];
}

function drawOnlyBricksOnScreen() {
  var roomKind = roomsToLoad[roomsOverC + roomsDownR*roomsToLoadColsW];
  cyclesTillAnimStep--;
  if(cyclesTillAnimStep < 0) {
    cyclesTillAnimStep = FRAMES_BETWEEN_ANIM;
    animFrame++;
  }

  if(roomKind == 4){
    canvasContext.drawImage(easterTown, 0, 0);
    return;
  }

  var cameraLeftMostCol = Math.floor(camPanX / BRICK_W);
  var cameraTopMostRow = Math.floor(camPanY / BRICK_H);

  // how many columns and rows of tiles fit on one screenful of area?
  var colsThatFitOnScreen = Math.floor(canvas.width / BRICK_W);
  var rowsThatFitOnScreen = Math.floor(canvas.height / BRICK_H);

  // finding the rightmost and bottommost tiles to draw.
  // the +1 and + 2 on each pushes the new tile popping in off visible area
  // +2 for columns since BRICK_W doesn't divide evenly into canvas.width
  var cameraRightMostCol = cameraLeftMostCol + colsThatFitOnScreen + 2;
  var cameraBottomMostRow = cameraTopMostRow + rowsThatFitOnScreen + 1;

  if(cameraRightMostCol > BRICK_COLS) {
    cameraRightMostCol = BRICK_COLS;
  }
  if(cameraBottomMostRow > BRICK_ROWS) {
    cameraBottomMostRow = BRICK_ROWS;
  }

  var usePic;
  var tileFrame;
  
  for(var eachCol=cameraLeftMostCol; eachCol<cameraRightMostCol; eachCol++) {
    for(var eachRow=cameraTopMostRow; eachRow<cameraBottomMostRow; eachRow++) {

      // will be overridden in switch-case with cycled frame for animated tiles
      tileFrame = 0; // by default use first tile position
      var showStreetUnderTransparency = false;

      var tileValueHere = whichBrickAtTileCoord(eachCol, eachRow);
      switch( tileValueHere ) {
        case TILE_NONE:
        case TILE_PLAYERSTART:
        usePic = tileStreet[roomKind];
        break;
        case TILE_SIDEWALK:
        usePic = tileSidewalk[roomKind];
        break;
        case TILE_BUILDING:
        usePic = tileBuildingPic[roomKind];
        break;
        case TILE_PISTOL:
        usePic = tilePistolPic;
        showStreetUnderTransparency = true;
        break;
        case TILE_RIFLE:
        usePic = tileRiflePic;
        showStreetUnderTransparency = true;
        break;
        case TILE_ARMOR:
        usePic = tileArmorPic;
        showStreetUnderTransparency = true;
        break;
        case TILE_OVEN:
        if (hasPizza){
            usePic = tileOvenOff;
        } else {
            usePic = tileOvenOn;
        }
        showStreetUnderTransparency = true;
        break;
        case TILE_PIZZA_HERE:
        usePic = tilePizzaHerePic;
        showStreetUnderTransparency = true;
        break;
        case TILE_PIZZA:
        usePic = tilePizzaPic;
        showStreetUnderTransparency = true;
        tileFrame = animFrame % TILE_PIZZA_FRAMES;
        break;
        case TILE_MERCHANT:
        showStreetUnderTransparency = true;
        usePic = tileMerchantPic;
        break;
        case TILE_MAP:
        usePic = tileMapPic;
        showStreetUnderTransparency = true;
        break;
        default:
        usePic = tileStreet[roomKind];
        break;
      } // end of whichBrickAtTileCoord()
      var brickLeftEdgeX = eachCol * BRICK_W;
      var brickTopEdgeY = eachRow * BRICK_H;

      if(showStreetUnderTransparency) {
        canvasContext.drawImage(tileStreet[roomKind],
          0, 0, // top-left corner of tile art
          BRICK_W, BRICK_H, // get full tile size from source
          brickLeftEdgeX, brickTopEdgeY, // x,y top-left corner for image destination
          BRICK_W, BRICK_H); // draw full full tile size for destination
      }

    //   console.log(tileValueHere);
    if(usePic){
      canvasContext.drawImage(usePic,
        tileFrame * BRICK_W, 0, // top-left corner of tile art
        BRICK_W, BRICK_H, // get full tile size from source
        brickLeftEdgeX, brickTopEdgeY, // x,y top-left corner for image destination
        BRICK_W, BRICK_H); // draw full full tile size for destination
      }

    } // end of for eachRow
  } // end of for eachCol
} // end of drawOnlyBricksOnScreen()
