// Display message if the user is not logged in
export function displayNotificationMessageAndRedirect(message) {
    const notificationMessageModal = document.getElementById('notification-message-modal')
    const notificationMessageParagraph = notificationMessageModal.querySelector('p')

    // Set message to notify about session expiration
    notificationMessageParagraph.textContent = message

    // Show redirection message
    notificationMessageModal.style.display = 'block'

    // Set a delay before redirecting to the homepage
    setTimeout(function() {
        notificationMessageModal.style.display = 'none'
        window.location.href = '/';
    }, 3000);
}

const handleHttpResponseError = (response) => {
    if (response.status === 401) {
        displayNotificationMessageAndRedirect('Your session has expired. Please log in again to continue.')
    } else {
        displayNotificationMessageAndRedirect('Something went wrong. Please try again.')
    }
    return null
}

const processNetworkError = (error) => {
    // Handle network errors or errors in processing the request
    console.error('Network error or error in processing the request:', error)
    displayNotificationMessageAndRedirect('An error occurred while fetching data. Please check your connection and try again.')
    return null
}

export { handleHttpResponseError, processNetworkError }