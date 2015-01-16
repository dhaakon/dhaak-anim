(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"../../kettle-tween.js":3,"kettle-ease":4}],2:[function(require,module,exports){
var TweenManager = {
  // PROPERTIES
  _tweens:[],
  _timelines:[],

  // METHODS
  init:function(){},
  add:function(){},
  delete:function(){},
  update:function(){},

  // EVENTS
  onTweenComplete:function(){},
  onTimelineComplete:function(){}
};


module.exports = TweenManager;

},{}],3:[function(require,module,exports){
/** 
 *    @constructor
 *    @description A lightweight <b>Tween</b> class independant of Third Party libraries (aside from Robert Penner's easing functions). The engine has Paul Irish's
 *    requestAnimFrame shim built in allowing for consistent animations across browsers and devices.
 *    <br>
 *    @example
 *    <b><u>Properties Example</b></u>
 *
 *    var tween = new Tween();
 *    target = document.getElementById("target");
 *
 *    var propertyOptions = {
 *       node: target,
 *       duration: 1000,
 *       properties:{height:{start:300, end:4000, unit:"px"},
 *                   width:{start:200, end:3000, unit:"px"}},
 *    }
 *
 *    tween.to(propertyOptions);
 *    @link <a href="../examples/PropertyExample.html">Property Example</a>
 *    @link <a href="../examples/CurveExample.html">Curve Example</a>
 *    @link <a href="../examples/LineExample.html">Line Example</a>
 *
 *    @example
 *
 *
 *    <b><u>Curve Example</b></u>
 *
 *    var tween = new Tween();
 *    target = document.getElementById("target");
 *
 *    var curveOptions = {
 *       node: target, 
 *       duration: 1000,
 *       curve:[0, 100],
 *       onUpdate:function(c){
 *        this.node.style.width = c + "px"
 *    }
 *
 *    tween.to(curveOptions);
 *    @example
 *
 *
 *    <b><u>Line Example</b></u>
 *
 *    var tween = new Tween();
 *    target = document.getElementById("target");
 *
 *    var lineOptions = {
 *       node: target, 
 *       duration: 1000,
 *       curve:new Line([0, 0],[100,200]),
 *       onUpdate:function(c){
 *        this.node.style.width = c[0] + "px"
 *        this.node.style.left = c[1] + "px"
 *       }
 *    }
 *
 *    tween.to(lineOptions);
 *    
 *
 *    @property {function} onEnd A function to be called at the end of the Tween.
 *    @property {function} onBegin A function to be called at the beginning of the Tween.
 *    @property {function} onUpdate A function to be called at every step of the Tween.
 *    @property {number} delay The delay before the  Tween starts.
 *    @property {boolean} isAnimating (read-only) Boolean determining if the Tween is in animating state.
 *    @property {boolean} isReversed (read-only) Boolean determining if the Tween is reversed.
 *    @property {boolean} isPaused (read-only) Boolean determining if the Tween is in the paused state.
 *    @property {number} percentage (read-only) The percentage of the Tween's completion.
 *    @property {object} properties The properties object which is used to create the motion objects.
 *    @property {array} _curve The curves object which is used to create the motion objects.
 *    @property {function} easing The easing function to be used for the tween.
 *    @property {object} node An object which the Tween will animate.
 *    @property {number} duration The duration of the tween (in milliseconds).
 *    @property {number} _previousTime (read-only) The previous time from the last step.
 *    @property {number} _currentTime (read-only) The current time for the current step.
 *    @property {number} _startTime (read-only) The initial start time for the tween.
 *    @property {number} _delta (read-only) The difference between the last and first step.
 *    @property {number} _t (read-only) The time value to pass to the easing function.
 *    @property {array}  _motionStack (read-only) The motion objects which will be tweened.
 */

var Tween = function( options ){
  this.onEnd = null;
  this.onBegin = null; 
  this.onUpdate = null;
  this.delay = 0;
  this.node = null;
  this.duration = 0;
  this.isAnimating = false; 
  this.isReversed = false; 
  this.isPaused = false; 
  this.properties = null;  
  this._curve = [0, 1];
  this.overshoot = 0;
  this._manager = require('./kettle-tween-manager.js');
  this.easing = function(t, b, c, d){
    return c*t/d + b;
  };
  this._previousTime = null; 
  this._currentTime = null; 
  this._startTime = 0;
  this._endTime = null; 
  this._delta = null; 
  this._t = 0;
  this._motionStack = null;
  this.options = options;

  if (options) this._setOptions(options);

  return this;
}

Tween.prototype = {
   _callbacks:{
      onEnd:[],
      onBegin:[],
      onComplete:[]
   },
   _setOptions:function(options){
      for(var key in options){
        this[key] = options[key];
      }

      this._endTime = this.duration;
      // Grab the motion objects
      if (this._motionStack == null){
        this._motionStack = [];
        if (this.properties != null) {
          this._setMotionFromProperty();
        }else{
          this._setMotionFromCurve();
        }
      }
   },
   /**
    * Private method which creates a MotionObject based on the curves set in the Tween Options before the start of the tween.
    * @private  {object}    Tween._setMotionFromCurve
    * @property {object}
    *
   */
   _setMotionFromCurve:function(){
    var c = this._curve;

    console.log(this._curve);
    if (c instanceof Tween.Line !== true){
      //console.log('not a line');
      var _mo = new MotionObject();
      _mo.d = this.duration;
      _mo.b = c[0];
      _mo.c = c[1] - c[0];
      this._motionStack.push(_mo);
    }else{
        var _c1 = c.curves[0];
        var _c2 = c.curves[1];

        var len = _c1.length;

        for (var i = 0; i < len; ++i){
          var _mo = new MotionObject();

          _mo.b = _c1[i];
          _mo.c = _c2[i] - _c1[i];
          this._motionStack.push(_mo);
        }
      }
  },

  /**
   *  Private method which creates a MotionObject based on the property Object passed in
   *  @private {object}     Tween._setMotionFromProperty
   *  @param   {object}     properties           The properties object which should contain standard CSS properties.
   *  
   */
  
   _setMotionFromProperty:function(){
         // Each object in the properties object should be a CSS style
           for(var property in this.properties){
              var _mo = new MotionObject();
              _mo.prop = property;
              var _property = this.properties[property];
              // If this is an object parse
              // // TODO: webkit, color tranforms: further detection and proceeding parsing
              //
              if (typeof _property == "object"){
                for(var _p in _property){
                  switch(_p){
                    case (_p == "begin"): _mo.b = _property[_p];
                    case (_p == "end"): {_mo.c = _property[_p] - _mo.b;}
                    case (_p == "unit"): _mo.unit = _property[_p];
                  }
                 }
              // If not use the value as the end
              }else{
                 this.change = _property - this.begin;                 
              }

              this._motionStack.push(_mo);
           }
   },

  /**
   * Starts the tween according to the delay if any
   * @private {object}    Tween._start
   *
   */

   _start:function(){
    var self = this; // Self reference for the delay setTimeout callback

    this._currentTime = 0;
    this._startTime = this.delay;
    this._endTime = (this.delay == 0) ? this.duration : this.duration;

    if (this.onBegin != null) this.onBegin();
    this._previousTime = Date.now();
    this.isAnimating = true;

    this._t = (this.isReversed == true) ? this._endTime : 0;
    var self = this;
    setTimeout(function(){self._update();}, this.delay);
   },

  /**
   * Steps the tween 
   * @private {object}    Tween._step
   *
   */

   _step:function(c){
        if (c) this._t = c;
        // Get the current time
        this._currentTime = Date.now();
        // Get the difference between the current time and the last time
        this._delta = this._currentTime - this._previousTime;
        
        // Bottleneck the difference if it is too high
        this._delta = Math.min(this._delta, 25);

        var offsetTime = (this.offsetTime) ? this.offsetTime : this._t + this._delta;
        
        // If we are moving forward
        if (!this.isReversed){
            // If the time and the difference is less than the duration
            if ( offsetTime < this._endTime ){
                // Add this and the adjusted frame step to the tween value
                this._t = this._delta + this._t;
                // Continue to the next step
                this._setProperties();
            // If we are at the end of the tween
            }else{
                // Set the tween value to the final step
                this._t = this.duration;
                this._setProperties();
                // End the tween
                this._stop();
            }
        // If we are moving in reverse
        }else{
             // If the tween value is greater than the start (0)
             if (this._t > 0){
                // Tween value minus the adjusted frame step or the beginning value
                this._t = (this._t - this._delta > 0) ? this._t - this._delta : 0;
                // Continue to the next step
                //this.animationFrame = window.requestAnimationFrame(this._update.bind(this));
                this._setProperties();

            }else{
              this._stop();
            }
          }
        // If there is an onUpdate callback
        // Change the time
        this._previousTime = this._currentTime;

    },

  /**
   * Stops the tween
   * @private {object}    Tween._stop
   *
   */
   _setProperties:function(){
     //if(!this._motionStack) return;
      // Iterate through the motion stack to get all our motion objects
     var i, len = this._motionStack.length;

      for (i = 0; i < len; ++i){
          // Assign a temporary motion object
          var motionObject = this._motionStack[i];
          // If it has a property value
          if (motionObject.prop != null){
              // Assign the value to the tween return value
              this.node.style[motionObject.prop] = this.easing( this._t, motionObject.b, motionObject.c, this._endTime) + motionObject.unit;
              // If there is an onUpdate function return the tween with a beginning of 0 and an end of 1
              if (this.onUpdate != null) var c = this.easing( this._t, 0, 1, this.duration);
          // If there is no property value and only a curve value
          }else{
              // If we only have one curve
              if(this._motionStack.length == 1){
                  // Assign the onUpdate parameter to the one curve
                  var c = this.easing( this._t, motionObject.b, motionObject.c, this.duration);
              // If there are multiple curves
              }else{
                  // Assign the onUpdate parameter to an empty array
                  var c = [];
                  // Iterate through the motionObjects
                  for (var motionObject in this._motionStack){
                      var _m = this._motionStack[motionObject];
                      // Add the return paramater to the array
                      c.push(this.easing( this._t, _m.b, _m.c, this.duration));
                  }
              }
           }
           if (this.onUpdate != null) this.onUpdate(c);
        }
   },
  /**
   * Stops the tween 
   * @private {object}    Tween._stop
   *
   */

   _stop:function(){
    this.isAnimating = false;
    this.isCompleted = true;
    window.cancelAnimationFrame(this.animationFrame);
    
    this._t = (this.isReversed) ? 0 : this.duration;
    this._setProperties();


    if (this.onEnd != null && !this.isPaused) this.onEnd();
   },

  /**
   * Updates the tween 
   * @private {object}    Tween._update
   *
   */

   _update:function(time){
    var self = this;

    // Synchronizes the time
    if (time) {
      this._t = time;
    }

    if (this.isAnimating == true) this.animationFrame = window.requestAnimFrame(this._update.bind(this, time));
    self._step();
   },

  /**
   * Reverses the tween 
   * @public {object}    Tween.reverse
   *
   */

   reverse:function(){
     this.isReversed = !this.isReversed;
   },

  /**
   * Checks to see if the tween is paused. If so, resumes the tween.
   * @public {object}    Tween.resume
   *
   */

   resume:function(){
     if (!this.isPaused) return;
     // Reset our time settings
     this._delta = 0;
     this._previousTime = Date.now();
     // Set our properties
     this.isPaused = false;
     this.isAnimating = true;
     // Resume the tween
     this._update();
   },

  /**
   * the user can manually add a wait method to a tween which would delay the 
   * progress mid-tween
   * @public {object}    Tween.wait
   *
   */


  /**
   * Pauses the tween 
   * @public {object}    Tween.pause
   *
   */

   pause:function(){
     // No need to pause a stopped tween
     if (this.isAnimating == false) return;
     // Set the properties
     this.isAnimating = false;
     this.isPaused = true;
     this._step();
   },

  /**
   * Initializes the tween animation.
   * @public {object}    Tween.play
   * @param {object} options The options object.
   * @example
   * var options = {
   *  node:this,
   *  duration:100,
   *  properties:{width:400}
   * }
   *
   * tween.play(options)
   */

   play:function(options){
      //setup options
      if(options){
        // Iterate through the options
        for (var key in options){
          // Assign our properties
          this[key] = options[key];
        }
      }
      // Grab the motion objects
      if (this._motionStack == null){
        this._motionStack = [];
        if (this.properties != null) {
          this._setMotionFromProperty();
        }else{
          this._setMotionFromCurve();
        }
      }

      // Let her rip
      this._start();
    },

    // functional methods
    update: function( cb ){
      this.onUpdate = cb;
      return this;
    },

    begin:function( fn ){
      this.onBegin = fn;
      return this;
    },

    end:function( fn ){
      this.onEnd = fn;
      return this;
    },

    ease: function(ease){
      this.ease = ease;
      return this;
    },

    curve:function(curve){
      this._curve = curve;
      this._motionStack = [];
      this._setMotionFromCurve(curve);
      return this;
    },

    setDuration:function( duration ){
      this.duration = this._endTime = this._duration = duration;
    },
    getCurrentFrame:function(){
      return Math.ceil((this._t / this.duration) * this._getTotalFrames());
    },

    _getTotalFrames: function(){
      // Add 2 frames for beginning and end
      return ((this.duration/1000)*60)+2;
    }
}
/**
  Create a MotionObject which the Tween Engine uses to modify a given value
  @constructor
  @property {number} b          the begin value for the tween
  @property {number} c          the change value for the tween
  @property {number} t          the time value for the tween
  @property {string} prop       the property which the tween manipulates (if any)
  @property {string} unit       the unit which determines the scale of the property (if any)
*/

function MotionObject(){
  this.b = 0; this.c; this.t; this.prop = null; this.unit = "";
}

/**
  Create a Line Object or an array containing an array of start values and an array of end values
  @constructor
  @param {array} a              an Array of start points
  @param {array} b              an Array of end points
*/

Tween.Line = function(a, b){
  if (a.length != b.length) throw new Error("Uneven Amount of Lines " + a.length + " != " + b.length);
  this.curves = [a, b];
}

/**
 * @ignore
 */

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
                  window.setTimeout(callback, 1000 / 60);
          };
})();

