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

export { showNotification }