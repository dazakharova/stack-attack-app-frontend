const BACKEND_ROOT_URL = 'https://stack-attack-backend.onrender.com'
document.addEventListener("DOMContentLoaded", function() {
  const logoutLink = document.getElementById("logoutLink");

  logoutLink.onclick = function (event) {
    event.preventDefault();
    logoutUser();
  };
});

function logoutUser() {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    credentials: 'include'
  };


  fetch(BACKEND_ROOT_URL + "/auth/logout", requestOptions)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    return response.json()
  })
    .then(data => {
        sessionStorage.clear();
        // Clear local storage
        localStorage.clear()
        // Redirect the user to the homepage
        window.location.href = '/'
    })
  .catch((error) => {
    console.error("Error: ", error)
    console.error("An error occurred while logging out")
  })

}
