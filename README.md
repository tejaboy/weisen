# weisen
JavaScript Visual Novel Library

## Features

* Dialogue System
* Character System
* Responsive Website
* Live2D Animation
* Save/Load Game

## Good Read
[Getting Started](https://github.com/tejaboy/weisen/wiki/Getting-Started)  
[Workflow](https://github.com/tejaboy/weisen/wiki/Workflow)

## Sample Code

Below is a standard boilarplate to get started with WeiSen. For more information, look at the links above.
```javascript
startGame();

async function startGame()
{
	/* Call preload() to preload images */
	preload();
	
	/* Set Game Size and Background */
	WeiSen.set_size("100vh", "100vw");
	WeiSen.set_background("background.png");
	
        /* Create and show Character */
	JingSen = new Character("Jing Sen");
	JingSen.show("JSConfident", {"right": 0, "bottom": 0});
	
	/* Let Character Speak, and then, ask user to choose from a list of options - 'Yes' or 'No' */
	await JingSen.say("A very warm welcome developer!");
	await JingSen.say("For more sample script with advanced feature - branching, saving etc - take a look at 'examples' directory.");
	
	/* Hide MSG Box */
	WeiSen.hide_msg();
}

function preload()
{
	WeiSen.preload_image('JSConfident', 'Confident.png');
}
```

## Authors
* [tejaboy](https://github.com/tejaboy)

## License
This project is licensed under the GNU General Public License 3.0 - see the [LICENSE.md](https://github.com/tejaboy/weisen/blob/master/LICENSE) file for more details.
