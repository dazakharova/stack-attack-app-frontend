document.addEventListener('DOMContentLoaded', function() {
  // check whether logged in or not
  let userLoggedIn = true; 

  // get the links for headers according to their id
  let unloggedHeader = document.getElementById('unloggedHeader');
  let loggedHeader = document.getElementById('loggedHeader');

  // if the user is not logged in, show the 1st header and hide the 2nd
  if (!userLoggedIn) {
    if (unloggedHeader && loggedHeader) {
      unloggedHeader.style.display = 'block';
      loggedHeader.style.display = 'none';
    }
  } else {
    // of the user is logged in, show the 2ns and hide the 1st
    if (unloggedHeader && loggedHeader) {
      unloggedHeader.style.display = 'none';
      loggedHeader.style.display = 'block';
    }
  }

  // add event listener to redirect to homepage clicking"Our Team" 
  let ourTeamLink = document.getElementById('ourTeamLink');
  if (ourTeamLink) {
    ourTeamLink.addEventListener('click', function(event) {
      event.preventDefault(); 
      let homepageURL = window.location.origin + '/index.html#ourTeamSection'; //get the url for home page with anchor 
      window.location.href = homepageURL; // redirect user to the homepage with anchor 
    });
  }
  
  //how it works section
  let howItWorksLink = document.getElementById('mainpageLink');
  if(howItWorksLink){
    howItWorksLink.addEventListener('click', function(event){
      event.preventDefault();
      let homepageURL = window.location.origin +'/index.html#howItWorksSection';
      window.location.href = homepageURL;
    })
  }
//the same with the feedback
  let feedbackLink = document.getElementById('feedbackLink');
  if(feedbackLink){
    feedbackLink.addEventListener('click', function(event){
      event.preventDefault();
      let homepageURL = window.location.origin + '/index.html#feedbackSection';
      window.location.href = homepageURL;
    })
  }
});
