var scrolling = false;

// Adding scroll event listener
window.addEventListener('scroll', function() {
  scrolling = true;
  var navbar = document.querySelector('.navbar');
  var scrollTop = window.scrollY;

  if (scrollTop > 100) {
    navbar.classList.add('active');
  } else {
    navbar.classList.remove('active');
  }
});

// Using setTimeout instead of setInterval for gradually reducing opacity
var timeout;

window.addEventListener('scroll', function() {
  scrolling = true;
  clearTimeout(timeout);
  timeout = setTimeout(function() {
    if (scrolling) {
      scrolling = false;
      var navbar = document.querySelector('.navbar');
      navbar.classList.remove('active');
    }
  }, 600); // Delay of 600 milliseconds (0.6 seconds)
});





