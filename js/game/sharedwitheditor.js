var roomsToLoadColsW = 9

var BRICK_COLS = 16;
var BRICK_ROWS = 12;
// room biome, rooms labeled 0 don't get loaded
var roomsToLoad =
//0 1 2 3 4 5 6 7 8
 [0,1,1,1,0,0,3,3,3, // a
    1,1,1,1,1,3,3,3,0, // b
    0,1,1,1,3,3,3,3,3, // c
    1,1,0,1,1,0,3,3,3, // d
    1,1,0,1,3,3,3,3,3, // e
    0,0,0,4,2,0,0,3,2, // f
    0,0,0,0,2,2,2,2,2, // g
    0,0,0,0,2,2,2,2,2, // h
    0,0,0,0,0,0,2,2,2  // i
    ];

const TILE_NONE = 0;
const TILE_SIDEWALK = 1;
const TILE_BUILDING = 2;
const TILE_GANGER = 3;
const TILE_KNIFE_GANGER = 4;
const TILE_PISTOL_GANGER = 5;
const TILE_MERCHANT = 6;
const TILE_HEALTH = 7;
const TILE_PIZZA_HERE = 8;
const TILE_PIZZA = 9;
const TILE_PLAYERSTART = 10;
const TILE_PISTOL = 11;
const TILE_ARMOR = 12;
const TILE_RIFLE = 13;
const TILE_MAP = 14;
const TILE_TOTAL_COUNT = 15;

var m_tooltips = [
    "street",
    "sidewalk",
    "building",
    "ganger",
    "knife_ganger",
    "pistol_ganger",
    "friendlies",
    "health",
    "pizza_here",
    "pizza",
    "start",
    "pistol",
    "armor",
    "rifle",
    "map"
    ];
