// Provider Data
const providers = [
    {
        id: 1,
        name: "Alex Johnson",
        service: "Home Cleaning",
        category: "cleaning",
        price: "$75",
        description: "Professional home cleaning with eco-friendly products. Specialized in deep cleaning kitchens and bathrooms. 5 years experience with excellent reviews.",
        image: "",
        whatsapp: "+14155552671",
        rating: 4.9,
        reviews: 127,
        tags: ["Eco-friendly", "Deep Cleaning", "Same Day"],
        available: true
    },
    {
        id: 2,
        name: "Maria Garcia",
        service: "Handyman Services",
        category: "repair",
        price: "$60/hour",
        description: "General repairs, furniture assembly, painting, and minor electrical/plumbing work. Licensed and insured. Available weekdays and Saturdays.",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        whatsapp: "+14155552672",
        rating: 4.8,
        reviews: 89,
        tags: ["Licensed", "Emergency", "Quality Work"],
        available: true
    },
    {
        id: 3,
        name: "David Chen",
        service: "Personal Trainer",
        category: "fitness",
        price: "$90/session",
        description: "Certified personal trainer specializing in weight loss and strength training. Customized workout plans for all fitness levels. First session free!",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        whatsapp: "+14155552673",
        rating: 4.7,
        reviews: 156,
        tags: ["Certified", "Weight Loss", "Free Trial"],
        available: false
    },
    {
        id: 4,
        name: "Sophie Williams",
        service: "Dog Walking",
        category: "petcare",
        price: "$25/walk",
        description: "Reliable and loving dog walker with 3 years experience. I walk dogs in local parks and provide updates with photos. Available mornings and afternoons.",
        image: "",
        whatsapp: "+14155552674",
        rating: 4.9,
        reviews: 203,
        tags: ["Pet First Aid", "Photo Updates", "Flexible"],
        available: true
    },
    {
        id: 5,
        name: "James Wilson",
        service: "Tutoring - Math & Science",
        category: "education",
        price: "$45/hour",
        description: "High school math and science tutor with Master's in Education. Specializing in Algebra, Calculus, Physics, and Chemistry. Patient and results-oriented.",
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        whatsapp: "+14155552675",
        rating: 4.8,
        reviews: 94,
        tags: ["M.Ed.", "Test Prep", "Online Available"],
        available: true
    },
    {
        id: 6,
        name: "Lisa Rodriguez",
        service: "Massage Therapy",
        category: "wellness",
        price: "$85",
        description: "Licensed massage therapist specializing in deep tissue and sports massage. Helps with stress relief, muscle tension, and injury recovery. Mobile service available.",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
        whatsapp: "+14155552676",
        rating: 4.9,
        reviews: 178,
        tags: ["Licensed", "Mobile Service", "Sports Massage"],
        available: true
    }
];

// Categories for filtering
const categories = [
    { id: 'all', name: 'All Categories', icon: 'fas fa-th' },
    { id: 'cleaning', name: 'Cleaning', icon: 'fas fa-broom' },
    { id: 'repair', name: 'Repair', icon: 'fas fa-tools' },
    { id: 'fitness', name: 'Fitness', icon: 'fas fa-dumbbell' },
    { id: 'petcare', name: 'Pet Care', icon: 'fas fa-paw' },
    { id: 'education', name: 'Education', icon: 'fas fa-graduation-cap' },
    { id: 'wellness', name: 'Wellness', icon: 'fas fa-spa' }
];

// Global state
let currentProvider = null;
let selectedCategory = 'all';
let sortBy = 'rating';

// DOM Elements
const providerFeed = document.getElementById('providerFeed');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');
const searchInput = document.getElementById('searchInput');
const bookingModal = document.getElementById('bookingModal');
const closeModalBtn = document.getElementById('closeModal');
const bookingForm = document.getElementById('bookingForm');
const statusMessage = document.getElementById('statusMessage');
const submitBtn = document.getElementById('submitBtn');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    renderProviderFeed();
    setupEventListeners();
    setDefaultDateTime();
});

