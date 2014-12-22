var Timeline = require('../../kettle-timeline.js');
var Tween = require('../../kettle-tween.js');
var Easing = require('kettle-ease');

(function init(){
  console.log("Timeline example");

  var circle = document.createElement("div");
  circle.style.width = "20px";
  circle.style.height = "20px";
  circle.style.display = "block";
  circle.style.background = "red";
  circle.style.borderRadius = "10px";

  var mat = new WebKitCSSMatrix();
  var mat2 = new WebKitCSSMatrix();

  document.body.appendChild(circle);

  var tween1options = {
    duration: 500,
    curve:[0, 1200],
    easing:Easing.easeInOutCirc,
    onUpdate:function(c){
      mat2 = mat.translate(c, 0, 0);
      circle.style.transform = mat2.toString();
    },
    onEnd:function(){
      mat = mat2;
      console.log("Tween 1 Completed");
    }
  }

  var tween2options = {
    duration: 150,
    curve:[1, 1],
    easing:Easing.easeOutBounce,
    onUpdate:function(c){
      mat2 = mat.scale(c,c,1)
      circle.style.transform = mat2.toString();
    },
    onEnd:function(){
      mat = mat2;
      console.log("Tween 2 Completed");
    }
  }

  var tween3options = {
    duration: 200,
    curve:[0, 100],
    easing:Easing.easeInOutBack,
    onUpdate:function(c){
      mat2 = mat.translate(0, c, 0);
      circle.style.transform = mat2.toString();
    },
    onEnd:function(){
      console.log("Tween 3 Completed");
    }
  }

  var tween1 = new Tween( tween1options );
  var tween2 = new Tween( tween2options );
  var tween3 = new Tween( tween3options );

  var options = {
    duration: 1000
  }

  var timeline = new Timeline( options );
  timeline.addTweens([tween1, tween2, tween3]);

  timeline.start();
})()
