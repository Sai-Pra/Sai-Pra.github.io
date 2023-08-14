const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const fadeInCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
};

const observer = new IntersectionObserver(fadeInCallback, observerOptions);

window.addEventListener('DOMContentLoaded', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach(element => {
        observer.observe(element);
    });
});

window.addEventListener('scroll', function() {
    var navbar = document.querySelector('.navbar');
    if (window.scrollY === 0) {
        navbar.style.position = 'sticky';
    } else {
        navbar.style.position = 'sticky';
    }
});

window.addEventListener("scroll", function() {
    var waves = document.querySelectorAll(".wave");
    var scrollTop = window.scrollY;
    var maxOpacity = 1;
    var minOpacity = 0;
    var maxScroll = 600; // Adjust this value as needed
    
    var opacity = maxOpacity - Math.log(scrollTop + 1) / Math.log(maxScroll + 1);
    opacity = Math.max(minOpacity, Math.min(maxOpacity, opacity)); // Ensure opacity is between min and max
    
    waves.forEach(function(wave) {
      wave.style.opacity = opacity;
    });
  });