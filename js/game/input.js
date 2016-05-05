
const KEY_LEFT_ARROW = 37;
const KEY_A = 65;
const KEY_UP_ARROW = 38;
const KEY_W = 87;
const KEY_RIGHT_ARROW = 39;
const KEY_D = 68;
const KEY_DOWN_ARROW = 40;
const KEY_S = 83;
const KEY_SPACE = 32;
const KEY_T = 84;
const KEY_M = 77;
const KEY_R = 82;

var wall_clipping_cheat = false;

var holdLeft = false;
var holdRight = false;
var holdUp = false;
var holdDown = false;
var lastFacingLeft = false;
var abilityCoolDown = 0;
var dashPower = 2;
var showTimer = false;
var timerDelay = 0;
var showMap = false;
var resetTimer = 0;

function initInput() {
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyReleased);
}

function setKeyHoldState(thisKey, setTo) {

    if (thisKey == KEY_R && resetTimer == 0) {
        resetTimer = 30;
        playerRestoreFromStoredRoomEntry();
        audio_music.currentTime = 0;
        // audio_music.play();
        return; // block other keys
    }

    if (thisKey == KEY_M && hasMap && timerDelay == 0) {
        showMap = !showMap;
        timerDelay = 10;
    }

    if (thisKey == KEY_SPACE && setTo) {
        if (gameGoing == false && isWinner == false) {
            gameGoing = true;
            // audio_music.play();
        }
        wall_clipping_cheat = !wall_clipping_cheat;
    }
    if (thisKey == KEY_LEFT_ARROW || thisKey == KEY_A) {
        holdLeft = setTo;
        if (setTo) {
            lastFacingLeft = true;
            if (isFiring == false) {
                shieldFacingLeft = true;
            }
        }
    }
    if (thisKey == KEY_RIGHT_ARROW || thisKey == KEY_D) {
        holdRight = setTo;
        if (setTo) {
            lastFacingLeft = false;
            if (isFiring == false) {
                shieldFacingLeft = false;
            }
        }
    }
    if (thisKey == KEY_UP_ARROW || thisKey == KEY_W) {
        holdUp = setTo;
    }
    if (thisKey == KEY_DOWN_ARROW || thisKey == KEY_S) {
        holdDown = setTo;
    }
}

function keyPressed(evt) {
    if (evt.keyCode == KEY_T) {    
        fireGun();
    }
    setKeyHoldState(evt.keyCode, true);
    evt.preventDefault(); // without this, arrow keys scroll the browser!
}

function keyReleased(evt) {
    setKeyHoldState(evt.keyCode, false);
}
