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

var audio_music = new Audio("SFX/determination" + ext);
var audio_ganger_shot = new Audio("SFX/enemy_shot" + ext);
var audio_player_shot = new Audio("SFX/player_shot" + ext);
var audio_pizza_picked_up = new Audio("SFX/pizza_picked_up" + ext);
var audio_pizza_delivered = new Audio("SFX/pizza_delivered" + ext);
var audio_pisol_shoot = new Audio("SFX/pistol_shoot" + ext);
var audio_rifle_shoot = new Audio("SFX/rifle_shoot" + ext);
var audio_rifle_shoot_alt = new Audio("SFX/rifle_shoot" + ext);

audio_music.loop = true;


function mute(){
    if(muted){
        audio_music.muted = muted;
        audio_ganger_shot.muted = muted;
        audio_player_shot.muted = muted;
        audio_pizza_picked_up.muted = muted;
        audio_pizza_delivered.muted = muted;
        audio_pisol_shoot.muted = muted;
        audio_rifle_shoot.muted = muted;
        audio_rifle_shoot_alt.muted = muted;
    } else {
        audio_music.muted = muted;
        audio_ganger_shot.muted = muted;
        audio_player_shot.muted = muted;
        audio_pizza_picked_up.muted = muted;
        audio_pizza_delivered.muted = muted;
        audio_pisol_shoot.muted = muted;
        audio_rifle_shoot.muted = muted;
        audio_rifle_shoot_alt.muted = muted;
    }
}
