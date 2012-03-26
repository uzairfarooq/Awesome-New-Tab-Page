/* Copyright 2008 Paul Bennett - http://paulicio.us
 * Scroller.js
 * Captures mouse wheel events and runs the ScrollSmoothly
 * function based on their output.
 * Aims to aid usability by allowing the user to scroll the 
 * page horizontally smoothly using only their mousewheel.
 * Mousewheel event capture by Adomas Paltanavičius at http://adomas.org/
 */

var hscroll = true;
$("#widget-drawer,#app-drawer,.edit-shortcut-ui,#options-ui,.ui-2").live({
  mouseenter: function() {
    hscroll = false;
  },
  mouseleave: function() {
    hscroll = true;
  }
});

 function handle(delta) {
  if (delta <0)
    ScrollSmoothly(10,10,'right');
  else if (delta >0)
    ScrollSmoothly(10,10,'left');
}

function wheel(event){
  if(hscroll === false) {
    return;
  }
  var delta = 0;
  if (!event) 
    event = window.event;
  if (event.wheelDelta) {
    delta = event.wheelDelta/120;
    if (window.opera)
      delta = -delta;
  } else if (event.detail) {
    delta = -event.detail/3;
  }
  if (delta)
    handle(delta);
  if (event.preventDefault)
    event.preventDefault();
  event.returnValue = false;
}

var repeatCount = 0;

function ScrollSmoothly(scrollPos,repeatTimes, direction) {
  if(repeatCount < repeatTimes)
    if(direction == 'right')
      window.scrollBy(15,0);
    else
      window.scrollBy(-15,0);
    else
    {
      repeatCount = 0;
      clearTimeout(cTimeout);
      return;
    }
    repeatCount++;
    cTimeout = setTimeout("ScrollSmoothly('" + scrollPos + "','"+ repeatTimes +"','"+ direction +"')",10);
  }

  /* Initialization code. */
  if (window.addEventListener) {
    window.addEventListener('DOMMouseScroll', wheel, false);
  }
  window.onmousewheel = document.onmousewheel = wheel;