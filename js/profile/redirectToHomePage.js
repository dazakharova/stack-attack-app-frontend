import { isAuthenticated } from "./utils/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // Get links to the specific sections of the homepage
    const links = document.querySelectorAll('.section')
    links.forEach(link => {
        // Sending auth query inside url while accessing navigations links
        // And dynamically display homepage header according to the user authentication status
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


