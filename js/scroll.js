document.addEventListener("DOMContentLoaded", function() {
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
