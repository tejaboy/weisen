// Note: In order to utilize Live2D in your game, it has to be hosted on a server. For testing, 'Web Server for Chrome' would be alright.

startGame();

async function startGame()
{
	WeiSen.set_size("100vh", "100vw");
	WeiSen.set_background("background.png");
	
	Emily = new Character("Emily");
	
	Emily.show("live2d/model/epsilon/Epsilon_free.model.json", {"right": 0, "bottom": 0, "width": 420, "height": 600});
	await Emily.say("A very warm welcome developer!");
	var reply = await Emily.ask_choose(["Yes", "No"], "Before we get started with the demo project, may I ask you a few question?");
	
	if (reply == "Yes")
	{
		var reply = await Emily.ask_choose(["Kinetic", "Otome", "Bishoujo", "Educational", "Drama", "Comedy"], "What's kind of visual novel do you plan to develop?")
		
		await Emily.say("Wow! You're planning to develop " + reply + " type of visual novel?")
		await Emily.say("Great to hear that! Thank you for considering WeiSen engine! Enjoy your development!")
	}
	else
	{
		await Emily.say("Ugh");
		await Emily.say("Ugh ...");
		await Emily.say("Ugh ... Okay");
		await Emily.say("Ugh ... Okay ...");
		await Emily.say("Goodbye!");
	}
	
}