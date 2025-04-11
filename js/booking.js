/**
 * Paws & Paths - Dog Walking Business Website
 * Booking System Logic
 */

// Global variables for booking system
let selectedDate = null;
let availableTimeSlots = [];
let bookings = [];

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Booking system initialized');
    
    // Initialize the booking system
    initializeCalendar();
    initializeBookingForm();
    loadExistingBookings();
});

/**
 * Initialize the booking calendar
 * Uses the Vanilla JS Datepicker library
 */
function initializeCalendar() {
    // Get the calendar container
    const calendarElement = document.getElementById('booking-calendar');
    
    // Check if the calendar element exists
    if (!calendarElement) {
        console.error('Calendar element not found');
        return;
    }
    
    // Clear placeholder content
    calendarElement.innerHTML = '';
    
    // Add CSS for the calendar
    addCalendarStyles();
    
    try {
        // Initialize the datepicker
        const datepicker = new Datepicker(calendarElement, {
            autohide: true,
            format: 'mm/dd/yyyy',
            startDate: new Date(),
            todayHighlight: true,
            weekStart: 0, // Sunday
            daysOfWeekDisabled: [], // No disabled days
            calendarWeeks: true, // Show week numbers
            maxView: 1, // Month view only
            minView: 0, // Day view
            maxNumberOfDates: 1, // Single date selection
            beforeShowDay: function(date) {
                // Disable dates in the past
                if (date < new Date().setHours(0, 0, 0, 0)) {
                    return false;
                }
                
                // Check if the date has reached the maximum number of bookings
                const dateString = formatDateForStorage(date);
                const dateBookings = getBookingsForDate(dateString);
                
                // If there are already 2 bookings for this date, disable it
                if (dateBookings.length >= 2) {
                    return {
                        enabled: false,
                        classes: 'fully-booked',
                        tooltip: 'Fully booked'
                    };
                }
                
                // If there is 1 booking, mark it as partially booked
                if (dateBookings.length === 1) {
                    return {
                        enabled: true,
                        classes: 'partially-booked',
                        tooltip: '1 slot available'
                    };
                }
                
                // Otherwise, the date is available
                return {
                    enabled: true,
                    classes: 'available',
                    tooltip: '2 slots available'
                };
            }
        });
        
        console.log('Calendar initialized successfully');
    } catch (error) {
        console.error('Error initializing calendar:', error);
        
        // Fallback to a simple calendar UI if the library fails
        createSimpleCalendarUI(calendarElement);
    }
    
    // Add event listener for date selection
    calendarElement.addEventListener('changeDate', function(e) {
        // Get the selected date
        selectedDate = e.detail.date;
        
        // Update the booking form with the selected date
        document.getElementById('booking-date').value = formatDate(selectedDate);
        
        // Update available time slots
        updateAvailableTimeSlots(selectedDate);
        
        // Enable the time slot selection
        document.getElementById('booking-time').disabled = false;
        
        // Show availability info
        updateAvailabilityInfo(selectedDate);
    });
}

/**
 * Add CSS styles for the calendar
 */
