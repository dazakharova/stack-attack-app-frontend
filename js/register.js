const BACKEND_ROOT_URL = "http://localhost:3001";
const registrationForm = document.getElementById("registrationForm");
const modal = document.getElementById("signupModal");
const btn = document.getElementById("signupLink");
const span = document.getElementsByClassName("close")[0];

// registration (put into header)
const signupLink = document.getElementById("signupLink");

signupLink.addEventListener("click", function (event) {
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

// Find a button to close the form and add the event to close it
document
  .getElementById("closeRegistrationForm")
  .addEventListener("click", function () {
    document.getElementById("registrationForm").style.display = "none";
    document.querySelector(".overlay-registration").style.display = "none";
  });

registrationForm.addEventListener("submit", function (event) {
  //
  event.preventDefault(); // prevent default

  const usernameInput = document.getElementById("registerUsername");
  const passwordInput = document.getElementById("registerPassword");

  const username = usernameInput.value;
  const password = passwordInput.value;

  //regex for username
  const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;

  //regex for password
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&!])[A-Za-z\d@#$%^&!]{8,}$/;

  // regex to check username:
  //"Username must be at least 4 characters long and can only include letters (a-z, A-Z), numbers (0-9), and underscores (_).
  if (!usernameRegex.test(username)) {
    alert("Please choose a new username");
    return; // interrupt the code
  }
  //regex to check password
  //"Password must be at least 8 characters long and include at least one letter, one number, and one special character (e.g., @, #, $, %)."
  if (!passwordRegex.test(password)) {
    alert("Please create a more secure password");
    return; // interrupt the code
  }
  //in case of succesfull check
  sendDataToBackend(username, password);
});

function sendDataToBackend(username, password) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  };

  fetch(BACKEND_ROOT_URL + "/auth/register", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success: ", data);
      console.log("Data successfully sent to the backend");
    })
    .catch((error) => {
      console.error("Error: ", error);
      console.error("An error occurred while sending data to the backend");
    });
}
