import {UserProfileService} from "../class/UserProfileService.js";
const backend_url = 'http://localhost:3001'

const userSettings = new UserProfileService(backend_url)

// Function to extract the image name from a URL
function extractImageName(imgSrc) {
  const urlParts = imgSrc.split('/');
  return urlParts[urlParts.length - 1];  // Returns the last segment after the last '/'
}

// Function to save the path to the image in local storage and update the displayed image
function saveSelectedPictureToLocalStorage(imgSrc) {
  const imageName = extractImageName(imgSrc);
  localStorage.setItem('selectedPictureSrc', imageName);
  updateImagesInUI(imageName);
}

// Function to update images in the UI wherever needed
function updateImagesInUI(imageName) {
  console.log("Got image ", imageName)
  const imagePath = `../image/avatars/${imageName}`;
  let smallMenuImage = document.querySelector('.fixed-dropdown-container img');
  let currentPicture = document.getElementById('current-picture');
  smallMenuImage.src = imagePath;
  currentPicture.src = imagePath;

  let saveSelectedPictureBtn = document.getElementById('save-picture-btn');

  // Save the selected picture to local storage and update the profile picture on server
  saveSelectedPictureBtn.onclick = function () {
    updateProfilePicture(extractImageName(imagePath)).then(() => {
      saveSelectedPictureToLocalStorage(imagePath);
    })

  };
}

// Initialize event listeners once the DOM content has fully loaded
document.addEventListener('DOMContentLoaded', function () {
  loadProfilePictureFromServer().then(() => {
    loadSelectedPictureFromLocalStorage();
    initializeEventListeners();
  })

});

// Initialize all relevant event listeners
function initializeEventListeners() {
  let newPictureBtn = document.getElementById('new-picture-btn');
  let imageOptions = document.querySelectorAll('.image-option');

  // Show modal on new picture button click
  newPictureBtn.onclick = function () {
    let pictureModal = document.getElementById('picture-modal');
    pictureModal.style.display = 'block';
  };

  // Add click listeners to all image options to update the current picture preview
  imageOptions.forEach(option => {
    option.onclick = () => {
      updateImagesInUI(extractImageName(option.src));
    };
  });

}

// Function to load the selected picture from local storage upon page load
function loadSelectedPictureFromLocalStorage() {
  const imageName = localStorage.getItem('selectedPictureSrc');
  if (imageName) {
    updateImagesInUI(imageName);
  } else {
    document.querySelector('.fixed-dropdown-container img').src = '../image/avatars/grey_backround.png'
  }
}

// Function to update the profile picture on the server
async function updateProfilePicture(imageName) {
  try {
    const response = await userSettings.setProfilePicture(imageName)
    loadSelectedPictureFromLocalStorage()
    document.getElementById('picture-modal').style.display = 'none';
  } catch (error) {
    console.error(error)
  }
}

async function loadProfilePictureFromServer() {
  try {
    const profilePictureName = await userSettings.fetchProfilePicture()
    if (profilePictureName) {
      localStorage.setItem('selectedPictureSrc', profilePictureName)
    }
  } catch (error) {
    console.error(error)
  }
}