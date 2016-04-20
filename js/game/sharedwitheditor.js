console.log("yay I was included");
var roomsToLoadColsW = 9

var BRICK_COLS = 16;
var BRICK_ROWS = 12;
// room biome, rooms labeled 0 don't get loaded
var roomsToLoad =
//0 1 2 3 4 5 6 7 8
[0,0,0,0,0,0,0,0,0, // a
  0,0,0,0,0,0,0,0,0, // b
  0,0,0,0,0,0,0,0,0, // c
  0,0,0,0,1,0,0,0,0, // d
  0,0,0,4,2,3,0,0,0, // e
  0,0,0,0,5,0,0,0,0, // f
  0,0,0,0,0,0,0,0,0, // g
  0,0,0,0,0,0,0,0,0, // h
  0,0,0,0,0,0,0,0,0  // i
  ];

const TILE_NONE = 0;
const TILE_SIDEWALK = 1;
const TILE_BUILDING = 2;
const TILE_CRUMBLE = 3;
const TILE_EVIL_ANT_START = 4;
const TILE_EVIL_FLY_START = 5;
const TILE_SPIKES = 6;
const TILE_FRIENDLY_ANT = 7;
const TILE_HEALTH = 8;
const TILE_DOOR = 9;
const TILE_KEY = 10;
const TILE_PLAYERSTART = 11;
const TILE_GRENADE = 12;
const TILE_PISTOL = 13;
const TILE_ARMOR = 14;
const TILE_CLOAK = 15;  // Stealth cloak
const TILE_RIFLE = 16;
const TILE_TORCH = 17;  // light
const TILE_MAP = 18;
const TILE_GOLD_DOOR = 19;
const TILE_GOLD_KEY = 20;
const TILE_KNIFE = 21;  // knife
const TILE_TOTAL_COUNT = 22;


var m_tooltips = [
  "street",
  "sidewalk",
  "building",
  "crumble",
  "red-ant",
  "fly",
  "spikes",
  "friendlies",
  "health",
  "gate",
  "key",
  "start",
  "grenade",
  "pistol",
  "armor",
  "cloak",
  "rifle",
  "torch",
  "map",
  "gold_door",
  "gold_key",
  "knife",
  ];
