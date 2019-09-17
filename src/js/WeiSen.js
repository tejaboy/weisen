class _WeiSen
{
	constructor()
	{
		/* SELECTOR */
		this.ROOT = "#game";
		
		/* PATH */
		this.ROOT_PATH = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
		this.IMAGE_PATH = "/images/";
		this.SOUND_PATH = "/sounds/";
		
		/* Preloaders */
		this.preloaded = {"images": {}}
		
		/* Save/Load */
		this.saveData = {}
		this.saveFunction = {}
		
		/* Typing Effect */
		this.typeSpeed = 15;
		
		/* Add visual-novel HTML elements */
		$("#game").append('<div id="visual-novel"><div id="choices"></div><div id="say_name"></div><div id="say_msg"></div></div></div>');
	}
	
	/* Set Game Height */
	set_size(height, width)
	{
		this.height = height;
		this.width = width;
		this.heightEnder = height.replace(/[0-9]/g, '');
		this.widthEnder = width.replace(/[0-9]/g, '');
		
		$("#game").css("height", height);
		$("#game").css("width", width);
		$("#visual-novel").css("height", height);
		$("#visual-novel").css("width", width);
		
		$("#say").css("width", parseInt(width) * 0.8 + this.widthEnder);
		$("#say").css("right", parseInt(width) * 0.1 + this.widthEnder);
		$("#say").css("bottom", parseInt(height) * 0.05 + this.heightEnder);
		
		$("#choices").css("width", parseInt(width) * 0.8 + this.widthEnder);
		$("#choices").css("right", parseInt(width) * 0.1 + this.widthEnder);
		$("#choices").css("top", parseInt(height) * 0.15 + this.heightEnder);
	}
	
	/* Preload Images */
	preload_image(tag, url)
	{
		url = this.get_image_path(url);
		
		this.preloaded["images"][tag] = new Image();
		this.preloaded["images"][tag].src = url;
	}
	
	/* Set Background */
	set_background(url, size = "cover")
	{
		url = this.get_image_path(url);
		
		console.log("Change background to: " + url);
		$(game).css("background-image", "url('" + url + "')");
		$(game).css("background-size", size);
	}
	
	/* Message Box*/
	show_msg()
	{
		$("#say_name, #say_msg").fadeIn();
	}
	
	hide_msg()
	{
		$("#say_name, #say_msg").fadeOut();
	}
	
	/* Output Text to Message Box */
	say(name, msg, returnPromise = true)
	{
		console.log(name + " say: " + msg);
		
		$("#say_name").html(name);
		$("#say_msg").html("");
		
		this.show_msg();
		
		WeiSen.stopTypeWriter();
		WeiSen.startTypeWriter(msg);
		
		if (!returnPromise) return;
		
		return wait();
	}
	
	/* TypeWriter Effect */
	startTypeWriter(msg, point = 0)
	{
		if (point < msg.length)
		{
			$("#say_msg").append(msg.charAt(point));
			this.typeTimeout = setTimeout(() => { WeiSen.startTypeWriter(msg, ++point) }, this.typeSpeed);
		}
	}
	
	stopTypeWriter()
	{
		clearTimeout(this.typeTimeout);
	}
	
	/* Show Sprite - async to wait for sprite to be shown */
	async show(name, sprite, css)
	{
		console.log("Showing: " + name + " (" + sprite + ")");
		
		name = name.replaceAll(" ", "_");
		var selector = name + '-sprite';
		var isLive2D = sprite.split(".")[sprite.split(".").length - 1] == 'json'
		
		// Convert CSS JSON String to dictionary
		if (typeof css == "string")
			css = JSON.parse(css);
		
		// Remove exisiting sprite/live2d
		if ($(".sprite_" + name)[0])
			WeiSen.hide(name);
		
		// Remove previous named sprite
		if (!isLive2D)
		{
			// Check if sprite is in preloaded objects
			if (sprite in this.preloaded["images"])
				sprite = this.preloaded["images"][sprite].src;
			else
				sprite = this.get_image_path(sprite)
			
			// Add the sprite to DOM and hide it for animation
			$(game).append("<img id='" + selector + "' class='sprite' style='max-height: 100%; max-width: auto;' src='" + sprite + " '/>");
			$("#" + selector).hide();
		}
		else
		{
			$("#game").append('<canvas id="' + selector + '" width="280" height="400" class="ws-live2d"></canvas>');
			
			if (css["width"] != undefined)
				$("#" + selector).prop("width", css["width"])
			
			if (css["height"] != undefined)
				$("#" + selector).prop("height", css["height"])
			
			loadlive2d(selector, sprite);
		}
		
		// Additional CSS property
		for (var property in css)
		{
			if (css.hasOwnProperty(property))
			{
				$("#" + name + "-sprite").css(property, css[property])
			}
		}
		
		// Wait for fadeIn() to finish
		return new Promise((resolve, reject) =>
		{
			$("#" + selector).fadeIn(400, (e) =>
			{
				resolve("done!");
			});
		});
	}
	
	/* Hide Sprite - TODO: Animate it with fadeOut. */
	hide(name)
	{
		$(".sprite_" + name.replaceAll(" ", "_")).remove();
	}
	
	/* Sound */
	play_sound(url, loop = false)
	{
		var sound = new Audio(this.get_sound_path(url));
		sound.loop = loop;
		
		const promise = sound.play();
		
		if (promise !== undefined)
		{
			promise.then(() => {
			}).catch(error => {
				console.warn("Error: " + error + ".");
			});
		}
	}
	
	/* Prompt for input - any input. */
	prompt(msg, default_value, name = undefined)
	{
		console.log("Prompting " + msg);
		
		if (name != undefined)
		{
			$("#say_name").html(name);
			$("#say_name").show();
		}
		
		WeiSen.stopTypeWriter();
		$("#say_msg").html(msg + "<br /><span id='say_input' contentEditable='true'>" + default_value + "</span>");
		$("#say_msg").fadeIn(400, (e) =>
		{
			$("#say_input").focus().select();
		});
		
		return wait(false, false, true, $("#say_input"));
	}
	
	/* Show a list of options for user to select - value will be returned as String. */
	ask_choose(choices, msg, name)
	{
		$("#choices").html("");
		
		for (var i = 0; i < choices.length; i++)
		{
			$("#choices").append("<p class=\"choice\">" + choices[i] + "</p>");
		}
		
		$("#choices").fadeIn();
		
		if (msg != undefined)
		{
			WeiSen.say(name, msg, false);
		}
		
		// Wait for choice click
		return new Promise((resolve, reject) =>
		{
			$(".choice").one("click", (e) =>
			{
				var choice = $(e.target);
				
				choice.css("background-color", "rgba(0, 0, 0, 0.8)");
				$("#choices").fadeOut();
				
				wait_finish(resolve, choice.text());
			});
		});
	}
	
	/* Enable Menu */
	enable_menu()
	{
		/* Custom Menu */
		// Add custom menu
		$("#game").append('<ul id="custom-menu"></ul>');
		$("#custom-menu").append('<li data-action="save-game">Save Game</li>');
		$("#custom-menu").append('<li data-action="load-game">Load Game</li>');
		
		// Custom menu on right click
		$("#game").contextmenu(function(evt)
		{
			// Avoid the real one
			evt.preventDefault();
			
			// Show contextmenu
			$("#custom-menu").finish().toggle(100).
			
			// In the right position (the mouse)
			css({
				top: evt.pageY + "px",
				left: evt.pageX + "px"
			});
		});
		
		// Close custom menu on mouse down
		$(document).bind("mousedown", function (e)
		{
			// If the clicked element is not the menu
			if (!$(e.target).parents("#custom-menu").length > 0)
			{
				$("#custom-menu").hide(100);
			}
		});
		
		// Custom menu input
		$("#custom-menu li").on("click", function()
		{
			// Actions
			let action = $(this).attr("data-action")
			
			if (action == "save-game")
			{
				WeiSen.show_menu_save();
			}
			else if (action == "load-game")
				WeiSen.show_menu_load();
			
			// Hide it AFTER the action was triggered
			$("#custom-menu").hide(100);
		});
		
		/* Menu Page */
		// Escape Key
		$(document).keyup((e) =>
		{
			// Show Load Game
			if (e.key === "Escape")
			{
				if (!$("#game-overlay").length)
					WeiSen.show_menu();
				else
					WeiSen.hide_menu();
			}
		});
		
		// Render Menu Page
		$("#game").prepend("<div id='game-overlay'></div>");
		$("#game-overlay").hide();
	}
	
	show_menu_save()
	{
		$("#game-overlay").html("<h1>Save Game</h1>");
		$("#game-overlay").append("<div id='overlay-options'><button id='option-new-save'>Create New Save</button></div>");
		
		// Load save files
		var ws = JSON.parse(localStorage.getItem("ws"));
		
		if (ws == null)
			ws = []
		
		// Append HTML - save files
		for (var i = 0; i < ws.length; i++)
		{
			$("#game-overlay").append("<span class='file' data-slot='" + i + "'>Save #" + i + "</span>");
		}
		
		// Set click listener for save files
		$("#game-overlay .file").on("click", (evt) =>
		{
			var slot = $(evt.target).data("slot");
			
			WeiSen.save_game(slot);
		});
		
		// Set click listener for new save
		$("#overlay-options #option-new-save").on("click", (evt) =>
		{
			WeiSen.save_game();
			
			WeiSen.show_menu_save();
		});
		
		WeiSen.show_menu_animate();
	}
	
	show_menu_load()
	{
		$("#game-overlay").html("<h1>Load Game</h1>");
		
		// Load save files
		var ws = JSON.parse(localStorage.getItem("ws"));
		
		if (ws == null)
			ws = []
		
		// Append HTML - save files
		for (var i = 0; i < ws.length; i++)
		{
			$("#game-overlay").append("<span class='file' data-slot='" + i + "'>Save #" + i + "</span>");
		}
		
		// Set click listener for save files
		$("#game-overlay .file").on("click", (evt) =>
		{
			var slot = $(evt.target).data("slot");
			
			WeiSen.load_game(slot);
		});
		
		WeiSen.show_menu_animate();
	}
	
	show_menu_animate()
	{
		// CSS and Animation
		$("#game-overlay").hide().fadeIn();
	}
	
	hide_menu()
	{
		$("#game-overlay").fadeOut();
	}
	
	/* Save Game */
	save_game(slot = undefined)
	{
		// localStorage.setItem("ws", JSON.stringify([]));
		var ws = WeiSen.get_save_files();
		
		var saveObject = {
			"saveData": this.saveData,
			"saveFunction": this.saveFunction
		}
		
		if (slot == undefined)
			ws.push(saveObject);
		else
			ws[slot] = saveObject;
		
		localStorage.setItem("ws", JSON.stringify(ws));
	}
	
	/* Load Game */
	load_game(slot)
	{
		var ws = WeiSen.get_save_files();
		var data = ws[slot];
		
		this.saveData = data.saveData;
		this.saveFunction = data.saveFunction;
		
		try
		{
			eval(this.saveFunction + "()");
			
			$("#choices").html("");
		} 
		catch
		{
			console.warn("No save function detected (or function does not exist)! Skipped!")
		}
		
		WeiSen.hide_menu();
	}
	
	// HELPERS
	get_image_path(url)
	{
		// If it is not local resource, return.
		if (url.substr(0, 4) == "http")
			return url
		
		return this.ROOT_PATH + this.IMAGE_PATH + url;
	}
	
	get_sound_path(url)
	{
		// If it is not local resource, return.
		if (url.substr(0, 4) == "http")
			return url
		
		return this.ROOT_PATH + this.SOUND_PATH + url;
	}
	
	get_save_files()
	{
		var ws = localStorage.getItem("ws")
		
		if (ws == null)
			ws = [];
		else
			ws = JSON.parse(ws);
		
		return ws;
	}
}

