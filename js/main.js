/**
 * Paws & Paths - Dog Walking Business Website
 * Main JavaScript File
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Paws & Paths website initialized');
    
    // Initialize all components
    initializeCarousel();
    initializeAnimations();
    
    // Set current year in footer copyright
    document.querySelector('.copyright').innerHTML = `© ${new Date().getFullYear()} Paws & Paths. All rights reserved.`;
});

/**
 * Initialize the dog image carousel
 * Creates 10 carousel items with placeholder images/icons
 */
function initializeCarousel() {
    const carouselInner = document.querySelector('#dogCarousel .carousel-inner');
    
    // Clear existing content
    carouselInner.innerHTML = '';
    
    // Create 10 carousel items
    for (let i = 1; i <= 10; i++) {
        const isActive = i === 1 ? 'active' : '';
        const item = document.createElement('div');
        item.className = `carousel-item ${isActive}`;
        
        // In a real implementation, we would use actual dog images
        // For this demo, we'll use placeholders with different icons
        const icons = ['dog', 'paw', 'bone', 'heart', 'walking', 'home', 'user-friends', 'map-marker-alt', 'clock', 'star'];
        const icon = icons[i - 1] || 'dog';
        
        item.innerHTML = `
            <div class="carousel-placeholder">
                <i class="fas fa-${icon}"></i>
                <p>Dog Image ${i}</p>
            </div>
        `;
        
        carouselInner.appendChild(item);
    }
    
    console.log('Carousel initialized with 10 placeholder images');
}

/**
 * Initialize animations for elements with the fade-in class
 * Uses Intersection Observer to trigger animations when elements come into view
 */
function initializeAnimations() {
    // Get all elements with the fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element is in the viewport
            if (entry.isIntersecting) {
                // Add the visible class to trigger the animation
                entry.target.classList.add('visible');
                // Unobserve the element after it's animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // Use the viewport as the root
        threshold: 0.1, // Trigger when at least 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element comes into view
    });
    
    // Observe each fade-in element
    fadeElements.forEach(element => {
        observer.observe(element);
    });
    
    console.log('Animations initialized for', fadeElements.length, 'elements');
}

/**
 * Utility function to format currency
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

/**
 * Utility function to format dates
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

/**
 * Utility function to validate email addresses
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Utility function to validate phone numbers
 * @param {string} phone - The phone number to validate
 * @returns {boolean} Whether the phone number is valid
 */
function isValidPhone(phone) {
    // Basic validation for US phone numbers
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return regex.test(phone);
}

/**
 * Utility function to show a notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 * @param {number} duration - How long to show the notification in ms
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles for the notification container
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    
    // Add styles for the notification
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : 
                                        type === 'error' ? '#F44336' : '#2196F3';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

// Export utility functions for use in other modules
window.utils = {
    formatCurrency,
    formatDate,
    isValidEmail,
    isValidPhone,
    showNotification
};
