// Function to save the path to the image in local storage
function saveSelectedPictureToLocalStorage (imgSrc) {
  localStorage.setItem ('selectedPictureSrc', imgSrc);

  // Update the image in the menu immediately after saving
  let smallMenuImage = document.querySelector ('.fixed-dropdown-container img');
  smallMenuImage.src = imgSrc;
}

// Event handler for clicking on the image
function imageClickHandler (event) {
  let imgSrc = event.target.src;
  saveSelectedPictureToLocalStorage (imgSrc);
}

// Event handler for DOMContentLoaded event
document.addEventListener ('DOMContentLoaded', function () {
  // Get a reference to the "New picture..." button
  let newPictureBtn = document.getElementById ('new-picture-btn');

  // Add event listener for click on the "New picture..." button
  newPictureBtn.addEventListener ('click', function () {
    // Get a reference to the modal window
    let pictureModal = document.getElementById ('picture-modal');

    // Show the modal window
    pictureModal.style.display = 'block';
  });

  // Get all elements of image options
  let imageOptions = document.querySelectorAll ('.image-option');

  // Iterate over each element and add event listener for click
  imageOptions.forEach (function (option) {
    option.addEventListener ('click', function () {
      let imgSrc = option.src;
      let currentPicture = document.getElementById ('current-picture');
      currentPicture.src = imgSrc;
    });
  });

  // Add click event handler for each image option
  imageOptions.forEach (function (option) {
    option.addEventListener ('click', imageClickHandler);
  });

  // Try to load the selected image from local storage when the page loads
  loadSelectedPictureFromLocalStorage ();

  // Save button event handler
  document.getElementById ('save-picture-btn').onclick = function () {
    saveSelectedPictureToLocalStorage (
      document.getElementById ('current-picture').src
    );
  };
});

////test in case when we don't have imiges
function loadSelectedPictureFromLocalStorage() {
  var selectedPictureSrc = localStorage.getItem("selectedPictureSrc");
  if (selectedPictureSrc) {
    var smallMenuImage = document.querySelector(".fixed-dropdown-container img");
    smallMenuImage.src = selectedPictureSrc;
    document.getElementById("current-picture").src = selectedPictureSrc; // 
  } else {
    //
    var smallMenuImage = document.querySelector(".fixed-dropdown-container img");
    smallMenuImage.style.display = "none";
  }
}