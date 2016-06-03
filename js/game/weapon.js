var allShots = [];


var hasPistol = true;
var hasRifle = true;

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


function drawWeapons() {
    drawAmmo();
    if (hasRifle) {
        hudCanContext.drawImage(tileRifleHudPic, canvas.width-80, 0);
    }
    if (hasPistol) {
        hudCanContext.drawImage(tilePistolHudPic, canvas.width-130, 0);
    } 
    
    hudCanContext.drawImage(emptyHand, canvas.width-185, 0);
    
    if (holdingPistol === false && holdingRifle === false) {
        rect(canvas.width - 180, 2, 50, 50, 2, "yellow");
    } else if (holdingPistol === true) {
        rect(canvas.width - 130, 2, 50, 50, 2, "yellow");
    } else if (holdingRifle === true) {
        rect(canvas.width - 80, 2, 50, 50, 2, "yellow");
    }

}

function drawAmmo() {
    var AMMO_TEXT_SIZE = 15;
    ///change to holdingPistol
    if (hasPistol) {
        drawHudText(pistolAmmo, canvas.width-85, 15, `${AMMO_TEXT_SIZE}px Consolas MS`, "#000000", "center");
    }
    if (hasRifle) {
        drawHudText(rifleAmmo, canvas.width-45, 15, `${AMMO_TEXT_SIZE}px Consolas MS`, "#000000", "center");
    }
}

function gunSwitchLogic() {
    if (hasPistol && holdingRifle == false && holdingPistol === false) {
        holdingRifle = false;
        holdingPistol = true;
    } else if (hasRifle && holdingPistol) {
        holdingPistol = false;
        holdingRifle = true;
    } else if ((hasPistol === false && hasRifle === false) || holdingRifle) {
        holdingPistol = false;
        holdingRifle = false;
    }


}