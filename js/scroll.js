/**
 * Paws & Paths - Dog Walking Business Website
 * Scroll Effects and Navigation
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Scroll effects initialized');
    
    // Initialize scroll-based functionality
    initializeSmoothScrolling();
    initializeScrollSpy();
    initializeParallaxEffects();
});

/**
 * Initialize smooth scrolling for navigation links
 * Smoothly scrolls to the target section when a navigation link is clicked
 */
function initializeSmoothScrolling() {
    // Get all navigation links that point to an ID on the page
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    // Add click event listener to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default anchor behavior
            e.preventDefault();
            
            // Get the target section ID from the href attribute
            const targetId = this.getAttribute('href');
            
            // Skip if the href is just "#" (often used for buttons)
            if (targetId === '#') return;
            
            // Get the target element
            const targetElement = document.querySelector(targetId);
            
            // If the target element exists, scroll to it
            if (targetElement) {
                // Get the navbar height for offset
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                
                // Calculate the target position with offset
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                // Smooth scroll to the target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update the active navigation link
                updateActiveNavLink(targetId);
            }
        });
    });
    
    console.log('Smooth scrolling initialized for', navLinks.length, 'navigation links');
}

/**
 * Initialize scroll spy functionality
 * Updates the active navigation link based on the current scroll position
 */
function initializeScrollSpy() {
    // Get all sections that should be tracked
    const sections = document.querySelectorAll('section.section');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the section is in the viewport
            if (entry.isIntersecting) {
                // Get the section ID
                const id = entry.target.getAttribute('id');
                // Update the active navigation link
                updateActiveNavLink(`#${id}`);
            }
        });
    }, {
        root: null, // Use the viewport as the root
        threshold: 0.3, // Trigger when at least 30% of the section is visible
        rootMargin: '-100px 0px -100px 0px' // Adjust for navbar height
    });
    
    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Also update active link on scroll (as a fallback)
    window.addEventListener('scroll', throttle(function() {
        // Get the current scroll position
        const scrollPosition = window.scrollY;
        
        // Find the current section
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150; // Adjust for navbar height
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const id = section.getAttribute('id');
                updateActiveNavLink(`#${id}`);
            }
        });
    }, 100));
    
    console.log('Scroll spy initialized for', sections.length, 'sections');
}

/**
 * Update the active navigation link
 * @param {string} targetId - The ID of the target section
 */
function updateActiveNavLink(targetId) {
    // Remove active class from all navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to the matching navigation link
    const activeLink = document.querySelector(`.nav-link[href="${targetId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

/**
 * Initialize parallax effects for background elements
 * Creates subtle movement effects based on scroll position
 */
function initializeParallaxEffects() {
    // This is a simple implementation that could be expanded
    // with more complex parallax effects if desired
    
    window.addEventListener('scroll', throttle(function() {
        const scrollPosition = window.scrollY;
        
        // Apply parallax effect to elements with the parallax class
        document.querySelectorAll('.parallax').forEach(element => {
            const speed = element.getAttribute('data-parallax-speed') || 0.2;
            element.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    }, 10));
}

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Handle navbar appearance on scroll
 * Makes the navbar more compact when scrolling down
 */
window.addEventListener('scroll', throttle(function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
}, 100));

/**
 * Scroll to top button functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button if it doesn't exist
    if (!document.querySelector('.scroll-to-top')) {
        const scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(scrollButton);
        
        // Style the button
        scrollButton.style.position = 'fixed';
        scrollButton.style.bottom = '20px';
        scrollButton.style.right = '20px';
        scrollButton.style.width = '40px';
        scrollButton.style.height = '40px';
        scrollButton.style.borderRadius = '50%';
        scrollButton.style.backgroundColor = 'var(--primary-color)';
        scrollButton.style.color = 'white';
        scrollButton.style.border = 'none';
        scrollButton.style.display = 'none';
        scrollButton.style.justifyContent = 'center';
        scrollButton.style.alignItems = 'center';
        scrollButton.style.cursor = 'pointer';
        scrollButton.style.zIndex = '999';
        scrollButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        scrollButton.style.transition = 'opacity 0.3s ease';
        
        // Show/hide the button based on scroll position
        window.addEventListener('scroll', throttle(function() {
            if (window.scrollY > 300) {
                scrollButton.style.display = 'flex';
                setTimeout(() => {
                    scrollButton.style.opacity = '1';
                }, 10);
            } else {
                scrollButton.style.opacity = '0';
                setTimeout(() => {
                    scrollButton.style.display = 'none';
                }, 300);
            }
        }, 100));
        
        // Scroll to top when clicked
        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
