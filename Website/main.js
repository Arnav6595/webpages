// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initLoadingScreen();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize model slider
    initModelSlider();
    
    // Initialize contact section
    initContactSection();
});

// Loading screen functionality
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingBar = document.querySelector('.loading-bar');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            // Hide loading screen with animation
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    // Trigger initial animations after loading
                    animateHeroSection();
                }, 500);
            }, 300);
        }
        
        loadingBar.style.width = `${progress}%`;
    }, 200);
}

// Navigation functionality
function initNavigation() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelectorAll('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Toggle mobile menu
    hamburgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.forEach(nav => nav.classList.toggle('active'));
    });
    
    // Handle dropdown menus
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            // Prevent click from bubbling up
            e.stopPropagation();
            
            // Close all other open dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('open');
                }
            });
            
            // Toggle current dropdown
            this.classList.toggle('open');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    });
    
    // Header scroll effects
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');
    const nav = document.querySelector('.main-nav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove header background on scroll
        if (scrollTop > 50) {
            header.classList.add('scrolled');
            nav.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            nav.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            header.classList.add('hidden');
            nav.classList.add('hidden');
        } else {
            // Scrolling up
            header.classList.remove('hidden');
            nav.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });
}

// Initialize scroll animations using GSAP
function initScrollAnimations() {
    // Initialize smooth scrolling with Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
    });
    
    // GSAP ScrollTrigger integration with Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    // Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);
    
    // Scroll indicator animation
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        gsap.to(scrollIndicator, {
            y: 20,
            opacity: 0,
            duration: 1,
            repeat: -1,
            yoyo: true
        });
    }
    
    // Hero section parallax effect
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        gsap.to(heroImage, {
            backgroundPosition: '50% -30%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    }
    
    // Model showcase animations
    ScrollTrigger.create({
        trigger: '.model-showcase',
        start: 'top 80%',
        onEnter: () => {
            gsap.to('.model-card', {
                y: 0,
                opacity: 1,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out'
            });
        }
    });
    
    // Animate sections when they enter viewport
    const sections = document.querySelectorAll('[data-scroll-section]');
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            onEnter: () => {
                section.classList.add('in-view');
            }
        });
    });
}

// Model slider functionality
function initModelSlider() {
    const modelSlider = document.querySelector('.model-slider');
    const modelCards = document.querySelectorAll('.model-card');
    const sliderProgress = document.querySelector('.slider-progress');
    
    if (!modelSlider || modelCards.length === 0) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    let maxScroll = modelSlider.scrollWidth - modelSlider.clientWidth;
    
    // Mouse events for slider
    modelSlider.addEventListener('mousedown', (e) => {
        isDown = true;
        modelSlider.classList.add('active');
        startX = e.pageX - modelSlider.offsetLeft;
        scrollLeft = modelSlider.scrollLeft;
    });
    
    modelSlider.addEventListener('mouseleave', () => {
        isDown = false;
        modelSlider.classList.remove('active');
    });
    
    modelSlider.addEventListener('mouseup', () => {
        isDown = false;
        modelSlider.classList.remove('active');
    });
    
    modelSlider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - modelSlider.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        modelSlider.scrollLeft = scrollLeft - walk;
        updateSliderProgress();
    });
    
    // Touch events for mobile
    modelSlider.addEventListener('touchstart', (e) => {
        isDown = true;
        modelSlider.classList.add('active');
        startX = e.touches[0].pageX - modelSlider.offsetLeft;
        scrollLeft = modelSlider.scrollLeft;
    });
    
    modelSlider.addEventListener('touchend', () => {
        isDown = false;
        modelSlider.classList.remove('active');
    });
    
    modelSlider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - modelSlider.offsetLeft;
        const walk = (x - startX) * 2;
        modelSlider.scrollLeft = scrollLeft - walk;
        updateSliderProgress();
    });
    
    // Update progress bar
    function updateSliderProgress() {
        const scrollPercentage = (modelSlider.scrollLeft / maxScroll) * 100;
        sliderProgress.style.width = `${scrollPercentage}%`;
    }
    
    // Initialize slider position
    modelSlider.scrollLeft = 0;
    updateSliderProgress();
    
    // Model card hover effects
    modelCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
        
        // Add to compare functionality
        const addButton = card.querySelector('.add-button');
        if (addButton) {
            addButton.addEventListener('click', function(e) {
                e.stopPropagation();
                const modelName = this.parentNode.querySelector('.model-name').textContent;
                
                // Toggle selected state
                this.parentNode.classList.toggle('selected');
                
                // Show feedback
                const feedback = document.createElement('div');
                feedback.className = 'selection-feedback';
                feedback.textContent = this.parentNode.classList.contains('selected') ? 
                    `${modelName} added to comparison` : 
                    `${modelName} removed from comparison`;
                
                document.body.appendChild(feedback);
                
                setTimeout(() => {
                    feedback.classList.add('show');
                    
                    setTimeout(() => {
                        feedback.classList.remove('show');
                        setTimeout(() => {
                            document.body.removeChild(feedback);
                        }, 300);
                    }, 2000);
                }, 10);
            });
        }
    });
}

// Contact section functionality
function initContactSection() {
    const contactBar = document.querySelector('.contact-bar');
    const expandBtn = document.querySelector('.expand-btn');
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactBar || !expandBtn) return;
    
    expandBtn.addEventListener('click', function() {
        contactBar.classList.toggle('expanded');
        
        // Toggle icon
        const icon = this.querySelector('i');
        if (icon) {
            if (contactBar.classList.contains('expanded')) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        }
        
        // Show/hide contact form
        if (contactForm) {
            if (contactBar.classList.contains('expanded')) {
                contactForm.style.display = 'block';
                setTimeout(() => {
                    contactForm.style.opacity = '1';
                }, 10);
            } else {
                contactForm.style.opacity = '0';
                setTimeout(() => {
                    contactForm.style.display = 'none';
                }, 300);
            }
        }
    });
    
    // Contact dealer button
    const contactDealerBtn = document.querySelector('.contact-dealer-btn');
    if (contactDealerBtn) {
        contactDealerBtn.addEventListener('click', function() {
            window.location.href = '/dealer-locator';
        });
    }
}

// Function to animate hero section
function animateHeroSection() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const ctaButton = document.querySelector('.hero-content .cta-button');
    
    if (!heroTitle) return;
    
    // Create timeline
    const tl = gsap.timeline();
    
    // Split text for more advanced animations
    if (window.SplitText) {
        const titleSplit = new SplitText(heroTitle, {type: 'chars, words'});
        const subtitleSplit = heroSubtitle ? new SplitText(heroSubtitle, {type: 'chars'}) : null;
        
        tl.from(titleSplit.chars, {
            opacity: 0,
            y: 50,
            rotationX: -90,
            stagger: 0.03,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        if (subtitleSplit) {
            tl.from(subtitleSplit.chars, {
                opacity: 0,
                y: 20,
                stagger: 0.01,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.4');
        }
    } else {
        // Fallback if SplitText is not available
        tl.from(heroTitle, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        });
        
        if (heroSubtitle) {
            tl.from(heroSubtitle, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                ease: 'power3.out'
            }, '-=0.4');
        }
    }
    
    // Animate description and button
    if (heroDescription) {
        tl.from(heroDescription, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.2');
    }
    
    if (ctaButton) {
        tl.from(ctaButton, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4');
    }
}