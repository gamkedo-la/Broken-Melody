var allShots = [];

var holdingPistol = false;
var holdingRifle = false;

const PISTOL_PICKUP_AMMO = 10;
const RIFLE_PICKUP_AMMO = 30;

var pistolAmmo = 10;
var rifleAmmo = 30;




function addShotToPistol() {
    if (allShots < 1) {
        var myShot = new shotClass();
        allShots.push(myShot);
        
    }
}

function addShotToPistol_enemy(allShots) {
    if (allShots < 1) {
        var myShot = new shotClass();
        allShots.push(myShot);
    }
}

function addShotToRifle() {
    if (allShots.length < 5) {
        var myShot = new shotClass();
        allShots.push(myShot);
        
    }
}

function firePistol() {
    if (allShots[0].isActive == false && pistolAmmo > 0) {
        allShots[0].shootFrom(playerX, playerY, playerLastWalkedIn);
        pistolAmmo--;
    }
}

function firePistol_enemy(x,y,allShots, direction) {
    if (allShots[0].isActive === false) {
        allShots[0].shootFrom(x, y, direction);
    }
}

function fireRifle() {

    for (var i = 0; i < allShots.length; i++) {
        if (allShots[i].isActive == false && rifleAmmo > 0) {
            allShots[i].shootFrom(playerX, playerY, playerLastWalkedIn);
            rifleAmmo--;
            break;
        }
    }
}

function drawShot() {

    if (allShots.length > 0) {
        for (var i = 0; i < allShots.length; i++) {
            allShots[i].move();
            allShots[i].draw();
        }
    }
}

function drawShot_enemy(allShots) {

    if (allShots.length > 0) {
        for (var i = 0; i < allShots.length; i++) {
            allShots[i].move();
            allShots[i].draw();
        }
    }
}

function shotsExist() {
    if (allShots.length <= 0) {
        return false;
    } else {
        return true;
    }
}

function drawAmmo() {
    var AMMO_TEXT_SIZE = 15;
    ///change to holdingPistol
    if (hasPistol) {
        drawHudText(pistolAmmo, 200, 15, `${AMMO_TEXT_SIZE}px Consolas MS`, "#000000", "center");
    }
    if (hasRifle) {
        drawHudText(rifleAmmo, 200, 15, `${AMMO_TEXT_SIZE}px Consolas MS`, "#000000", "center");
    }
}


function drawWeapons() {
    if (hasRifle) {
        hudCanContext.drawImage(tileRifleHudPic, 180, 0);
        drawAmmo();
    } else if (hasPistol) {
        hudCanContext.drawImage(tilePistolHudPic, 180, 0);
        drawAmmo();
    } else {
        hudCanContext.drawImage(emptyHand, 180, 0);
    }
}