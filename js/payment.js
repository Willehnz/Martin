/**
 * Paws & Paths - Dog Walking Business Website
 * Payment Integration
 */

// Global variables for payment processing
let stripe = null;
let cardElement = null;
let paymentProcessing = false;

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Payment system initialized');
    
    // Initialize Stripe (in test mode)
    initializeStripe();
    
    // Set up payment form event listeners
    setupPaymentForm();
});

/**
 * Initialize Stripe payment processing
 * Uses Stripe.js in test mode
 */
function initializeStripe() {
    // Check if Stripe is available
    if (typeof Stripe === 'undefined') {
        console.error('Stripe.js is not loaded');
        
        // Show placeholder for demo purposes
        const cardElement = document.getElementById('card-element');
        if (cardElement) {
            cardElement.innerHTML = `
                <div class="card-placeholder">
                    <i class="fas fa-credit-card"></i>
                    <p>Stripe.js not loaded - this is a demo</p>
                </div>
            `;
        }
        return;
    }
    
    try {
        // Initialize Stripe with a test publishable key
        // In a real implementation, this would be your actual Stripe publishable key
        stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
        
        // Create Stripe Elements
        const elements = stripe.elements();
        
        // Create and mount the Card Element
        cardElement = elements.create('card', {
            style: {
                base: {
                    color: '#32325d',
                    fontFamily: '"Open Sans", sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            }
        });
        
        // Mount the Card Element to the DOM
        const cardElementContainer = document.getElementById('card-element');
        if (cardElementContainer) {
            // Clear any existing content
            cardElementContainer.innerHTML = '';
            
            // Mount the card element
            cardElement.mount('#card-element');
            
            // Handle validation errors
            cardElement.on('change', function(event) {
                const displayError = document.getElementById('card-errors');
                if (displayError) {
                    if (event.error) {
                        displayError.textContent = event.error.message;
                    } else {
                        displayError.textContent = '';
                    }
                }
            });
        }
        
        console.log('Stripe initialized in test mode');
    } catch (error) {
        console.error('Error initializing Stripe:', error);
        
        // Show error message
        const cardErrors = document.getElementById('card-errors');
        if (cardErrors) {
            cardErrors.textContent = 'Could not initialize payment system. Please try again later.';
        }
        
        // Show placeholder for demo purposes
        const cardElement = document.getElementById('card-element');
        if (cardElement) {
            cardElement.innerHTML = `
                <div class="card-placeholder">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Payment system error - this is a demo</p>
                </div>
            `;
        }
    }
}

/**
 * Set up payment form event listeners
 */
function setupPaymentForm() {
    // Get the payment form and submit button
    const paymentForm = document.getElementById('payment-form');
    const submitButton = document.getElementById('submit-payment');
    
    // Check if the elements exist
    if (!paymentForm || !submitButton) {
        return;
    }
    
    // Add event listener for submit button
    submitButton.addEventListener('click', function(event) {
        event.preventDefault();
        
        // Prevent multiple submissions
        if (paymentProcessing) {
            return;
        }
        
        // Start payment processing
        processPayment();
    });
}

/**
 * Process the payment
 * In a real implementation, this would create a payment intent on the server
 * and confirm the payment with Stripe
 */
function processPayment() {
    // Set processing flag
    paymentProcessing = true;
    
    // Get the submit button
    const submitButton = document.getElementById('submit-payment');
    
    // Show loading state
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading-spinner"></span> Processing...';
    }
    
    // Get the error display element
    const displayError = document.getElementById('card-errors');
    if (displayError) {
        displayError.textContent = '';
    }
    
    // In a real implementation, we would create a payment intent on the server
    // and then confirm the payment with Stripe
    
    // For this demo, we'll simulate a payment process with a delay
    setTimeout(function() {
        // Simulate a successful payment
        const success = Math.random() > 0.2; // 80% success rate for demo
        
        if (success) {
            // Payment successful
            handlePaymentSuccess();
        } else {
            // Payment failed
            handlePaymentError('Payment failed. Please try again.');
        }
        
        // Reset processing flag
        paymentProcessing = false;
        
        // Reset button state
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Complete Booking';
        }
    }, 2000); // 2 second delay to simulate processing
}

