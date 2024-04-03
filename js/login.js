document.addEventListener("DOMContentLoaded", function () {
  //search for the login form
  const loginForm = document.getElementById("loginForm");
  const modal = document.getElementById("loginModal");
  const btn = document.getElementById("loginLink");
  const span = document.getElementsByClassName("close")[0];
 
  const loginLink = document.getElementById("loginLink");
  
  loginLink.addEventListener("click", function (event) {
    event.preventDefault();
    
    // When the user clicks on the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent scrolling
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // Enable scrolling
}
 
});
// Find a button to close the login form and add the event to close it
document.querySelector(".closeLoginForm").addEventListener("click", function () {
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // Enable scrolling
});

  loginForm.addEventListener("submit", function (event) {
    //
    event.preventDefault(); // prevent default


    // get the links of the inputs
    const usernameInput = document.getElementById("loginUsername");
    const passwordInput = document.getElementById("loginPassword");

    // get the values and delete spaces
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    //check if username is empty
    if (username === "") {
      console.log("Username field can not be empty");
      return; // interrupt
    }
    //check if password is empty
    if (password === "") {
      alert("Password field can not be empty");
      return; // interrupt
    }

    // an object with the data to send to a server
    const data = {
      username: username,
      password: password,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

});

    // send to server
    fetch(BACKEND_ROOT_URL + "/auth/login", options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("Data sent successfully!");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  });