function addCalendarStyles() {
    // Check if styles already exist
    if (document.getElementById('calendar-styles')) {
        return;
    }
    
    // Create style element
    const style = document.createElement('style');
    style.id = 'calendar-styles';
    
    // Add CSS rules
    style.textContent = `
        .datepicker {
            font-family: var(--body-font);
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            padding: 10px;
            background-color: white;
        }
        
        .datepicker-header {
            margin-bottom: 10px;
        }
        
        .datepicker-title {
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
        }
        
        .datepicker-controls {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .datepicker-view {
            display: block;
            width: 100%;
        }
        
        .datepicker-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
        }
        
        .datepicker-cell {
            text-align: center;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .datepicker-cell:hover {
            background-color: #f0f0f0;
        }
        
        .datepicker-cell.disabled {
            color: #ccc;
            cursor: not-allowed;
        }
        
        .datepicker-cell.selected {
            background-color: var(--primary-color);
            color: white;
        }
        
        .datepicker-cell.today {
            border: 2px solid var(--primary-color);
        }
        
        .datepicker-cell.available {
            background-color: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .datepicker-cell.partially-booked {
            background-color: rgba(255, 160, 0, 0.1);
            border: 1px solid rgba(255, 160, 0, 0.3);
        }
        
        .datepicker-cell.fully-booked {
            background-color: rgba(244, 67, 54, 0.1);
            border: 1px solid rgba(244, 67, 54, 0.3);
            color: #999;
        }
        
        .datepicker-cell.available.selected {
            background-color: var(--primary-color);
            color: white;
            border: none;
        }
        
        .datepicker-cell.partially-booked.selected {
            background-color: var(--primary-color);
            color: white;
            border: none;
        }
        
        .calendar-legend {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            font-size: 0.85rem;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
        }
        
        .legend-color {
            width: 15px;
            height: 15px;
            border-radius: 3px;
            margin-right: 5px;
        }
        
        .legend-available {
            background-color: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .legend-partial {
            background-color: rgba(255, 160, 0, 0.1);
            border: 1px solid rgba(255, 160, 0, 0.3);
        }
        
        .legend-booked {
            background-color: rgba(244, 67, 54, 0.1);
            border: 1px solid rgba(244, 67, 54, 0.3);
        }
    `;
    
    // Add to document head
    document.head.appendChild(style);
}

/**
 * Create a simple calendar UI as a fallback
 * @param {HTMLElement} container - The container element
 */
function createSimpleCalendarUI(container) {
    // Get current date
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Create calendar container
    container.innerHTML = `
        <div class="simple-calendar">
            <div class="calendar-header">
                <button class="btn btn-sm btn-outline-secondary prev-month">&lt;</button>
                <h4 class="month-year">${getMonthName(currentMonth)} ${currentYear}</h4>
                <button class="btn btn-sm btn-outline-secondary next-month">&gt;</button>
            </div>
            <div class="calendar-grid">
                <div class="weekday">Sun</div>
                <div class="weekday">Mon</div>
                <div class="weekday">Tue</div>
                <div class="weekday">Wed</div>
                <div class="weekday">Thu</div>
                <div class="weekday">Fri</div>
                <div class="weekday">Sat</div>
                ${generateCalendarDays(currentMonth, currentYear)}
            </div>
            <div class="calendar-legend">
                <div class="legend-item">
                    <div class="legend-color legend-available"></div>
                    <span>Available</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color legend-partial"></div>
                    <span>1 Slot Left</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color legend-booked"></div>
                    <span>Fully Booked</span>
                </div>
            </div>
        </div>
    `;
    
    // Add styles for simple calendar
    const style = document.createElement('style');
    style.textContent = `
        .simple-calendar {
            font-family: var(--body-font);
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            padding: 15px;
            background-color: white;
        }
        
        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .month-year {
            margin: 0;
        }
        
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
        }
        
        .weekday {
            text-align: center;
            font-weight: bold;
            padding: 5px;
        }
        
        .day {
            text-align: center;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .day:hover:not(.empty):not(.disabled) {
            background-color: #f0f0f0;
        }
        
        .day.empty {
            background-color: transparent;
            cursor: default;
        }
        
        .day.disabled {
            color: #ccc;
            cursor: not-allowed;
        }
        
        .day.selected {
            background-color: var(--primary-color);
            color: white;
        }
        
        .day.today {
            border: 2px solid var(--primary-color);
        }
        
        .day.available {
            background-color: rgba(76, 175, 80, 0.1);
            border: 1px solid rgba(76, 175, 80, 0.3);
        }
        
        .day.partially-booked {
            background-color: rgba(255, 160, 0, 0.1);
            border: 1px solid rgba(255, 160, 0, 0.3);
        }
        
        .day.fully-booked {
            background-color: rgba(244, 67, 54, 0.1);
            border: 1px solid rgba(244, 67, 54, 0.3);
            color: #999;
        }
    `;
    
    document.head.appendChild(style);
    
    // Add event listeners
    const prevButton = container.querySelector('.prev-month');
    const nextButton = container.querySelector('.next-month');
    const monthYearDisplay = container.querySelector('.month-year');
    
    let displayMonth = currentMonth;
    let displayYear = currentYear;
    
    prevButton.addEventListener('click', function() {
        displayMonth--;
        if (displayMonth < 0) {
            displayMonth = 11;
            displayYear--;
        }
        updateCalendar();
    });
    
    nextButton.addEventListener('click', function() {
        displayMonth++;
        if (displayMonth > 11) {
            displayMonth = 0;
            displayYear++;
        }
        updateCalendar();
    });
    
    // Add click event for days
    container.addEventListener('click', function(e) {
        if (e.target.classList.contains('day') && !e.target.classList.contains('empty') && !e.target.classList.contains('disabled')) {
            // Remove selected class from all days
            container.querySelectorAll('.day').forEach(day => {
                day.classList.remove('selected');
            });
            
            // Add selected class to clicked day
            e.target.classList.add('selected');
            
            // Get the date
            const day = parseInt(e.target.textContent);
            selectedDate = new Date(displayYear, displayMonth, day);
            
            // Update the booking form
            document.getElementById('booking-date').value = formatDate(selectedDate);
            
            // Update available time slots
            updateAvailableTimeSlots(selectedDate);
            
            // Enable the time slot selection
            document.getElementById('booking-time').disabled = false;
            
            // Show availability info
            updateAvailabilityInfo(selectedDate);
        }
    });
    
    function updateCalendar() {
        monthYearDisplay.textContent = `${getMonthName(displayMonth)} ${displayYear}`;
        container.querySelector('.calendar-grid').innerHTML = `
            <div class="weekday">Sun</div>
            <div class="weekday">Mon</div>
            <div class="weekday">Tue</div>
            <div class="weekday">Wed</div>
            <div class="weekday">Thu</div>
            <div class="weekday">Fri</div>
            <div class="weekday">Sat</div>
            ${generateCalendarDays(displayMonth, displayYear)}
        `;
    }
}

