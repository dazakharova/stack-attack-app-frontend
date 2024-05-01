document.addEventListener("DOMContentLoaded", function () {
  //search for the login form
  const loginForm = document.getElementById("loginForm");
  const loginModal = document.getElementById("loginModal");
  const loginLink = document.getElementById("loginLink");
  const closeButton = document.getElementsByClassName("close")[1];

  const BACKEND_ROOT_URL = 'https://stack-attack-backend.onrender.com'
  
  loginLink.onclick = function (event) {
    event.preventDefault();
    // When the user clicks on the button, open the modal
    loginModal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  // When the user clicks on <span> (x), close the modal
  closeButton.onclick = function() {
    loginModal.style.display = "none";
    document.body.style.overflow = "auto"; // Enable scrolling

    // Reset input fields
    resetLoginInputFields();

    // Remove invalid credentials message if there is one
    removeInvalidCredentialsMessage();
  }

  // When the user clicks to switch to SignUp
  document.getElementById("switchToSignup").onclick = function() {
    loginModal.style.display = "none";
    document.body.style.overflow = "auto";
    document.getElementById("signupModal").style.display = "block";
    document.body.style.overflow = "hidden";
  }

  loginForm.onsubmit = function (event) {
    //
    event.preventDefault(); // prevent default


    // get the links of the inputs
    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    // Remove invalid credentials message once input field are focused
    emailInput.onfocus = removeInvalidCredentialsMessage;
    passwordInput.onfocus = removeInvalidCredentialsMessage;

    // get the values and delete spaces
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

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

    // send to server
    fetch(BACKEND_ROOT_URL + "/auth/login", options)
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errData) => {
              // Handle the error message
              if (response.status === 401) {
                if (errData.message === 'Invalid username') {
                  displayInvalidCredentialsMessage("Invalid Email: Please check your email address.")
                  throw new Error("Invalid credentials");
                } else if (errData.message === 'Invalid password') {
                  displayInvalidCredentialsMessage("Invalid Password: Please check your password.");
                  throw new Error("Invalid credentials");
                }
              } else {
                console.error("There was a problem with the request:", errData.message);
                throw new Error(errData.message);
              }
            });
          }
          return response.json(); // For successful responses, parse as JSON.
        })
        .then((data) => {
          if (data.token) {
            sessionStorage.setItem('token', data.token);

            // Reset input fields
            resetLoginInputFields();

            // Close login form window
            loginModal.style.display = "block";

            // Redirect user to their profile page
            window.location.href = 'pages/profile.html';
          } else {
            throw new Error(data.message || 'Failed to login');
          }
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
  };
});

const removeInvalidCredentialsMessage = () => {
  const invalidCredentialsMessage = document.getElementById("invalid-credentials-message");
  if (invalidCredentialsMessage) {
    invalidCredentialsMessage.style.display = "none";
  }
}

const displayInvalidCredentialsMessage = (message) => {
  const invalidCredentialsMessage = document.getElementById("invalid-credentials-message");
  invalidCredentialsMessage.textContent = message;

  // Show the message
  invalidCredentialsMessage.style.display = "block";
}

const resetLoginInputFields = () => {
  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
}
