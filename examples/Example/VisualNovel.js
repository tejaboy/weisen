startGame();

async function startGame()
{
	preload();
	
	WeiSen.set_size("100vh", "100vw");
	WeiSen.set_background("background.png");
	
	JingSen = new Character("Jing Sen");
	
	JingSen.show("JSConfident", {"right": 0, "bottom": 0});
	await JingSen.say("A very warm welcome developer!");
	var reply = await JingSen.ask_choose(["Yes", "No"], "Before we get started with the demo project, may I ask you a few question?");
	
	if (reply == "Yes")
	{
		var MC = new Character(await JingSen.prompt("Awesome! What is your name?", "Satoshi"));
		
		await JingSen.say(MC.name + "? What a wonderful name!")
		var reply = await JingSen.ask_choose(["Kinetic", "Otome", "Bishoujo", "Educational", "Drama", "Comedy"], "And ... what's kind of visual novel do you plan to develop?")
		
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
	
	WeiSen.hide_msg();
}

function preload()
{
	WeiSen.preload_image('JSConfident', 'Confident.png');
}