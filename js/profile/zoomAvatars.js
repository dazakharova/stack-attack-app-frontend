// Get all elements with the class "image-option"
const imageOptions = document.querySelectorAll('.image-option');

// Get the reference to the zoomed image
const currentPicture = document.getElementById('current-picture');

// For each image, set a mouseover event handler
imageOptions.forEach(imageOption => {
  imageOption.addEventListener('mouseover', function() {
    // Replace the image in #current-picture with the hovered image
    currentPicture.src = this.src;
  });
});
