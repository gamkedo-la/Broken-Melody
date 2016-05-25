var ext;

function setFormat() {
	var audio = new Audio();
	if( audio.canPlayType("audio/mp3")) {
		ext = ".mp3";
	} else {
		ext = ".ogg";
	}
}

setFormat();

// var audio_music = new Audio("SFX/antventureTheme" + ext);
var audio_ganger_shot = new Audio("SFX/enemy_shot" + ext);
var audio_player_shot = new Audio("SFX/player_shot" + ext);
var audio_pizza_picked_up = new Audio("SFX/pizza_picked_up" + ext);
var audio_pizza_delivered = new Audio("SFX/pizza_delivered" + ext);
var audio_pisol_shoot = new Audio("SFX/pistol_shoot" + ext);
var audio_rifle_shoot = new Audio("SFX/rifle_shoot" + ext);

// audio_music.loop = true;
