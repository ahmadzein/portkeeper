// Port Keeper - Optimized JavaScript for Performance

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    // Create mobile overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                // Close menu
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');
                console.log('Menu closed - hamburger should show 3 lines');
            } else {
                // Open menu
                navMenu.classList.add('active');
                hamburger.classList.add('active');
                overlay.classList.add('active');
                body.style.overflow = 'hidden';
                hamburger.setAttribute('aria-expanded', 'true');
                console.log('Menu opened - hamburger should show X');
            }
            
            // Debug: Check if active class is present
            console.log('Hamburger classes:', hamburger.className);
            console.log('Has active class:', hamburger.classList.contains('active'));
            
            // Debug span positions
            const spans = hamburger.querySelectorAll('span');
            spans.forEach((span, index) => {
                const computed = window.getComputedStyle(span);
                console.log(`Span ${index + 1}:`, {
                    top: computed.top,
                    transform: computed.transform,
                    opacity: computed.opacity,
                    transition: computed.transition
                });
            });
            
            // Check if styles.css is loaded and find hamburger rules
            const styleSheets = Array.from(document.styleSheets);
            let foundRules = [];
            
            styleSheets.forEach(sheet => {
                try {
                    const rules = Array.from(sheet.cssRules || sheet.rules || []);
                    rules.forEach(rule => {
                        if (rule.selectorText && rule.selectorText.includes('hamburger')) {
                            foundRules.push({
                                selector: rule.selectorText,
                                styles: rule.style.cssText
                            });
                        }
                    });
                } catch (e) {
                    console.warn('Cannot access stylesheet:', e);
                }
            });
            
            console.log('Found hamburger CSS rules:', foundRules.filter(r => r.selector.includes('active')));
        });
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        });
        
        // Close menu when clicking menu links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                overlay.classList.remove('active');
                body.style.overflow = '';
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                if (window.innerWidth >= 768) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    overlay.classList.remove('active');
                    body.style.overflow = '';
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            }, 250);
        });
    }
    
    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80; // Navbar height
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lazy Loading for Images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Copy to Clipboard for Code Blocks
    document.querySelectorAll('pre code').forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        
        const pre = block.parentElement;
        pre.style.position = 'relative';
        pre.appendChild(button);
        
        button.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(block.textContent);
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });

    // Service Worker Registration for PWA
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => console.log('SW registered:', registration))
                .catch(error => console.log('SW registration failed:', error));
        });
    }

    // Performance Monitoring
    if ('PerformanceObserver' in window) {
        // Monitor Largest Contentful Paint
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
                // Send to analytics
                if (window.gtag) {
                    gtag('event', 'LCP', {
                        event_category: 'Web Vitals',
                        value: Math.round(lastEntry.startTime)
                    });
                }
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {}
        
        // Monitor First Input Delay
        try {
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const delay = entry.processingStart - entry.startTime;
                    console.log('FID:', delay);
                    // Send to analytics
                    if (window.gtag) {
                        gtag('event', 'FID', {
                            event_category: 'Web Vitals',
                            value: Math.round(delay)
                        });
                    }
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {}
        
        // Monitor Cumulative Layout Shift
        try {
            let clsValue = 0;
            let clsEntries = [];
            
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        clsEntries.push(entry);
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            
            // Report CLS when page is about to unload
            addEventListener('beforeunload', () => {
                console.log('CLS:', clsValue);
                // Send to analytics
                if (window.gtag) {
                    gtag('event', 'CLS', {
                        event_category: 'Web Vitals',
                        value: Math.round(clsValue * 1000)
                    });
                }
            });
        } catch (e) {}
    }

    // Search functionality (for future implementation)
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = this.querySelector('input[name="q"]').value;
            if (query) {
                window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }
        });
    }
    
    // Newsletter signup (for future implementation)
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const button = this.querySelector('button');
            const originalText = button.textContent;
            
            button.disabled = true;
            button.textContent = 'Subscribing...';
            
            try {
                // Implement newsletter API call here
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated
                button.textContent = 'Subscribed!';
                this.reset();
            } catch (error) {
                button.textContent = 'Error. Try again.';
            } finally {
                setTimeout(() => {
                    button.disabled = false;
                    button.textContent = originalText;
                }, 3000);
            }
        });
    }
});

// Optimize font loading
if ('fonts' in document) {
    Promise.all([
        document.fonts.load('400 1em Inter'),
        document.fonts.load('600 1em Inter'),
        document.fonts.load('700 1em Inter'),
        document.fonts.load('400 1em JetBrains Mono')
    ]).then(() => {
        document.documentElement.classList.add('fonts-loaded');
    });
}