document.addEventListener('DOMContentLoaded', (event) => {
  const BACKEND_ROOT_URL = "https://stack-attack-backend.onrender.com";
  const registrationForm = document.getElementById("registrationForm");
  const signupModal = document.getElementById("signupModal");
  const signupLink = document.getElementById("signupLink");
  const closeButton = document.getElementsByClassName("close")[0];

  signupLink.onclick = function (event) {
    event.preventDefault();
    // When the user clicks on the button, open the modal
    signupModal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  // When the user clicks on <span> (x), close the modal
  closeButton.onclick = function () {
    signupModal.style.display = "none";
    document.body.style.overflow = "auto"; // Enable scrolling

    // Remove all the warning messages if there is one
    removeWeakPasswordMessage();

    // Reset form input fields
    resetInputFields();
  }

  document.getElementById("switchToLogin").onclick = function () {
    signupModal.style.display = "none";
    document.body.style.overflow = "auto";
    document.getElementById("loginModal").style.display = "block";
    document.body.style.overflow = "hidden";
  };


  registrationForm.onsubmit = function (event) {
    //
    event.preventDefault(); // prevent default

    const nameInput = document.getElementById("registerName");
    const emailInput = document.getElementById("registerEmail")
    const passwordInput = document.getElementById("registerPassword");

    const name = nameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    // Remove weak password message if there is one while changing password
    passwordInput.onfocus = removeWeakPasswordMessage;

    //regex for password
    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&!])[A-Za-z\d@#$%^&!]{8,}$/;

    // regex to check password
    // "Password must be at least 8 characters long and include at least one letter, one number, and one special character (e.g., @, #, $, %)."
    if (!passwordRegex.test(password)) {
      document.getElementById("weak-password-message").style.display = "block";
      return; // interrupt the code
    }

    // in case of successfull check
    sendDataToBackend(BACKEND_ROOT_URL, name, email, password);
  };
});

function sendDataToBackend(BACKEND_ROOT_URL, name, email, password) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  };

  fetch(BACKEND_ROOT_URL + "/auth/register", requestOptions)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      const successRegistrationModal = document.getElementById('success-login-modal')

      // Close sign up window
      signupModal.style.display = 'none'

      const newUserNameSpan = successRegistrationModal.querySelector('#user-name')
      newUserNameSpan.textContent = json.name

      // Show success message window
      successRegistrationModal.style.display = 'block'

      // Close successful registration message modal once close button is clicked
      document.querySelector('#success-login-modal .close').onclick = () => {
        successRegistrationModal.style.display = 'none'
      }
    })
    .catch((error) => {
      console.error("Error: ", error);
    });
}

const resetInputFields = () => {
  document.getElementById("registerName").value = '';
  document.getElementById("registerEmail").value = '';
  document.getElementById("registerPassword").value = '';
}

const removeWeakPasswordMessage = () => {
  if (document.getElementById("weak-password-message").style.display === "block") {
    document.getElementById("weak-password-message").style.display = "none";
  }
}