var canvas = document.getElementById("Game_Canvas");
var context = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 640;
canvas.style.width = canvas.width;
canvas.style.height = canvas.height;
function clearScreen()
{
	context.clearRect(0, 0, canvas.width, canvas.height);
}
function Prelude() 
{
	console.log("ENTER HERE");
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
var KEYS = [];
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
	this.image = new Image();
	this.image.src = "./Character.png";
	this.x = 5;
	this.y = 5;
	this.draw = function()
	{
		context.drawImage(this.image, this.x * 64, this.y * 64, 64, 64);
	}
}
/*
	create village
*/
var Village = function()
{
	var map = 
	[[0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,1,1,1,1,1,1,1,1,0],
	 [0,1,0,0,0,0,0,0,1,0],
	 [0,1,0,0,0,0,0,0,1,0],
	 [0,1,0,0,0,0,0,0,1,0],
	 [0,1,0,0,0,0,0,0,1,0],
	 [0,1,1,1,0,0,1,1,1,0],
	 [0,0,0,0,0,0,0,0,0,0],
	 [0,0,0,0,0,0,0,0,0,0]
	]

	this.draw = function()
	{
		for(var i = 0; i < map.length; i++)
		{
			for(var j = 0; j < map[0].length; j++)
			{
				var v = map[i][j];
				if(v == 0)
					//context.drawImage(ground_image, j*64, i*64, 64, 64);
					context.drawImage(grass_image, j*64, i*64, 64, 64);
				if(v == 1)
				{
					context.drawImage(grass_image, j*64, i*64, 64, 64);
					context.drawImage(tree_image, j*64, i*64, 64, 64);
				}
			}
		}
	}
} 

var village = new Village();
var character = new Character();
var wall_image = new Image(); wall_image.src = "./Wall.png";
var ground_image = new Image(); ground_image.src = "./Ground.png";
var grass_image = new Image(); grass_image.src = "./Grass.png";
var tree_image = new Image(); tree_image.src = "./Tree.png";
function enterGameWorld()
{
	village.draw();
	character.draw();
	var fps = 30;
	var t = 1000/fps;
	setInterval(function()
	{
		console.log("ETNER HERE");
		// check keycode
		if(KEYS[38])  // move up
		{
			clearScreen(); // clear canvas
			village.draw(); // redraw village
			character.y -= 1;
			character.draw();

			KEYS[38] = false;
		}
		if(KEYS[37])  // move left
		{
			clearScreen(); // clear canvas
			village.draw(); 
			character.x -= 1;
			character.draw();

			KEYS[37] = false;
		}
		if(KEYS[39])  // move right
		{
			clearScreen(); // clear canvas
			village.draw(); 
			character.x += 1;
			character.draw();

			KEYS[39] = false;
		}
		if(KEYS[40]) // move down
		{
			clearScreen(); // clear canvas
			village.draw(); 
			character.y += 1;
			character.draw();

			KEYS[40] = false;
		}
	}, t);
}














