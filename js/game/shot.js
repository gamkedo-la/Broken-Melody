function shotClass(){
    var bullet_speed = 10.0;
    var bullet_life = 20;
    var bullet_display_radious = 2.0;

    this.isActive = false;

    this.shootFrom = function (playerX, playerY) {

        this.isActive = true;
        this.x = playerX;
        this.y = playerY;

        switch (playerLastWalkedIn){
            case DIR_W:
                this.xv = -1.0;
                this.yv = 0.0;
                break;
            case DIR_E:
                this.xv = 1.0;
                this.yv = 0.0;
                break;
            case DIR_N:
                this.xv = 0.0;
                this.yv = -1.0;
                break;      
            case DIR_S:
                this.xv = 0.0;
                this.yv = 1.0;
                break;
        }

        if (hasPistol) {
            audio_pisol_shoot.play();
        }
        if (hasRifle) {
            if (audio_rifle_shoot_alt) {
                audio_rifle_shoot_alt.currentTime = 0;
                audio_rifle_shoot_alt.play();
            } else {
                audio_rifle_shoot.currentTime = 0;
                audio_rifle_shoot.play();
            }
        }

        this.bullet_life = bullet_life;
    }

    this.move = function(){
        if (this.bullet_life > 0) {
            this.bullet_life--;
            this.x += this.xv * bullet_speed;
            this.y += this.yv * bullet_speed;
        } else {
            this.isActive = false;
        }
    }

    this.draw = function(){
        if(this.isActive){
            colorCircle(this.x, this.y, bullet_display_radious, "#2D3030");
        }
    }

    this.reset = function(){
        this.bullet_life = 0;
        this.isActive = false;
    }

     this.isShotActive = function() {
         return this.isActive;
     }
}
