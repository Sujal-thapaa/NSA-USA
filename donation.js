// Donation & Help System JavaScript with Stripe Integration

// Initialize Stripe with the provided publishable key
const stripe = Stripe('pk_test_51RzS8eHDmi5xAocu2FOPT5IFHmX2ahZz2vgUuzIeCJd4KxsWpyCT7uurJv97fFW4KUtNU8f7fLdb0fhn6Z06jzjM00GFOWdD67');

// Sample data - In a real application, this would come from a backend API
let donationData = {
    totalFunds: 15750,
    totalDonors: 892,
    helpedFamilies: 12,
    targetMembers: 50000,
    currentMembers: 2340
};

let helpRequests = [
    {
        id: 1,
        type: 'medical',
        title: 'Emergency Surgery for Priya',
        description: 'Priya needs immediate surgery after a severe car accident. Her family is struggling with mounting medical bills and needs community support.',
        amountNeeded: 5000,
        amountRaised: 3250,
        urgency: 'critical',
        location: 'Boston, MA',
        postedDate: '2024-01-15',
        donorCount: 87
    },
    {
        id: 2,
        type: 'bereavement',
        title: 'Support for Sharma Family',
        description: 'After the sudden loss of their father, the Sharma family needs help with funeral expenses and temporary financial support.',
        amountNeeded: 3500,
        amountRaised: 2100,
        urgency: 'urgent',
        location: 'New York, NY',
        postedDate: '2024-01-12',
        donorCount: 56
    },
    {
        id: 3,
        type: 'housing',
        title: 'Emergency Housing for Raj',
        description: 'Raj was unexpectedly evicted and needs immediate help securing temporary housing and deposits for a new apartment.',
        amountNeeded: 2000,
        amountRaised: 800,
        urgency: 'urgent',
        location: 'Los Angeles, CA',
        postedDate: '2024-01-10',
        donorCount: 23
    },
    {
        id: 4,
        type: 'medical',
        title: 'Cancer Treatment for Maya',
        description: 'Maya is battling cancer and her insurance doesn\'t cover all treatment costs. The family needs help with medical expenses.',
        amountNeeded: 8000,
        amountRaised: 4500,
        urgency: 'moderate',
        location: 'Chicago, IL',
        postedDate: '2024-01-08',
        donorCount: 134
    }
];

// Stripe Elements
let elements;
let cardElement;
let clientSecret = null;
let selectedAmount = 0;

// Initialize the donation page
document.addEventListener('DOMContentLoaded', function() {
    updateStatistics();
    loadHelpRequests();
    initializeModals();
    initializeDonationForm();
    initializeHelpRequestForm();
    updateProgressCircle();
    initializeStripe();
});

// Initialize premium form inputs
function initializeStripe() {
    // Initialize card input formatters
    initializeCardFormatting();
    
    // Note: We're using custom inputs instead of Stripe Elements for the professional look
    // In a real implementation, you'd still use Stripe.js for actual payment processing
}

// Update statistics on the page
function updateStatistics() {
    document.getElementById('totalFunds').textContent = `$${donationData.totalFunds.toLocaleString()}`;
    document.getElementById('totalDonors').textContent = donationData.totalDonors.toLocaleString();
    document.getElementById('helpedFamilies').textContent = donationData.helpedFamilies;
}

// Update the circular progress indicator
function updateProgressCircle() {
    const progressCircle = document.getElementById('progressCircle');
    const percentage = (donationData.currentMembers / donationData.targetMembers) * 100;
    const circumference = 2 * Math.PI * 90; // radius = 90
    const offset = circumference - (percentage / 100) * circumference;
    
    progressCircle.style.strokeDashoffset = offset;
}

// Load and display help requests
function loadHelpRequests() {
    const grid = document.getElementById('helpRequestsGrid');
    grid.innerHTML = '';
    
    helpRequests.forEach(request => {
        const requestCard = createRequestCard(request);
        grid.appendChild(requestCard);
    });
}

