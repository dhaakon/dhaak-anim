var _ = require("underscore");
var Tween = require('./dhaak-tween.js');

var TweenManager = require('./dhaak-tween-manager.js');
var round = Math.round;

var Timeline = function( options ){
  this.init( options );
};

// References the tween class
var proto = Timeline.prototype = new Tween();

proto.init = function( options ){
  this._type = 'timeline';
  this._tweens = [];

  this._tail = null;
  this._head = null;

  this._currentTween = null;
  this._previousTween = null;
  this._nextTween = null;

  //this._currentTweenIdx = 0;
  this._numTweens = 0;

  this._tween = null;
  this._delta = 0;
  this._previousTime = 0;
  this._startTime = 0;

  this._duration = 0;
  this._percentComplete = 0;
  this._manager = TweenManager;

  this._loop = false;

  if (options) this._setupWithOptions( options );
  this._setupMainTween();
};

proto._addTween = function( tween ){
  var _prevTweenEnd = (this._numTweens > 0) ? this._tweens[this._numTweens-1].end : 0;

  var tweenReference = {
    start: _prevTweenEnd + tween.delay,
    end: _prevTweenEnd + tween.duration + tween.delay,
    tween: tween
  }


  this._tweens.push(tweenReference);
  this._setDuration();
  this._numTweens++;
};

proto._setupMainTween = function(){
  var options = {
    node:this,
    easing:require('penner').linear,
    onUpdate:this.onUpdate.bind(this),
    onBegin:this.onBegin,
    onEnd:this.onEnd.bind(this),
    curve:[0,1]
  }

  this._setOptions(options);
};

proto._setupWithOptions = function( options ){
  for(var key in options){
    this[key] = options[key];
  }
};

proto._getTweenAtTime = function(time){
  var i; len = this._tweens.length;


  for( i = 0; i < len; ++i ){
    var _t =  this._tweens[i];
    if(time > _t.start && time < _t.end){
      if (!_t.isPaused){
/*
        if (this._tweens.indexOf(_t) !== this._currentTweenIdx){
          this._previousTweenIdx = this._currentTweenIdx || 0;

          var _prevTween = this._tweens[this._previousTweenIdx];
          var _tmp = _prevTween.tween;
        }
*/
        //this._currentTweenIdx = this._tweens.indexOf(_t);

        return this._tweens[ this._tweens.indexOf(_t) ];
      }
    }
  }
};

proto._setDuration = function(){
  var i, tmpDuration = 0, len = this._tweens.length;

  for(i = 0; i < len; ++i){
    tmpDuration += this._tweens[i].tween.duration + this._tweens[i].tween.delay;
  }

  this.duration = this._duration = tmpDuration;

  this.setDuration(this.duration);
};

/*
 * Overwritten method
 */

proto.start = function(){
  //if ( !this._currentTween) this._currentTween = this._tweens[0];
  //this._currentTween.play();
  this.play();
};

proto.addTweens = function( tweens ){
  var i; len = tweens.length;

  for(i = 0; i < len; ++i){
    this._addTween(tweens[i])
  }
};

proto.addTweenAt = function(tween, idx){};
proto.removeTween = function( tween ){};

proto.loop = function( bool ){
  this._loop = bool;
  return this;
};

  // EVENTS
proto.onBegin = function(){};
proto.onEnd = function(){
  //this._tweens[this._tweens.length - 1]._stop();

  if(this._loop){
    setTimeout(function(){
        for( var _t in this._tweens ){
          this._tweens[_t].tween.reverse();
        }

        this.reverse();
        this.play();
      }.bind(this),
    1);
    }
};

proto.onUpdate = function(c){
  this._currentTime = c * this.duration;

  var _tweenReference = this._getTweenAtTime(round(this._currentTime));

  if(_tweenReference){
    var _tween = _tweenReference.tween;
    var _inputTime = this._t - _tweenReference.start;

    console.log(this._t);
    _tween.inputTime = _inputTime;

    _tween._step(_inputTime);
  }
};

module.exports = Timeline;
