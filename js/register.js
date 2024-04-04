const BACKEND_ROOT_URL = "http://localhost:3001";
const registrationForm = document.getElementById("registrationForm");
const modal = document.getElementById("signupModal");
const signupLink = document.getElementById("signupLink");
const closeButton = document.getElementsByClassName("close")[0];

signupLink.addEventListener("click", function (event) {
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

  document.getElementById("switchToLogin").addEventListener("click", function () {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    document.getElementById("loginModal").style.display = "block";
    document.body.style.overflow = "hidden";
  });


registrationForm.addEventListener("submit", function (event) {
  //
  event.preventDefault(); // prevent default

  const nameInput = document.getElementById("registerName");
  const emailInput = document.getElementById("registerEmail")
  const passwordInput = document.getElementById("registerPassword");

  // const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  //regex for password
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&!])[A-Za-z\d@#$%^&!]{8,}$/;

  //regex to check password
  //"Password must be at least 8 characters long and include at least one letter, one number, and one special character (e.g., @, #, $, %)."
  // if (!passwordRegex.test(password)) {
  //   alert("Please create a more secure password");
  //   return; // interrupt the code
  // }
  //in case of succesfull check
  sendDataToBackend(email, password);
});

function sendDataToBackend(email, password) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
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
