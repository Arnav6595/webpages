// Custom cursor functionality
document.addEventListener('DOMContentLoaded', function() {
    initCustomCursor();
});

function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');
    
    if (!cursor || !follower) return;
    
    // Initial position off-screen
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });
    
    // Variables for cursor position and smoothing
    let mouseX = 0;
    let mouseY = 0;
    let posX = 0;
    let posY = 0;
    let cursorScale = 1;
    
    // Smoothing factor (lower = smoother)
    const smoothFactor = 0.15;
    
    // Animation loop for smooth cursor movement
    gsap.ticker.add(updateCursor);
    
    // Update cursor position
    function updateCursor() {
        // Calculate smooth position
        posX += (mouseX - posX) * smoothFactor;
        posY += (mouseY - posY) * smoothFactor;
        
        // Update cursor elements
        gsap.set(cursor, { x: mouseX, y: mouseY });
        gsap.set(follower, { x: posX, y: posY });
    }
    
    // Track mouse movement
    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Hover states for interactive elements
    const links = document.querySelectorAll('a, button, .model-card, .config-option, .dropdown');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            follower.classList.add('follower-hover');
            
            // Scale effect
            gsap.to(cursor, {
                scale: 1.5,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(follower, {
                scale: 1.8,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            follower.classList.remove('follower-hover');
            
            // Reset scale
            gsap.to([cursor, follower], {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Special effects for CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-cta');
            follower.classList.add('follower-cta');
            
            // Larger scale for CTA
            gsap.to(cursor, {
                scale: 2,
                backgroundColor: 'rgba(227, 6, 19, 0.2)',
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(follower, {
                scale: 0.8,
                opacity: 0.6,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-cta');
            follower.classList.remove('follower-cta');
            
            // Reset styles
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                duration: 0.3,
                ease: 'power2.out'
            });
            
            gsap.to(follower, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // Special effect for hero section
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hero');
            
            gsap.to(cursor, {
                borderColor: '#fff',
                borderWidth: '2px',
                duration: 0.3
            });
            
            gsap.to(follower, {
                backgroundColor: 'rgba(227, 6, 19, 0.15)',
                duration: 0.3
            });
        });
        
        heroSection.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hero');
            
            gsap.to(cursor, {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: '1px',
                duration: 0.3
            });
            
            gsap.to(follower, {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                duration: 0.3
            });
        });
    }
    
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Show default cursor when leaving the window
    document.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        document.body.style.cursor = 'auto';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
        follower.style.display = 'block';
        document.body.style.cursor = 'none';
    });
    
    // Handle touch devices
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
    
    if (isTouchDevice()) {
        cursor.style.display = 'none';
        follower.style.display = 'none';
        document.body.style.cursor = 'auto';
    }
}