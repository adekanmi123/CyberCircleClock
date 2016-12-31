const CIRCLE_NUMBER = 5;
const DASHARRAYS = [43, 69, 136, 212, 500, 618, 1400];
const COLORS = [
  '#2ecc71',
  '#d35400',
  '#9b59b6',
  '#3498db',
  '#e74c3c',
  '#34495e',
  '#bdc3c7',
  '#398ec1',
  '#95a5a6',
  '#1d297e',
  '#ffa721',
  '#ea9eff',
];
const STROCKS = [2, 3, 11, 5, 16, 3, 12, 7, 15, 14];
const Z_PADDING = 50;
const SHRINKING = 0.7
const FLOAT_RESTRICT = 40;
const SPEED = [5000, 10000];
const ANIMATIONS = ['spin', 'spin-back'];
const WIDTH = 300;

var screenCenter = {
  X: document.body.clientWidth / 2,
  Y: document.body.clientHeight / 2,
};
$( window ).resize(function() {
  screenCenter = {
    X: document.body.clientWidth / 2,
    Y: document.body.clientHeight / 2,
  }
});

jQuery(function($) {
  const circles = [];
  for (var i = 0; i < CIRCLE_NUMBER; i++) {
    $('#circles').append('<svg id="circle-'+ i +'"></svg>');
    
    circles.push(new Circle(i));
  }
  
  // Follow the mouse
  let freeMode = false;
  $(document).on('mousemove', (e) => {
    if (freeMode) {
        return;
    }
  
    let mouseX = e.originalEvent.x;
    let mouseY = e.originalEvent.y;
    
    // Change to centerPoint.left/top/right/bottom
    var rotateY = accurate((mouseX - screenCenter.X) / screenCenter.X) * 45;
    var rotateX = -accurate((mouseY - screenCenter.Y) / screenCenter.Y) * 45;
    
    rotates(rotateX, rotateY);
  });
  $(document).on('click', () => { freeMode = !freeMode; });
  setInterval(() => {
    if (!freeMode) {
        return;
    }
  
    let str = circles[0].element.attr('style');
    let rotateX = +str.match(/rotateX\(([-0-9\.]+?)deg\)/)[1] + ((Math.random() - 0.5) / 5);
    let rotateY = +str.match(/rotateY\(([-0-9\.]+?)deg\)/)[1] + ((Math.random() - 0.5) / 5);
  
    rotates(rotateX, rotateY);
  }, 100);
  
  $('#circles').css('zoom', 1.5);
  $(document).on('mousewheel', (e) => {
    let event = e.originalEvent;
    let zoom = +$('#circles').css('zoom');
    if (event.wheelDelta > 0 || event.detail < 0) {
        if (zoom < 2) {
            $('#circles').css('zoom', zoom + 0.02);
        }
    }
    else {
        if (zoom > 1) {
            $('#circles').css('zoom', zoom - 0.02);
        }
    }
  });
  
  function rotates(rotateX, rotateY) {
    circles.forEach((circle, i) => {
      circle.element.css('transform', 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(' + (i * Z_PADDING) + 'px)');
    });
  }
  
  // Randomly change circles
  setInterval(() => {
    spoof(circles.random());
    spoof(circles.random());
  }, 5000);
  function spoof(circle) {
    circle.element
      .animate({opacity: 0}, 800)
      .promise().then(() => {
        circle.makeCircle();
        circle.element
          .animate({opacity: 1}, 800);
      });
  }
});

// useful
function accurate(x) {
  return -Math.sin(x * Math.PI/2 + Math.PI);
}
Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

// Circle class
function Circle(id) {
  this.id = id;
  this.snap = Snap('#circle-' + id);
  this.element = $('#circle-' + id);
  
  var width = Math.pow(SHRINKING, id) * WIDTH;
  this.snap.attr({
    viewBox: '0 0 100 100',
  });
  this.element.css({
    width: width,
    margin: -width / 2,
    transform: 'rotateX(27deg) rotateY(-27deg) translateZ(' + (id * Z_PADDING) + 'px)',
  });
  
  this.makeCircle();
}

Circle.prototype.makeCircle = function() {
  if (this.circle) {
    this.circle.remove();
  }
  
  // Randomise Width
  var width = Math.pow(SHRINKING, this.id) * WIDTH + (_.random(FLOAT_RESTRICT) - (FLOAT_RESTRICT / 2));
  this.element.css({
    width: width,
    margin: -width / 2,
  });
  
  this.circle = this.snap.circle(50, 50, 42);
  this.circle.attr({
    fill: 'none',
    stroke: COLORS.random(),
    strokeWidth: STROCKS.random() / this.id,
    strokeDasharray: DASHARRAYS.random() + '',
    'vector-effect': 'non-scaling-stroke',
  });
  $(this.circle.node).css({
    'animation-duration':  _.random.apply(null, SPEED) +'ms',
    'animation-name': ANIMATIONS.random(),
  });
};