/**
 * Generate calendar days for a month
 * @param {number} month - The month (0-11)
 * @param {number} year - The year
 * @returns {string} HTML for calendar days
 */
function generateCalendarDays(month, year) {
    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();
    
    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get today's date
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let html = '';
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="day empty"></div>';
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = formatDateForStorage(date);
        const dateBookings = getBookingsForDate(dateString);
        
        let classes = 'day';
        
        // Check if this is today
        if (day === currentDay && month === currentMonth && year === currentYear) {
            classes += ' today';
        }
        
        // Check if date is in the past
        if (date < new Date().setHours(0, 0, 0, 0)) {
            classes += ' disabled';
        } else {
            // Check booking status
            if (dateBookings.length >= 2) {
                classes += ' fully-booked';
            } else if (dateBookings.length === 1) {
                classes += ' partially-booked';
            } else {
                classes += ' available';
            }
        }
        
        html += `<div class="${classes}">${day}</div>`;
    }
    
    return html;
}

/**
 * Get month name from month number
 * @param {number} month - The month number (0-11)
 * @returns {string} The month name
 */
function getMonthName(month) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
}

/**
 * Initialize the booking form
 * Sets up event listeners and validation
 */
function initializeBookingForm() {
    // Get form elements
    const bookingForm = document.getElementById('booking-form');
    const proceedButton = document.getElementById('proceed-to-payment');
    
    // Check if the form elements exist
    if (!bookingForm || !proceedButton) {
        console.error('Booking form elements not found');
        return;
    }
    
    // Add event listener for form inputs to enable/disable proceed button
    const formInputs = bookingForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('change', validateBookingForm);
        input.addEventListener('input', validateBookingForm);
    });
    
    // Add event listener for proceed button
    proceedButton.addEventListener('click', function() {
        // Validate the form one more time
        if (validateBookingForm()) {
            // Show the payment section
            showPaymentSection();
        }
    });
    
    // Set up payment section buttons
    const submitPaymentButton = document.getElementById('submit-payment');
    const backToBookingButton = document.getElementById('back-to-booking');
    
    if (submitPaymentButton && backToBookingButton) {
        // Back button returns to booking form
        backToBookingButton.addEventListener('click', function() {
            document.getElementById('payment-section').classList.add('d-none');
            document.getElementById('booking-form').closest('.row').classList.remove('d-none');
        });
        
        // Submit button completes the booking
        submitPaymentButton.addEventListener('click', function() {
            // In a real implementation, this would process the payment
            // For this demo, we'll just simulate a successful payment
            completeBooking();
        });
    }
    
    // Set up new booking button in confirmation section
    const newBookingButton = document.getElementById('new-booking');
    if (newBookingButton) {
        newBookingButton.addEventListener('click', function() {
            // Reset the form and show it again
            resetBookingForm();
            document.getElementById('confirmation-section').classList.add('d-none');
            document.getElementById('booking-form').closest('.row').classList.remove('d-none');
        });
    }
    
    console.log('Booking form initialized');
}

