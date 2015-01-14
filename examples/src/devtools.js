var Timeline = require('../../kettle-timeline.js');
var Tween = require('../../kettle-tween.js');
var Easing = require('kettle-ease');
var _ = require('underscore');
var d3 = require('d3');

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

var isCSS = (window.location.href.split('?')[1] === 'css');
var cssWindow, windowWidth;

var play =(!isCSS) ? function(){
                      hero.style['-webkit-transition'] = 'none';
                      hero.style['-webkit-transform'] = 'translate3d(0px, 0px, 0px)';

                      cssWindow.postMessage('play', '*')

                      if (!tween.isAnimating){
                        hasPlayed = true;
                        tween.play(tweenOptions);
                      };
                    }
                    :
                    function(){
                      
                      //hero.style['-webkit-transition'] = 'none';
                      hero.style['left'] = '0px';

                      /*
                      setTimeout( function(){
                        hero.style['-webkit-transition'] = '1s all ease-out';
                        hero.style['-webkit-transform'] = 'translate3d(' + windowWidth +'px, 0px, 0px)';
                      }, 10);
                     */
                      TweenLite.to(hero, 1, {left: windowWidth + 'px' });
                    };

if (!isCSS) {
  cssWindow = window.open('http://localhost:1337/examples/devtools.html?css', 'cssWindow', "height=600,width=651");
  console.log(cssWindow);
}else{
  window.addEventListener('message', play);
  playButton.style.opacity = 0;
}

// Create the simple logger
simpleLogger.init( loggerOptions );
simpleLogger.disable();

(function init(){
  var endPosition = null;

  simpleLogger.out("Dev Tools Test");

  var hero = document.createElement("div");
  hero.setAttribute('id', 'hero');

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

  var setTimeline = function( position ){
    fn = (position === "start") ? console.timeline : console.timelineEnd;
    return {exec: fn};
  };

  var _h;

  var analyze = function(){

    var pathFunction = d3.svg.line()
      .x(function(d, i){return i * (window.innerWidth / 62)})
      .y(function(d){ return -(d.duration * 50) + svg.node().getBBox().height})
      .interpolate('cardinal-open');

    if(tweenMeasurements === undefined) throw new Error('No data present');

    var idealFrames = Math.round(tweenOptions.duration / (1000/60));
    var actualFrames = tweenMeasurements.length;

    var callTotal = 0;

    tweenMeasurements.forEach(function(el, idx){
      callTotal += el.duration;
    });

    var averageCallTime = callTotal / actualFrames;

    console.log(averageCallTime, 1/(1000/60));
    console.log(idealFrames, actualFrames);

    svg.selectAll('*').remove();

    var rect = svg.append('rect')
       .attr('width', '100%')
       .attr('height', '100px')
       .attr('fill', 'white')
       .attr('stroke', 'grey')

    svg.append('path')
       .attr('d', pathFunction(tweenMeasurements))
       .attr('stroke', 'rgba(0,0,255,0.4)')
       .attr('stroke-width', 2)
       .attr('style', 'pointer-events:none;')
       .attr('fill', 'none')

    line = svg.append('path')
               .attr('stroke-width', 2)
               .attr('stroke', 'green')
               .attr('d', 'M 0 0 L 0 50')

    _h = svg.node().getBBox().height;
    console.log(_h);

     svg.selectAll('circle')
        .data(tweenMeasurements)
        .enter()
        .append('circle')
        .attr('cx', function(d, i){return i * (window.innerWidth / 62)})
        .attr('cy', function(d){return -(d.duration * 50) + _h})
        .attr('r', function(d){return (d.duration * 16)})
        .attr('fill', 'red').attr('style', 'opacity:0;')
      
      rect.on('mousemove', function(){
        var x = d3.mouse(this)[0];
        var w = svg.node().getBBox().width;
        var currentFrame = Math.floor((x / w) * actualFrames);

        line.attr('d', ['M', x, 0, 'L', x, _h].join(' '));

        hero.style['-webkit-transform'] = props[currentFrame];
      });
  };

  windowWidth = parseInt(window.getComputedStyle(stage).getPropertyValue('width')) - parseInt(window.getComputedStyle(hero).getPropertyValue('width'));

  var onBeginHandler = function(){
    simpleLogger.out(hr);
    simpleLogger.out("Tween Started");

    this._motionStack[0].c = windowWidth;

    //setTimeline('start').exec();
    console.time();
    console.timeStamp()
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

    console.timeStamp();
    console.timeEnd();

    tweenMeasurements = window.performance.getEntriesByName('style_measure');
    //console.log(JSON.stringify(tweenMeasurements));
    // clear our marks and measures
    window.performance.clearMarks();
    window.performance.clearMeasures();

    analyze();
  };

  var getClip = function( node ){
    var bRect = node.getBoundingClientRect();
    var top, left, bottom, right;

    var elWidth = bRect.width;
    var elHeight = bRect.height;

    top = bRect.top + 'px';
    right = (bRect.left + elWidth) + 'px';
    left = bRect.right + 'px';
    bottom = (bRect.bottom + elWidth) + 'px';

    arr = [ top, right, bottom, left ]

    return arr;
  }

  var onUpdateHandler = function(c){
      // mark the start of styling
      window.performance.mark('style_update_start');

      _prop = 'translate3d(' + ~~c + 'px, 0px, 1px)';
      //_prop = ~~c + 'px';
      hero.style['-webkit-transform'] = _prop;

      props.push(_prop);
      //hero.style['left'] = ~~c + "px";
      
      // mark the end of styling
      window.performance.mark('style_update_end');
      window.performance.measure('style_measure', 'style_update_start', 'style_update_end');
    }

  tweenOptions = {
    duration: 1000,
    curve:[0, 500],
    easing: Easing.easeOutQuad,
    onBegin: onBeginHandler,
    onEnd: onEndHandler,
    onUpdate: onUpdateHandler
  }
  var hasPlayed = false;

  var onCSSAnimationUpdate = function( event ){
    console.log(event);
  }

  window.addEventListener('transisionEvent', onCSSAnimationUpdate );

  playButton.onclick = play;
}())
