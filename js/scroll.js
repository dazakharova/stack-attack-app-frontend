/*document.addEventListener("DOMContentLoaded", function() {
  // Find the link to Our Team
  const ourTeamLink = document.querySelector("nav .navbar_nav li:nth-child(1) a");

  // Find the link to Feedback
  const feedbackLink = document.querySelector("nav .navbar_nav li:nth-child(2) a");

  // Function to scroll to the specified section
  function scrollToSection(section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }

  // Add event listener for clicking on the Our Team link
  ourTeamLink.addEventListener("click", function(event) {
    event.preventDefault();
    const ourTeamSection = document.querySelector(".ourTeam");
    scrollToSection(ourTeamSection);
  });

  // Add event listener for clicking on the Feedback link
  feedbackLink.addEventListener("click", function(event) {
    event.preventDefault();
    const feedbackSection = document.querySelector(".feedback");
    scrollToSection(feedbackSection);
  });
});
*/




document.addEventListener("DOMContentLoaded", function() {
  // Find the link to Our Team
  const ourTeamLink = document.querySelector("nav .navbar_nav li:nth-child(1) a");

  // Find the link to Feedback
  const feedbackLink = document.querySelector("nav .navbar_nav li:nth-child(2) a");

  // Find the logged header
  const loggedHeader = document.getElementById("loggedHeader");

  // Function to scroll to the specified section
  function scrollToSection(section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }

  // Add event listener for clicking on the Our Team link
  ourTeamLink.addEventListener("click", function(event) {
    event.preventDefault();
    const ourTeamSection = document.querySelector(".ourTeam");
    scrollToSection(ourTeamSection);
  });

  // Add event listener for clicking on the Feedback link
  feedbackLink.addEventListener("click", function(event) {
    event.preventDefault();
    const feedbackSection = document.querySelector(".feedback");
    scrollToSection(feedbackSection);
  });

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
