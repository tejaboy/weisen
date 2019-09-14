
# Live2D Example

## Requirements

1. Web Server ([Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb/related?hl=en) are recommended for testing).

## Running Example
1. Start up Web Server
2. Open up Example.htm

Success Condition: Live2D Model appear at bottom right corner.

## Example Model License
The example model are provided by [Live2D](https://www.live2d.com/en/download/sample-data/) and follows the company's [Software License Agreement free materials](https://www.live2d.jp/terms/live2d-free-material-license-agreement/) license.

## Using Live2D in WeiSen.js 
### Requirements
* model.json file

### Importing own Live2D Model
To install, simply create a folder in live2d/model/ with the respective model name.  
And then drag all the required files (json, texture etc) into the new directory.

### Displaying Live2D Model
```javascript
Emily = new Character("Emily");
Emily.show("live2d/model/epsilon/Epsilon_free.model.json", {"right": 0, "bottom": 0, "width": 420, "height": 600});
```
**Note:** The `width` and `height` property is very crucial. User are advised to adjust the value to fit the respective model.