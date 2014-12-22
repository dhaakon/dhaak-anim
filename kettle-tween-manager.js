var TweenManager = function(){
  this.init();
}

var __prototype = {
  // PROPERTIES
  _tweens:[],
  _timelines:[],

  // METHODS
  init:function(){},
  add:function(){},
  delete:function(){},
  update:function(){},

  // EVENTS
  onLoad:function(){},
  onTweenComplete:function(){},
  onTimelineComplete:function(){}
};

_.extend(TweenManager.prototype, __prototype);

module.exports = new TweenManager();
