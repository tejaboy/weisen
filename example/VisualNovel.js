WeiSen = new _WeiSen();
startGame();

async function startGame()
{
    preload();
    
    WeiSen.set_size("100vh", "100vw");
    WeiSen.set_background("background.jpg");
    
    JingSen = new Character("Jing Sen");
    
    JingSen.show("JingSenConfident", {"right": 0, "bottom": 0});
    await JingSen.say("Hey there!");
    var reply = await JingSen.ask_choose(["None of your business", "The best guy ever", "The most handsome guy"], "Who are you?");
   	await JingSen.say(reply + "?!?!");
    await JingSen.say("Stop fooling around! Tell me your name!");
    var MC = new Character(await WeiSen.prompt("Enter your name: ", "Bernard"));
}

function preload()
{
    WeiSen.preload_image('JingSenConfident', 'Confident.png');
}