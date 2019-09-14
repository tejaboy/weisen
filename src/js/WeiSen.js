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
		
		$("#say_name").fadeIn();
		$("#say_msg").fadeIn();
		
		if (!returnPromise) return;
		
		return wait();
	}
	
	this.show = async function(name, sprite, css)
	{
		console.log("Showing: " + name + " (" + sprite + ")");
		
		name = name.replaceAll(" ", "_");
		selector = name + '-sprite';
		isLive2D = sprite.split(".")[sprite.split(".").length - 1] == 'json'
		
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
	
	this.show_live2d = function(name, model, css)
	{
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
	
	this.show_live2d = function(url, position)
	{
		return WeiSen.show_live2d(name, url, position);
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

// MISC
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};