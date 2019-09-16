/* Notes: The game will only save when user click on "Save Game" in menu (right-click). */

startGame();

async function startGame()
{
	preload();
	
	/* Enable Menu */
	WeiSen.enable_menu();
	
	/* Set Game Size and Background */
	WeiSen.set_size("100vh", "100vw");
	WeiSen.set_background("background.png");
	
	/* Create a Character and assign it to WeiSen.saveData.JingSen (new property in saveData object). To shorten the code, reference saveData.JingSen as JingSen. */
	JingSen = WeiSen.saveData.JingSen = new Character("Jing Sen");
	
	/* Create a new money property for Character and set it to 200. */
	JingSen.money = 200;
	
	/* Show Sprite and then ask character to choose from a list of item. */
	JingSen.show("JSConfident", {"right": 0, "bottom": 0});
	await JingSen.say("Hey there! Welcome to WeiSen SaveGame Demo!");
	var reply = await JingSen.ask_choose(["Character Art ($50)", "Concept Art ($100)", "Background Music ($150)"], "What would you like to purchase?\nYou have $" + JingSen.money + ".");
	
	/* For each option, deduct the money accordingly. */
	if (reply == "Character Art ($50)")
		JingSen.money -= 50;
	else if (reply == "Concept Art ($100)")
		JingSen.money -= 100;
	else
		JingSen.money -= 150;
	
	afterPurchase();
}

async function afterPurchase()
{
	/* Set current save checkpoint to "afterPurchase" function. */
	/* If the game is saved and then loaded, user will jump into the function (WeiSen.saveFunction). */
	WeiSen.saveFunction = "afterPurchase";
	
	JingSen.say("Thank you for your purchase! The money has been deducted from your balance. Have a nice day!");
}

function preload()
{
	WeiSen.preload_image('JSConfident', 'Confident.png');
}