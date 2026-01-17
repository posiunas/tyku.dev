// ===== GLITCH TEXT EFFECT =====
function initGlitchEffect() {
    const title = document.querySelector('.name');
    if (!title) return;

    const text = title.textContent;
    title.setAttribute('data-text', text);

    setInterval(() => {
        if (Math.random() > 0.95) {
            title.classList.add('glitch-active');
            setTimeout(() => {
                title.classList.remove('glitch-active');
            }, 200);
        }
    }, 3000);
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    // specific check for touch devices to avoid double cursors or performance issues
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';

    document.body.appendChild(cursor);
    document.body.appendChild(dot);

    const onMouseMove = (e) => {
        const { clientX, clientY } = e;
        // Use requestAnimationFrame for smoother visual updates is often overkill for a simple cursor 
        // but transform updates are generally cheap. Direct style update:
        cursor.style.left = `${clientX}px`;
        cursor.style.top = `${clientY}px`;
        dot.style.left = `${clientX}px`;
        dot.style.top = `${clientY}px`;
    };

    document.addEventListener('mousemove', onMouseMove);

    // Hover effect for links
    const links = document.querySelectorAll('a, button, .card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// ===== 3D CARD TILT =====
function init3DCards() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ===== PARALLAX EFFECT =====
let ticking = false;
// Cache DOM elements
const header = document.querySelector('header');
const body = document.body;
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');
// Don't query all floating-shapes inside scroll loop if possible, but for this small page it's okay to cache once
const shapes = document.querySelectorAll('.floating-shape');

function handleScroll() {
    const scrollY = window.scrollY;

    // Header transparency toggle
    if (scrollY > 100) {
        header.classList.add('scrolled');
        body.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
        body.classList.remove('scrolled');
    }

    // Parallax effect for hero
    if (hero && heroContent && window.innerWidth > 768) {
        // Only run parallax on larger screens to save mobile battery/perf
        const parallaxSpeed = 0.5;
        heroContent.style.transform = `translateY(${scrollY * parallaxSpeed}px)`;
        hero.style.opacity = Math.max(0, 1 - (scrollY / 800));
    }

    // Parallax for floating shapes (if they existed in DOM, keeping logic if you add them later)
    if (shapes.length > 0) {
        shapes.forEach((shape, index) => {
            const speed = 0.1 + (index * 0.05);
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    }

    ticking = false;
}

function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick, { passive: true });

// ===== SECTION REVEAL (IntersectionObserver) =====
function initSectionReveal() {
    const options = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible
                // observer.unobserve(entry.target); 
            }
        });
    }, options);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== TEXT REVEAL ANIMATION =====
function initTextReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('text-reveal');
                observer.unobserve(entry.target); // Good practice to unobserve text reveals
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section p, section h2, section h3').forEach(el => {
        observer.observe(el);
    });
}

// ===== INITIALIZE EVERYTHING =====
window.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initGlitchEffect();
    init3DCards();
    initTextReveal();
    initSectionReveal();
    handleScroll(); // Initial check
});
