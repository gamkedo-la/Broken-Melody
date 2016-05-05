function shotClass(){
	var bullet_speed = 6.0;
	var bullet_life = 30;
	var bullet_display_radious = 2.0;

	this.shootFrom = function(playerX, playerY){
		this.x = playerX;
		this.y = playerY;

		this.xv = 0.0;
		this.yv = 0.0;

		this.bullet_life = bullet_life;
	}

	this.move = function(){
		if(this.bullet_life > 0){
			this.bullet_life--;
		}
	}

	this.draw = function(){
		if(this.bullet_life > 0){
			colorCircle(this.x, this.y, bullet_display_radious, 'yellow');	
		}
	}

	this.reset = function(){
		this.bullet_life = 0;
	}
}
