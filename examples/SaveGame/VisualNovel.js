startGame();

async function startGame()
{
	preload();
	
	WeiSen.set_size("100vh", "100vw");
	WeiSen.set_background("background.png");
	
	JingSen = WeiSen.saveData.JingSen = new Character("Jing Sen");
	JingSen.money = 200;
	
	JingSen.show("JSConfident", {"right": 0, "bottom": 0});
	await JingSen.say("Hey there! Welcome to WeiSen SaveGame Demo!");
	var reply = await JingSen.ask_choose(["Character Art ($50)", "Concept Art ($100)", "Background Music ($150)"], "What would you like to purchase?\nYou have $" + JingSen.money + ".");
	
	if (reply == "Character Art ($50)")
		JingSen.money -= 50;
	else if (reply == "Concept Art ($100)")
		JingSen.money -= 100;
	else
		JingSen.money -= 150;
	
	WeiSen.save_game();
	
	afterPurchase();
}

async function afterPurchase()
{
	WeiSen.saveFunction = "afterPurchase";
	
	JingSen.say("Thank you for your purchase! The money has been deducted from your balance. Have a nice day!");
	
	WeiSen.save_game();
}

function preload()
{
	WeiSen.preload_image('JSConfident', 'Confident.png');
}