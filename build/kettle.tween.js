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
 *    @property {array} curve The curves object which is used to create the motion objects.
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
  this.curve = [0, 1];
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
    var c = this.curve;

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

    setCurve:function(curve){
      this.curve = curve;
      this._setMotionFromCurve(curve);
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

},{"./kettle-tween-manager.js":1}]},{},[2]);