/**
 * Validate the booking form
 * @returns {boolean} Whether the form is valid
 */
function validateBookingForm() {
    // Get form elements
    const bookingForm = document.getElementById('booking-form');
    const proceedButton = document.getElementById('proceed-to-payment');
    
    // Check if the form elements exist
    if (!bookingForm || !proceedButton) {
        return false;
    }
    
    // Get required inputs
    const requiredInputs = bookingForm.querySelectorAll('[required]');
    
    // Check if all required fields are filled
    let isValid = true;
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
        }
    });
    
    // Additional validation for email and phone
    const emailInput = document.getElementById('owner-email');
    const phoneInput = document.getElementById('owner-phone');
    
    if (emailInput && emailInput.value && !window.utils.isValidEmail(emailInput.value)) {
        isValid = false;
    }
    
    if (phoneInput && phoneInput.value && !window.utils.isValidPhone(phoneInput.value)) {
        isValid = false;
    }
    
    // Enable/disable the proceed button based on validation
    if (proceedButton) {
        proceedButton.disabled = !isValid;
    }
    
    return isValid;
}

/**
 * Update available time slots based on the selected date
 * @param {Date} date - The selected date
 */
function updateAvailableTimeSlots(date) {
    // Get the time slot select element
    const timeSelect = document.getElementById('booking-time');
    
    // Check if the element exists
    if (!timeSelect) {
        return;
    }
    
    // Clear existing options
    timeSelect.innerHTML = '';
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = 'Select a time';
    timeSelect.appendChild(defaultOption);
    
    // Get bookings for the selected date
    const dateString = formatDateForStorage(date);
    const dateBookings = getBookingsForDate(dateString);
    
    // Define available time slots
    const allTimeSlots = [
        { value: 'morning', text: 'Morning (8:00 AM - 11:00 AM)' },
        { value: 'afternoon', text: 'Afternoon (12:00 PM - 3:00 PM)' },
        { value: 'evening', text: 'Evening (4:00 PM - 7:00 PM)' }
    ];
    
    // Filter out time slots that are already booked
    availableTimeSlots = allTimeSlots.filter(slot => {
        return !dateBookings.some(booking => booking.timeSlot === slot.value);
    });
    
    // Add available time slots to the select element
    availableTimeSlots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot.value;
        option.textContent = slot.text;
        timeSelect.appendChild(option);
    });
}

/**
 * Update the availability info for the selected date
 * @param {Date} date - The selected date
 */
function updateAvailabilityInfo(date) {
    // Get the availability info element
    const availabilityInfo = document.getElementById('availability-info');
    
    // Check if the element exists
    if (!availabilityInfo) {
        return;
    }
    
    // Get bookings for the selected date
    const dateString = formatDateForStorage(date);
    const dateBookings = getBookingsForDate(dateString);
    
    // Update the availability info
    const availableSlots = 2 - dateBookings.length;
    
    if (availableSlots === 0) {
        availabilityInfo.innerHTML = '<p class="text-danger">No available slots for this date.</p>';
    } else if (availableSlots === 1) {
        availabilityInfo.innerHTML = '<p class="text-warning">1 slot available for this date.</p>';
    } else {
        availabilityInfo.innerHTML = '<p class="text-success">2 slots available for this date.</p>';
    }
}

/**
 * Show the payment section and populate booking summary
 */
