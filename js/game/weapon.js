var allShots = [];


function addShotToPistol() {
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
    if (allShots[0].isActive == false) {
        allShots[0].shootFrom(playerX, playerY);
    }
}

function fireRifle() {

    for (var i = 0; i < allShots.length; i++) {
        if (allShots[i].isActive == false) {
            allShots[i].shootFrom(playerX, playerY);
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

function shotsExist() {
    if (allShots.length <= 0) {
        return false;
    } else {
        return true;
    }
}