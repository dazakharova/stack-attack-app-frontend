// Set the video play only once before the page is loaded completely
document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('gifVideo');
    video.loop = false;
    video.playbackRate = 0.9;

    // Listen for the video to end and then replace it with a static image
    video.onended = function() {
        // Replace the video with a static image
        const img = document.createElement('img');
        img.src = '../image/logo.png'; // Specify the source of your static image
        video.parentNode.replaceChild(img, video); // Replace the video with the image
    };
});