function showPaymentSection() {
    // Get the payment section
    const paymentSection = document.getElementById('payment-section');
    
    // Check if the element exists
    if (!paymentSection) {
        return;
    }
    
    // Hide the booking form
    document.getElementById('booking-form').closest('.row').classList.add('d-none');
    
    // Show the payment section
    paymentSection.classList.remove('d-none');
    
    // Populate booking summary
    populateBookingSummary();
}

/**
 * Populate the booking summary in the payment section
 */
function populateBookingSummary() {
    // Get the booking summary element
    const summaryElement = document.getElementById('booking-summary-details');
    const totalElement = document.getElementById('booking-total-amount');
    
    // Check if the elements exist
    if (!summaryElement || !totalElement) {
        return;
    }
    
    // Get form values
    const ownerName = document.getElementById('owner-name').value;
    const dogName = document.getElementById('dog-name').value;
    const dogBreed = document.getElementById('dog-breed').value;
    const serviceType = document.getElementById('service-type').value;
    const bookingDate = document.getElementById('booking-date').value;
    const bookingTime = document.getElementById('booking-time').value;
    
    // Get service details
    let serviceDetails = {
        name: 'Unknown Service',
        price: 0
    };
    
    if (serviceType === 'standard') {
        serviceDetails = { name: 'Standard Walk', price: 20 };
    } else if (serviceType === 'extended') {
        serviceDetails = { name: 'Extended Walk', price: 35 };
    } else if (serviceType === 'group') {
        serviceDetails = { name: 'Group Walk', price: 25 };
    }
    
    // Get time slot text
    let timeSlotText = 'Unknown Time';
    availableTimeSlots.forEach(slot => {
        if (slot.value === bookingTime) {
            timeSlotText = slot.text;
        }
    });
    
    // Create summary HTML
    const summaryHTML = `
        <div class="booking-summary-item">
            <p><strong>Owner:</strong> ${ownerName}</p>
            <p><strong>Dog:</strong> ${dogName} (${dogBreed})</p>
            <p><strong>Service:</strong> ${serviceDetails.name}</p>
            <p><strong>Date:</strong> ${bookingDate}</p>
            <p><strong>Time:</strong> ${timeSlotText}</p>
        </div>
    `;
    
    // Update summary and total
    summaryElement.innerHTML = summaryHTML;
    totalElement.textContent = window.utils.formatCurrency(serviceDetails.price);
}

/**
 * Complete the booking process
 * Saves the booking and shows the confirmation
 */
function completeBooking() {
    // Get form values
    const ownerName = document.getElementById('owner-name').value;
    const ownerEmail = document.getElementById('owner-email').value;
    const ownerPhone = document.getElementById('owner-phone').value;
    const dogName = document.getElementById('dog-name').value;
    const dogBreed = document.getElementById('dog-breed').value;
    const serviceType = document.getElementById('service-type').value;
    const bookingDate = selectedDate;
    const bookingTime = document.getElementById('booking-time').value;
    const specialInstructions = document.getElementById('special-instructions').value;
    
    // Create booking object
    const booking = {
        id: generateBookingId(),
        owner: {
            name: ownerName,
            email: ownerEmail,
            phone: ownerPhone
        },
        dog: {
            name: dogName,
            breed: dogBreed
        },
        service: serviceType,
        date: formatDateForStorage(bookingDate),
        timeSlot: bookingTime,
        specialInstructions: specialInstructions,
        createdAt: new Date().toISOString()
    };
    
    // Save the booking
    saveBooking(booking);
    
    // Show confirmation
    showConfirmation(booking);
}

/**
 * Show the booking confirmation
 * @param {Object} booking - The booking object
 */
