// Scroll Fade-In Animation Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all scroll-fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.scroll-fade-in');
    fadeElements.forEach(el => fadeInObserver.observe(el));
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Create Floating Yellow Particles
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'floating-particles';
    document.body.appendChild(particlesContainer);

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random size between 20-100px
        const size = Math.random() * 80 + 20;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random horizontal position
        particle.style.left = `${Math.random() * 100}%`;

        // Random animation duration between 10-30 seconds
        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = `${duration}s`;

        // Random delay
        particle.style.animationDelay = `${Math.random() * 5}s`;

        particlesContainer.appendChild(particle);

        // Remove particle after animation completes
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }

    // Create initial particles
    for (let i = 0; i < 15; i++) {
        setTimeout(() => createParticle(), i * 500);
    }

    // Continue creating particles
    setInterval(() => {
        if (particlesContainer.children.length < 15) {
            createParticle();
        }
    }, 2000);
}

// Initialize particles on page load
document.addEventListener('DOMContentLoaded', createParticles);

// Section Highlight on Scroll
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            setTimeout(() => {
                entry.target.classList.remove('in-view');
            }, 1000);
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => sectionObserver.observe(section));

// Enhanced Feature Card Hover Effects
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.hover-lift');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add extra glow effect
            this.style.boxShadow = '0 20px 60px rgba(240, 185, 11, 0.4)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
});

// Stats Counter Animation on Scroll
function animateStats() {
    const stats = document.querySelectorAll('.stat-card');

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transform = 'scale(1.05)';
                entry.target.style.transition = 'transform 0.3s ease';

                setTimeout(() => {
                    entry.target.style.transform = 'scale(1)';
                }, 300);

                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        stat.classList.add('stat-card');
        statsObserver.observe(stat);
    });
}

// Initialize stats animation
document.addEventListener('DOMContentLoaded', animateStats);

// CTA Button Pulse Effect
document.addEventListener('DOMContentLoaded', () => {
    const ctaButtons = document.querySelectorAll('.glow-effect');

    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse-glow 0.5s ease-in-out';
        });

        button.addEventListener('animationend', function() {
            this.style.animation = 'pulse-glow 3s ease-in-out infinite';
        });
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Only prevent default for hash links that are not just "#"
        if (href !== '#' && href !== '#get-started' && href !== '#documentation') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Partner Logo Scroll Enhancement
document.addEventListener('DOMContentLoaded', () => {
    const partnerTrack = document.querySelector('.partner-scroll-track');

    if (partnerTrack) {
        // Add yellow glow effect on hover
        const partnerCards = document.querySelectorAll('.partner-card');

        partnerCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const logo = this.querySelector('.partner-logo');
                logo.style.filter = 'brightness(1.2) contrast(1.3) drop-shadow(0 0 30px rgba(240, 185, 11, 0.6))';
            });

            card.addEventListener('mouseleave', function() {
                const logo = this.querySelector('.partner-logo');
                logo.style.filter = '';
            });
        });
    }
});

// Add random sparkle effects on hero section
function createSparkles() {
    const hero = document.querySelector('section');
    if (!hero) return;

    setInterval(() => {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.borderRadius = '50%';
        sparkle.style.background = '#F0B90B';
        sparkle.style.boxShadow = '0 0 10px #F0B90B';
        sparkle.style.left = `${Math.random() * 100}%`;
        sparkle.style.top = `${Math.random() * 100}%`;
        sparkle.style.animation = 'sparkle-fade 2s ease-out forwards';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1';

        hero.style.position = 'relative';
        hero.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 2000);
    }, 3000);
}

// Add sparkle animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle-fade {
        0% {
            opacity: 1;
            transform: scale(0);
        }
        50% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize sparkles
document.addEventListener('DOMContentLoaded', createSparkles);

console.log('🚀 BNBPay animations loaded! Enjoy the yellow glow ✨');
