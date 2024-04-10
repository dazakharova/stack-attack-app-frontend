document.addEventListener("DOMContentLoaded", function () {
  //search for the login form
  const loginForm = document.getElementById("loginForm");
  const modal = document.getElementById("loginModal");
  const loginLink = document.getElementById("loginLink");
  const closeButton = document.getElementsByClassName("close")[1];
  
  loginLink.addEventListener("click", function (event) {
    event.preventDefault();
    // When the user clicks on the button, open the modal
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling
  });

  // When the user clicks on <span> (x), close the modal
  closeButton.onclick = function() {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Enable scrolling
  }

  // When the user clicks to switch to SignUp
  document.getElementById("switchToSignup").addEventListener("click", function() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    document.getElementById("signupModal").style.display = "block";
    document.body.style.overflow = "hidden";
  })

  loginForm.addEventListener("submit", function (event) {
    //
    event.preventDefault(); // prevent default


    // get the links of the inputs
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    // get the values and delete spaces
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    //check if username is empty
    if (email === "") {
      console.log("E-mail field can not be empty");
      return; // interrupt
    }
    //check if password is empty
    if (password === "") {
      alert("Password field can not be empty");
      return; // interrupt
    }

    // an object with the data to send to a server
    const data = {
      email: email,
      password: password,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: 'include'
    };
    
    emailInput.value = "";
    passwordInput.value = "";

    // send to server
    fetch(BACKEND_ROOT_URL + "/auth/login", options)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          // In success case fetch containers and items from the server
          console.log("Data sent successfully!");
          window.location.href = 'pages/profile.html';
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
  });
});



