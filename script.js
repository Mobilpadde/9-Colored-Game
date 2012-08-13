/*
*
* Created by Mads Cordes
* @Mobilpadde || Mobilpadde@gmail.com || Mcordes@me.com
*
* 0: Transparent
* 1: Sky Blue
* 2: Grass
* 3: Yellow
* 4: Red
* 5: Dark Gray
* 6: Skin
* 7: Brown
* 8: Dark/Light Green (Random 5:1)
*/
var canvas = document.getElementById("game") //document.querySelector("canvas");
	canvas.width = document.width;
	canvas.height = document.height;
var ctx = canvas.getContext("2d"),
	cWidth = canvas.width,
	cHeight = canvas.height,
	scale = 8,
	dir,
	score = 0,
	spawnChange = 10;
	enemys = [],
	bullets = [],
	clouds = [],
	sprites = {
			"hero": {
				"left": [
					[0,0,0,4,4,4,4,0,0,0],
					[0,0,4,4,4,4,4,4,4,0],
					[0,0,6,5,6,6,6,6,0,0],
					[0,0,6,6,6,6,6,6,0,0],
					[0,0,4,4,6,6,6,6,0,0],
					[0,0,0,7,7,7,7,0,0,0],
					[3,3,0,5,5,5,5,7,0,7],
					[0,6,5,5,5,5,5,0,7,0],
					[0,0,0,5,5,5,5,0,0,0],
					[0,0,0,5,5,5,5,0,0,0],
					[0,0,0,5,5,5,5,0,0,0],
					[0,0,0,5,0,0,5,0,0,0],
					[0,0,4,4,0,4,4,0,0,0]
				],
				"right": [
					[0,0,0,4,4,4,4,0,0,0],
					[0,4,4,4,4,4,4,4,0,0],
					[0,0,6,6,6,6,5,6,0,0],
					[0,0,6,6,6,6,6,6,0,0],
					[0,0,6,6,6,6,4,4,0,0],
					[0,7,0,7,7,7,7,0,0,0],
					[7,0,7,5,5,5,5,0,3,3],
					[0,0,0,5,5,5,5,5,6,0],
					[0,0,0,5,5,5,5,0,0,0],
					[0,0,0,5,5,5,5,0,0,0],
					[0,0,0,5,5,5,5,0,0,0],
					[0,0,0,5,0,0,5,0,0,0],
					[0,0,0,4,4,0,4,4,0,0]
				],
				"jump": {
					"left": [],
					"right": []
				},
				"crouch": {
					"left": [
						[0,0,0,4,4,4,4,0,0,0],
						[0,0,4,4,4,4,4,4,4,0],
						[0,0,6,5,6,6,6,6,0,0],
						[0,0,6,6,6,6,6,6,0,7],
						[0,0,4,6,6,6,6,7,7,0],
						[0,0,0,7,7,7,7,0,0,0],
						[0,6,5,5,5,5,5,0,0,0],
						[3,3,0,5,5,5,5,0,0,0],
						[0,0,0,5,0,0,5,0,0,0],
						[0,0,4,4,0,4,4,0,0,0]
					],
					"right": [
						[0,0,0,4,4,4,4,0,0,0],
						[0,4,4,4,4,4,4,4,0,0],
						[0,0,6,6,6,6,5,6,0,0],
						[7,0,6,6,6,6,6,6,0,0],
						[0,7,7,6,6,6,6,4,0,0],
						[0,0,0,7,7,7,7,0,0,0],
						[0,0,0,5,5,5,5,5,6,0],
						[0,0,0,5,5,5,5,0,3,3],
						[0,0,0,5,0,0,5,0,0,0],
						[0,0,0,4,4,0,4,4,0,0]
					]
				}
			},
			"enemy": {
				"zombie": {
					"left": [
						[0,0,0,0,8,8,8,8,0],
						[0,0,0,8,8,8,8,8,8],
						[0,0,0,8,5,8,8,8,8],
						[0,0,0,8,8,8,8,8,8],
						[0,0,0,4,8,8,8,8,8],
						[0,8,0,0,8,8,8,8,0],
						[8,8,7,7,7,7,7,7,0],
						[0,0,0,0,7,7,7,7,0],
						[0,0,0,0,7,7,7,7,0],
						[0,0,0,0,7,7,7,7,0],
						[0,0,0,0,7,0,0,7,0],
						[0,0,0,8,8,0,8,8,0]
					],
					"right": [
						[0,8,8,8,8,0,0,0,0],
						[8,8,8,8,8,8,0,0,0],
						[8,8,8,8,5,8,0,0,0],
						[8,8,8,8,8,8,0,0,0],
						[8,8,8,8,8,4,0,0,0],
						[0,8,8,8,8,0,0,8,0],
						[0,7,7,7,7,7,7,8,8],
						[0,7,7,7,7,0,0,0,0],
						[0,7,7,7,7,0,0,0,0],
						[0,7,7,7,7,0,0,0,0],
						[0,7,0,0,7,0,0,0,0],
						[0,8,8,0,8,8,0,0,0]
					]
				},
				"blob": {
					"left": [
						[0,0,0,8,8,8,8,0,0,0],
						[0,0,8,8,8,8,8,8,0,0],
						[0,5,5,8,8,8,8,8,0,0],
						[0,8,8,8,8,8,8,8,8,0],
						[0,8,8,8,8,8,8,8,8,0],
						[8,8,8,8,8,8,8,8,8,8]
					],
					"right": [
						[0,0,0,8,8,8,8,0,0,0],
						[0,0,8,8,8,8,8,8,0,0],
						[0,8,8,8,8,8,5,5,0,0],
						[0,8,8,8,8,8,8,8,8,0],
						[8,8,8,8,8,8,8,8,8,0],
						[8,8,8,8,8,8,8,8,8,8]
					]
				},
				"muzz": [
					[0,8,0,0,5,5,8,5,5,0,0,8,0],
					[8,7,8,0,5,4,8,4,5,0,8,7,8],
					[0,0,7,8,8,8,5,8,8,8,7,0,0],
					[0,0,0,7,8,5,8,5,8,7,0,0,0],
					[0,0,0,0,8,5,8,5,8,0,0,0,0]
				]
			},
			"bullet": {
				"bullet": ["3","3"],
				"explode": {
					"left": [],
					"right": []
				}
			},
			"cloud": [
				[0,0,6,6,6,6,6,6,6,0,0],
				[0,6,6,6,6,6,6,6,6,6,0],
				[6,6,6,6,6,6,6,6,6,6,6],
				[0,6,6,6,6,6,6,6,6,6,0],
				[0,0,6,6,6,6,6,6,6,0,0]
			]
		},
	hero = {
		x: (cWidth / 2) - ((scale * sprites.hero.left[0].length) / 2),
		y: (cHeight - ((sprites.hero.left.length * scale) + (scale * 2))),
		life: 5,
		jump: 0,
		height: 0,
		speed: 0,
		dir: (rand(0,1) ? "right" : "left"),
		hit: 0,
		crouch: 0
	};

