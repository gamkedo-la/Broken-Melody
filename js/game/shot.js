function shotClass(){
	var bullet_speed = 10.0;
	var bullet_life = 20;
	var bullet_display_radious = 2.0;

	this.shootFrom = function(playerX, playerY){
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

		this.bullet_life = bullet_life;
	}

	this.move = function(){
		if(this.bullet_life > 0){
			this.bullet_life--;
			this.x += this.xv * bullet_speed;
			this.y += this.yv * bullet_speed;
		}
	}

	this.draw = function(){
		if(this.bullet_life > 0){
		    colorCircle(this.x, this.y, bullet_display_radious, "#2D3030");
		}
	}

	this.reset = function(){
		this.bullet_life = 0;
	}
}
