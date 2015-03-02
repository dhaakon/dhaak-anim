var Timeline = require('../../kettle-timeline.js');
var Tween = require('../../kettle-tween.js');
var Easing = require('kettle-ease');
var _ = require('underscore');
var d3 = require('d3');

(function init(){
  var cos = Math.cos, sin = Math.sin;

  console.log("Timeline example");

  var createCircle = function(){
    var _circle = document.createElement("div");
    _circle.style.width = "20px";
    _circle.style.left = "400px";
    _circle.style.top = "200px";
    _circle.style.height = "20px";
    _circle.style.display = "block";
    _circle.style.background = "red";
    _circle.style.borderRadius = "10px";
    _circle.style.position = "absolute";
    _circle.style['-webkit-transform'] = "scale(0)";

    return _circle;
  }

  var circle = createCircle();

  document.body.appendChild(circle);

  var tween1 = new Tween( { duration: 1000, delay: 100 } );

  tween1.curve(new Tween.Line( [   0,    0,  50,    0,  300 ],
                               [ 360,  360,  50,  1.5,  300 ]))
        .ease(Easing.easeInOutQuad)
        .begin(function(){
          console.log('1 start');
        })
        .update(function(c){
            var _r = c[2] * c[3];
            var _x = cos(c[0] * ((Math.PI * 2) / 180)) * _r;
            var _y = sin(c[1] * ((Math.PI * 2) / 180)) * _r;
            var _offset = c[4];

            var rx = 0, ry = 0, rz = 70;

            mat = new WebKitCSSMatrix('scale(' + c[3] + ')').rotate( rx, ry, rz ).translate( _x, _y, 0).toString();

            circle.style['-webkit-transform'] = mat
        })
        .end(function(){
          console.log('1 end');
        });

  var tween2options = {
    duration: 400,
    delay:200,
    curve:new Tween.Line([1,100],[ 10, 255 ]),
    easing:Easing.easeInQuad,
    onUpdate:function(c){
      var b = Math.round(c[1]);
      circle.style['-webkit-transform'] = new WebKitCSSMatrix(circle.style['-webkit-transform']).rotate(180,0,1).toString();
      circle.style.background = 'rgb(' + b + ',0,' + b + ')';
      circle.style.border = c[0] + 'px red';
    },
    onEnd:function(){
    }
  }

  var tween2 = new Tween( tween2options );

  var options = {
    duration: 1000
  };

  var tween1clone = tween1.clone();
  tween1clone.reverse();

  var timeline = new Timeline( options );
  timeline.addTweens([ tween1, tween1]);
  timeline.loop( true );

  setTimeout(function(){
    timeline.start();
  }, 200);

})()
