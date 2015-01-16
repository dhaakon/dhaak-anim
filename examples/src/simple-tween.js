var Tween = require('../../kettle-tween.js');
var Easing = require('kettle-ease');

(function init(){
  var obj = {x:0};

  var opts = {
    node:obj,
    duration:500
  };

  var _update = function(c){
    this.node.x = c;
    //console.log(this.node.x);
    console.log(c);
  }

  var _begin = function(){
    console.log('tween started');
  }

  var t = new Tween(opts)
              .update(_update).begin(_begin)
              .ease(Easing.easeInCirc)
              .curve([0,100])
              .play();
})();
/*
(function init(){
//var Tween = require("kettle-tween");
  var Stats = require("stats-js");
  var Tween = require("../../kettle-tween.js");
  var Easing = require('kettle-ease') ;

  var _ = require("underscore");

  var line = Tween.Line;
  var tweens = [];
  var numBoxes = 3;
  var count = 0;
  var easeFunc = "Back";

  
  
   //var tween = new Tween({node:target})
                   //.duration(1000)
                   //.update(onUpdate)
                   //.ease(Easing.easeInCirc)
                   //.play();
  
  


  var _easing = [
    //easeInElastic:Easing.easeInElastic,
    Easing["easeIn" + easeFunc],
    Easing["easeInOut" + easeFunc],
    Easing["easeOut" + easeFunc],
  ];

  function createStats(){
    var loop, stats = new Stats();

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 10000;

    document.body.appendChild(stats.domElement);
    loop = function(){
      stats.begin();
      window.requestAnimationFrame(loop);
      stats.end();
    }

    loop();
  }

  //createStats();

  function update(c){
    var r = g = Math.round(c[0]);
    var b = 255 - r;

    this.mat = this.mat.translate(c[0], c[1], 1);
    this.mat = this.mat.rotate(c[2]);

    //this.node.style.transform = this.mat.toString();
    this.node.style['-webkit-transform'] = "translate3d(" + c[0] + "px, " + c[1] + "px, 0px) rotate(" + c[2] + "deg)";
    this.mat = new WebKitCSSMatrix();
  }

  //var prevTime = Date.now();

  function createTween(obj, ease, y, delay, duration){
    var t = new Tween();

    var options = {
      node: obj,
      duration: duration || 1000,
      curve: new line([50, y, 0],[600, y, 720]),
      onUpdate: update,
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

        this.play();
        //setTimeout( function(){this.play()}.bind(this), this.delay);
        this.prevTime = Date.now();
      }
    };

    _.extend(t, options)
    t.play();
    tweens.push(t);
  }

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

  while(numBoxes > 0){
    var _ease = _easing[count % 3];
    var y = (count * 22);
    //var _delay = count * 10
    //var _delay = 0;
    //var _duration = 500 + (count * 50)
    createTween( createBox(), _ease, y );

    count++;
    numBoxes--;
  }

  window.onclick = function(){
    for(var tween in tweens){
      var _tween = tweens[tween];
      console.log(_tween);
      if (!_tween.isAnimating) _tween.play();
    }
  }


})();
*/
