document.addEventListener('DOMContentLoaded', (event) => {

    document.getElementById('current-year').textContent = new Date().getFullYear().toString();


    const urlParams = new URLSearchParams(window.location.search)

    if (urlParams.size === 0) {
        checkAuthenticationStatus().then(isAuthenticated => {
            displayRelevantHeader(isAuthenticated);
        })
    } else {
        const authStatus = urlParams.get('auth');
        let loggedHeader = document.getElementById('loggedHeader');
        let unloggedHeader = document.getElementById('unloggedHeader');

        if (authStatus === 'logged') {
            loggedHeader.classList.remove('header-hidden')
            loggedHeader.classList.add('header-active')

            unloggedHeader.classList.add('header-hidden')
            unloggedHeader.classList.remove('header-active')
        } else {
            unloggedHeader.classList.remove('header-hidden')
            unloggedHeader.classList.add('header-active')

            loggedHeader.classList.add('header-hidden')
            loggedHeader.classList.remove('header-active')
        }

        // Optional: Smooth scroll to the hash fragment if it exists
        if (window.location.hash) {
            const id = window.location.hash.slice(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }


    // Find profile link in the header
    const profileLink = document.getElementById("profilePageLink")

    if (profileLink) {
        profileLink.addEventListener('click', (event) => {
            // Prevent the default link behavior
            event.preventDefault();

            // Check if the user is authenticated
            isAuthenticated().then(isAuth => {
                if (isAuth) {
                    // User is authenticated, redirect to the profile page
                    window.location.href = '/pages/profile.html';
                } else {
                    // User is not authenticated, handle accordingly (e.g., redirect to login page)
                    displayNotificationMessage('Please log in to access your profile.');
                }
            });
        });
    }
});

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


function checkAuthenticationStatus() {
    // This function makes a fetch request to the server-side endpoint that checks authentication
    return fetch(`${backend_url}/auth/status`,{
        method: 'GET',
        credentials: 'include'
    })
        .then(response => response.json())
        .then(data => data.isAuthenticated)
        .catch(error => {
            console.error('Error checking authentication status:', error);
            return false; // Assume not authenticated on error
        });
}

function displayRelevantHeader(isAuthenticated) {
    const loggedHeader = document.getElementById('loggedHeader');
    const unloggedHeader = document.getElementById('unloggedHeader');
    if (isAuthenticated) {
        loggedHeader.classList.remove('header-hidden')
        loggedHeader.classList.add('header-active')

        unloggedHeader.classList.add('header-hidden')
        unloggedHeader.classList.remove('header-active')
    } else {
        unloggedHeader.classList.remove('header-hidden')
        unloggedHeader.classList.add('header-active')

        loggedHeader.classList.add('header-hidden')
        loggedHeader.classList.remove('header-active')
    }
}

function displayNotificationMessage(message) {
    const notificationMessageModal = document.getElementById('notification-message-modal');
    const notificationMessageParagraph = notificationMessageModal.querySelector('p');

    // Set message to notify about session expiration
    notificationMessageParagraph.textContent = message;

    // Show redirection message
    notificationMessageModal.style.display = 'block';

    // Set a delay before redirecting to the homepage
    setTimeout(function() {
        notificationMessageModal.style.display = 'none';
    }, 3000);
}