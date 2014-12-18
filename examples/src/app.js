//var Tween = require("kettle-tween");
var Tween = require("../../kettle-tween.js");

var Easing = require('kettle-ease') ;
var _ = require("underscore");

//var animMeter = require("./animationCounter.js").animMeter;
//var fpsDisplay = animMeter('fps-counter');

var line = Tween.Line;
var tweens = [];

window.onclick = function(){
  for(var tween in tweens){
    var _tween = tweens[tween];
    if (!_tween.isAnimating) _tween.play();
  }
}

easeFunc = "Expo";

var _easing = [
  //easeInElastic:Easing.easeInElastic,
  Easing["easeIn" + easeFunc],
  Easing["easeInOut" + easeFunc],
  Easing["easeOut" + easeFunc],
];

function update(c){
  var r = g = Math.round(c[0]);
  var b = 255 - r;
  this.mat = this.mat.translate(c[0], c[1], 1);
  this.mat = this.mat.rotate(c[2]);

  this.node.style.transform = this.mat.toString();
  this.mat = new WebKitCSSMatrix();
}

//var prevTime = Date.now();

function createTween(obj, ease, y, delay){
  var t = new Tween();
  var options = {
    node: obj,
    duration: 1500,
    curve: new line([50, y, 0],[600, y, 720]),
    onAnimate: update,
    easing: ease,
    mat:new WebKitCSSMatrix(),
    delay:delay || 0,
    onBegin:function(){
      this.prevTime = Date.now();
    },
    onEnd:function(){
      var diff = this.duration - (Date.now() - this.prevTime);
      this.reverse();

      var startValues = [600, y, 0];
      var finishValues = [600, y + 600, 0];

      //this.play();
      //setTimeout( function(){this.play()}.bind(this), this.delay);
      this.prevTime = Date.now();
    }
  };

  t.play(options);
  tweens.push(t);
}

var count = 0;

function createBox(){
  var _obj = document.createElement("div");

  _obj.style.background = "red";
  _obj.style.position = "absolute";
  _obj.style['-webkit-transform'] = "translate3d( 50px, " + y + "px, 0px)";
  _obj.style.width = "20px";
  _obj.style.height = "20px";

  document.body.appendChild(_obj);
  return _obj;
}

var numBoxes = 27;

while(numBoxes > 0){
  var _ease = _easing[count % 3];
  var y = (count * 22);
  //var _delay = count
  createTween( createBox(), _ease, y );

  count++;
  numBoxes--;
}

