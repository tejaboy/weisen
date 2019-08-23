# weisen
JavaScript Visual Novel Library

[Documentations](https://drive.google.com/open?id=1Gm0RsLQXzB08mARla8tCY09dmTOqmkkC37LqiO8-8Vo)
[Demo Visual Novel](https://weisen.me/Game.htm?pid=1)

# Getting Started

## Prerequisites

1. Working browser (with JavaScript enabled) - works best in Mozilla Firefox and Google Chrome.

## Installation

1. Download or clone the repo to your machine.

## Usage

### Head
To use WeiSen.js, create a new HTML file and include the following content in your `head` tag.

```html
<!-- WeiSen.css -->
<link rel="stylesheet" href="../src/css/WeiSen.css" />

<!-- jQuery -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

<!-- WeiSen.js -->
<script src="../src/js/WeiSen.js"></script>
		
<!-- Storyline -->
<script src="VisualNovel.js" async></script>
```

Remember to change the path of WeiSen.css and WeiSen.js to where you place the file.

### Body

The following tags are required in the `body` tag for WeiSen to work properly.

```html
<div id="game">
  <div id="choices">
  </div>
 
  <div id="say">
  <p id="say_msg"></p>
</div>
```

### Scripting

Check `example/VisualNovel.js` for the demo script.

## Authors
* [tejaboy](https://github.com/tejaboy)

## License
This project is licensed under the GNU General Public License 3.0 - see the [LICENSE.md](https://github.com/tejaboy/weisen/blob/master/LICENSE) file for more details.
