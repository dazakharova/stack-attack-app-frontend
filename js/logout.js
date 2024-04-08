const logoutLink = document.getElementById("logoutLink");

logoutLink.addEventListener("click", function (event) {
event.preventDefault();
logoutUser();
});

function logoutUser() {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
  };


  fetch(BACKEND_ROOT_URL + "/auth/logout", requestOptions)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // 
    window.location.href = 'http://127.0.0.1:5500/'; 
  })
  .catch((error) => {
    console.error("Error: ", error);
    console.error("An error occurred while logging out");
  });

}