function rand(min, max){
	var num = Math.floor(Math.random()*(max - min + 1)) + min;
	while(num < min){
		num = Math.floor(Math.random()*(max - min + 1)) + min;
	}
	return num;
}
function handleColor(num){
	switch(num){
		case 0:
			return ctx.fillStyle = "transparent"; break;
		case 1:
			return ctx.fillStyle = "#87dcec"; break;
		case 2:
			return ctx.fillStyle = "#72d856"; break;
		case 3:
			return ctx.fillStyle = "#f7e818"; break;
		case 4:
			return ctx.fillStyle = "#f75149"; break;
		case 5:
			return ctx.fillStyle = "#303030"; break;
		case 6:
			return ctx.fillStyle = "#fff1da"; break;
		case 7:
			return ctx.fillStyle = "#75430a"; break;
		case 8:
			return ctx.fillStyle = (rand(0,4) ? "#0e7259" : "#217017"); break;
	}
}
function handleInfo(){
	var x = 5;
	for(var i = 0; i < hero.life; i++){
		for(var j = 0; j < sprites.hero.right.length; j++){
			for(var k = 0; k < sprites.hero.right[j].length; k++){
				handleColor(sprites.hero.right[j][k]);
				ctx.fillRect((k * 2) + x, (j * 2) + 5, 2, 2);
			}
		}
		x = x + (sprites.hero.left[0].length * 2.5);
	}
	
	ctx.font="30px Visitor";
	ctx.textAlign = "right";
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillText("You've killed "+score+" enemies", (cWidth - 5), 28);
	ctx.font="25px Visitor";
}
function handleDeath(){
	var text = "You are dead!",
		text = text.split(" "),
		fontSize = 30,
		spaceB = 30,
		y = 10;
	for(var key in text){
		ctx.font=fontSize+"px Visitor";
		ctx.textAlign = "center";
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.fillText(text[key], (cWidth / 2), (((cHeight - 50) / 2) + y));
		
		fontSize = fontSize + 5;
		y = y + spaceB;
		spaceB = spaceB + 10;
	}
}
function enemy(){
	this.x = (rand(0,1) ? 0 : cWidth);
	
	this.hit = 0;
	this.species = rand(0, 2);
	switch(this.species){
		case 0:
			this.species = "zombie";
			this.life = 2;
			this.speed = rand(1,4);
			break;
		case 1:
			this.species = "blob";
			this.life = 0;
			this.speed = rand(1,3);
			break;
		case 2:
			this.species = "muzz";
			this.life = 0;
			this.speed = rand(3,5);
			break; 
	}
	
	if(this.species != "muzz"){
		this.y = (cHeight - ((sprites.enemy[this.species].left.length * scale) + (scale * 2)));
	}else{
		this.y = rand(20, (cHeight - ((sprites.enemy.zombie.left.length * scale) + (scale * 5))));
	}
	
	this.dx = hero.x;
}
function bullet(){
	this.x = (hero.dir == "left" ? hero.x : (hero.x + (scale * 10)));
	this.y = (hero.crouch ? (hero.y + (scale * 7)) : (hero.y + (scale * 6)))
	
	this.state = 1;
	this.dir = 0;
}
function cloud(){
	this.x = (rand(0,1) ? -(sprites.cloud.length * scale) : cWidth);
	this.y = rand(0,200);
	
	if(this.x > 0){
		this.dir = "left";
	}else{
		this.dir = "right";
	}
	
	this.speed = rand(1,2);
}
function doKeys(){
	document.onkeydown = function(e){
		switch(e.keyCode){
			case 38:
			case 87:
				hero.jump = 1;
				e.preventDefault();
				break;
			case 32: e.preventDefault(); break;
			case 40:
			case 83: 
				hero.crouch = 1;
				if(hero.y >= (cHeight - ((sprites.hero.left.length * scale) + (scale * 2)))){
					hero.y = (cHeight - ((sprites.hero.crouch.left.length * scale) + (scale * 2)));
				}
				e.preventDefault(); 
				break;
			case 37:
			case 65:
				hero.speed = (hero.x <= 0 ? 0 : -scale); 
				e.preventDefault(); 
				break;
			case 39:
			case 68:
				hero.speed = (hero.x >= (cWidth - ((sprites.hero.left.length - 1) * scale)) ? 0 : scale); 
				e.preventDefault(); 
				break;
		}
	}
	document.onkeyup = function(e){
		switch(e.keyCode){
			case 38:
			case 87:
				hero.jump = 0;
				e.preventDefault();
				break;
			case 32: 
				(bullets.length < 11 ? bullets.push(new bullet()) : "");
				break;
			case 40:
			case 83: 
				hero.crouch = 0;
				hero.y = (cHeight - ((sprites.hero.left.length * scale) + (scale * 2)));
				e.preventDefault(); 
				break;
			case 37:
			case 65:
				hero.speed = 0; 
				e.preventDefault(); 
				break;
			case 39:
			case 68:
				hero.speed = 0; 
				e.preventDefault(); 
				break;
		}
	}
}
function drawHero(){
	if(hero.speed != 0){
		hero.dir = (hero.speed > 0 ? "right" : "left");
		hero.x = (hero.speed > 0 ? hero.x + scale : hero.x - scale);
	}
	
	if(hero.jump != 0){
		hero.y = hero.y - (scale * 4);
		hero.jump = 0;
	}else if(!hero.jump && hero.y < (cHeight - ((sprites.hero.left.length * scale) + (scale * 2)))){
		hero.y = hero.y + scale;
	}
	
	for(var key in enemys){
		var e = enemys[key];
		if( hero.y <= e.y && hero.y >= (e.y - (scale * 12))){
			if( e.x > hero.x && 
				e.x < (hero.x + (scale * 10)) ||
				(e.x + (scale * 9)) > hero.x &&
				(e.x + (scale * 9)) < (hero.x + (scale * sprites.hero[hero.dir][0].length))){
				hero.life--;
				hero.hit = 1;
				enemys.splice(key,1);
				spawnChange++;
			}
		}
	}
	
	if(hero.life > 0){
		if(!hero.crouch){
			for(var i = 0; i < sprites.hero[hero.dir].length; i++){
				for(var j = 0; j < sprites.hero[hero.dir][i].length; j++){
					handleColor((hero.hit ? (sprites.hero[hero.dir][i][j] ? 4 : 0) : sprites.hero[hero.dir][i][j]));
					ctx.fillRect((j * scale) + hero.x, (i * scale) + hero.y, scale, scale);
				}
			}
		}else{
			for(var i = 0; i < sprites.hero.crouch[hero.dir].length; i++){
				for(var j = 0; j < sprites.hero.crouch[hero.dir][i].length; j++){
					handleColor((hero.hit ? (sprites.hero.crouch[hero.dir][i][j] ? 4 : 0) : sprites.hero.crouch[hero.dir][i][j]));
					ctx.fillRect((j * scale) + hero.x, (i * scale) + hero.y, scale, scale);
				}
			}
		}
	}else{
		handleDeath();
	}
	
	if(hero.hit){
		hero.hit = 0;
	}
}
function drawEnemy(){
	for(var key in enemys){
		e = enemys[key];
		dir = (e.x < e.dx ? "right" : "left");
		e.dx = hero.x; 
		
		if(e.x < e.dx){
			e.x = e.x + e.speed;
		}else if(e.x > e.dx){
			e.x = e.x - e.speed;
		}
		
		if(e.species != "muzz"){
			for(var keyz in bullets){
				var b = bullets[keyz];
				if(b.x < (e.x + (scale * 9)) && b.x > e.x && b.y < (e.y + (sprites.enemy[e.species][dir].length * scale)) && b.y > e.y){
					bullets.splice(keyz,1);
					e.hit = 1;
					if(e.life > 0){
						e.life--;
					}else{
						enemys.splice(key,1);
						score++;
						if(spawnChange > 0){
							spawnChange--;
						}
					}
				}
			}
			for(var i = 0; i < sprites.enemy[e.species][dir].length; i++){
				for(var j = 0; j < sprites.enemy[e.species][dir][i].length; j++){
					handleColor((e.hit ? (sprites.enemy[e.species][dir][i][j] ? 4 : 0) : sprites.enemy[e.species][dir][i][j]));
					ctx.fillRect((j * scale) + e.x, (i * scale) + e.y, scale, scale);
				}
			}
		}else{
			for(var keyz in bullets){
				var b = bullets[keyz];
				if(b.x < (e.x + (scale * 9)) && b.x > e.x && b.y < (e.y + (sprites.enemy[e.species].length * scale)) && b.y > e.y){
					bullets.splice(keyz,1);
					e.hit = 1;
					if(e.life > 0){
						e.life--;
					}else{
						enemys.splice(key,1);
						score++;
						if(spawnChange > 0){
							spawnChange--;
						}
					}
				}
			}
			
			(hero.y < e.y ? e.y-- : e.y++);
			
			for(var i = 0; i < sprites.enemy.muzz.length; i++){
				for(var j = 0; j < sprites.enemy.muzz[i].length; j++){
					handleColor((e.hit ? (sprites.enemy.muzz[i][j] ? 4 : 0) : sprites.enemy.muzz[i][j]));
					ctx.fillRect((j * scale) + e.x, (i * scale) + e.y, scale, scale);
				}
			}
		}
		
		if(e.hit){
			e.hit = 0;
		}
	}
}
function drawBullet(){
	for(var key in bullets){
		var b = bullets[key];
		for(var i = 0; i < sprites.bullet.bullet.length; i++){
			handleColor(5);
			ctx.fillRect((i * scale) + b.x, b.y, scale, scale);
		}
		if(!b.dir){
			if(hero.dir == "right"){
				if(b.x < cWidth){
					b.x = (b.x + (scale * 2));
					b.dir = hero.dir;
				}else{
					bullets.splice(key,1);
				}
			}else if(hero.dir == "left"){
				if(b.x > 0){
					b.x = (b.x - (scale * 2));
					b.dir = hero.dir;
				}else{
					bullets.splice(key,1);
				}
			}
		}
		if(b.dir == "right"){
			if(b.x < cWidth){
				b.x = (b.x + (scale * 2));
			}else{
				bullets.splice(key,1);
			}
		}else if(b.dir == "left"){
			if(b.x > 0){
				b.x = (b.x - (scale * 2));
			}else{
				bullets.splice(key,1);
			}
		}
	}
}
function drawClouds(){
	for(var key in clouds){
		var c = clouds[key];
		
		if(c.dir == "left"){
			if(c.x < 0){
				clouds.splice(key,1);
			}
			c.x = c.x - c.speed;
		}else{
			if(c.x > (cWidth + (sprites.cloud.length * scale))){
				clouds.splice(key,1);
			}
			c.x = c.x + c.speed;
		}
		
		for(var i = 0; i < sprites.cloud.length; i++){
			for(var j = 0; j < sprites.cloud[i].length; j++){
				handleColor(sprites.cloud[i][j]);
				ctx.fillRect((j * scale) + c.x, (i * scale) + c.y, scale, scale);
			}
		}
	}
}
function loop(){
	ctx.clearRect(0, 0, cWidth, cHeight);
	handleColor(1);
	ctx.fillRect(0, 0, cWidth, cHeight);
	handleColor(2);
	ctx.fillRect(0, cHeight - (scale * 2), cWidth, cHeight);
	
	doKeys();
	drawBullet();
	drawHero();
	drawClouds();
	handleInfo();
	drawEnemy();
}

enemys.push(new enemy(), new enemy(), new enemy());
clouds.push(new cloud());
setInterval(function(){
	(rand(0,spawnChange) ? "" : enemys.push(new enemy()));
	(rand(0,spawnChange) ? "" : (clouds.length < 21 ? clouds.push(new cloud()) : ""));
}, 1000);
setInterval(loop, 1000/20);