function showNotification() {
    const notification = document.createElement('p')
    notification.textContent = 'No room selected. Please select a room to proceed.'

    // Get the div where the message will be displayed
    const  locationInfoDiv = document.getElementById('location-info');

    // Clean up the location path div
    locationInfoDiv.innerHTML = '';
    // Append the message to the div
    locationInfoDiv.appendChild(notification);
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

export { showNotification, displayNotificationMessage }