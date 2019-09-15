class _WeiSen
{
	constructor()
	{
		this.ROOT_PATH = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
		this.IMAGE_PATH = "/images/";
		this.saveData = {}
		this.saveFunction = {}
		
		this.preloaded = {"images": {}}
	}
	
	set_size(height, width)
	{
		this.height = height;
		this.width = width;
		this.heightEnder = height.replace(/[0-9]/g, '');
		this.widthEnder = width.replace(/[0-9]/g, '');
		
		$(game).css("height", height);
		$(game).css("width", width);
		
		$("#say").css("width", parseInt(width) * 0.8 + this.widthEnder);
		$("#say").css("right", parseInt(width) * 0.1 + this.widthEnder);
		$("#say").css("bottom", parseInt(height) * 0.05 + this.heightEnder);
		
		$("#choices").css("width", parseInt(width) * 0.8 + this.widthEnder);
		$("#choices").css("right", parseInt(width) * 0.1 + this.widthEnder);
		$("#choices").css("top", parseInt(height) * 0.15 + this.heightEnder);
	}
	
	/* Preloading Images */
	preload_image(tag, url)
	{
		url = this.get_image_path(url);
		
		this.preloaded["images"][tag] = new Image();
		this.preloaded["images"][tag].src = url;
	}
	
	set_background(url, size = "cover")
	{
		url = this.get_image_path(url);
		
		console.log("Change background to: " + url);
		$(game).css("background-image", "url('" + url + "')");
		$(game).css("background-size", size);
	}
	
	say(name, msg, returnPromise = true)
	{
		console.log(name + " say: " + msg);
		
		$("#say_name").html(name);
		new Typed("#say_msg", { strings: ["", msg], typeSpeed: 12 });
		
		$("#say_name").fadeIn();
		$("#say_msg").fadeIn();
		
		if (!returnPromise) return;
		
		return wait();
	}
	
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
			name = name.replaceAll(" ", "_");
			
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
		return new Promise(function(resolve, reject)
		{
			$("#" + selector).fadeIn(400, function(e)
			{
				resolve("done!");
			});
		});
	}
	
	hide(name)
	{
		$(".sprite_" + name.replaceAll(" ", "_")).remove();
	}
	
	prompt(msg, default_value)
	{
		console.log("Prompting " + msg);
		$("#say_msg").html(msg + "<span id='say_input' contentEditable='true'>" + default_value + "</span>");
		$("#say_msg").fadeIn(400, function(e)
		{
			$("#say_input").focus().select();
		});
		
		return wait(false, false, true, $("#say_input"));
	}
	
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
		return new Promise(function(resolve, reject)
		{
			$(".choice").one("click", function(e)
			{
				var choice = $(e.target);
				
				choice.css("background-color", "rgba(0, 0, 0, 0.8)");
				$("#choices").fadeOut();
				
				wait_finish(resolve, choice.text());
			});
		});
	}
	
	/* Save Game */
	save_game()
	{
		//localStorage.setItem("ws", JSON.stringify([]));
		// Load ws
		var ws = localStorage.getItem("ws")
		
		if (ws == null)
			ws = [];
		else
			ws = JSON.parse(ws);
		
		var saveObject = {
				"saveData": this.saveData,
				"saveFunction": this.saveFunction
			}
		
		if (WeiSen.saveSlot == null)
		{
			ws.push(saveObject);
			
			WeiSen.saveSlot = ws.length;
		}
		else
			ws[slot] = saveObject;
		
		localStorage.setItem("ws", JSON.stringify(ws));
		
		console.log(localStorage.getItem(ws));
	}
	
	load_game(data)
	{
		this.saveData = data.saveData;
		this.saveFunction = data.saveFunction;
		
		try { eval(this.saveFunction + "()"); } catch {}
		
		$("#game-overlay").fadeOut(400, () =>
		{
			$("#game-overlay").remove();
		});
	}
	
	// HELPERS
	get_image_path(url)
	{
		// If it is not local resource, return.
		if (url.substr(0, 4) == "http")
			return url
		
		url = this.ROOT_PATH + this.IMAGE_PATH + url;
		
		return url;
	}
}

var WeiSen = new _WeiSen();

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
	
	ask_choose(choices, msg)
	{
		return WeiSen.ask_choose(choices, msg, this.name);
	}
}

function wait(click = true, space = true, enter = true, return_statement = null)
{
	return new Promise(function(resolve, reject)
	{
		if (click)
		{
			$("#game").one("click", function(e)
			{
				wait_finish(resolve, return_statement);
			});
		}
		
		$(document).on("keypress", function(e)
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
	$("#say_name").fadeOut(400);
	
	return $("#say_msg").fadeOut(400, function()
	{
		$("#say").off("click");
		$(document).off("keypress");
		$(".choice").off("click");
		
		if (return_statement instanceof jQuery)
			return_statement = $(return_statement).text();
		
		resolve(return_statement);
	});
}

// Key Handlers
$(document).keyup(function(e)
{
	// Show Load Game
	if (e.key === "Escape") {
		showEscapeMenu();
    }
});

function showEscapeMenu()
{
	if (!$("#game-overlay").length)
	{
		// Create HTML Element
		$("#game").prepend("<div id='game-overlay'><h1>Save Files</h1></div>");
		
		// Load save files
		var ws = JSON.parse(localStorage.getItem("ws"));
		
		if (ws == null)
			ws = []
		
		// Append save files
		for (var i = 0; i < ws.length; i++)
		{
			$("#game-overlay").append("<span class='save-btn' data-slot='" + i + "'>Save #" + i + "</span>");
		}
		
		// Set click listener
		$("#game-overlay .save-btn").on("click", (evt) =>
		{
			WeiSen.saveSlot = $(evt.target).data("slot");
			
			WeiSen.load_game(ws[WeiSen.saveSlot]);
		});
		
		// CSS and Animation
		$("#game-overlay").hide();
		$("#game-overlay").css({
			"width": $("#game").css("width"),
			"height": $("#game").css("height")
		});
		$("#game-overlay").fadeIn();
	}
	else
	{
		$("#game-overlay").fadeOut(400, () =>
		{
			$("#game-overlay").remove();
		});
	}
}

// MISC
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};