/* Create Singleton */
var WeiSen = new _WeiSen();

/* Character Class */
class Character
{
	constructor(name)
	{
		this.name = name;
	}
	
	say(msg)
	{
		return WeiSen.say(this.name, msg);
	}
	
	show(url, position)
	{
		return WeiSen.show(this.name, url, position);
	}
	
	hide()
	{
		return WeiSen.hide(this.name);
	}
	
	prompt(msg, default_value)
	{
		return WeiSen.prompt(msg, default_value, this.name);
	}
	
	ask_choose(choices, msg)
	{
		return WeiSen.ask_choose(choices, msg, this.name);
	}
}

/* Wait Promise Helper Function - wait for click, space and/or enter with optional return_statement. */
/* return_statement = _WeiSen.ask_choose and _WeiSen.prompt input value. */
function wait(click = true, space = true, enter = true, return_statement = null)
{
	return new Promise((resolve, reject) =>
	{
		if (click)
		{
			$("#visual-novel").one("click", (e) =>
			{
				wait_finish(resolve, return_statement);
			});
		}
		
		$(document).on("keypress", (e) =>
		{
			if (enter && e.which == 13 || space && e.which == 32)
			{
				e.preventDefault();
				wait_finish(resolve, return_statement);
			}
		});
	});
}

function wait_finish(resolve, return_statement)
{
	$("#say").off("click");
	$(document).off("keypress");
	$(".choice").off("click");
	
	if (return_statement instanceof jQuery)
		return_statement = $(return_statement).text();
	
	resolve(return_statement);
}

// MISC
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};