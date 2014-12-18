/*!
 *	Animation-meter version 1.0
 *
 *	Ken Fyrstenberg Nilsen (C) 2013 Abdias Software.
 *	http://abdiassoftware.com/
 *
 *	MIT license.
*/
/**
 *	animMeter is a highly accurate meter to measure frames and FPS. It
 *	is made to be used with canvas animations.
 *
 *	animMeter has a bar to show each individual frame rates, if they
 *	operate within the "time budget" as well as an accurate FPS counter.
 *
 *	animMeter is very efficient an leaves a very tiny memory foot-print.
 *
 *	USAGE:
 *
 *		There are only two steps needed -
 *
 *		Initialization outside loop:
 *
 *			var meter = new animMeter(appendToIdOrElement)
 *			var meter = new animMeter(appendToIdOrElement, systemFPS)
 *
 *		appendToIdOrElement   = id of an element or an element to append the meter to
 *		systempFPS (optional) = if system Hz is not 60 Hz, pass in the frequency here
 *
 *		Inside loop right before calling requestAnimationFrame/setTimeout:
 *
 *			meter.update();          //if used from setTimeout (less accurate)
 *			meter.update(rafResult); //rafResult from requestAnimationFrame
 *
 *	Note: if you choose to not use the event it will still be able to
 *	measure, but less accurate.
 *
 *	Example:
 *
 *		var meter = new animMeter('myDiv'); //id or pass in an element directly
 *
 *		function loop(rafResult) {
 *
 *			// ...
 *
 *			meter.update(rafResult);
 *			requestAnimationFrame(loop);
 *		}
*/
function animMeter(id, fps) {

	fps = fps ? fps : 60;

	var ctime, otime = null,	// current and old time
		canvas, ctx,			// our canvas
		
		rw = 120,				// real width
		nw = 18,				// fps area width
		w = rw - nw,			// bar width
		h = 10,					// height
		cx = 0,					// bar x
		
		y = 2,					// meter indicator height
		mh = (h / 2 + y / 2)|0,	// middle height
		bh = h - y,				// bar width
		
		wx = w * 0.25,			// pre-calced for bar
		interval = 1000 / fps,	// expected interval
		
		i = 0,					// for rendering indicators
		isNum = false,			// cache event number status
		ut = 0, fpsa = 0,		// fps average counter
		dx = 0, dy = 0,			// delta for Firefox

		cols = ['#0f0', '#ff0', '#fa0', '#f00'];

	/**
	 *	Call this from within the animation loop, right before calling
	 *	requestAnimationFrame (or setTimeout).
	*/
	this.update = function(e) {

		var x, fps, diff;

		/// first time init
		if (isNum || (arguments.length === 1 && typeof e !== 'undefined')) {

			if (otime === null) {
				otime = 0;
				isNum = true;
				return;
			}
			diff = e - otime;
			otime = e;
		
		} else {

			if (otime === null) {
				otime = (new Date()).getTime();
				return;
			}
		
			ctime = (new Date()).getTime();
			
			diff = ctime - otime;
			otime = ctime;
		}
		
		/// frame rate
		fps = 1000 / diff;
		
		/// calc bar width - ideal result = 1
		x = (wx * diff / interval)|0;
		if (x > w) x = w;
		if (x > cx) cx = x;

		/// render
		ctx.beginPath();
		ctx.moveTo(0, mh);
		ctx.lineTo(cx, mh);
		ctx.stroke();

		/// clear remaining
		ctx.fillRect(cx, y, w - cx, bh);
		
		/// calc average FPS and update once every second
		if (ut === 0) {

			ctx.beginPath();
			ctx.fillRect(w, 0, nw, h);
			ctx.fillStyle = '#ddf';
			ctx.fillText(fpsa, w + nw + dx - 2, -1 + dy);
			ctx.fillStyle = '#000';

			ut++;
			fpsa = fps;
			
		} else {
			
			ut++;
			fpsa += fps;
			
			if (ut > fps) {
				fpsa = (fpsa / ut + 0.5)|0;
				if (fpsa < 0) fpsa = 0;
				ut = 0;
			}
		}

		/// slow rest of bar
		cx-=4;
		if (cx < 1) cx = 1;
	}

	/**
	 *	Setup canvas and render indicators to it
	*/
	canvas = document.createElement('canvas');
	canvas.width = rw;
	canvas.height = h;
	canvas.title = 'animMeter v.1.0 by Ken Fyrstenberg http://abdiassoftware.com/';
	canvas.style.border = '2px solid #000';

	ctx = canvas.getContext('2d');

	/// for background
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, rw, h);
	ctx.lineWidth = 2;

	/// draw top indicators
	for(; i < 4; i++) {
		ctx.beginPath();
		ctx.strokeStyle = cols[i];
		ctx.moveTo((i * w * 0.25)|0, y-1);
		ctx.lineTo((i * w * 0.25 + w * 0.25 - ((i<3)?1:0) )|0, y-1);
		ctx.stroke();	
	}

	/// webkit and firefox render text differently, compensate
	if (typeof window.console.__mozillaConsole__ !== 'undefined') {
		dx += 1;
		dy += 2;
	};
	
	/// for text
	ctx.font = '9px Arial';
	ctx.textAlign = 'end';
	ctx.textBaseline = 'top';

	ctx.lineWidth = bh - 2;

	if (typeof id === 'string')
		id = document.getElementById(id);
	
	id.appendChild(canvas);

	return this;
}
