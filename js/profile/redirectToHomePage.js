document.addEventListener('DOMContentLoaded', function() {
    // Get the links for headers according to their id
    let unloggedHeader = document.getElementById('unloggedHeader');
    let loggedHeader = document.getElementById('loggedHeader');

    // Hide the unlogged header and show the logged header
    if (unloggedHeader && loggedHeader) {
        unloggedHeader.style.display = 'none';
        loggedHeader.style.display = 'block';
    }

    // Add event listener to redirect to the homepage when clicking "Our Team" 
    let ourTeamLink = document.getElementById('ourTeamLink');
    if (ourTeamLink) {
        ourTeamLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            let homepageURL = window.location.origin + '/index.html#ourTeamSection'; // Get the homepage URL with anchor
            window.location.href = homepageURL; // Redirect the user to the homepage with anchor
        });
    }
    
    // Add event listener to redirect to the "How it works" section when clicking the corresponding link
    let howItWorksLink = document.getElementById('mainpageLink');
    if (howItWorksLink) {
        howItWorksLink.addEventListener('click', function(event) {
            event.preventDefault();
            let homepageURL = window.location.origin + '/index.html#howItWorksSection';
            window.location.href = homepageURL;
        });
    }
    
    // Add event listener to redirect to the "Feedback" section when clicking the corresponding link
    let feedbackLink = document.getElementById('feedbackLink');
    if (feedbackLink) {
        feedbackLink.addEventListener('click', function(event) {
            event.preventDefault();
            let homepageURL = window.location.origin + '/index.html#feedbackSection';
            window.location.href = homepageURL;
        });
    }
});
