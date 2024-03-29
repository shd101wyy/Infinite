var canvas = document.getElementById("Game_Canvas");
var context = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 64 * 12;
canvas.style.width = canvas.width;
canvas.style.height = canvas.height;
canvas.style.position = "absolute";

var body_width = document.body.offsetWidth;
var body_height = document.body.offsetHeight;
canvas.style.left = (body_width - canvas.width)/2
canvas.style.top = (body_height - canvas.height)/2


var wall_image = new Image(); wall_image.src = "./Wall.png";
var ground_image = new Image(); ground_image.src = "./Ground.png";
var grass_image = new Image(); grass_image.src = "./Grass.png";
var tree_image = new Image(); tree_image.src = "./Tree.png";
var water_image = new Image(); water_image.src = "./Water.png";
var sand_image = new Image(); sand_image.src = "./Sand.png";
var stone_image = new Image(); stone_image.src = "./Stone.png";
var attack_effect2 = new Image(); attack_effect2.src = "./Attack_Effect2.png";
var mouse_image = new Image(); mouse_image.src = "./Mouse.png";
var ghost1 = new Image(); ghost1.src = "./Ghost1.png";
var bat_image = new Image(); bat_image.src = "./Bat.png";
var bed_image = new Image(); bed_image.src = "./Bed.png";
var small_table_image = new Image(); small_table_image.src = "./Small_Table.png";

var background_music_ancient_forest = document.getElementById("background_music_ancient_forest")
var background_music_village = document.getElementById("background_music_village");
function clearScreen()
{
	context.clearRect(0, 0, canvas.width, canvas.height);
}
function Prelude() 
{
	document.body.style.background = "black";
	canvas.style.background = "#454545";

	//context.font = "Arial";
	//context.fillStyle = "blue";
	//context.fillText("Welcome to the world of Infinity. This world has no light. Everything is dark. And you are trying to find the light", 300, 300);
	
	context.font = "32px Arial bold";
	context.fillStyle = "white";
	context.fillText("Welcome to the World of Infinity.",100,150);
	//context.fillText("This world doesn't have any light.", 100, 200);
	//context.fillText("Everything is in dark...", 100, 250);
	context.fillText("Version 0.1", 100, 300);

	setTimeout(function()
	{
		clearScreen();
		context.fillText("Please... Hero! ", 100, 150);
		context.fillText("Please save this world!!", 100, 200);
		context.fillText("Please bring us brightness!!!", 100, 250);

		var img = new Image();
		img.src = "./Character.png";
		img.onload = function()
		{
			context.drawImage(img, 300, 400, 64, 64);
		}
		setTimeout(function()
		{
			clearScreen();
			context.fillText("Game Beginssssss", 200, 300);
			// begin to start game
			setTimeout(function()
			{
				clearScreen();
				enterGameWorld(character); // enter game world
			}, 1000)
		}, 1000)
	}, 1000);

	//context.fillStyle = "black";
	//context.fillRect(0,0,150,75);

}
function BeginGame()
{
	/* Begin Game */
	Prelude(); // run prelude
}
function ShowMenu()
{
	clearScreen();
	context.font = "32px Arial bold";
	context.fillStyle = "white";
	context.fillText("Name: Yiyi",100,150);

	context.fillText("Level  : " + character.level, 100, 300);
	context.fillText("HP      : " + character.hp, 100, 350);
	context.fillText("EXP      : " + character.experience, 100, 400);

}
var KEYS = [];
var SHOW_MENU = 0;
var ENEMIES = [];
document.body.onkeydown = function(evt)
{
	console.log(evt.keyCode);
	KEYS[evt.keyCode] = true;
}
document.body.onkeyup = function(evt)
{
	console.log("Key Up: " + evt.keyCode);
	KEYS[evt.keyCode] = false;
}
/*
	create character
*/
var Character = function()
{
	var character_image = new Image(); character_image.src = "./Character.png";
	var character_image2 = new Image(); character_image2.src = "./Character2.png";

	this.image = [character_image, character_image2]//, character_image2];
	this.count = 0;
	this.x = 5;
	this.y = 5;
	this.level = 1;
	this.hp = 30;
	this.max_hp = 30;
	this.experience = 0;
	this.attack_damage = 5;
	this.evasion = 0.005; // evasion
	this.inventory = {};  // inventory
	this.fixed_position_x = 5;
	this.fixed_position_y = 5;
	this.draw = function()
	{
		if(this.count % 20 == 0)
			context.drawImage(this.image[0], this.fixed_position_x %10 * 64, this.fixed_position_y %10 * 64, 64, 64);
		else
			context.drawImage(this.image[1], this.fixed_position_x %10 * 64, this.fixed_position_y %10 * 64, 64, 64);
		this.count++;
	}
}
// killed enemy, get experience and check levelup
function Character_CheckLevelUp(killed_enemy)
{
	character.experience += killed_enemy.exp;
	console.log("exp now : " + character.experience);
	if(character.experience >= character.hp * 10)
	{
		character.level += 1; // level up;
		character.experience -=  character.hp * 10; // update experience
		character.evasion += 0.005;
		character.attack_damage += 3;
		character.max_hp += 20;
		character.hp = character.max_hp;
	}
}
var Slime = function()
{
	this.image = new Image();
	this.image.src = "./Slime.png";
	this.x = 1;
	this.y = 0;
	this.level = 1;
	this.hp = 20;
	this.attack_damage = 1;
	this.hostile = 4;
	this.exp = 20;
	this.name = "Cute Slime";
	this.draw = function()
	{
		var x = character.x - character.fixed_position_x;
		var y = character.y - character.fixed_position_y;
		context.drawImage(this.image, (this.x - x) * 64, (this.y - y)*64, 64, 64);	}
}

