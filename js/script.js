// Set the video play only once before the page is loaded completely
document.addEventListener('DOMContentLoaded', (event) => {
    // const video = document.getElementById('gifVideo');
    // video.loop = false;
    // video.playbackRate = 0.9;
    //
    // // Listen for the video to end and then replace it with a static image
    // video.onended = function() {
    //     // Replace the video with a static image
    //     const img = document.createElement('img');
    //     img.src = '../image/logo.png'; // Specify the source of your static image
    //     video.parentNode.replaceChild(img, video); // Replace the video with the image
    // };

    const urlParams = new URLSearchParams(window.location.search);
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
});




