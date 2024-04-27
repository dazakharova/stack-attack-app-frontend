document.addEventListener("DOMContentLoaded", function() {

  // Find the logged header
  const loggedHeader = document.getElementById("loggedHeader");

  let lastScrollTop = 0;
  let scrollingTimer;
  let isScrollingDown = true;

  window.addEventListener('scroll', function() {
    clearTimeout(scrollingTimer);

    const currentScroll = window.scrollY;

    if (currentScroll > lastScrollTop) {
      // Scroll down
      isScrollingDown = true;
    } else {
      // Scroll up
      isScrollingDown = false;
    }

    if (isScrollingDown || currentScroll === 0) {
      loggedHeader.style.opacity = 0;
    } else {
      loggedHeader.style.opacity = 1;
    }

    lastScrollTop = currentScroll;

    scrollingTimer = setTimeout(function() {
      loggedHeader.style.opacity = 1;
    }, 200);
  });
});
