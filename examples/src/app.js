var Tween = require("../../beTween.js").Tween;
var easing = require('kettle-ease');
var _ = require("underscore");

t = new Tween();

var target = {x:0};
var line = Tween.Line;

obj = document.getElementById("circle");

function update(c){
  console.log(c);
  this.node.style["-webkit-transform"] = "translate3d(" + c[0] + "px, " + c[1] + "px, 0px) rotate("+c[2]+"deg)";

}

var prevTime = Date.now();

var options = {
  node: obj,
  duration: 1500,
  curve: new line([0, 0, 0],[600,300, 360]),
  onAnimate: update,
  easing: easing.easeInCirc,
  onEnd:function(){
    var diff = this.duration - (Date.now() - prevTime);
    console.log("Duration difference = " + Math.abs(diff));
    console.log("Complete");
    this.easing = (this.isReversed) ?  easing.easeInCirc : easing.easeOutCirc;
    this.reverse();
    this.play();
  }
};

t.play(options);
