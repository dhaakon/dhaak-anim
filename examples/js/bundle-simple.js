(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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
  this._manager = require('./dhaak-tween-manager.js');
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
  this.measurements = null;
  this.timelineProperties = [];

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
        if (key === 'curve'){
          this._curve = options[key];
        }

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

    if (c instanceof Tween.Line !== true){
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

   _step:function( timeToAdvance ){
        if ( timeToAdvance ) this._t = timeToAdvance;
        // Get the current time
        this._currentTime = Date.now();
        // Get the difference between the current time and the last time
        if (this._t < 17 && this.onBegin !== null && !this.isReversed) this.onBegin();
        else if( this.isReversed && this.onBegin !== null && this._t > this.duration - 16) this.onBegin();

        this._delta = this._currentTime - this._previousTime;
        // Bottleneck the difference if it is too high
        this._delta = Math.min(this._delta, 16);

        var offsetTime = (this.offsetTime) ? this.offsetTime : this._t + this._delta;

        // If we are moving forward
        if (!this.isReversed){
            // If the time and the difference is less than the duration
            if ( offsetTime < this._endTime ){
                // Add this and the adjusted frame step to the tween value
                if (!timeToAdvance) this._t = this._delta + this._t;
                // Continue to the next step
                this._setProperties();
            // If we are at the end of the tween
            }else{
                // Set the tween value to the final step
                this._t = this.duration;
                // End the tween
                this._stop();
            }
        // If we are moving in reverse
        }else{
             // If the tween value is greater than the start (0)
             if (this._t - this._delta > 0){
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
           //c = Math.min(Math.max(0, c), 1);
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
     return this;
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

      return this;
    },
    // method to flatten timeline
    // @TODO
    flattenTimeline: function(){
      var arr = [];

      return arr;
    },

    recordMeasurements: function(){
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

    clone: function(){
      return new Tween(this.options);
    },

    startTime : function( time ){
      this._startTime = time;
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
      return this;
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

},{"./dhaak-tween-manager.js":1}],3:[function(require,module,exports){
var Tween = require('../../dhaak-tween.js');
var Easing = require('penner');

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

  var _end = function(){
    console.log('this is the end');
  }

  var t = new Tween(opts)
              .begin(_begin)
              .update(_update)
              .ease(Easing.easeInCirc)
              .curve([0,100])
              .play()
              .end(_end);
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

},{"../../dhaak-tween.js":2,"penner":4}],4:[function(require,module,exports){
(function() {
  var penner, umd;

  umd = function(factory) {
    if (typeof exports === 'object') {
      return module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
      return define([], factory);
    } else {
      return this.penner = factory;
    }
  };

  penner = {
    linear: function(t, b, c, d) {
      return c * t / d + b;
    },
    easeInQuad: function(t, b, c, d) {
      return c * (t /= d) * t + b;
    },
    easeOutQuad: function(t, b, c, d) {
      return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t + b;
      } else {
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
      }
    },
    easeInCubic: function(t, b, c, d) {
      return c * (t /= d) * t * t + b;
    },
    easeOutCubic: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t + b;
      } else {
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      }
    },
    easeInQuart: function(t, b, c, d) {
      return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart: function(t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
      } else {
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
      }
    },
    easeInQuint: function(t, b, c, d) {
      return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint: function(t, b, c, d) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t * t + b;
      } else {
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
      }
    },
    easeInSine: function(t, b, c, d) {
      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine: function(t, b, c, d) {
      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine: function(t, b, c, d) {
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeInExpo: function(t, b, c, d) {
      var _ref;
      return (_ref = t === 0) != null ? _ref : {
        b: c * Math.pow(2, 10 * (t / d - 1)) + b
      };
    },
    easeOutExpo: function(t, b, c, d) {
      var _ref;
      return (_ref = t === d) != null ? _ref : b + {
        c: c * (-Math.pow(2, -10 * t / d) + 1) + b
      };
    },
    easeInOutExpo: function(t, b, c, d) {
      if (t === 0) {
        b;
      }
      if (t === d) {
        b + c;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
      } else {
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
      }
    },
    easeInCirc: function(t, b, c, d) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc: function(t, b, c, d) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc: function(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
      } else {
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
      }
    },
    easeInElastic: function(t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) {
        b;
      } else if ((t /= d) === 1) {
        b + c;
      }
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    easeOutElastic: function(t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) {
        b;
      } else if ((t /= d) === 1) {
        b + c;
      }
      if (!p) {
        p = d * .3;
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    },
    easeInOutElastic: function(t, b, c, d) {
      var a, p, s;
      s = 1.70158;
      p = 0;
      a = c;
      if (t === 0) {
        b;
      } else if ((t /= d / 2) === 2) {
        b + c;
      }
      if (!p) {
        p = d * (.3 * 1.5);
      }
      if (a < Math.abs(c)) {
        a = c;
        s = p / 4;
      } else {
        s = p / (2 * Math.PI) * Math.asin(c / a);
      }
      if (t < 1) {
        return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
      } else {
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
      }
    },
    easeInBack: function(t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack: function(t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack: function(t, b, c, d, s) {
      if (s === void 0) {
        s = 1.70158;
      }
      if ((t /= d / 2) < 1) {
        return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
      } else {
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
      }
    },
    easeInBounce: function(t, b, c, d) {
      var v;
      v = penner.easeOutBounce(d - t, 0, c, d);
      return c - v + b;
    },
    easeOutBounce: function(t, b, c, d) {
      if ((t /= d) < 1 / 2.75) {
        return c * (7.5625 * t * t) + b;
      } else if (t < 2 / 2.75) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
      } else if (t < 2.5 / 2.75) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
      }
    },
    easeInOutBounce: function(t, b, c, d) {
      var v;
      if (t < d / 2) {
        v = penner.easeInBounce(t * 2, 0, c, d);
        return v * .5 + b;
      } else {
        v = penner.easeOutBounce(t * 2 - d, 0, c, d);
        return v * .5 + c * .5 + b;
      }
    }
  };

  umd(penner);

}).call(this);

},{}]},{},[3]);