function showConfirmation(booking) {
    // Get the confirmation section
    const confirmationSection = document.getElementById('confirmation-section');
    const confirmationDetails = document.getElementById('confirmation-details');
    
    // Check if the elements exist
    if (!confirmationSection || !confirmationDetails) {
        return;
    }
    
    // Hide the payment section
    document.getElementById('payment-section').classList.add('d-none');
    
    // Show the confirmation section
    confirmationSection.classList.remove('d-none');
    
    // Get service details
    let serviceName = 'Unknown Service';
    let servicePrice = 0;
    
    if (booking.service === 'standard') {
        serviceName = 'Standard Walk';
        servicePrice = 20;
    } else if (booking.service === 'extended') {
        serviceName = 'Extended Walk';
        servicePrice = 35;
    } else if (booking.service === 'group') {
        serviceName = 'Group Walk';
        servicePrice = 25;
    }
    
    // Get time slot text
    let timeSlotText = 'Unknown Time';
    if (booking.timeSlot === 'morning') {
        timeSlotText = 'Morning (8:00 AM - 11:00 AM)';
    } else if (booking.timeSlot === 'afternoon') {
        timeSlotText = 'Afternoon (12:00 PM - 3:00 PM)';
    } else if (booking.timeSlot === 'evening') {
        timeSlotText = 'Evening (4:00 PM - 7:00 PM)';
    }
    
    // Create confirmation HTML
    const confirmationHTML = `
        <div class="confirmation-details-item">
            <p><strong>Booking Reference:</strong> ${booking.id}</p>
            <p><strong>Owner:</strong> ${booking.owner.name}</p>
            <p><strong>Dog:</strong> ${booking.dog.name} (${booking.dog.breed})</p>
            <p><strong>Service:</strong> ${serviceName}</p>
            <p><strong>Date:</strong> ${formatDateFromStorage(booking.date)}</p>
            <p><strong>Time:</strong> ${timeSlotText}</p>
            <p><strong>Total Paid:</strong> ${window.utils.formatCurrency(servicePrice)}</p>
        </div>
    `;
    
    // Update confirmation details
    confirmationDetails.innerHTML = confirmationHTML;
    
    // Show success notification
    window.utils.showNotification('Booking confirmed successfully!', 'success');
}

/**
 * Reset the booking form
 */
function resetBookingForm() {
    // Get the booking form
    const bookingForm = document.getElementById('booking-form');
    
    // Check if the form exists
    if (!bookingForm) {
        return;
    }
    
    // Reset the form
    bookingForm.reset();
    
    // Reset selected date
    selectedDate = null;
    
    // Disable time slot selection
    document.getElementById('booking-time').disabled = true;
    
    // Reset availability info
    document.getElementById('availability-info').innerHTML = '<p>Available slots will be shown after selecting a date.</p>';
    
    // Disable proceed button
    document.getElementById('proceed-to-payment').disabled = true;
    
    // Reinitialize the calendar
    initializeCalendar();
}

/**
 * Load existing bookings from local storage
 */
function loadExistingBookings() {
    // Get bookings from local storage
    const storedBookings = localStorage.getItem('pawsAndPathsBookings');
    
    // Parse bookings if they exist
    if (storedBookings) {
        bookings = JSON.parse(storedBookings);
        console.log('Loaded', bookings.length, 'existing bookings');
    } else {
        // Initialize with empty array if no bookings exist
        bookings = [];
        console.log('No existing bookings found');
    }
}

/**
 * Save a booking to local storage
 * @param {Object} booking - The booking object to save
 */
function saveBooking(booking) {
    // Add the booking to the array
    bookings.push(booking);
    
    // Save to local storage
    localStorage.setItem('pawsAndPathsBookings', JSON.stringify(bookings));
    
    console.log('Booking saved:', booking.id);
}

/**
 * Get bookings for a specific date
 * @param {string} dateString - The date string in YYYY-MM-DD format
 * @returns {Array} Array of bookings for the date
 */
function getBookingsForDate(dateString) {
    return bookings.filter(booking => booking.date === dateString);
}

/**
 * Generate a unique booking ID
 * @returns {string} Unique booking ID
 */
function generateBookingId() {
    return 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

/**
 * Format a date for display
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    if (!date) return '';
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format a date for storage
 * @param {Date} date - The date to format
 * @returns {string} Date string in YYYY-MM-DD format
 */
function formatDateForStorage(date) {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

/**
 * Format a date from storage format
 * @param {string} dateString - The date string in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
function formatDateFromStorage(dateString) {
    if (!dateString) return '';
    
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    
    return formatDate(date);
}
