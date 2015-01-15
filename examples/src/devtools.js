var Timeline = require('../../kettle-timeline.js');
var Tween = require('../../kettle-tween.js');
var Easing = require('kettle-ease');
var _ = require('underscore');
var d3 = require('d3');
var _str = require('sprintf').vsprintf;

var simpleLogger = require('../../node_modules/kettle-simple-logger/kettle-simple-logger.js');

var stage = document.getElementById('stage');
var playButton = document.getElementById('toggle-animation-button');
var analysisButton = document.getElementById('toggle-analysis-button');
var analysisElement = document.getElementById('analysis');

// Define our start time
startTime = window.performance.now();

// Set our logger options
var loggerOptions = {
  position:'absolute',
  left:'0px',
  bottom:'0px',
  height:'400px',
  maxHeight:'400px',
  overflowY:'scroll',
  top:null
};
var tween = new Tween();
var duration = 2000;

var isCSS = (window.location.href.split('?')[1] === 'css');
var cssWindow, windowWidth;

var kettleTweenTest = function(){
  hero.style['-webkit-transition'] = 'none';
  hero.style['-webkit-transform'] = 'translate3d(0px, 0px, 0px)';

  //cssWindow.postMessage('play', '*')

  if (!tween.isAnimating){
    hasPlayed = true;
    tween.play(tweenOptions);
  };
}

var tweenLiteTest = function(){
  hero.style['left'] = '0px';
  TweenLite.to(hero, duration/1000, {left: windowWidth + 'px' });
};

var cssTest = function(){
  hero.style['-webkit-transition'] = 'none';
  hero.style['left'] = '0px';

  setTimeout( function(){
    hero.style['-webkit-transition'] = '1s all ease-out';
    hero.style['-webkit-transform'] = 'translate3d(' + windowWidth +'px, 0px, 0px)';
  }, 10);
}


var play = (!isCSS) ? kettleTweenTest : tweenLiteTest;

if (!isCSS) {
  //cssWindow = window.open('http://localhost:1337/examples/devtools.html?css', 'cssWindow', "height=600,width=651");
}else{
  window.addEventListener('message', play);
  playButton.style.opacity = 0;
}

// Create the simple logger
simpleLogger.init( loggerOptions );
simpleLogger.disable();

(function init(){
  var endPosition = null;
  var tweenMeasurements = [];

  var hero = document.getElementById("hero");

  var hr = new Array(70).join('=');
  var hlr = new Array(70).join('-');

  var start = Date.now();
  var end = 0;

  var tweenMeasurements;
  var props = [];

  var svg = d3.select("#analysis")
      .append("svg")
      .attr("class", "box")
      .attr("width", '100%')
      .attr("height", '100px')
      .append("g")

  stage.appendChild(hero);

  var _h;
  var currentFrame = 0;

  var analyze = function(){
    var idealFrames = Math.floor(tweenOptions.duration / (1000/60)) + 2;
    var actualFrames = tweenMeasurements.length;
    var callTotal = 0;
    var averageCallTime = callTotal / actualFrames;

    var pathFunction = d3.svg.line()
      .x(function(d, i){return (i-1) * (window.innerWidth / idealFrames)})
      .y(function(d){ return -(d.duration * 50) + svg.node().getBBox().height})
      .interpolate('cardinal-open');

    svg.selectAll('*').remove();

    if(tweenMeasurements === undefined) throw new Error('No data present');

    if( tweenMeasurements.length != 0 ){
      tweenMeasurements.forEach(function(el, idx){
        callTotal += el.duration;
      });
    }

    var rect = svg.append('rect')
       .attr('width', '100%')
       .attr('height', '100px')
       .attr('fill', 'rgba(0,0,0,0)')
       .attr('stroke', 'grey')

    svg.append('path')
       .attr('d', pathFunction(tweenMeasurements))
       .attr('stroke', 'rgba(0,0,255,0.4)')
       .attr('stroke-width', 2)
       .attr('style', 'pointer-events:none;')
       .attr('fill', 'none')

    _h = svg.node().getBBox().height;

    line = svg.append('path')
               .attr('stroke-width', 2)
               .attr('stroke', 'green')
               .attr('d', _str('M %1$u 0 L %1$u %2$u', [window.innerWidth * ((currentFrame-1)/ idealFrames), _h]))

    svg.selectAll('path')
               .data(tweenMeasurements)
               .enter()
               .append('path')
               .attr('stroke-width', 0.5)
               .attr('stroke', 'rgba(0,0,0,0.4)')
               .attr('d', function(d, i){
                 return _str('M %1$u 0 L %1$u %2$u', [(window.innerWidth / idealFrames) * (i-1), _h])
               })

    /*
     svg.selectAll('circle')
        .data(tweenMeasurements)
        .enter()
        .append('circle')
        .attr('cx', function(d, i){return i * (window.innerWidth / 62)})
        .attr('cy', function(d){return -(d.duration * 50) + _h})
        .attr('r', function(d){return (d.duration * 16)})
        .attr('fill', 'red').attr('style', 'opacity:0.4;')
    */
      
      rect.on('mousemove', function(){
        var x = d3.mouse(this)[0];
        var w = svg.node().getBBox().width;
        var currentFrame = Math.floor((x / w) * actualFrames);

        pathString = _str('M %u %u L %u %u', [ x, 0, x, _h ]);
        line.attr('d', pathString);

        props[currentFrame]();
      });
  };

  windowWidth = parseInt(window.getComputedStyle(stage).getPropertyValue('width')) - parseInt(window.getComputedStyle(hero).getPropertyValue('width'));

  var onBeginHandler = function(){
    simpleLogger.out(hr);
    simpleLogger.out("Tween Started");

    this._motionStack[0].c = windowWidth;

    //setTimeline('start').exec();
  };

  var onEndHandler = function(){
    simpleLogger.out(hlr);
    simpleLogger.out("Tween Completed");

    end = Date.now();

    simpleLogger.out(hr);
    simpleLogger.out("Start Time: \t" + start);
    simpleLogger.out("End Time: \t" + end);
    simpleLogger.out("Duration: \t" + this.duration);
    simpleLogger.out("Time Offset: \t" + (this.duration - (end - start)));
    simpleLogger.out(hlr);

    //tweenMeasurements = window.performance.getEntriesByName('style_measure');
    // clear our marks and measures
    window.performance.clearMarks();
    window.performance.clearMeasures();

    //analyze();
  };

  var onUpdateHandler = function(c){
      currentFrame = this.getCurrentFrame();
      // mark the start of styling
      window.performance.mark('style_update_start');

      var fn = function(){
        _prop = 'translate3d(' + ~~c + 'px, 0px, 1px) rotateZ(' + ~~c + 'deg)';
        //_prop = 'translate3d(' + ~~c + 'px, 0px, 1px)';
        hero.style['-webkit-transform'] = _prop;
      };

      fn();

      props.push(fn);

      window.performance.mark('style_update_end');

      window.performance.measure('style_measure', 'style_update_start', 'style_update_end');
      tweenMeasurements = window.performance.getEntriesByName('style_measure');
      analyze();
    }

  tweenOptions = {
    duration: duration,
    curve:[0, 500],
    easing: Easing.easeOutQuad,
    onBegin: onBeginHandler,
    onEnd: onEndHandler,
    onUpdate: onUpdateHandler
  }
  var hasPlayed = false;

  playButton.onclick = play;
}())
