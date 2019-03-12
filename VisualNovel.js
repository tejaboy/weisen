WeiSen = new _WeiSen();
startGame();

async function startGame()
{
    preload();
    
    WeiSen.set_size("100vh", "100vw");
    WeiSen.set_background("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/c4cc1f8f-76a7-441a-a360-a97d61e3b6fa/dcwx5j1-bc326564-fe01-4e03-bb5c-77cc8e065492.png/v1/fill/w_1192,h_670,q_70,strp/park3_by_hsaiob87_dcwx5j1-pre.jpg");
    
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
    WeiSen.preload_image('JingSenConfident', 'https://weisen.me/src/images/Male/Confident.png');
}