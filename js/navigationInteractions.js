document.addEventListener("DOMContentLoaded", function() {

    // Find the logged header
    const loggedHeader = document.getElementById("loggedHeader");

    let lastScrollTop = 0;
    let scrollingTimer;
    let isScrollingDown = true;

    window.addEventListener('scroll', function() {
        clearTimeout(scrollingTimer);

        const currentScroll = window.scrollY;

        if (currentScroll > lastScrollTop) {
            // Scroll down
            isScrollingDown = true;
        } else {
            // Scroll up
            isScrollingDown = false;
        }

        if (isScrollingDown || currentScroll === 0) {
            loggedHeader.style.opacity = 0;
        } else {
            loggedHeader.style.opacity = 1;
        }

        lastScrollTop = currentScroll;

        scrollingTimer = setTimeout(function() {
            loggedHeader.style.opacity = 1;
        }, 200);
    });

    let scrolling = false;


// Adding scroll event listener
    window.addEventListener('scroll', function() {
        scrolling = true;
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.scrollY;

        if (scrollTop > 100) {
            navbar.classList.add('active');
        } else {
            navbar.classList.remove('active');
        }
    });


    // Using setTimeout instead of setInterval for gradually reducing opacity
    let timeout;

    window.addEventListener('scroll', function() {
        scrolling = true;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            if (scrolling) {
                scrolling = false;
                const navbar = document.querySelector('.navbar');
                navbar.classList.remove('active');
            }
        }, 600); // Delay of 600 milliseconds (0.6 seconds)
    });

    let button = document.getElementById('backToTopButton');

    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});









