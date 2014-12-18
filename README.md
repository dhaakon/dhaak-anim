kettle-tween
=============

A simple tween class independant from third party libraries.

### Getting Started

## Installation

```
npm install kettle-tween
git clone https://github.com/davidpoyner/kettle-tween
```

## Examples
```
npm install
grunt examples
```

Check out the source code in `/examples/src/app.js`


## Usage
Kettle Tween is based off of dojo's tweening syntax. The user provides
an easing function, a target node, and a callback and the tween engine
does the rest. For example, to tween a circle 200 pixels to the right we
would do the following:

```
var circle = document.getElementById('circle');

// create the tween object
var tween = new Tween();

var start = 0;
var end = 200;

// create the options object
var options = {
	duration: 1000, // 1 second
	node: circle, // the object to act on
	curve: [start, end], // the curve object
	onAnimate: function(c){
		this.node.style.left = c + "px";
	}
};

// play the tween with the specified options
tween.play(options)

```

### Curve/Line objects
Kettle Tween relies on either a curve or line object in order to advance the animation. The curve object is an array containing start and finish values, like so:

`curve = [ 0, 100 ]`

This onAnimate function will pass through a variable indicating the change value at the correct tween time.

What if we wanted to pass in multiple values? That would be nice.

We can with a Line object. A line object is an array containing an array of start and end values. The onAnimate function will then pass over an array with the curve values at the specific time.

Let's say we wanted to move the object 200 pixels left and rotate 30 degrees. We would first create the Line object:

```
var startValues = [ 0, 0 ];
var endValues = [ 200, 30];
var line = new Tween.Line( startValues, endValues)
```

Then the onAnimate function will pass over an array with the position (0 index) and the rotation (1 index) values:

```
var onAnimate = function(c){
	var positionValue = c[0];
	var rotationValue = c[1];
	
	this.node.style.left = positionValue + "px";
	this.node.style.transform = "rotate(" + rotationValue + "px, 0px, 0px)"
}
```

This method allows for an unlimited amount of property adjustments per tween.


