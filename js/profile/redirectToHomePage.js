import { isAuthenticated } from "./utils/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const howItWorksLink = document.getElementById('mainpageLink');
    const ourTeamLink = document.getElementById('ourTeamLink');
    const feedbackSection = document.getElementById('feedbackLink');

    const links = [howItWorksLink, ourTeamLink, feedbackSection];

    links.forEach(link => {
        link.onclick = async (event) => {
            event.preventDefault(); // Prevent default link behavior
            const authStatus = await isAuthenticated();
            const destination = '../index.html';
            const sectionToScrollTo = `${link.getAttribute('data-href')}`// Original destination
            const authQuery = authStatus ? "?auth=logged" : "?auth=unlogged"; // Append authentication status
            window.location.href = `${destination}${authQuery}${sectionToScrollTo}`; // Navigate with authentication status
        }
    })
})