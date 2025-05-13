// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Trigger bouncing faces animation when first stanza becomes visible
            if (entry.target.id === 'a' && !imagesBouncing) {
                startBouncingFaces();
            }
        }
    });
}, {
    threshold: 0.1
});

// Observe all stanzas
document.querySelectorAll('.stanza').forEach((stanza) => {
    observer.observe(stanza);
});

// Bouncing images animation
const firstStanza = document.getElementById("a");
let imagesBouncing = false;
const imageSrcs = [
    "assets/Img/Bad Bunny.png",
    "assets/Img/Tego.png",
    "assets/Img/Mariposa.png"
];
let bouncers = [];
let intervals = [];

function startBouncingFaces() {
    if (imagesBouncing) return; // prevent duplicates
    imagesBouncing = true;

    for (let i = 0; i < 6; i++) {
        const img = document.createElement("img");
        img.src = imageSrcs[Math.floor(Math.random() * imageSrcs.length)];
        img.classList.add("bouncer");

        // Position within the stanza
        let x = Math.random() * (firstStanza.offsetWidth - 100);
        let y = Math.random() * (firstStanza.offsetHeight - 100);
        let dx = 2 + Math.random() * 2;
        let dy = 2 + Math.random() * 2;

        img.style.left = x + "px";
        img.style.top = y + "px";
        firstStanza.appendChild(img);
        bouncers.push(img);

        const interval = setInterval(() => {
            x += dx;
            y += dy;

            // Bounce off stanza boundaries
            if (x <= 0 || x >= firstStanza.offsetWidth - 100) {
                dx *= -1;
                x = Math.max(0, Math.min(x, firstStanza.offsetWidth - 100));
            }
            if (y <= 0 || y >= firstStanza.offsetHeight - 100) {
                dy *= -1;
                y = Math.max(0, Math.min(y, firstStanza.offsetHeight - 100));
            }

            img.style.left = x + "px";
            img.style.top = y + "px";
        }, 16);

        intervals.push(interval);
    }
}

// Clean up bouncing images when scrolling away
const stanzaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            // Remove all bouncing images when scrolling away
            bouncers.forEach(img => img.remove());
            intervals.forEach(interval => clearInterval(interval));
            bouncers = [];
            intervals = [];
            imagesBouncing = false;
        }
    });
}, { threshold: 0 });

stanzaObserver.observe(firstStanza);

// Parallax effect for background images
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.intro');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.backgroundPositionY = `${scrolled * speed}px`;
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
