var Timeline = require('../../kettle-timeline.js');
var Tween = require('../../kettle-tween.js');
var Easing = require('kettle-ease');
var _ = require('underscore');
var d3 = require('d3');

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

  var hr = new Array(70).join('=');
  var hlr = new Array(70).join('-');

  document.body.appendChild(circle);

  var marker = document.createElement("div");
  var markerStyleOptions = {
    "position" : "absolute",
    "-webkit-transform":"translate(500px, -20px)",
    "border":" 1px solid red",
    "width":"20px",
    "height":"20px",
    "borderRadius":"10px",
    "text-indent":"7px",
    "font-size":"12px",
    "line-height":"18px"
  }

  _.extend( marker.style, markerStyleOptions );
  
  var marker2 = document.createElement('div');
  marker2options = _.clone(markerStyleOptions);

  _.extend( marker2options, {"-webkit-transform" : "translate(500px, 280px)"});
  _.extend( marker2.style, marker2options );

  marker.innerHTML = "1";
  marker2.innerHTML = "2";

  document.body.appendChild(marker);
  document.body.appendChild(marker2);


  var tween1options = {
    duration: 1000,
    curve:[0, 500],
    easing:Easing.easeInOutBack,
    onBegin:function(){
      console.log(hr);
      console.log("Tween 1 Starting");
      console.log(hlr);
    },
    onUpdate:function(c){
      mat = mat.translate(c, 0, 0);
      circle.style['-webkit-transform'] = new WebKitCSSMatrix().translate(c,0,0).toString();
    },
    onEnd:function(){
      console.log(hr);
      console.log("Tween 1 Completed");
      console.log(hlr);
    }
  }

  var tween2options = {
    duration: 1000,
    curve:[1, 3],
    easing:Easing.easeOutBounce,
    onUpdate:function(c){
      //circle.style['-webkit-transform'] = new WebKitCSSMatrix(circle.style['-webkit-transform']).scale(c).toString();
    },
    onEnd:function(){
      console.log(hr);
      console.log("Tween 2 Completed");
      console.log(hlr);
    }
  }

  var tween3options = {
    duration: 1000,
    curve:new Tween.Line([1,0],[0.3333339, 300]),
    easing:Easing.easeOutBounce,
    onUpdate:function(c){
      mat = new WebKitCSSMatrix(circle.style['-webkit-transform']);
      mat2 = mat.translate(0, c[1]);
      circle.style['-webkit-transform'] = new WebKitCSSMatrix().translate(500,c[1],0).toString();
    },
    onEnd:function(){
      console.log(hr);
      console.log("Tween 3 Completed");
      console.log(hlr);

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

  setTimeout(function(){
    timeline.start();
  }, 200);

})()
