var Tween = require("../../beTween.js");
var Easing = require('kettle-ease');
var _ = require("underscore");
var line = Tween.Line;

var _easing = {
  //easeInElastic:Easing.easeInElastic,
  easeInCirc:Easing.easeInCirc,
  easeInOutCirc:Easing.easeInOutCirc,
  easeOutCirc:Easing.easeOutCirc,
};

function update(c){
  var r = g = Math.round(c[0]);
  var b = 255 - r;
  //document.body.style.background = "rgba(" + [r, g, b, 1].join(',') + ")";
  this.node.style["-webkit-transform"] = "translate3d(" + c[0] + "px, " + c[1] + "px, 0px) rotate("+c[2]+"deg)";
}

var prevTime = Date.now();

function createTween(obj, ease, y){
  var t = new Tween();
  var options = {
    node: obj,
    duration: 1200,
    curve: new line([0, y, 0],[600, y, 360]),
    onAnimate: update,
    easing: ease,
    onBegin:function(){ 
      this.prevTime = Date.now();
    },
    onEnd:function(){
      //var diff = this.duration - (Date.now() - this.prevTime);
      this.reverse();
      var startValues = [600, y, 0];
      var finishValues = [600, y + 600, 0];
      //this.setCurve(new line( startValues, finishValues ));
      this.play();
      //console.log(this.curve);
      //this.onEnd = null;
    }
  };

  t.play(options);
}

var count = 0;

function createBox(){
  var _obj = document.createElement("div");

  _obj.style.background = "red";
  _obj.style.position = "absolute";
  _obj.style['-webkit-transform'] = "translate3d( 0px, " + y + "px, 0px)";
  _obj.style.width = "20px";
  _obj.style.height = "20px";

  document.body.appendChild(_obj);
  return _obj;
}

for(var ease in _easing){
  var _ease = _easing[ease];
  var y = (count * 30);
  
  createTween( createBox(), _ease, y );

  count++;
}

