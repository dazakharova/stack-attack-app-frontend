const backend_url = 'http://localhost:3001'
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault(); // Prevent default link behavior
            const authStatus = await isAuthenticated();
            const destination = '../index.html';
            const sectionToScrollTo = link.getAttribute('href')// Original destination
            const authQuery = authStatus ? "?auth=logged" : "?auth=unlogged"; // Append authentication status
            window.location.href = `${destination}${authQuery}${sectionToScrollTo}`; // Navigate with authentication status
        });
    });
})

// Function to check if the user is authenticated
function isAuthenticated() {
    return fetch(`${backend_url}/auth/status`, {
        method: 'GET',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => data.isAuthenticated)
        .catch(error => {
            console.error('Error:', error);
            return false;
        });
}
