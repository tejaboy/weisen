// Note: In order to utilize Live2D in your game, it has to be hosted on a server. For testing, 'Web Server for Chrome' would be alright.

startGame();

async function startGame()
{
	WeiSen.set_size("100vh", "100vw");
	WeiSen.set_background("background.png");
	
	Emily = new Character("Emily");
	
	Emily.show("live2d/model/epsilon/Epsilon_free.model.json", {"right": 0, "bottom": 0, "width": 420, "height": 600});
	await Emily.say("A very warm welcome developer!");
	
	WeiSen.play_sound("how_are_you.wav");
	var reply = await Emily.ask_choose(["Great to see you!", "Sad"], "How are you?");
	
	if (reply == "Great to see you!")
	{
		WeiSen.play_sound("laughter.wav");
		
		var reply = await Emily.ask_choose(["Kinetic", "Otome", "Bishoujo", "Educational", "Drama", "Comedy"], "What's kind of visual novel do you plan to develop?")
		
		WeiSen.play_sound("kinda.wav");
		await Emily.say("Oh ... !")
		await Emily.say("is this the kinda thing you're into?");
	}
	else
	{
		WeiSen.play_sound("why.wav");
		
		await Emily.say("Why?!?!");
		await Emily.say("It's alright. We can talk about it next time.");
	}
	
}