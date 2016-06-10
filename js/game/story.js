var opacityTimer = 0;
var opacity = 0.0;

var fadInsplash = true;
var fadeOutSplash = false;

var story1fadein = false;
var story1fadeout = false;

var story2fadein = false;
var story2fadeout = false;

function runStory() {

    if (fadInsplash) {
        if (opacityTimer >= 1) {
            opacityTimer = 0;
            colorRect(0, 0, canvas.width, canvas.height, "black");
            drawImageWithFade(gamkedoLogoPic, 50, (canvas.height - 128) / 2, opacity);

            opacity = opacity + 0.01;


            if (opacity >= 1) {
                fadInsplash = false;
                fadeOutSplash = true;
            }
        }
    } else if (fadeOutSplash) {
        if (opacityTimer >= 1) {
            opacityTimer = 0;
            colorRect(0, 0, canvas.width, canvas.height, "black");
            drawImageWithFade(gamkedoLogoPic, 50, (canvas.height - 128) / 2, opacity);

            opacity = opacity - 0.01;


            if (opacity <= 0) {
                fadeOutSplash = false;
                story1fadein = true;
                opacity = 0;
            }
        }
    } else if (story1fadein) {
        if (opacityTimer >= 1) {
            opacityTimer = 0;
            colorRect(0, 0, canvas.width, canvas.height, "black");
            drawImageWithFade(story1Pic, 0, 0, opacity);

            opacity = opacity + 0.01;


            if (opacity >= 1) {
                story1fadein = false;
                story1fadeout = true;
            }
        }
    } else if (story1fadeout) {
        if (opacityTimer >= 1) {
            opacityTimer = 0;
            colorRect(0, 0, canvas.width, canvas.height, "black");
            drawImageWithFade(story1Pic, 0, 0, opacity);

            opacity = opacity - 0.01;


            if (opacity <= 0) {
                story1fadeout = false;
                story2fadein = true;
                opacity = 0;
            }
        }
    }


    else if (story2fadein) {
        if (opacityTimer >= 1) {
            opacityTimer = 0;
            colorRect(0, 0, canvas.width, canvas.height, "black");
            drawImageWithFade(story2Pic, 0, 0, opacity);

            opacity = opacity + 0.01;


            if (opacity >= 1.5) {
                story2fadein = false;
                story2fadeout = true;
            }
        }
    } else if (story2fadeout) {
        if (opacityTimer >= 1) {
            opacityTimer = 0;
            colorRect(0, 0, canvas.width, canvas.height, "black");
            drawImageWithFade(story2Pic, 0, 0, opacity);

            opacity = opacity - 0.01;


            if (opacity <= 0) {
                startLogos = false;
            }
        }
    }
    opacityTimer++;
}