// Create a help request card
function createRequestCard(request) {
    const card = document.createElement('div');
    card.className = 'request-card';
    
    const progressPercentage = Math.round((request.amountRaised / request.amountNeeded) * 100);
    const daysAgo = Math.floor((new Date() - new Date(request.postedDate)) / (1000 * 60 * 60 * 24));
    
    card.innerHTML = `
        <div class="request-header">
            <div class="request-type ${request.type}">
                <i class="fas fa-${getTypeIcon(request.type)}"></i>
                ${getTypeLabel(request.type)}
            </div>
            <div class="request-amount">$${request.amountNeeded.toLocaleString()}</div>
        </div>
        <div class="request-body">
            <h3 class="request-title">${request.title}</h3>
            <p class="request-description">${request.description}</p>
            
            <div class="request-progress">
                <div class="progress-info">
                    <span class="progress-raised">$${request.amountRaised.toLocaleString()} raised</span>
                    <span class="progress-percentage">${progressPercentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
            </div>
            
            <div class="request-meta">
                <span><i class="fas fa-map-marker-alt"></i> ${request.location}</span>
                <span><i class="fas fa-calendar"></i> ${daysAgo} days ago</span>
                <span><i class="fas fa-users"></i> ${request.donorCount} donors</span>
            </div>
            
            <div class="request-footer">
                <button class="btn btn-primary" onclick="openDonateToRequestModal(${request.id})">
                    <i class="fas fa-heart"></i>
                    Donate Now
                </button>
                <button class="btn btn-secondary" onclick="shareRequest(${request.id})">
                    <i class="fas fa-share"></i>
                    Share
                </button>
                <div class="urgency-badge ${request.urgency}">
                    <i class="fas fa-${getUrgencyIcon(request.urgency)}"></i>
                    ${request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Helper functions for request cards
function getTypeIcon(type) {
    const icons = {
        'medical': 'stethoscope',
        'bereavement': 'dove',
        'housing': 'home',
        'emergency': 'exclamation-triangle',
        'financial': 'dollar-sign'
    };
    return icons[type] || 'question-circle';
}

function getTypeLabel(type) {
    const labels = {
        'medical': 'Medical Emergency',
        'bereavement': 'Bereavement Support',
        'housing': 'Housing Crisis',
        'emergency': 'Emergency',
        'financial': 'Financial Hardship'
    };
    return labels[type] || 'Other';
}

function getUrgencyIcon(urgency) {
    const icons = {
        'critical': 'exclamation-circle',
        'urgent': 'clock',
        'moderate': 'info-circle'
    };
    return icons[urgency] || 'info-circle';
}

// Modal management
function initializeModals() {
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Donation modal functions
function openDonateModal() {
    document.getElementById('donateModal').style.display = 'flex';
    resetDonationForm();
}

function closeDonateModal() {
    document.getElementById('donateModal').style.display = 'none';
}

function openDonateToRequestModal(requestId) {
    const request = helpRequests.find(r => r.id === requestId);
    if (request) {
        openDonateModal();
        // Pre-fill some information for the specific request
        document.getElementById('payment-form').dataset.requestId = requestId;
    }
}

// Success modal functions
function openSuccessModal(amount, transactionId) {
    document.getElementById('success-amount').textContent = formatCurrency(amount);
    document.getElementById('success-transaction').textContent = transactionId;
    document.getElementById('successModal').style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Help request modal functions
function openHelpRequestModal() {
    document.getElementById('helpRequestModal').style.display = 'flex';
    resetHelpRequestForm();
}

function closeHelpRequestModal() {
    document.getElementById('helpRequestModal').style.display = 'none';
}

// Initialize card input formatting
function initializeCardFormatting() {
    const cardNumberInput = document.getElementById('cardNumber');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCVCInput = document.getElementById('cardCVC');
    const cardIcons = document.querySelectorAll('.card-icon');

    // Format card number
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
            
            // Detect card type and highlight icon
            const cardType = detectCardType(value);
            cardIcons.forEach(icon => {
                icon.classList.remove('active');
                if (icon.classList.contains(cardType)) {
                    icon.classList.add('active');
                }
            });
        });
    }

    // Format expiry date
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Format CVC
    if (cardCVCInput) {
        cardCVCInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
}

// Detect card type based on number
function detectCardType(number) {
    const patterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/
    };
    
    for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(number)) {
            return type;
        }
    }
    return '';
}

// Initialize donation form
function initializeDonationForm() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    const customAmountDiv = document.querySelector('.custom-amount');
    
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            if (this.classList.contains('custom')) {
                customAmountDiv.style.display = 'block';
                customAmountInput.focus();
            } else {
                customAmountDiv.style.display = 'none';
                customAmountInput.value = '';
                selectedAmount = parseFloat(this.dataset.amount);
                updateDonationSummary();
            }
        });
    });
    
    // Handle custom amount input
    customAmountInput.addEventListener('input', function() {
        selectedAmount = parseFloat(this.value) || 0;
        updateDonationSummary();
    });
    
    // Handle payment form submission
    document.getElementById('payment-form').addEventListener('submit', handlePaymentSubmission);
}

// Update donation summary
function updateDonationSummary() {
    const donationAmount = document.getElementById('donation-amount');
    const totalAmount = document.getElementById('total-amount');
    
    donationAmount.textContent = formatCurrency(selectedAmount);
    totalAmount.textContent = formatCurrency(selectedAmount);
}

// Handle payment form submission
async function handlePaymentSubmission(event) {
    event.preventDefault();
    
    if (!selectedAmount || selectedAmount <= 0) {
        showError('Please select or enter a valid donation amount.');
        return;
    }
    
    const name = document.getElementById('donorName').value;
    const email = document.getElementById('donorEmail').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVC = document.getElementById('cardCVC').value;
    const cardName = document.getElementById('cardName').value;
    
    if (!name || !email) {
        showError('Please fill in all required fields.');
        return;
    }
    
    if (!cardNumber || !cardExpiry || !cardCVC || !cardName) {
        showError('Please fill in all card details.');
        return;
    }
    
    // Basic validation
    if (!isValidCardNumber(cardNumber)) {
        showError('Please enter a valid card number.');
        return;
    }
    
    if (!isValidExpiry(cardExpiry)) {
        showError('Please enter a valid expiry date.');
        return;
    }
    
    if (!isValidCVC(cardCVC)) {
        showError('Please enter a valid CVC.');
        return;
    }
    
    setLoading(true);
    
    // Simulate payment processing for demo purposes
    setTimeout(() => {
        // For demo: simulate successful payment with test card
        if (cardNumber.replace(/\s/g, '') === '4242424242424242') {
            const mockPaymentIntent = {
                id: 'pi_demo_' + Math.random().toString(36).substr(2, 9),
                status: 'succeeded'
            };
            handlePaymentSuccess(mockPaymentIntent);
        } else {
            showError('For demo purposes, please use card number 4242 4242 4242 4242');
            setLoading(false);
        }
    }, 2000);
}

// Create payment intent on backend
async function createPaymentIntent(amount) {
    try {
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: Math.round(amount * 100), // Convert to cents
                currency: 'usd',
                metadata: {
                    donorName: document.getElementById('donorName').value,
                    donorEmail: document.getElementById('donorEmail').value,
                    university: document.getElementById('donorUniversity').value,
                    anonymous: document.getElementById('anonymousDonation').checked,
                    message: document.getElementById('donationMessage').value,
                    requestId: document.getElementById('payment-form').dataset.requestId || null
                }
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to create payment intent');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw new Error('Unable to process payment. Please check your connection and try again.');
    }
}

// Handle successful payment
function handlePaymentSuccess(paymentIntent) {
    // Update statistics
    donationData.totalFunds += selectedAmount;
    donationData.totalDonors += 1;
    updateStatistics();
    
    // Update specific request if applicable
    const requestId = document.getElementById('payment-form').dataset.requestId;
    if (requestId) {
        const request = helpRequests.find(r => r.id === parseInt(requestId));
        if (request) {
            request.amountRaised += selectedAmount;
            request.donorCount += 1;
            loadHelpRequests(); // Reload to show updated progress
        }
    }
    
    // Close donation modal and show success
    closeDonateModal();
    setLoading(false);
    
    // Show success modal
    openSuccessModal(selectedAmount, paymentIntent.id);
}

// Set loading state
function setLoading(isLoading) {
    const submitButton = document.getElementById('submit-button');
    const buttonText = document.getElementById('button-text');
    const spinner = document.getElementById('spinner');
    
    if (isLoading) {
        submitButton.disabled = true;
        buttonText.classList.add('hidden');
        spinner.classList.remove('hidden');
    } else {
        submitButton.disabled = false;
        buttonText.classList.remove('hidden');
        spinner.classList.add('hidden');
    }
}

// Validation functions
function isValidCardNumber(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleanNumber);
}

function isValidExpiry(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    
    const [month, year] = expiry.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    const expiryYear = parseInt(year, 10);
    const expiryMonth = parseInt(month, 10);
    
    if (expiryMonth < 1 || expiryMonth > 12) return false;
    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
    
    return true;
}

function isValidCVC(cvc) {
    return /^\d{3,4}$/.test(cvc);
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('card-errors');
    errorElement.textContent = message;
    
    // Also show as alert for critical errors
    if (message.includes('connection') || message.includes('server')) {
        alert(message);
    }
}

// Initialize help request form
function initializeHelpRequestForm() {
    document.getElementById('helpRequestForm').addEventListener('submit', handleHelpRequestSubmission);
    
    // Handle file upload display
    const fileInput = document.getElementById('supportingDocs');
    fileInput.addEventListener('change', function() {
        const fileCount = this.files.length;
        const label = this.parentElement.querySelector('.file-upload-label span');
        if (fileCount > 0) {
            label.textContent = `${fileCount} file(s) selected`;
        } else {
            label.textContent = 'Click to upload medical bills, death certificates, police reports, etc.';
        }
    });
}

// Handle help request form submission
function handleHelpRequestSubmission(event) {
    event.preventDefault();
    
    const requestData = {
        name: document.getElementById('requestorName').value,
        phone: document.getElementById('requestorPhone').value,
        email: document.getElementById('requestorEmail').value,
        location: document.getElementById('requestorLocation').value,
        type: document.getElementById('emergencyType').value,
        description: document.getElementById('emergencyDescription').value,
        amount: parseFloat(document.getElementById('amountNeeded').value),
        urgency: document.getElementById('urgencyLevel').value,
        additionalInfo: document.getElementById('additionalInfo').value,
        files: document.getElementById('supportingDocs').files
    };
    
    // Validate required fields
    if (!requestData.name || !requestData.phone || !requestData.email || !requestData.location) {
        alert('Please fill in all required personal information fields.');
        return;
    }
    
    if (!requestData.type || !requestData.description || !requestData.amount || !requestData.urgency) {
        alert('Please fill in all required emergency details.');
        return;
    }
    
    if (requestData.amount < 1) {
        alert('Please enter a valid amount needed (minimum $1).');
        return;
    }
    
    if (requestData.amount > 100000) {
        alert('Please enter a reasonable amount (maximum $100,000).');
        return;
    }
    
    // Check if required checkboxes are checked
    if (!document.getElementById('verifyTruthfulness').checked) {
        alert('Please verify that all information provided is truthful and accurate.');
        return;
    }
    
    if (!document.getElementById('agreeToReview').checked) {
        alert('Please acknowledge that your request will be reviewed by the community committee.');
        return;
    }
    
    // Process the request
    processHelpRequest(requestData);
}

// Process help request and add to list
function processHelpRequest(data) {
    // Show loading state
    const submitBtn = document.querySelector('#helpRequestForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Generate appropriate title based on emergency type
        const titleTemplates = {
            'medical': `Medical Emergency for ${data.name}`,
            'death': `Support for ${data.name}'s Family`,
            'accident': `Accident Recovery Support for ${data.name}`,
            'housing': `Emergency Housing for ${data.name}`,
            'financial': `Financial Hardship Support for ${data.name}`,
            'other': `Emergency Support for ${data.name}`
        };
        
        // Create new help request object
        const newRequest = {
            id: Date.now(), // Use timestamp for unique ID
            type: data.type,
            title: titleTemplates[data.type] || titleTemplates['other'],
            description: data.description,
            amountNeeded: data.amount,
            amountRaised: 0,
            urgency: data.urgency,
            location: data.location,
            postedDate: new Date().toISOString().split('T')[0], // Today's date
            donorCount: 0,
            // Additional metadata
            requestorName: data.name,
            requestorEmail: data.email,
            requestorPhone: data.phone,
            additionalInfo: data.additionalInfo,
            fileCount: data.files ? data.files.length : 0,
            status: 'pending' // For future use
        };
        
        // Add to the beginning of the array (most recent first)
        helpRequests.unshift(newRequest);
        
        // Refresh the display
        loadHelpRequests();
        
        // Update statistics
        updateStatistics();
        
        // Show success message
        showSuccessMessage(`Thank you ${data.name}!`, 
            `Your help request has been submitted successfully and is now visible in the Current Help Requests section below. Our review committee will evaluate your request within 24-48 hours and contact you via email.`);
        
        // Reset form and close modal
        resetHelpRequestForm();
        closeHelpRequestModal();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Scroll to the requests section to show the new request
        setTimeout(() => {
            document.querySelector('.active-requests').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Highlight the new request temporarily
            const firstRequestCard = document.querySelector('.request-card');
            if (firstRequestCard) {
                firstRequestCard.style.border = '3px solid #10b981';
                firstRequestCard.style.boxShadow = '0 8px 25px -8px rgba(16, 185, 129, 0.5)';
                
                // Remove highlight after 3 seconds
                setTimeout(() => {
                    firstRequestCard.style.border = '';
                    firstRequestCard.style.boxShadow = '';
                }, 3000);
            }
        }, 500);
        
    }, 2000);
}

