
function drawTransparentHudBox() {
    hudCanContext.globalAlpha = 0.75;
    //pizza box :)
    colorRectHud(0, 0, 180, 67, "white");
    //cash box
    colorRectHud(377, 0, 50, 46, "white");
    //weapon box
    colorRectHud(canvas.width-130, 0, 140, 64, "white");
    //mute box
    colorRectHud(MUTE_BUTTON_X, MUTE_BUTTON_Y, MUTE_BUTTON_WIDTH - 2, MUTE_BUTTON_HEIGHT - 2, "white");
    hudCanContext.globalAlpha = 1;
}

var offset = 15;
function drawAmmo() {
    var AMMO_TEXT_SIZE = 15;
    ///change to holdingPistol
    if (hasPistol) {
        drawHudText(pistolAmmo, canvas.width - 95 + offset, 46, `bold ${AMMO_TEXT_SIZE}px Consolas MS`, "#000000", "center");
    }
    if (hasRifle) {
        drawHudText(rifleAmmo, canvas.width - 50 + offset, 46, `bold ${AMMO_TEXT_SIZE}px Consolas MS`, "#000000", "center");
    }
}

function drawWeapons() {
    drawAmmo();
    if (hasRifle) {
        hudCanContext.drawImage(tileRifleHudPic, canvas.width - 80 + offset, 0);
    }
    if (hasPistol) {
        hudCanContext.drawImage(tilePistolHudPic, canvas.width - 140 + offset, 0);
    }

    if (holdingPistol === true) {
        rectHud(canvas.width - 135 + offset, 2, 52, 50, 2, "#EF5353");
    } else if (holdingRifle === true) {
        rectHud(canvas.width - 80 + offset, 2, 52, 50, 2, "#EF5353");
    }

}

function displayRemainingDeliveries() {
    if (isWinner) {
        return;
    }
    var textY = 65;
    hudCanContext.fillStyle = "black";
    hudCanContext.font = "bold 14px Consolas MS";
    hudCanContext.fillText(`DELIVERIES LEFT: ${remainingDeliveries}`, 85, textY);
}



//PIZZAS
function drawHealthHud() {
    if (isWinner) {
        return;
    }
    if (health == 1) {
        hudCanContext.drawImage(hudHealth1Pic, 0, 0);
    }
    if (health == 2) {
        hudCanContext.drawImage(hudHealth2Pic, 0, 0);
    }
    if (health == 3) {
        hudCanContext.drawImage(hudHealth3Pic, 0, 0);
    }
    if (health < 1) {
        hudCanContext.drawImage(hudHealth0Pic, 0, 0);
    }
}

function drawShieldHud() {
    if (isWinner) {
        return;
    }
    if (shieldAmount === 1) {
        hudCanContext.drawImage(hudShield1Pic, 0, 0);
    }
    if (shieldAmount === 2) {
        hudCanContext.drawImage(hudShield2Pic, 0, 0);
    }
    if (shieldAmount === 3) {
        hudCanContext.drawImage(hudShield3Pic, 0, 0);
    }
}



//MONEY and TIMER
function drawFundsAndTimer() {
    if (isWinner) {
        return;
    }
    hudCanContext.fillStyle = "#000000";
    hudCanContext.font = "20px Consolas MS";
    hudCanContext.textAlign = "center";
    hudCanContext.fillText(`$ ${money}`, 400, 20);

    if (pizzaTime > 0) {
        hudCanContext.fillStyle = "#000000";
        hudCanContext.font = "20px Consolas MS";
        hudCanContext.textAlign = "center";
        hudCanContext.fillText(pizzaTime, 400, 40);
    }
}


//WEAPONS





function drawSpeaker() {
    if (muted) {
        hudCanContext.drawImage(speakerMuted, MUTE_BUTTON_X, MUTE_BUTTON_Y);
    } else {
        hudCanContext.drawImage(speakerNotMuted, MUTE_BUTTON_X, MUTE_BUTTON_Y);
    }

    
}