var Mouse = function(x, y)
{
	this.image = mouse_image;
	this.x = 0;
	this.y = 0;
	if(typeof(x)!=="undefined") this.x = x;
	if(typeof(y)!=="undefined") this.y = y;

	this.level = 1;
	this.hp = 30;
	this.attack_damage = 2;
	this.hostile = 8;
	this.exp = 45;
	this.name = "Cute Mouse";
	this.draw = function()
	{
		var x = character.x - character.fixed_position_x;
		var y = character.y - character.fixed_position_y;
		context.drawImage(this.image, (this.x - x) * 64, (this.y - y)*64, 64, 64);
	}
}
var Bat = function(x, y)
{
	this.image = bat_image;
	this.x = 0;
	this.y = 0;
	if(typeof(x)!=="undefined") this.x = x;
	if(typeof(y)!=="undefined") this.y = y;

	this.level = 1;
	this.hp = 40;
	this.attack_damage = 6;
	this.hostile = 14;
	this.exp = 80;
	this.name = "Cute Bat";
	this.draw = function()
	{
		var x = character.x - character.fixed_position_x;
		var y = character.y - character.fixed_position_y;
		context.drawImage(this.image, (this.x - x) * 64, (this.y - y)*64, 64, 64);
	}
}
var Ghost = function(x, y)
{
	this.image = ghost1;
	this.x = 0;
	this.y = 0;
	if(typeof(x)!=="undefined") this.x = x;
	if(typeof(y)!=="undefined") this.y = y;

	this.level = 1;
	this.hp = 50;
	this.attack_damage = 4;
	this.hostile = 12;
	this.exp = 60;
	this.name = "Cute Ghost";
	this.draw = function()
	{
		var x = character.x - character.fixed_position_x;
		var y = character.y - character.fixed_position_y;
		context.drawImage(this.image, (this.x - x) * 64, (this.y - y)*64, 64, 64);	}
}
/*
	create village
*/
var Map = function()
{
	this.map = 
	[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
	 [0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	 [0,1,0,2,2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	 [0,1,0,2,2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	 [0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	 [0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	]
	this.collision = 
	[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
	 [0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	 [0,1,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	 [0,1,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	 [0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
	 [0,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	]
	this.music = background_music_ancient_forest;

	this.draw = function()
	{
		// 计算相对于玩家的相对位置
		var x = character.x - character.fixed_position_x;
		var y = character.y - character.fixed_position_y;
		for(var i = 0; i < 12; i++)
		{
			for(var j = 0; j < 10; j++)
			{
				if( i + y >= this.map.length || j + x >= this.map[i].length || i + y < 0 || j + x < 0)
					continue;
				var v = this.map[i + y][j + x];
				if(v == 0)
					//context.drawImage(ground_image, j*64, i*64, 64, 64);
					context.drawImage(grass_image, j*64, i*64, 64, 64);
				if(v == 1)
				{
					context.drawImage(grass_image, j*64, i*64, 64, 64);
					context.drawImage(tree_image, j*64, i*64, 64, 64);
				}
				if(v == 2)
				{
					context.drawImage(grass_image, j*64, i*64, 64, 64);
					context.drawImage(stone_image, j*64, i*64, 64, 64);
				}
			}
		}
	}
} 
/*
	resources information
*/
var RESOURCES_INFO = 
{
	"bed": {
		image: bed_image,
		information: "This is a beautiful bed",
		hp: 200,
		width:2,
		height:1
	},
	"wall1": {
		image: wall_image,
		information: "This is a ugly wall",
		hp:20000,
		width:1,
		height:1
	},
	"small_table":
		{
			image: small_table_image,
			information: " This is a small table",
			hp: 100,
			width:1,
			height:1
		}
}
/*
	create resources
*/
var Resources = function(name)
{
	// bed
	this.name = name;
	this.image = RESOURCES_INFO[name]["image"];
	this.information = RESOURCES_INFO[name]["information"];
	this.hp = RESOURCES_INFO[name]["hp"];
	this.width = RESOURCES_INFO[name]["width"];
	this.height = RESOURCES_INFO[name]["height"];

	this.draw = function(x, y)
	{
		context.drawImage(this.image, x*64, y*64);
	}
}
/* Create Village */
var Village = function()
{
	// 1 => ground
	this.map = [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	]
	// 1 => wall
	// 2 => bed
	// 3 => small table
	var wall1 = new Resources("wall1");
	var bed = new Resources("bed");
	var small_table = new Resources("small_table");
	this.resources = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,4,4,4,4,4,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,3,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,2,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		]

	this.collision = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	]
	this.music = background_music_village;

	this.draw = function()
	{
		// 计算相对于玩家的相对位置
		var x = character.x - character.fixed_position_x;
		var y = character.y - character.fixed_position_y;
		for(var i = 0; i < 12; i++)
		{
			for(var j = 0; j < 10; j++)
			{
				if( i + y >= this.map.length || j + x >= this.map[i].length || i + y < 0 || j + x < 0)
					continue;
				var v = this.map[i + y][j + x];
				if(v == 1)
					context.drawImage(ground_image, j*64, i*64, 64, 64);
			}
		}
		for(var i = 0; i < 12; i++)
		{
			for(var j = 0; j < 10; j++)
			{
				if( i + y >= this.map.length || j + x >= this.map[i].length || i + y < 0 || j + x < 0)
					continue;
				var r = this.resources[i + y][j + x];
				if(r == 1)
					wall1.draw(j, i);
				else if (r == 2)
					bed.draw(j, i);
				else if (r == 3)
					small_table.draw(j, i);
			}
		}
	}

}

// var map = new Map();
var map = new Village();
var character = new Character();
var slime = new Slime();
var slime2 = new Slime();
slime2.y = 3;  slime2.x = 2;
var mouse = new Mouse(2, 0);
var ghost = new Ghost(3, 0);
var bat = new Bat(4, 0);
// ENEMIES.push(slime, slime2, mouse, ghost, bat);

/*
	check enemy exist at that position
*/
function Enemy_Exist(x, y)
{
	for(var i = 0; i < ENEMIES.length; i++)
	{
		if(ENEMIES[i].x == x && ENEMIES[i].y == y)
		{
			return ENEMIES[i];
		}
	}
	return null;
}

function Enemy_Delete(enemy)
{
	for(var i = 0; i < ENEMIES.length; i++)
	{
		if(ENEMIES[i] == enemy)
		{
			ENEMIES.splice(i, 1);
			return;
		}
	}
}
// update enemy position
function Enemy_Update(attacked_enemy, map)
{
	for(var i = 0; i < ENEMIES.length; i++)
	{
		var e = ENEMIES[i];
		// check attack
		if((character.y == e.y && (e.x == character.x - 1 || e.x == character.x + 1)) 
			|| (character.x == e.x && (e.y == character.y - 1 || e.y == character.y + 1)))
		{
			if( Math.random() <= character.evasion )
			{
				context.fillText(e.name + " tried to attack, but you evaded!", 10, 680);
			}
			else
			{
				context.fillText("Attacked by " + e.name + ",  Losing Hp: " + e.attack_damage, 10, 680);
				// attack player
				character.hp -= e.attack_damage;
				if(character.hp <= 0)
				{
					context.fillText("Attacked by " + e.name + ",  Losing Hp: " + e.attack_damage, 10, 680);
					context.fillText(e.name + " killed you!", 10, 720);
				}
			}
			
			e.draw();
		}
		else{
			var moved = false;
			var hostile = e.hostile;
			var distance = Math.sqrt(Math.pow(character.x - e.x, 2) + Math.pow(character.y - e.y, 2));
			if(distance < hostile)
			{
				console.log("Enemy begins to attack");
				// enter attack area.
				var d_x = Math.abs(character.x - e.x);
				var d_y = Math.abs(character.y - e.y);
				if(e.x + 1 < map.map[0].length && character.y == e.y && character.x - e.x > 0 && map.collision[e.y][e.x + 1] == 0 && Enemy_Exist(e.x+1, e.y) == null) // move horizentally +
				{
					e.x += 1;
					console.log(e.x);
					moved = true;
				}
				if(e.x - 1 >= 0 && moved == false && character.y == e.y && character.x - e.x < 0 && map.collision[e.y][e.x - 1] == 0 && Enemy_Exist(e.x-1, e.y) == null) // move horizentally +
				{
					e.x -= 1;
					console.log(e.x);
					moved = true;
				}
				if (e.y + 1 < map.map.length && moved == false && character.x == e.x && character.y - e.y > 0 && map.collision[e.y + 1][e.x] == 0 && Enemy_Exist(e.x, e.y + 1) == null)
				{
					e.y += 1;
					console.log(e.y);
					moved = true;
				}
				if (e.y - 1 >= 0 && moved == false && character.x == e.x && character.y - e.y < 0 && map.collision[e.y - 1][e.x] == 0 && Enemy_Exist(e.x, e.y - 1) == null)
				{
					e.y -= 1;
					console.log(e.y);
					moved = true;
				}

				if(d_x < d_y) // move horizentally
				{
					console.log("Move Horizontally 2");
					if(e.x + 1 < map.map[0].length && moved == false && character.x - e.x > 0 && map.collision[e.y][e.x + 1] == 0 && Enemy_Exist(e.x + 1, e.y) == null) // move horizentally +
					{
						e.x += 1;
						console.log(e.x);
						moved = true;
					}
					if(e.x - 1 >= 0 && moved == false && character.x - e.x < 0 && map.collision[e.y][e.x - 1] == 0 && Enemy_Exist(e.x - 1, e.y) == null) // move horizentally +
					{
						e.x -= 1;
						console.log(e.x);
						moved = true;
					}
				}
				else // move vertically
				{
					console.log("Move Vertically 2");
					console.log(character.y - e.y)
					console.log(map.collision[e.x][e.y + 1])
					console.log(map.collision[e.x][e.y - 1])
					if (e.y + 1 < map.map.length && moved == false && character.y - e.y > 0 && map.collision[e.y + 1][e.x] == 0 && Enemy_Exist(e.x, e.y + 1) == null)
					{
						e.y += 1;
						console.log("Move Vertically 2 Down");
						console.log(e.y);
						moved = true;
					}
					if (e.y - 1 >= 0 && moved == false && character.y - e.y < 0 && map.collision[e.y - 1][e.x] == 0 && Enemy_Exist(e.x, e.y - 1) == null)
					{
						e.y -= 1;
						console.log("Move Vertically 2 Up");
						console.log(e.y);
					}	
				}
			}
			if(distance > hostile && moved == false )  // didn't find character.
				  // so random move
			{
				var probability = Math.random();
				if(probability < 0.8){
				if(e.y - 1 >=0 && probability < 0.2 && map.collision[e.y - 1][e.x] == 0 && Enemy_Exist(e.x, e.y - 1) == null)
					e.y -= 1;
				else if(e.y + 1 < map.map.length && probability < 0.4 && map.collision[e.y + 1][e.x] == 0 && Enemy_Exist(e.x, e.y + 1) == null)
					e.y += 1;
				else if (e.x - 1 >= 0 && probability < 0.6 && map.collision[e.y][e.x - 1] == 0 && Enemy_Exist(e.x - 1, e.y ) == null)
					e.x -= 1;
				else if (e.x + 1 < map.map[0].length && probability < 0.8 && map.collision[e.y][e.x + 1] == 0 && Enemy_Exist(e.x + 1, e.y) == null)
					e.x += 1;
				}
				else ; // keep unmoved
			}
		}
		e.draw();
		if (e == attacked_enemy)
		{
			var x = character.x - character.fixed_position_x;
			var y = character.y - character.fixed_position_y;
			context.drawImage(attack_effect2, (e.x - x)*64, (e.y - y)*64, 64, 64);
		}
	}
}
/*
	Tree Resources
*/
var Tree = function()
{
	this.image = tree_image;
	this.hp = 200 + Math.random()* 10;
	this.x = 0;
	this.y = 0;
	this.exp = 5;
	this.draw = function()
	{
		context.drawImage(this.image, this.x * 64, this.y * 64, 64, 64);
	}
}

function enterGameWorld()
{
	map.music.play();
	map.draw();
	character.draw();

	for(var i = 0; i < ENEMIES.length; i++)
	{
		ENEMIES[i].draw();
	}

	var fps = 30;
	var t = 1000/fps;
	setInterval(function()
	{
		// check keycode
		if(KEYS[38] && !SHOW_MENU && character.y - 1 >= 0)  // move up
		{
			KEYS[38] = false;
			
			clearScreen(); // clear canvas
			map.draw(); // redraw village
			character.y -= 1;
			// check enemy 
			var enemy = Enemy_Exist(character.x, character.y);
			if(enemy !== null)
			{
				// play soung
				document.getElementById("punch_sound").play();
				// find enemy, attack
				enemy.hp -= character.attack_damage;
				if(enemy.hp <= 0)
				{
					context.fillText("You killed " + enemy.name, 10, 680);
					Enemy_Delete(enemy);
					Character_CheckLevelUp(enemy);
				}
				else
				{
					// restore position
					character.y += 1;
				}
			}
			if(map.collision[character.y][character.x])
				character.y += 1;

			map.draw(); 
			character.draw();
			Enemy_Update(enemy, map);
		}
		if(KEYS[37] && !SHOW_MENU && character.x - 1 >= 0)  // move left
		{
			KEYS[37] = false;
			clearScreen(); // clear canvas
			map.draw(); 
			character.x -= 1;
			
			// check enemy 
			var enemy = Enemy_Exist(character.x, character.y);
			if(enemy !== null)
			{
				// play soung
				document.getElementById("punch_sound").play();
				// find enemy, attack
				enemy.hp -= character.attack_damage;
				if(enemy.hp <= 0)
				{
					context.fillText("You killed " + enemy.name, 10, 680);
					Enemy_Delete(enemy);
					Character_CheckLevelUp(enemy);
				}
				else
				{
					// restore position
					character.x += 1;
				}
			}

			if(map.collision[character.y][character.x])
				character.x += 1;

			map.draw(); 
			character.draw();
			Enemy_Update(enemy, map);
		}
		if(KEYS[39] && !SHOW_MENU && character.x + 1 < map.map[0].length)  // move right
		{
			KEYS[39] = false;
			clearScreen(); // clear canvas
			character.x += 1;

			// check enemy 
			var enemy = Enemy_Exist(character.x, character.y);
			if(enemy !== null)
			{
				// play soung
				document.getElementById("punch_sound").play();
				// find enemy, attack
				enemy.hp -= character.attack_damage;
				if(enemy.hp <= 0)
				{
					context.fillText("You killed " + enemy.name, 10, 680);
					Enemy_Delete(enemy);
					Character_CheckLevelUp(enemy);
				}
				else
				{
					// restore position
					character.x -= 1;
				}
			}

			if(map.collision[character.y][character.x])
				character.x -= 1;

			map.draw(); 
			character.draw();

			Enemy_Update(enemy, map);

		}
		if(KEYS[40] && !SHOW_MENU && character.y + 1 < map.map.length) // move down
		{
			KEYS[40] = false;
			clearScreen(); // clear canvas
			character.y += 1;

			// check enemy 
			var enemy = Enemy_Exist(character.x, character.y);
			if(enemy !== null)
			{
				// play soung
				document.getElementById("punch_sound").play();
				// find enemy, attack
				enemy.hp -= character.attack_damage;
				if(enemy.hp <= 0)
				{
					context.fillText("You killed " + enemy.name, 10, 680);
					Enemy_Delete(enemy);
					Character_CheckLevelUp(enemy);
				}
				else
				{
					// restore position
					character.y -= 1;
				}
			}

			if(map.collision[character.y][character.x])
				character.y -= 1;
			map.draw(); 
			character.draw();

			Enemy_Update(enemy, map);
		}
		if(KEYS[88])
		{
			KEYS[88] = false;
			if(!SHOW_MENU)
			{
				ShowMenu();
				SHOW_MENU = true;
			}
			else
			{
				SHOW_MENU = false;
				clearScreen();
				map.draw();
				character.draw();
				// draw enemies
				for(var i = 0; i < ENEMIES.length; i++)
				{
					ENEMIES[i].draw();
				}
			}
		}
		character.draw();
	}, t);
}














