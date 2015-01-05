var _ = require("underscore");
var Tween = require('./kettle-tween.js');

var TweenManager = require('./kettle-tween-manager.js');

var Timeline = function( options ){
  this.init( options );
};

var __prototype = {
  // PROPERTIES
  _tweens:[],
  _tail:null,
  _head:null,
  _currentTween:null,
  _previousTween:null,
  _nextTween:null,

  _currentTweenIdx: 0,
  _numTweens:0,

  // The main tween object which advances the timeline
  _tween:null,

  _delta:0,
  _previousTime:0,
  _startTime:0,

  _duration:0, duration:0,
  _percentComplete:0,
  _manager: TweenManager,

  loop:false,

  // METHODS
  init:function( options ){
    if (options) this._setupWithOptions( options );
    this._setupMainTween();

  },

  _addTween:function(tween){
    var _prevTweenEnd = (this._numTweens > 0) ? this._tweens[this._numTweens-1].end : 0;

    var tweenReference = {
      start: _prevTweenEnd,
      end: _prevTweenEnd + tween.duration,
      tween: tween
    }

    this._tweens.push(tweenReference);
    this._setDuration();
    this._numTweens++;
  },

  _setupMainTween:function(){
    var options = {
      node:this,
      //easing:require('kettle-ease').easerOutBack,
      onUpdate:this.onUpdate.bind(this),
      onBegin:this.onBegin,
      onEnd:this.onEnd,
      curve:[0,1]
    }

    this._tween = new Tween(options);
  },

  _setupWithOptions:function( options ){
    for(var key in options){
      this[key] = options[key];
    }
  },

  _getTweenAtTime:function(time){
    var i; len = this._tweens.length;

    time = ~~time + this._tween._delta;

    for( i = 0; i < len; ++i ){
      var _t =  this._tweens[i];
      if(time > _t.start && time < _t.end){
        console.log("time = " + time, _t.end);
        if (!_t.isPaused){ 
          //this._tween._t = _t.end;
          //console.log(this._tween._t);
          
          if (this._tweens.indexOf(_t) !== this._currentTweenIdx){
            this._previousTweenIdx = this.currentTweenIdx || 0;

            var _prevTween = this._tweens[this._previousTweenIdx];
            var _tmp = _prevTween.tween;

            //if(!_tmp.isPaused) _tmp._update(_prevTween.end);
          }
          
          this._currentTweenIdx = this._tweens.indexOf(_t);
          
          return _t;
        }
      }
    }
  },

  _setDuration:function(){
    var i, tmpDuration = 0, len = this._tweens.length;

    for(i = 0; i < len; ++i){
      tmpDuration += this._tweens[i].tween.duration;
    }

    this.duration = this._duration = tmpDuration;

    this._tween.setDuration(this.duration);
  },

  start:function(){
    //if ( !this._currentTween) this._currentTween = this._tweens[0];
    //this._currentTween.play();
    this._tween.play();
  },

  addTween:function( tween ){
    this._duration += tween.duration;
    var _prevTweenEnd = (this._numTweens > 0) ? this._tweens[this._numTweens-1].end : 0;

    var tweenReference = {
      start: _prevTweenEnd,
      end: _prevTweenEnd + tween.duration
    }

    this._tweens.push(tween);
    this._numTweens++;
  },

  addTweens:function( tweens ){
    var i; len = tweens.length;

    for(i = 0; i < len; ++i){
      this._addTween(tweens[i])
    }
  },

  addTweenAt:function(tween, idx){},

  removeTween:function( tween ){},

  // EVENTS
  onBegin:function(){},
  onEnd:function(){
    //this.reverse();
    //this.play();
  },

  onUpdate:function(c){
    this._currentTime = c * this.duration;
    var _tweenReference = this._getTweenAtTime(~~this._currentTime);

    if(_tweenReference){
      var _tween = _tweenReference.tween;
      _tween._update(this._tween._t - _tween.start);
    }
  },
};

_.extend(Timeline.prototype, __prototype);

module.exports = Timeline;