// Initialize filter dropdowns
function initializeFilters() {
    if (categoryFilter) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
        
        categoryFilter.addEventListener('change', function() {
            selectedCategory = this.value;
            renderProviderFeed();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            sortBy = this.value;
            renderProviderFeed();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            renderProviderFeed();
        }, 300));
    }
}

// Render provider feed
function renderProviderFeed() {
    if (!providerFeed) return;
    
    let filteredProviders = [...providers];
    
    // Filter by category
    if (selectedCategory !== 'all') {
        filteredProviders = filteredProviders.filter(p => p.category === selectedCategory);
    }
    
    // Filter by search
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    if (searchTerm) {
        filteredProviders = filteredProviders.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.service.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort providers
    filteredProviders.sort((a, b) => {
        switch(sortBy) {
            case 'price-low':
                return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
            case 'price-high':
                return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
            case 'rating':
                return b.rating - a.rating;
            default:
                return 0;
        }
    });
    
    // Render providers
    if (filteredProviders.length === 0) {
        providerFeed.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No providers found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    providerFeed.innerHTML = '';
    filteredProviders.forEach(provider => {
        const card = createProviderCard(provider);
        providerFeed.appendChild(card);
    });
    
    // Add event listeners to book buttons
    document.querySelectorAll('.btn-book').forEach(button => {
        button.addEventListener('click', function() {
            const providerId = parseInt(this.dataset.id);
            openBookingModal(providerId);
        });
    });
}

// Create provider card HTML
function createProviderCard(provider) {
    const card = document.createElement('div');
    card.className = 'provider-card fade-in';
    
    // Get first letter for default avatar
    const firstLetter = provider.name.charAt(0).toUpperCase();
    
    // Format rating stars
    const stars = '★'.repeat(Math.floor(provider.rating)) + '☆'.repeat(5 - Math.floor(provider.rating));
    
    card.innerHTML = `
        ${provider.available ? '' : '<div class="provider-badge">Unavailable</div>'}
        
        <div class="provider-image">
            ${provider.image 
                ? `<img src="${provider.image}" alt="${provider.name}" loading="lazy">`
                : `<div style="background: var(--primary-light); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 4rem; font-weight: bold;">${firstLetter}</div>`
            }
        </div>
        
        <div class="provider-info">
            <div class="provider-header">
                <div class="provider-avatar">
                    ${provider.image 
                        ? `<img src="${provider.image}" alt="${provider.name}">`
                        : `<div style="background: var(--primary); color: white; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold;">${firstLetter}</div>`
                    }
                </div>
                <div class="provider-meta">
                    <h3 class="provider-name">${provider.name}</h3>
                    <div class="provider-category">
                        <i class="fas fa-tag"></i>
                        ${provider.service}
                    </div>
                    <div class="provider-rating">
                        ${stars}
                        <span>${provider.rating} (${provider.reviews} reviews)</span>
                    </div>
                </div>
            </div>
            
            <div class="provider-price">
                ${provider.price} ${provider.price.includes('/') ? '' : '<span>/ service</span>'}
            </div>
            
            <p class="provider-description">${provider.description}</p>
            
            <div class="provider-tags">
                ${provider.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            
            <button class="btn btn-primary w-full btn-book" data-id="${provider.id}" ${!provider.available ? 'disabled' : ''}>
                <i class="fas fa-calendar-plus"></i>
                ${provider.available ? 'BOOK NOW' : 'UNAVAILABLE'}
            </button>
        </div>
    `;
    
    return card;
}

// Open booking modal
function openBookingModal(providerId) {
    currentProvider = providers.find(p => p.id === providerId);
    
    if (!currentProvider) return;
    
    // Update modal title
    document.querySelector('.modal-header h2').textContent = `Book ${currentProvider.name}`;
    
    // Show modal
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset form and status
    bookingForm.reset();
    statusMessage.className = 'status-message';
    statusMessage.textContent = '';
    
    // Set default date/time
    setDefaultDateTime();
}

// Close booking modal
function closeBookingModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = 'auto';
    currentProvider = null;
}

// Set default date/time
function setDefaultDateTime() {
    const now = new Date();
    const defaultDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    defaultDate.setHours(10, 0, 0, 0);
    
    const year = defaultDate.getFullYear();
    const month = String(defaultDate.getMonth() + 1).padStart(2, '0');
    const day = String(defaultDate.getDate()).padStart(2, '0');
    const hours = String(defaultDate.getHours()).padStart(2, '0');
    const minutes = String(defaultDate.getMinutes()).padStart(2, '0');
    
    const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    const serviceTimeInput = document.getElementById('serviceTime');
    if (serviceTimeInput) {
        serviceTimeInput.value = dateTimeString;
        serviceTimeInput.min = new Date().toISOString().slice(0, 16);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeBookingModal);
    }
    
    // Close modal on overlay click
    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });
    }
    
    // Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('active')) {
            closeBookingModal();
        }
    });
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form values
    const formData = {
        customerName: document.getElementById('customerName').value.trim(),
        customerEmail: document.getElementById('customerEmail').value.trim(),
        customerPhone: document.getElementById('customerPhone').value.trim(),
        customerAddress: document.getElementById('customerAddress').value.trim(),
        serviceTime: document.getElementById('serviceTime').value,
        note: document.getElementById('note').value.trim()
    };
    
    // Prepare payload
    const payload = {
        action: "createBooking",
        worker_name: currentProvider.name,
        service: currentProvider.service,
        worker_whatsapp: currentProvider.whatsapp,
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        customer_address: formData.customerAddress,
        service_time: formData.serviceTime,
        note: formData.note || "(No note provided)"
    };
    
    // Show loading state
    showLoadingState(true);
    showStatusMessage('Submitting your booking request...', 'loading');
    
    try {
        // Use the provided Google Apps Script URL
        const response = await fetch("https://script.google.com/macros/s/AKfycbwiQa0DhGs5rfNySr80TzBxLPfUQcW6YjZbM2oLnr6p7z-j0GE2KZplNq0In6QC8Ec/exec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showStatusMessage(
                `Booking request sent successfully! ${currentProvider.name} will contact you via WhatsApp to confirm.`,
                'success'
            );
            
            // Reset form
            bookingForm.reset();
            setDefaultDateTime();
            
            // Close modal after 3 seconds
            setTimeout(() => {
                closeBookingModal();
            }, 3000);
        } else {
            throw new Error(result.error || 'Booking failed');
        }
        
    } catch (error) {
        showStatusMessage(
            `Sorry, there was an error submitting your booking. Please try again or contact ${currentProvider.name} directly at ${currentProvider.whatsapp}.`,
            'error'
        );
        console.error('Booking error:', error);
    } finally {
        showLoadingState(false);
    }
}

// Validate form
function validateForm() {
    const fields = ['customerName', 'customerEmail', 'customerPhone', 'customerAddress', 'serviceTime'];
    let isValid = true;
    
    // Reset error styles
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.style.borderColor = '';
        }
    });
    
    // Validate each field
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            if (field) {
                field.style.borderColor = 'var(--error)';
                field.focus();
            }
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('customerEmail');
    if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
            emailField.style.borderColor = 'var(--error)';
            isValid = false;
        }
    }
    
    if (!isValid) {
        showStatusMessage('Please fill in all required fields correctly.', 'error');
    }
    
    return isValid;
}

// Show/hide loading state
function showLoadingState(isLoading) {
    if (!submitBtn) return;
    
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    
    if (isLoading) {
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (spinner) spinner.style.display = 'block';
    } else {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'block';
        if (spinner) spinner.style.display = 'none';
    }
}

// Show status message
function showStatusMessage(message, type) {
    if (!statusMessage) return;
    
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // Auto-hide error messages
    if (type === 'error') {
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
        }, 5000);
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}