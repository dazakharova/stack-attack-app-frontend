document.addEventListener("DOMContentLoaded", function () {
  // Get parent's container
  let spaceContainer = document.querySelector(".space-container");

  // Get "box" and "item2" elements
  let boxes = spaceContainer.querySelectorAll(".box, .item2");

  // set data-description attribute
  boxes.forEach(function (element) {
    element.setAttribute("data-description", "This is item description");
    element.setAttribute("data-title", "This is a title");
  });

  // Get the links for the elements of the modal window
  let modal = document.getElementById("modal");
  let elements = document.querySelectorAll(".box, .item2");

  // Add event listener for each element
  elements.forEach(function (element) {
    element.addEventListener("click", function () {
      // Display the modal window
      modal.style.display = "block";

      // Get the data from the current element
      let titleElement = element.querySelector(".title");
      let title =
        titleElement && titleElement.innerHTML.trim() !== ""
          ? titleElement.innerHTML
          : "Here should be my title";

      let imageElement = element.querySelector("img");
      let image = imageElement ? imageElement.src : ""; // Check if image exists

      // Get the links for the elements of the modal window after opening it
      let modalImage = document.getElementById("modal-image");
      let modalTitle = document.getElementById("modal-title");
      let modalDescription = document.getElementById("modal-description");

      // Set the data in the modal window
      modalTitle.textContent = title;
      modalImage.src = image;
      modalDescription.textContent = description;
    });
  });

  // Close the modal window when the close button is clicked
  let closeButton = document.querySelector(".close");
  if (closeButton) {
    closeButton.onclick = function () {
      modal.style.display = "none";
    };
  }

  // Close the modal window if the user clicks outside of it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Hide the modal initially
  modal.style.display = "none";
});
