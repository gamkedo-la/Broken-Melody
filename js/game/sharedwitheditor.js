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
const TILE_DIRT = 1;
const TILE_MOSS = 2;
const TILE_CRUMBLE = 3;
const TILE_PILLAR = 4;
const TILE_EVIL_ANT_START = 5;
const TILE_EVIL_FLY_START = 6;
const TILE_SPIKES = 7;
const TILE_FRIENDLY_ANT = 8;
const TILE_HEALTH = 9;
const TILE_DOOR = 10;
const TILE_KEY = 11;
const TILE_PLAYERSTART = 12;
const TILE_GRENADE = 13;
const TILE_PISTOL = 14;
const TILE_ARMOR = 15;
const TILE_CLOAK = 16;  // Stealth cloak
const TILE_RIFLE = 17;
const TILE_TORCH = 18;  // light
const TILE_MAP = 19;
const TILE_GOLD_DOOR = 20;
const TILE_GOLD_KEY = 21;
const TILE_KNIFE = 22;  // knife
const TILE_TOTAL_COUNT = 23;


var m_tooltips = [
  "nothing",
  "dirt",
  "moss",
  "crumble",
  "pillar",
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
