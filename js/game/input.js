
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
const KEY_N = 78;
const KEY_R = 82;
const KEY_L = 76;
const KEY_P = 80;
const KEY_K = 75;

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
var mouseX = 0;
var mouseY = 0;

function initInput() {
    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyReleased);
    window.addEventListener("mousemove", mousePos);
    window.addEventListener("mousedown", mouseClick);
}

function setKeyHoldState(thisKey, setTo) {

    if (thisKey == KEY_M && hasMap && timerDelay == 0) {
        showMap = !showMap;
        timerDelay = 10;
    }

    if (thisKey == KEY_SPACE && setTo) {
        if (gameGoing == false && isWinner == false) {
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
    if (thisKey == KEY_L) {
        loadProgress();
    }
    if (thisKey == KEY_K) {
        saveProgress();
    }
    if (thisKey === KEY_T) {
        isShooting = setTo;
    }

}

function keyPressed(evt) {
    if(slideDir == DIR_NONE){
        //if (evt.keyCode == KEY_T) {
        //    fireWeapon();
        //}
        setKeyHoldState(evt.keyCode, true);
    }
    if (evt.keyCode == KEY_P) {
        pauseGame();
    }

    //quick cheat to test guns, but may be useful to allow player to switch weapons
    if (evt.keyCode === KEY_N) {
        gunSwitchLogic();
        //if (hasPistol) {
        //    hasPistol = false;
        //    hasRifle = true;
        //} else if (hasRifle) {
        //    hasRifle = false;
        //    hasPistol = true;
        //}
    }
    evt.preventDefault(); // without this, arrow keys scroll the browser!
}

function keyReleased(evt) {
    setKeyHoldState(evt.keyCode, false);
}

function mousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    mouseX = evt.clientX - rect.left;// - root.scrollLeft;
    mouseY = evt.clientY - rect.top;// - root.scrollTop;
    // console.log("mouseX = " + mouseX + " and mouseY = " + mouseY);
    if(mouseX > NEW_BUTTON_X && mouseX < NEW_BUTTON_X + MENU_BUTTON_WIDTH &&
        mouseY > NEW_BUTTON_Y && mouseY < NEW_BUTTON_Y + MENU_BUTTON_HEIGHT){
            mouseOverPlay = true;
        } else {
            mouseOverPlay = false;
        }
        if(mouseX > CONTINUE_BUTTON_X && mouseX < CONTINUE_BUTTON_X + MENU_BUTTON_WIDTH &&
            mouseY > CONTINUE_BUTTON_Y && mouseY < CONTINUE_BUTTON_Y + MENU_BUTTON_HEIGHT){
                mouseOverContinue = true;
            } else {
                mouseOverContinue = false;
            }
}

function mouseClick(evt){
    console.log(mouseX + ", " + mouseY);
    if(mouseX > NEW_BUTTON_X && mouseX < NEW_BUTTON_X + MENU_BUTTON_WIDTH &&
        mouseY > NEW_BUTTON_Y && mouseY < NEW_BUTTON_Y + MENU_BUTTON_HEIGHT){
        if(allImagesLoaded){
            if(window.localStorage) {
                window.localStorage.clear();
            }
            saveProgress();
            startGame();
        } else {
            console.log("Please wait images loading");
        }
    }
    if(mouseX > CONTINUE_BUTTON_X && mouseX < CONTINUE_BUTTON_X + MENU_BUTTON_WIDTH &&
        mouseY > CONTINUE_BUTTON_Y && mouseY < CONTINUE_BUTTON_Y + MENU_BUTTON_HEIGHT){
        if(allImagesLoaded){
            loadProgress();
            startGame();
        } else {
            console.log("Please wait images loading");
        }
    }
    if(mouseX > MUTE_BUTTON_X && mouseX < MUTE_BUTTON_X + MUTE_BUTTON_WIDTH &&
        mouseY > MUTE_BUTTON_Y && mouseY < MUTE_BUTTON_Y + MUTE_BUTTON_HEIGHT){
        if(muted){
            muted = false;
            mute();
        } else {
            muted = true;
            mute();
        }
    }
}
