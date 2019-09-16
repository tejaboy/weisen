startGame();

async function startGame()
{
	/* Call preload() to preload images */
	preload();
	
	/* Set Game Size and Background */
	WeiSen.set_size("100vh", "100vw");
	WeiSen.set_background("background.png");
	
	/* Create a new Character */
	JingSen = new Character("Jing Sen");
	
	/* Show Character Sprite (preloaded) at bottom right corner of screen */
	JingSen.show("JSConfident", {"right": 0, "bottom": 0});
	
	/* Let Character Speak, and then, ask user to choose from a list of options - 'Yes' or 'No' */
	await JingSen.say("A very warm welcome developer!");
	var reply = await JingSen.ask_choose(["Yes", "No"], "Before we get started with the demo project, may I ask you a few question?");
	
	/* Check what user had replied via IF statement */ 
	if (reply == "Yes")
	{
		/* Create MC Character right after MC input value into the prompt. */
		var MC = new Character(await JingSen.prompt("Awesome! What is your name?", "Satoshi"));
		
		/* Show user input text in .say(). And then also user for their favorite visual novel genre. */
		await JingSen.say(MC.name + "? What a wonderful name!")
		var reply = await JingSen.ask_choose(["Kinetic", "Otome", "Bishoujo", "Educational", "Drama", "Comedy"], "And ... what's kind of visual novel do you plan to develop?")
		
		/* Show user selected option and closre. */
		await JingSen.say("Wow! You're planning to develop " + reply + " type of visual novel?")
		await JingSen.say("Great to hear that! Thank you for considering WeiSen engine! Enjoy your development!")
	}
	else
	{
		await JingSen.say("Ugh");
		await JingSen.say("Ugh ...");
		await JingSen.say("Ugh ... Okay");
		await JingSen.say("Ugh ... Okay ...");
		await JingSen.say("Goodbye!");
	}
	
	/* Hide MSG Box */
	WeiSen.hide_msg();
}

function preload()
{
	/* Assign 'JSConfident' the image 'Confident.png'. */
	WeiSen.preload_image('JSConfident', 'Confident.png');
}