// Reset donation form
function resetDonationForm() {
    document.getElementById('payment-form').reset();
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.custom-amount').style.display = 'none';
    delete document.getElementById('payment-form').dataset.requestId;
    selectedAmount = 0;
    updateDonationSummary();
    
    // Clear any error messages
    document.getElementById('card-errors').textContent = '';
    
    // Reset card icons
    document.querySelectorAll('.card-icon').forEach(icon => {
        icon.classList.remove('active');
    });
}

// Reset help request form
function resetHelpRequestForm() {
    document.getElementById('helpRequestForm').reset();
    const fileLabel = document.querySelector('.file-upload-label span');
    fileLabel.textContent = 'Click to upload medical bills, death certificates, police reports, etc.';
}

// Share request functionality
function shareRequest(requestId) {
    const request = helpRequests.find(r => r.id === requestId);
    if (request) {
        const shareText = `Please help ${request.title}. They need $${request.amountNeeded.toLocaleString()} for ${request.description.substring(0, 100)}... Every donation counts! #NSACommunitySupport`;
        
        if (navigator.share) {
            navigator.share({
                title: request.title,
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(shareText + ' ' + window.location.href).then(() => {
                alert('Request details copied to clipboard! Share it on social media to help spread the word.');
            });
        }
    }
}

// Load more requests functionality
document.getElementById('loadMoreRequests')?.addEventListener('click', function() {
    // In a real application, this would load more requests from the API
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    setTimeout(() => {
        this.innerHTML = '<i class="fas fa-plus"></i> Load More Requests';
        // For demo purposes, we'll just show a message
        alert('No more requests to load at this time.');
    }, 1000);
});

// Sidebar toggle functionality (inherited from main script)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
}

// Animation for statistics on page load
function animateStatistics() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (stat.id === 'totalFunds') {
                stat.textContent = `$${Math.floor(current).toLocaleString()}`;
            } else {
                stat.textContent = Math.floor(current).toLocaleString();
            }
        }, 50);
    });
}

// Initialize animations when page loads
setTimeout(animateStatistics, 500);

// Utility function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Show success message (better than alert)
function showSuccessMessage(title, message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="notification-text">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .success-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                border-left: 4px solid #10b981;
                animation: slideIn 0.3s ease-out;
            }
            
            .notification-content {
                padding: 1.5rem;
                display: flex;
                align-items: flex-start;
                gap: 1rem;
            }
            
            .notification-icon {
                color: #10b981;
                font-size: 1.5rem;
                margin-top: 0.25rem;
            }
            
            .notification-text h4 {
                margin: 0 0 0.5rem 0;
                color: #1f2937;
                font-size: 1.125rem;
                font-weight: 600;
            }
            
            .notification-text p {
                margin: 0;
                color: #6b7280;
                font-size: 0.875rem;
                line-height: 1.5;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                font-size: 1rem;
                padding: 0.25rem;
                margin-left: auto;
                margin-top: -0.25rem;
            }
            
            .notification-close:hover {
                color: #6b7280;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 8000);
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openDonateModal,
        closeDonateModal,
        openHelpRequestModal,
        closeHelpRequestModal,
        toggleSidebar,
        closeSuccessModal,
        showSuccessMessage
    };
}