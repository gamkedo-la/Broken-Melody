var backgroundPic = document.createElement("img");
var tileStreet = document.createElement("img");
var tileSidewalk = document.createElement("img");
var tileBuildingPic = document.createElement("img");
var deadScreen = document.createElement("img");
var endScreen = document.createElement("img");
var tilePistolPic = document.createElement("img");
var tileHealth = document.createElement("img");
const TILE_HEALTH_FRAMES = 4;
var tileWelcomeMatPic = document.createElement("img");
var tilePizzaPic = document.createElement("img");
const TILE_PIZZA_FRAMES = 4;
var tilePistolGangerPic = document.createElement("img");
var tileRiflePic = document.createElement("img");
var tileMapPic = document.createElement("img");


var tileArmorPic = document.createElement("img"); // #TODO remove
var tileMerchantPic = document.createElement("img");

var playerPic = document.createElement("img");

var playerSwordPic = document.createElement("img");
const PLAYER_RUN_FRAMES = 4;
var hudHealth0Pic = document.createElement("img");
var hudHealth1Pic = document.createElement("img");
var hudHealth2Pic = document.createElement("img");
var hudHealth3Pic = document.createElement("img");

var hudMapPic = document.createElement("img");
var mapDotPic = document.createElement("img");
var majorKey = document.createElement("img");

var gangerPic = document.createElement("img");
const ENEMY_FRAMES = 4;

// start screen image loading before rest of them
var startScreen = document.createElement("img");
startScreen.src = "images/startScreen.png";

var picsToLoad = 0;
var worldArtSets = 3;

function countLoadedImageAndLaunchIfReady() {
  picsToLoad--;
  if(picsToLoad == 0) {
    gameGoing = true;
  }
}

function beginLoadingImage(imgVar, fileName, idx) {
  if(idx != undefined){
    console.log("IDX is " + idx);
    imgVar[idx] = document.createElement("img");
    imgVar[idx].onload=countLoadedImageAndLaunchIfReady; 
    imgVar[idx].src=fileName; 
  } else {
    imgVar.onload=countLoadedImageAndLaunchIfReady; 
    imgVar.src=fileName; 
  }
}

function loadImages() {
  tileStreet = [];
  tileSidewalk = [];
  tileBuildingPic = [];

  var imageList = [
    {varName:backgroundPic, theFile:"images/gamebg.png"},
    {varName:tilePistolPic, theFile:"images/tilePistol.png"},
    {varName:tileArmorPic, theFile:"images/tileArmor.png"},
    {varName:tileHealth, theFile:"images/healthSheet.png"},
    {varName:tileWelcomeMatPic, theFile:"images/welcome.png"},
    {varName:tilePizzaPic, theFile:"images/TilePizzaAnimated.png"},
    {varName:tilePistolGangerPic, theFile:"images/pistolGanger.png"},
    {varName:tileMerchantPic, theFile:"images/merchant.png"},
    {varName:tileRiflePic, theFile:"images/tileRifle.png"},
    {varName:tileMapPic, theFile:"images/tileMap.png"},
    {varName:deadScreen, theFile:"images/deadScreen.png"},
    {varName:playerPic, theFile:"images/player-sheet.png"},
    {varName:playerSwordPic, theFile:"images/playerSwordPic.png"},
    {varName:hudHealth0Pic, theFile:"images/hudHealth0.png"},
    {varName:hudHealth1Pic, theFile:"images/hudHealth1.png"},
    {varName:hudHealth2Pic, theFile:"images/hudHealth2.png"},
    {varName:hudHealth3Pic, theFile:"images/hudHealth3.png"},
    {varName:hudMapPic, theFile:"images/hudMap.png"},
    {varName:mapDotPic, theFile:"images/mapDotPic.png"},
    {varName:gangerPic, theFile:"images/ganger-sheet.png"}
    ];
  
  

  for(var i = 1;i<=worldArtSets;i++){ // starting at 1 so <=
    imageList.push({varName:tileStreet, idx:i, theFile:"images/" + i + "/tileStreet.png"});
    imageList.push({varName:tileSidewalk, idx:i, theFile:"images/" + i + "/tileSidewalk.png"});
    imageList.push({varName:tileBuildingPic, idx:i, theFile:"images/" + i + "/tileBuilding.png"});
  }
  picsToLoad = imageList.length;

  for(var i=0;i<imageList.length;i++) {
    beginLoadingImage(imageList[i].varName, imageList[i].theFile, imageList[i].idx);
  }
}