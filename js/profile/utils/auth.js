const backend_url = 'https://stack-attack-backend.onrender.com'

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

export { isAuthenticated }