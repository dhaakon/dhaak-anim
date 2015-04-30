// Class to track performance of a tween.

var _str = require('sprintf');
var d3 = require('d3');

var Analyze = function( tween, options, svg ){
    var tweenProperties = tween.flattenTimeline();
    tween.recordMeasurements(true);

    var idealFrames = Math.floor( tween.duration / (1000/60)) + 2;
    var actualFrames = tween.measurements.length;

    var callTotal = 0;

    var averageCallTime = callTotal / actualFrames;

    var pathFunction = d3.svg.line()
      .x(function(d, i){return (i-1) * (window.innerWidth / idealFrames)})
      .y(function(d){ return -(d.duration * 50) + svg.node().getBBox().height})
      .interpolate('cardinal-open');

    svg.selectAll('*').remove();

    if( tween.measurements === undefined ) throw new Error('No data present');

    if( tween.measurements.length != 0 ){
      tween.measurements.forEach(function(el, idx){
        callTotal += el.duration;
      });
    }

    var rect = svg.append('rect')
       .attr('width', '100%')
       .attr('height', '100px')
       .attr('fill', 'rgba(0,0,0,0)')
       .attr('stroke', 'grey')

    svg.append('path')
       .attr('d', pathFunction(tween.measurements))
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
               .data(tween.measurements)
               .enter()
               .append('path')
               .attr('stroke-width', 0.5)
               .attr('stroke', 'rgba(0,0,0,0.4)')
               .attr('d', function(d, i){
                 return _str('M %1$u 0 L %1$u %2$u', [(window.innerWidth / idealFrames) * (i-1), _h])
               })
    rect.on('mousemove', function(){
      var x = d3.mouse(this)[0];
      var w = svg.node().getBBox().width;
      var currentFrame = Math.floor((x / w) * actualFrames);

      pathString = _str('M %u %u L %u %u', [ x, 0, x, _h ]);
      line.attr('d', pathString);

      tween.getUpdateCallAtFrame(currentFrame)();
    });
};


module.exports = Analyze;
