// canvasDrawr originally from Mike Taylr  http://miketaylr.com/
// Tim Branyen massaged it: http://timbranyen.com/
// and i did too. with multi touch.
// and boris fixed some touch identifier stuff to be more specific.
// and then added pointer events.

var CanvasDrawr = function(options) {
  // grab canvas element
  var canvas = document.getElementById(options.id),
  ctxt = canvas.getContext("2d");
  canvas.style.width = '100%'
  canvas.width = canvas.offsetWidth;
  canvas.style.width = '';

	(function() {
		(function() {
			var evt = document.createEvent("Event");
			evt.initEvent("pointerdown", true, true);
			canvas.addEventListener("mousedown", function (e) {
				e.target.mouseEvent = e;
				evt.identifier = Infinity;
				evt.getPointerList = function() {
					return [e];
				};
				canvas.dispatchEvent(evt);
			}, false);
		})();
		
		(function() {
			var evt = document.createEvent("Event");
			evt.initEvent("pointermove", true, true);
			canvas.addEventListener("mousemove", function (e) {
				evt.identifier = Infinity;
				evt.getPointerList = function() {
					return e.target.mouseEvent ? [e] : [];
				};
				canvas.dispatchEvent(evt);
			}, false);
		})();
		
		(function() {
			var evt = document.createEvent("Event");
			evt.initEvent("pointerup", true, true);
			canvas.addEventListener("mouseup", function (e) {
				e.target.mouseEvent = null;
				evt.identifier = Infinity;
				evt.getPointerList = function() {
					return [e];
				};
				canvas.dispatchEvent(evt);
			}, false);
		})();
	
	})();

  // set props from options, but the defaults are for the cool kids
  ctxt.lineWidth = options.size || Math.ceil(Math.random() * 35);
  ctxt.lineCap = options.lineCap || "round";
  ctxt.pX = undefined;
  ctxt.pY = undefined;

  var lines = [,,];
  var offset = $(canvas).offset();

  var self = {
    //bind click events
    init: function() {
      //set pX and pY from first click
      canvas.addEventListener('pointerdown', self.preDraw, false);
      canvas.addEventListener('pointermove', self.draw, false);
    },

    preDraw: function(event) {
      var pointers = event.getPointerList();
      $.each(pointers, function(i, pointer) {

        var id      = pointer.identifier || 0, 
        colors  = ["red", "green", "yellow", "blue", "magenta", "orangered"],
        mycolor = colors[Math.floor(Math.random() * colors.length)];

        lines[id] = { x     : pointer.x - offset.left, 
          y     : pointer.y - offset.top, 
          color : mycolor
        };
      });

      event.preventDefault();
    },

    draw: function(event) {
      var e = event, hmm = {};
      var pointers = event.getPointerList();
      $.each(pointers, function(i, pointer) {
        var id = pointer.identifier || 0,
        moveX = pointer.x - offset.left - lines[id].x,
        moveY = pointer.y - offset.top - lines[id].y;

        var ret = self.move(id, moveX, moveY);
        lines[id].x = ret.x;
        lines[id].y = ret.y;
      });

      event.preventDefault();
    },

    move: function(i, changeX, changeY) {
      ctxt.strokeStyle = lines[i].color;
      ctxt.beginPath();
      ctxt.moveTo(lines[i].x, lines[i].y);

      ctxt.lineTo(lines[i].x + changeX, lines[i].y + changeY);
      ctxt.stroke();
      ctxt.closePath();

      return { x: lines[i].x + changeX, y: lines[i].y + changeY };
    }
  };

  return self.init();
};


$(function(){
  var super_awesome_multitouch_drawing_canvas_thingy = new CanvasDrawr({id:"example", size: 15 });
});