module.exports = Tween;

},{"./kettle-tween-manager.js":2}],4:[function(require,module,exports){
'use strict';

module.exports = {
	linear: function linear(time, begin, change, duration) {
		return change * time / duration + begin;
	},
	easeInQuad: function easeInQuad(time, begin, change, duration) {
		return change * (time /= duration) * time + begin;
	},
	easeOutQuad: function easeOutQuad(time, begin, change, duration) {
		return -change * (time /= duration) * (time - 2) + begin;
	},
	easeInOutQuad: function easeInOutQuad(time, begin, change, duration) {
		if ((time /= duration / 2) < 1) return change / 2 * time * time + begin;
		return -change / 2 * ((--time) * (time - 2) - 1) + begin;
	},
	easeInCubic: function easeInCubic(time, begin, change, duration) {
		return change * (time /= duration) * time * time + begin;
	},
	easeOutCubic: function easeOutCubic(time, begin, change, duration) {
		return change * ((time = time / duration - 1) * time * time + 1) + begin;
	},
	easeInOutCubic: function easeInOutCubic(time, begin, change, duration) {
		if ((time /= duration / 2) < 1) return change / 2 * time * time * time + begin;
		return change / 2 * ((time -= 2) * time * time + 2) + begin;
	},
	easeInQuart: function easeInQuart(time, begin, change, duration) {
		return change * (time /= duration) * time * time * time + begin;
	},
	easeOutQuart: function easeOutQuart(time, begin, change, duration) {
		return -change * ((time = time / duration - 1) * time * time * time - 1) + begin;
	},
	easeInOutQuart: function easeInOutQuart(time, begin, change, duration) {
		if ((time /= duration / 2) < 1) return change / 2 * time * time * time * time + begin;
		return -change / 2 * ((time -= 2) * time * time * time - 2) + begin;
	},
	easeInQuint: function easeInQuint(time, begin, change, duration) {
		return change * (time /= duration) * time * time * time * time + begin;
	},
	easeOutQuint: function easeOutQuint(time, begin, change, duration) {
		return change * ((time = time / duration - 1) * time * time * time * time + 1) + begin;
	},
	easeInOutQuint: function easeInOutQuint(time, begin, change, duration) {
		if ((time /= duration / 2) < 1) return change / 2 * time * time * time * time * time + begin;
		return change / 2 * ((time -= 2) * time * time * time * time + 2) + begin;
	},
	easeInSine: function easeInSine(time, begin, change, duration) {
		return -change * Math.cos(time / duration * (Math.PI / 2)) + change + begin;
	},
	easeOutSine: function easeOutSine(time, begin, change, duration) {
		return change * Math.sin(time / duration * (Math.PI / 2)) + begin;
	},
	easeInOutSine: function easeInOutSine(time, begin, change, duration) {
		return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + begin;
	},
	easeInExpo: function easeInExpo(time, begin, change, duration) {
		return (time == 0) ? begin : change * Math.pow(2, 10 * (time / duration - 1)) + begin;
	},
	easeOutExpo: function easeOutExpo(time, begin, change, duration) {
		return (time == duration) ? begin + change : change * (-Math.pow(2, -10 * time / duration) + 1) + begin;
	},
	easeInOutExpo: function easeInOutExpo(time, begin, change, duration) {
		if (time == 0) return begin;
		if (time == duration) return begin + change;
		if ((time /= duration / 2) < 1) return change / 2 * Math.pow(2, 10 * (time - 1)) + begin;
		return change / 2 * (-Math.pow(2, -10 * --time) + 2) + begin;
	},
	easeInCirc: function easeInCirc(time, begin, change, duration) {
		return -change * (Math.sqrt(1 - (time /= duration) * time) - 1) + begin;
	},
	easeOutCirc: function easeOutCirc(time, begin, change, duration) {
		return change * Math.sqrt(1 - (time = time / duration - 1) * time) + begin;
	},
	easeInOutCirc: function easeInOutCirc(time, begin, change, duration) {
		if ((time /= duration / 2) < 1) return -change / 2 * (Math.sqrt(1 - time * time) - 1) + begin;
		return change / 2 * (Math.sqrt(1 - (time -= 2) * time) + 1) + begin;
	},
	easeInElastic: function easeInElastic(time, begin, change, duration) {
		var shootover = 1.70158;
		var period = 0;
		var amplitude = change;
		if (time == 0) return begin;
		if ((time /= duration) == 1) return begin + change;
		if (!period) period = duration * .3;
		if (amplitude < Math.abs(change)) {
			amplitude = change;
			var shootover = period / 4;
		}
		else var shootover = period / (2 * Math.PI) * Math.asin(change / amplitude);
		return -(amplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period)) + begin;
	},
	easeOutElastic: function easeOutElastic(time, begin, change, duration) {
		var shootover = 1.70158;
		var period = 0;
		var amplitude = change;
		if (time == 0) return begin;
		if ((time /= duration) == 1) return begin + change;
		if (!period) period = duration * .3;
		if (amplitude < Math.abs(change)) {
			amplitude = change;
			var shootover = period / 4;
		}
		else var shootover = period / (2 * Math.PI) * Math.asin(change / amplitude);
		return amplitude * Math.pow(2, -10 * time) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period) + change + begin;
	},
	easeInOutElastic: function easeInOutElastic(time, begin, change, duration) {
		var shootover = 1.70158;
		var period = 0;
		var amplitude = change;
		if (time == 0) return begin;
		if ((time /= duration / 2) == 2) return begin + change;
		if (!period) period = duration * (.3 * 1.5);
		if (amplitude < Math.abs(change)) {
			amplitude = change;
			var shootover = period / 4;
		}
		else var shootover = period / (2 * Math.PI) * Math.asin(change / amplitude);
		if (time < 1) return -.5 * (amplitude * Math.pow(2, 10 * (time -= 1)) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period)) + begin;
		return amplitude * Math.pow(2, -10 * (time -= 1)) * Math.sin((time * duration - shootover) * (2 * Math.PI) / period) * .5 + change + begin;
	},
	easeInBack: function easeInBack(time, begin, change, duration, shootover) {
		if (shootover == undefined) shootover = 1.70158;
		return change * (time /= duration) * time * ((shootover + 1) * time - shootover) + begin;
	},
	easeOutBack: function easeOutBack(time, begin, change, duration, shootover) {
		if (shootover == undefined) shootover = 1.70158;
		return change * ((time = time / duration - 1) * time * ((shootover + 1) * time + shootover) + 1) + begin;
	},
	easeInOutBack: function easeInOutBack(time, begin, change, duration, shootover) {
		if (shootover == undefined) shootover = 1.70158;
		if ((time /= duration / 2) < 1) return change / 2 * (time * time * (((shootover *= (1.525)) + 1) * time - shootover)) + begin;
		return change / 2 * ((time -= 2) * time * (((shootover *= (1.525)) + 1) * time + shootover) + 2) + begin;
	},
	easeOutBounce: function easeOutBounce(time, begin, change, duration) {
		if ((time /= duration) < (1 / 2.75)) {
			return change * (7.5625 * time * time) + begin;
		} else if (time < (2 / 2.75)) {
			return change * (7.5625 * (time -= (1.5 / 2.75)) * time + .75) + begin;
		} else if (time < (2.5 / 2.75)) {
			return change * (7.5625 * (time -= (2.25 / 2.75)) * time + .9375) + begin;
		} else {
			return change * (7.5625 * (time -= (2.625 / 2.75)) * time + .984375) + begin;
		}
	}
};

},{}]},{},[1]);
