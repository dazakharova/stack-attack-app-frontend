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

  // Retrieve change password form
  const changePasswordForm = document.getElementById("changePasswordForm")


  const newPasswordInput = document.getElementById('newPassword')
  // If weak password message is displayed, then hide it once new password input is focused
  newPasswordInput.onfocus = () => {
    if (document.getElementById('weak-password-message')) {
      document.getElementById('weak-password-message').style.display = 'none'
    }
  }

  changePasswordForm.onsubmit = async (event) => {
    event.preventDefault()

    // Retrieve current and new password values
    let currentPassword = document.getElementById("currentPassword").value
    let newPassword = document.getElementById("newPassword").value

    //regex for password
    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&!])[A-Za-z\d@#$%^&!]{8,}$/;

    // regex to check password
    // "Password must be at least 8 characters long and include at least one letter, one number, and one special character (e.g., @, #, $, %)."
    if (!passwordRegex.test(newPassword)) {
      document.getElementById('weak-password-message').style.display = 'block'
      return // interrupt the code
    }

    try {
      // Send request to the server with new data
      const result = await userSettings.changePassword(currentPassword, newPassword)

      // Clean input fields
      document.getElementById("currentPassword").value = ''
      document.getElementById("newPassword").value = ''

      if (!result.success) {
        const invalidPasswordMessageParagraph = document.getElementById('invalid-password-message')
        invalidPasswordMessageParagraph.style.display = 'block'
        setTimeout(() => {
          invalidPasswordMessageParagraph.style.display = 'none'
        }, 3000)
      } else {
        document.getElementById("changePasswordModal").style.display = 'none'
        displayNotificationMessage('Password was changed successfully!')
      }
    } catch (error) {
      document.getElementById("changePasswordModal").style.display = 'none'
      displayNotificationMessage('Something went wrong. Please try again later.')
      console.error(error)
    }
  }

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

function showChangePasswordModal() {
  const changePasswordModal = document.getElementById("changePasswordModal");
  changePasswordModal.classList.add("show");
  changePasswordModal.style.display = "block";
}

const changePasswordLink = document.getElementById("change-password-menu");
if (changePasswordLink) {
  changePasswordLink.onclick = function(e) {
    e.preventDefault();
    showChangePasswordModal();
  };
}

const displayNotificationMessage = (message) => {
  const notificationMessageModal = document.getElementById('notification-message-modal')
  const notificationMessageParagraph = notificationMessageModal.querySelector('p')

  // Set message to notify about session expiration
  notificationMessageParagraph.textContent = message

  // Show redirection message
  notificationMessageModal.style.display = 'block'

  // Set a delay before redirecting to the homepage
  setTimeout(function() {
    notificationMessageModal.style.display = 'none'
  }, 3000);
}
