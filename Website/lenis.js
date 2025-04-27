/*!
 * Lenis Smooth Scrolling Library
 * A lightweight smooth scrolling library
 * 
 * This is a simplified version for the Ducati website
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Lenis = factory());
})(this, (function () {
    'use strict';
    
    // Default options
    const defaultOptions = {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false
    };
    
    class Lenis {
        constructor(options = {}) {
            // Merge options with defaults
            this.options = {...defaultOptions, ...options};
            
            // Initialize properties
            this.wheelMultiplier = 1;
            this.touchMultiplier = this.options.touchMultiplier;
            this.scrolling = false;
            this.lastScrollTop = 0;
            this.target = 0;
            this.current = 0;
            this.animatedScroll = this
            this.animatedScroll = this.target;
            this.scrollDirection = null;
            this.stopped = false;
            this.events = {};
            
            // Initialize
            this.init();
        }
        
        // Initialize the smooth scrolling
        init() {
            // Get document elements
            this.html = document.documentElement;
            this.body = document.body;
            
            // Add event listeners
            window.addEventListener('resize', this.onWindowResize.bind(this), false);
            window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
            window.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
            window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
            window.addEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
            
            // Initial scroll position
            this.current = this.target = window.scrollY;
        }
        
        // Handle window resize
        onWindowResize() {
            // Update dimensions if needed
        }
        
        // Handle mouse wheel events
        onWheel(e) {
            if (this.stopped) return;
            
            // Prevent default if smooth scrolling is enabled
            if (this.options.smooth) {
                e.preventDefault();
            }
            
            // Calculate delta with direction and multiplier
            const deltaY = e.deltaY;
            const normalized = this.normalize(deltaY);
            
            // Update target scroll position
            this.target += normalized * this.wheelMultiplier;
            this.scrolling = true;
            this.emit('scroll', { deltaY });
        }
        
        // Handle touch start
        onTouchStart(e) {
            if (this.stopped) return;
            
            this.touchStart = {
                x: e.targetTouches[0].clientX,
                y: e.targetTouches[0].clientY
            };
        }
        
        // Handle touch move
        onTouchMove(e) {
            if (this.stopped || !this.touchStart) return;
            
            // Calculate movement
            const touchY = e.targetTouches[0].clientY;
            const touchX = e.targetTouches[0].clientX;
            const deltaY = this.touchStart.y - touchY;
            const deltaX = this.touchStart.x - touchX;
            
            // Apply direction constraint
            let delta = deltaY;
            if (this.options.gestureDirection === 'horizontal') {
                delta = deltaX;
            } else if (this.options.gestureDirection === 'both') {
                delta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;
            }
            
            // If smooth touch is enabled, prevent default
            if (this.options.smoothTouch) {
                e.preventDefault();
                
                // Update target with touch multiplier
                this.target += this.normalize(delta) * this.touchMultiplier;
                this.scrolling = true;
            }
            
            this.emit('scroll', { deltaY: delta });
            
            // Update touch start position
            this.touchStart = {
                x: touchX,
                y: touchY
            };
        }
        
        // Handle touch end
        onTouchEnd() {
            if (this.stopped) return;
            this.touchStart = null;
        }
        
        // Normalize scroll delta based on window height
        normalize(value) {
            return value / window.innerHeight * 100;
        }
        
        // Main animation frame update
        raf(time) {
            if (this.stopped) return;
            
            // Calculate smooth scroll
            if (this.scrolling || this.target !== this.current) {
                // Apply easing
                this.animate(time);
                
                // Apply scroll
                window.scrollTo(0, this.current);
                
                // Update scroll direction
                const oldScrollTop = this.lastScrollTop;
                this.lastScrollTop = this.current;
                
                if (oldScrollTop !== this.lastScrollTop) {
                    this.scrollDirection = oldScrollTop < this.lastScrollTop ? 'down' : 'up';
                    this.emit('scroll direction', { direction: this.scrollDirection });
                }
                
                // Reset scrolling flag when done
                if (Math.abs(this.target - this.current) < 0.1) {
                    this.scrolling = false;
                    this.current = this.target;
                    this.emit('stop');
                }
            }
        }
        
        // Apply easing animation
        animate(time) {
            if (!this.isSmooth) {
                this.current = this.target;
                return;
            }
            
            // Get time delta
            if (!this.lastTime) {
                this.lastTime = time;
            }
            
            const delta = (time - this.lastTime) / 1000;
            this.lastTime = time;
            
            // Apply easing using options
            const duration = this.options.duration;
            const easing = this.options.easing;
            const fraction = delta / duration;
            const value = fraction * (this.target - this.animatedScroll);
            
            this.animatedScroll += value;
            this.current = Math.round(this.animatedScroll);
            
            // Check if we need to clamp the scroll
            if (!this.options.infinite) {
                const maxScroll = this.body.scrollHeight - window.innerHeight;
                
                if (this.target > maxScroll) {
                    this.target = maxScroll;
                } else if (this.target < 0) {
                    this.target = 0;
                }
            }
        }
        
        // Event emitter
        on(event, callback) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(callback);
            return this;
        }
        
        // Emit event to subscribers
        emit(event, data) {
            if (this.events[event]) {
                this.events[event].forEach(callback => {
                    callback(data);
                });
            }
        }
        
        // Get current values
        get isSmooth() {
            return this.options.smooth;
        }
        
        // Start/stop scrolling
        start() {
            this.stopped = false;
        }
        
        stop() {
            this.stopped = true;
        }
        
        // Update options
        setOption(key, value) {
            this.options[key] = value;
        }
        
        // Destroy and clean up
        destroy() {
            window.removeEventListener('resize', this.onWindowResize.bind(this), false);
            window.removeEventListener('wheel', this.onWheel.bind(this), { passive: false });
            window.removeEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
            window.removeEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
            window.removeEventListener('touchend', this.onTouchEnd.bind(this), { passive: false });
        }
    }
    
    return Lenis;
}));