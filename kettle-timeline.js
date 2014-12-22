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

  _delta:0,
  _previousTime:0,
  _startTime:0,

  _duration:0,
  _percentComplete:0,

  // METHODS
  init:function( options ){
    for(var key in options){
      this[key] = options[key];
    }
  },
  start:function(){},

  addTween:function( tween ){},
  
  removeTween:function( tween ){},

  // EVENTS
  onBegin:function(){},
  onEnd:function(){},
  onUpdate:function(){},
};

_.extend(Timeline.prototype, __prototype);

module.exports = Timeline;
