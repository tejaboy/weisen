function _WeiSen()
{
	this.ROOT_PATH = window.location.href.substring(0, window.location.href.lastIndexOf("/"));
	this.IMAGE_PATH = "/images/";
	
	this.preloaded = {"images": {}}
	
	this.set_size = function(height, width)
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
	this.preload_image = function(tag, url)
	{
		url = this.get_image_path(url);
		
		this.preloaded["images"][tag] = new Image();
		this.preloaded["images"][tag].src = url;
	}
	
	this.set_background = function(url, size = "cover")
	{
		url = this.get_image_path(url);
		
		console.log("Change background to: " + url);
		$(game).css("background-image", "url('" + url + "')");
		$(game).css("background-size", size);
	}
	
	this.say = function(name, msg, returnPromise = true)
	{
		console.log(name + " say: " + msg);
		
		$("#say_name").html(name);
		new Typed("#say_msg", { strings: ["", msg], typeSpeed: 12 });
		$("#say_msg").fadeIn();
		
		if (!returnPromise) return;
		
		return wait();
	}
	
	this.show = async function(name, sprite, css)
	{
		console.log("Showing: " + name + " (" + sprite + ")");
		
		name = name.replaceAll(" ", "_");
		
		// Remove previous named sprite
		if ($(".sprite_" + name)[0])
			WeiSen.hide(name);
		
		// Check if sprite is in preloaded objects
		if (sprite in this.preloaded["images"])
			sprite = this.preloaded["images"][sprite].src;
		else
			sprite = this.get_image_path(sprite)
		
		// Add the sprite to DOM and hide it for animation
		$(game).append("<img class='sprite sprite_" + name + "' style='max-height: 100%; max-width: auto;' src='" + sprite + " '/>");
		$(".sprite_" + name).hide();
		
		// Additional CSS property
		if (typeof css == "string")
			css = JSON.parse(css);
		
		for (var property in css)
		{
			if (css.hasOwnProperty(property))
			{
				$(".sprite_" + name).css(property, css[property])
			}
		}
		
		// Wait for fadeIn() to finish
		return new Promise(function(resolve, reject)
		{
			$(".sprite_" + name).fadeIn(400, function(e)
			{
				resolve("done!");
			});
		});
	}
	
	this.hide = function(name)
	{
		$(".sprite_" + name.replaceAll(" ", "_")).remove();
	}
	
	this.prompt = function(msg, default_value)
	{
		console.log("Prompting " + msg);
		$("#say_msg").html(msg + "<span id='say_input' contentEditable='true'>" + default_value + "</span>");
		$("#say_msg").fadeIn(400, function(e)
		{
			$("#say_input").focus().select();
		});
		
		return wait(false, false, true, $("#say_input"));
	}
	
	this.ask_choose = function(choices, msg, name)
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
				choice = $(e.target);
				
				choice.css("background-color", "rgba(0, 0, 0, 0.8)");
				$("#choices").fadeOut();
				
				wait_finish(resolve, choice.text());
			});
		});
	}
	
	// HELPERS
	this.get_image_path = function(url)
	{
		// If it is not local resource, return.
		if (url.substr(0, 4) == "http")
			return url
		
		url = this.ROOT_PATH + this.IMAGE_PATH + url;
		
		return url;
	}
}

function Character(name)
{
	this.name = name;
	
	this.say = function(msg)
	{
		return WeiSen.say(name, msg);
	}
	
	this.show = function(url, position)
	{
		return WeiSen.show(name, url, position);
	}
	
	this.hide = function()
	{
		return WeiSen.hide(name);
	}
	
	this.ask_choose = function(choices, msg)
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
				wait_finish(resolve, return_statement);
		});
	});
}

function wait_finish(resolve, return_statement)
{
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

// MISC
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};