/**
 * Handle a successful payment
 */
function handlePaymentSuccess() {
    console.log('Payment successful');
    
    // In a real implementation, we would verify the payment on the server
    // and then create the booking record
    
    // For this demo, we'll just trigger the booking completion
    if (typeof completeBooking === 'function') {
        completeBooking();
    } else {
        // Fallback if completeBooking is not available
        window.utils.showNotification('Payment successful!', 'success');
        
        // Show a generic confirmation
        const paymentSection = document.getElementById('payment-section');
        if (paymentSection) {
            paymentSection.innerHTML = `
                <div class="confirmation-container text-center fade-in">
                    <i class="fas fa-check-circle confirmation-icon"></i>
                    <h3>Payment Successful!</h3>
                    <p class="lead">Thank you for your payment.</p>
                    <button type="button" class="btn btn-primary mt-3" onclick="window.location.reload()">Return to Home</button>
                </div>
            `;
        }
    }
}

/**
 * Handle a payment error
 * @param {string} errorMessage - The error message to display
 */
function handlePaymentError(errorMessage) {
    console.error('Payment error:', errorMessage);
    
    // Show error message
    const displayError = document.getElementById('card-errors');
    if (displayError) {
        displayError.textContent = errorMessage;
    }
    
    // Show notification
    window.utils.showNotification(errorMessage, 'error');
}

/**
 * Get the price for a service type
 * @param {string} serviceType - The type of service
 * @returns {number} The price of the service
 */
function getServicePrice(serviceType) {
    switch (serviceType) {
        case 'standard':
            return 20;
        case 'extended':
            return 35;
        case 'group':
            return 25;
        default:
            return 0;
    }
}

/**
 * Format a payment amount for Stripe (in cents)
 * @param {number} amount - The amount in dollars
 * @returns {number} The amount in cents
 */
function formatAmountForStripe(amount) {
    return Math.round(amount * 100);
}

/**
 * Create a payment method with Stripe
 * This would be used in a real implementation
 * @returns {Promise} Promise resolving to a payment method or error
 */
function createPaymentMethod() {
    // Check if Stripe and card element are initialized
    if (!stripe || !cardElement) {
        return Promise.reject(new Error('Payment system not initialized'));
    }
    
    // Create a payment method with the card element
    return stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
            name: document.getElementById('owner-name').value,
            email: document.getElementById('owner-email').value,
            phone: document.getElementById('owner-phone').value
        }
    });
}

/**
 * Create a demo credit card input for testing
 * This is used when Stripe.js is not available
 */
function createDemoCreditCardInput() {
    // Get the card element container
    const cardElementContainer = document.getElementById('card-element');
    
    // Check if the element exists
    if (!cardElementContainer) {
        return;
    }
    
    // Create a demo credit card input
    cardElementContainer.innerHTML = `
        <div class="demo-card-input">
            <div class="form-row">
                <div class="col-12 mb-3">
                    <label for="demo-card-number">Card Number</label>
                    <input type="text" id="demo-card-number" class="form-control" placeholder="4242 4242 4242 4242" maxlength="19">
                </div>
            </div>
            <div class="form-row">
                <div class="col-6 mb-3">
                    <label for="demo-card-expiry">Expiration (MM/YY)</label>
                    <input type="text" id="demo-card-expiry" class="form-control" placeholder="MM/YY" maxlength="5">
                </div>
                <div class="col-6 mb-3">
                    <label for="demo-card-cvc">CVC</label>
                    <input type="text" id="demo-card-cvc" class="form-control" placeholder="CVC" maxlength="3">
                </div>
            </div>
            <div class="form-row">
                <div class="col-12">
                    <label for="demo-card-zip">ZIP Code</label>
                    <input type="text" id="demo-card-zip" class="form-control" placeholder="ZIP Code" maxlength="5">
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for formatting
    const cardNumberInput = document.getElementById('demo-card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Format card number with spaces
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // Format expiry date
    const expiryInput = document.getElementById('demo-card-expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/gi, '');
            
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            
            e.target.value = value;
        });
    }
}

// If Stripe.js is not available after 3 seconds, create a demo credit card input
setTimeout(function() {
    if (!stripe) {
        createDemoCreditCardInput();
    }
}, 3000);
