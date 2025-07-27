document.addEventListener('DOMContentLoaded', function() {
    // Sample doctor data - In a real app, this would come from an API
    const doctorsData = [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            location: "New York, NY",
            rating: 4.9,
            reviews: 156,
            experience: "15 years",
            education: "Harvard Medical School",
            languages: ["English", "Spanish"],
            insurance: ["Blue Cross", "Aetna", "Cigna"],
            about: "Dr. Johnson is a board-certified cardiologist with over 15 years of experience treating heart conditions. She specializes in preventive cardiology and minimally invasive procedures.",
            services: ["Heart Disease Treatment", "Cardiac Catheterization", "Echocardiography", "Stress Testing"],
            availability: {
                "Monday": "9:00 AM - 5:00 PM",
                "Tuesday": "9:00 AM - 5:00 PM",
                "Wednesday": "9:00 AM - 3:00 PM",
                "Thursday": "9:00 AM - 5:00 PM",
                "Friday": "9:00 AM - 4:00 PM",
                "Saturday": "Closed",
                "Sunday": "Closed"
            },
            phone: "(555) 123-4567",
            email: "dr.johnson@heartcare.com",
            address: "123 Medical Center Dr, New York, NY 10001",
            nextAvailable: "Today"
        },
        {
            id: 2,
            name: "Dr. Michael Chen",
            specialty: "Dermatologist",
            location: "Los Angeles, CA",
            rating: 4.8,
            reviews: 203,
            experience: "12 years",
            education: "Stanford University School of Medicine",
            languages: ["English", "Mandarin"],
            insurance: ["Kaiser", "Blue Cross", "United Healthcare"],
            about: "Dr. Chen is a renowned dermatologist specializing in both medical and cosmetic dermatology. He has extensive experience in treating skin cancer and advanced cosmetic procedures.",
            services: ["Skin Cancer Screening", "Acne Treatment", "Botox", "Laser Therapy", "Mole Removal"],
            availability: {
                "Monday": "8:00 AM - 6:00 PM",
                "Tuesday": "8:00 AM - 6:00 PM",
                "Wednesday": "8:00 AM - 6:00 PM",
                "Thursday": "8:00 AM - 6:00 PM",
                "Friday": "8:00 AM - 4:00 PM",
                "Saturday": "9:00 AM - 2:00 PM",
                "Sunday": "Closed"
            },
            phone: "(555) 234-5678",
            email: "dr.chen@skincare.com",
            address: "456 Wellness Blvd, Los Angeles, CA 90210",
            nextAvailable: "Tomorrow"
        },
        {
            id: 3,
            name: "Dr. Emily Rodriguez",
            specialty: "Pediatrician",
            location: "Chicago, IL",
            rating: 4.9,
            reviews: 189,
            experience: "10 years",
            education: "Johns Hopkins School of Medicine",
            languages: ["English", "Spanish", "Portuguese"],
            insurance: ["Blue Cross", "Medicaid", "Humana"],
            about: "Dr. Rodriguez is a compassionate pediatrician dedicated to providing comprehensive care for children from infancy through adolescence. She has a special interest in childhood development and preventive care.",
            services: ["Well-Child Visits", "Vaccinations", "Sick Visits", "Development Screening", "Behavioral Counseling"],
            availability: {
                "Monday": "7:00 AM - 5:00 PM",
                "Tuesday": "7:00 AM - 5:00 PM",
                "Wednesday": "7:00 AM - 5:00 PM",
                "Thursday": "7:00 AM - 5:00 PM",
                "Friday": "7:00 AM - 3:00 PM",
                "Saturday": "8:00 AM - 12:00 PM",
                "Sunday": "Closed"
            },
            phone: "(555) 345-6789",
            email: "dr.rodriguez@kidcare.com",
            address: "789 Children's Way, Chicago, IL 60601",
            nextAvailable: "This Week"
        },
        {
            id: 4,
            name: "Dr. James Wilson",
            specialty: "Orthopedic Surgeon",
            location: "Houston, TX",
            rating: 4.7,
            reviews: 142,
            experience: "18 years",
            education: "Mayo Clinic School of Medicine",
            languages: ["English"],
            insurance: ["Blue Cross", "Aetna", "United Healthcare", "Medicare"],
            about: "Dr. Wilson is a highly skilled orthopedic surgeon specializing in sports medicine and joint replacement. He has performed over 2,000 successful surgeries and is known for his innovative techniques.",
            services: ["Joint Replacement", "Sports Injury Treatment", "Arthroscopy", "Fracture Repair", "Physical Therapy"],
            availability: {
                "Monday": "6:00 AM - 4:00 PM",
                "Tuesday": "6:00 AM - 4:00 PM",
                "Wednesday": "Surgery Day",
                "Thursday": "6:00 AM - 4:00 PM",
                "Friday": "6:00 AM - 2:00 PM",
                "Saturday": "Emergency Only",
                "Sunday": "Closed"
            },
            phone: "(555) 456-7890",
            email: "dr.wilson@orthocenter.com",
            address: "321 Sports Medicine Dr, Houston, TX 77001",
            nextAvailable: "Next Week"
        },
        {
            id: 5,
            name: "Dr. Lisa Thompson",
            specialty: "Psychiatrist",
            location: "Seattle, WA",
            rating: 4.8,
            reviews: 167,
            experience: "14 years",
            education: "University of Washington School of Medicine",
            languages: ["English", "French"],
            insurance: ["Blue Cross", "Cigna", "Molina"],
            about: "Dr. Thompson is a board-certified psychiatrist with expertise in treating anxiety, depression, and ADHD. She takes a holistic approach to mental health, combining medication management with therapy.",
            services: ["Depression Treatment", "Anxiety Therapy", "ADHD Management", "Medication Management", "Cognitive Behavioral Therapy"],
            availability: {
                "Monday": "9:00 AM - 6:00 PM",
                "Tuesday": "9:00 AM - 6:00 PM",
                "Wednesday": "9:00 AM - 6:00 PM",
                "Thursday": "9:00 AM - 6:00 PM",
                "Friday": "9:00 AM - 4:00 PM",
                "Saturday": "10:00 AM - 2:00 PM",
                "Sunday": "Closed"
            },
            phone: "(555) 567-8901",
            email: "dr.thompson@mindcare.com",
            address: "654 Mental Health Ave, Seattle, WA 98101",
            nextAvailable: "Today"
        },
        {
            id: 6,
            name: "Dr. Robert Kim",
            specialty: "Neurologist",
            location: "Boston, MA",
            rating: 4.9,
            reviews: 134,
            experience: "16 years",
            education: "Harvard Medical School",
            languages: ["English", "Korean"],
            insurance: ["Blue Cross", "Harvard Pilgrim", "Tufts"],
            about: "Dr. Kim is a leading neurologist specializing in stroke treatment, epilepsy, and neurodegenerative diseases. He is actively involved in clinical research and has published numerous papers.",
            services: ["Stroke Treatment", "Epilepsy Management", "Migraine Treatment", "Memory Disorders", "EEG Testing"],
            availability: {
                "Monday": "8:00 AM - 5:00 PM",
                "Tuesday": "8:00 AM - 5:00 PM",
                "Wednesday": "8:00 AM - 5:00 PM",
                "Thursday": "8:00 AM - 5:00 PM",
                "Friday": "8:00 AM - 3:00 PM",
                "Saturday": "Closed",
                "Sunday": "Closed"
            },
            phone: "(555) 678-9012",
            email: "dr.kim@neurocenter.com",
            address: "987 Brain Health St, Boston, MA 02101",
            nextAvailable: "This Week"
        }
    ];

    // State management
    let currentPage = 1;
    const itemsPerPage = 6;
    let filteredDoctors = [...doctorsData];
    let currentFilters = {
        search: '',
        specialty: '',
        location: '',
        rating: '',
        availability: ''
    };

    // DOM elements
    const doctorsGrid = document.getElementById('doctorsGrid');
    const searchInput = document.getElementById('doctorSearch');
    const clearSearchBtn = document.getElementById('clearSearch');
    const specialtyFilter = document.getElementById('specialtyFilter');
    const locationFilter = document.getElementById('locationFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const totalDoctorsSpan = document.getElementById('totalDoctors');
    const specialtiesCountSpan = document.getElementById('specialtiesCount');
    const noResults = document.getElementById('noResults');
    const pagination = document.getElementById('pagination');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const doctorModal = document.getElementById('doctorModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalBody = document.getElementById('modalBody');
    const modalDoctorName = document.getElementById('modalDoctorName');
    const successMessage = document.getElementById('successMessage');

    // Initialize the application
    function init() {
        populateFilters();
        updateStats();
        renderDoctors();
        attachEventListeners();
    }

    // Populate filter dropdowns
    function populateFilters() {
        // Get unique specialties
        const specialties = [...new Set(doctorsData.map(doctor => doctor.specialty))].sort();
        specialties.forEach(specialty => {
            const option = document.createElement('option');
            option.value = specialty;
            option.textContent = specialty;
            specialtyFilter.appendChild(option);
        });

        // Get unique locations
        const locations = [...new Set(doctorsData.map(doctor => doctor.location))].sort();
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        });
    }

    // Update header statistics
    function updateStats() {
        totalDoctorsSpan.textContent = filteredDoctors.length;
        const uniqueSpecialties = new Set(filteredDoctors.map(doctor => doctor.specialty));
        specialtiesCountSpan.textContent = uniqueSpecialties.size;
    }

    // Apply filters to doctors data
    function applyFilters() {
        filteredDoctors = doctorsData.filter(doctor => {
            // Search filter
            if (currentFilters.search) {
                const searchTerm = currentFilters.search.toLowerCase();
                const matchesSearch = 
                    doctor.name.toLowerCase().includes(searchTerm) ||
                    doctor.specialty.toLowerCase().includes(searchTerm) ||
                    doctor.location.toLowerCase().includes(searchTerm) ||
                    doctor.services.some(service => service.toLowerCase().includes(searchTerm));
                
                if (!matchesSearch) return false;
            }

            // Specialty filter
            if (currentFilters.specialty && doctor.specialty !== currentFilters.specialty) {
                return false;
            }

            // Location filter
            if (currentFilters.location && doctor.location !== currentFilters.location) {
                return false;
            }

            // Rating filter
            if (currentFilters.rating) {
                const minRating = parseFloat(currentFilters.rating);
                if (doctor.rating < minRating) return false;
            }

            // Availability filter
            if (currentFilters.availability) {
                // This is a simplified availability check
                // In a real app, you'd check actual availability
                const availabilityMap = {
                    'today': ['Today'],
                    'week': ['Today', 'Tomorrow', 'This Week'],
                    'month': ['Today', 'Tomorrow', 'This Week', 'Next Week']
                };
                
                if (!availabilityMap[currentFilters.availability]?.includes(doctor.nextAvailable)) {
                    return false;
                }
            }

            return true;
        });

        currentPage = 1; // Reset to first page when filters change
        updateStats();
        renderDoctors();
        renderPagination();
    }

    // Render doctors grid
    function renderDoctors() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const doctorsToShow = filteredDoctors.slice(startIndex, endIndex);

        if (doctorsToShow.length === 0) {
            doctorsGrid.style.display = 'none';
            noResults.style.display = 'block';
            pagination.style.display = 'none';
            return;
        }

        doctorsGrid.style.display = 'grid';
        noResults.style.display = 'none';
        pagination.style.display = 'flex';

        doctorsGrid.innerHTML = doctorsToShow.map(doctor => createDoctorCard(doctor)).join('');
        
        // Attach click listeners to doctor cards
        document.querySelectorAll('.doctor-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.doctor-actions')) {
                    const doctorId = parseInt(card.dataset.doctorId);
                    showDoctorModal(doctorId);
                }
            });
        });

        // Attach listeners to action buttons
        document.querySelectorAll('.book-appointment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const doctorId = parseInt(btn.dataset.doctorId);
                bookAppointment(doctorId);
            });
        });

        document.querySelectorAll('.view-profile').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const doctorId = parseInt(btn.dataset.doctorId);
                showDoctorModal(doctorId);
            });
        });

        renderPagination();
    }

    // Create doctor card HTML
    function createDoctorCard(doctor) {
        const stars = generateStars(doctor.rating);
        const initials = doctor.name.split(' ').map(n => n[0]).join('');

        return `
            <div class="doctor-card" data-doctor-id="${doctor.id}">
                <div class="doctor-header">
                    <div class="doctor-avatar">${initials}</div>
                    <div class="doctor-info">
                        <h3>${doctor.name}</h3>
                        <div class="doctor-specialty">${doctor.specialty}</div>
                    </div>
                </div>
                
                <div class="doctor-details">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${doctor.location}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-user-graduate"></i>
                        <span>${doctor.experience} experience</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-language"></i>
                        <span>${doctor.languages.join(', ')}</span>
                    </div>
                    <div class="detail-item rating">
                        <i class="fas fa-star"></i>
                        <div class="stars">${stars}</div>
                        <span>${doctor.rating} (${doctor.reviews} reviews)</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>Next available: ${doctor.nextAvailable}</span>
                    </div>
                </div>
                
                <div class="doctor-actions">
                    <button class="action-btn btn-primary book-appointment" data-doctor-id="${doctor.id}">
                        <i class="fas fa-calendar-plus"></i>
                        Book Appointment
                    </button>
                    <button class="action-btn btn-secondary view-profile" data-doctor-id="${doctor.id}">
                        <i class="fas fa-user"></i>
                        View Profile
                    </button>
                </div>
            </div>
        `;
    }

    // Generate star rating HTML
    function generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';

        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star star"></i>';
        }

        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt star"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star star empty"></i>';
        }

        return starsHTML;
    }

    // Render pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';

        // Update prev/next buttons
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;

        // Generate page numbers
        pageNumbers.innerHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderDoctors();
            });
            pageNumbers.appendChild(pageBtn);
        }
    }

    // Show doctor modal
    function showDoctorModal(doctorId) {
        const doctor = doctorsData.find(d => d.id === doctorId);
        if (!doctor) return;

        modalDoctorName.textContent = doctor.name;
        modalBody.innerHTML = createDoctorProfile(doctor);
        doctorModal.classList.add('active');

        // Attach event listeners to modal buttons
        const modalBookBtn = modalBody.querySelector('.modal-book-appointment');
        if (modalBookBtn) {
            modalBookBtn.addEventListener('click', () => {
                bookAppointment(doctorId);
                doctorModal.classList.remove('active');
            });
        }
    }

    // Create doctor profile HTML for modal
    function createDoctorProfile(doctor) {
        const stars = generateStars(doctor.rating);
        const initials = doctor.name.split(' ').map(n => n[0]).join('');

        return `
            <div class="doctor-profile">
                <div class="profile-header">
                    <div class="profile-avatar">${initials}</div>
                    <div class="profile-info">
                        <h3>${doctor.name}</h3>
                        <div class="profile-specialty">${doctor.specialty}</div>
                        <div class="rating">
                            <div class="stars">${stars}</div>
                            <span>${doctor.rating} (${doctor.reviews} reviews)</span>
                        </div>
                    </div>
                </div>

                <div class="profile-section">
                    <h4><i class="fas fa-user"></i> About</h4>
                    <p>${doctor.about}</p>
                </div>

                <div class="profile-section">
                    <h4><i class="fas fa-graduation-cap"></i> Education & Experience</h4>
                    <p><strong>Education:</strong> ${doctor.education}</p>
                    <p><strong>Experience:</strong> ${doctor.experience}</p>
                </div>

                <div class="profile-section">
                    <h4><i class="fas fa-stethoscope"></i> Services</h4>
                    <ul>
                        ${doctor.services.map(service => `<li>${service}</li>`).join('')}
                    </ul>
                </div>

                <div class="profile-section">
                    <h4><i class="fas fa-calendar-alt"></i> Availability</h4>
                    <div class="availability-grid">
                        ${Object.entries(doctor.availability).map(([day, time]) => `
                            <div class="availability-item">
                                <div class="availability-day">${day}</div>
                                <div class="availability-time">${time}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="profile-section">
                    <h4><i class="fas fa-info-circle"></i> Additional Information</h4>
                    <p><strong>Languages:</strong> ${doctor.languages.join(', ')}</p>
                    <p><strong>Insurance:</strong> ${doctor.insurance.join(', ')}</p>
                    <p><strong>Phone:</strong> ${doctor.phone}</p>
                    <p><strong>Email:</strong> ${doctor.email}</p>
                    <p><strong>Address:</strong> ${doctor.address}</p>
                </div>

                <div class="modal-actions">
                    <button class="action-btn btn-primary modal-book-appointment">
                        <i class="fas fa-calendar-plus"></i>
                        Book Appointment
                    </button>
                    <button class="action-btn btn-secondary" onclick="window.open('tel:${doctor.phone}')">
                        <i class="fas fa-phone"></i>
                        Call Now
                    </button>
                </div>
            </div>
        `;
    }

    // Book appointment function
    function bookAppointment(doctorId) {
        const doctor = doctorsData.find(d => d.id === doctorId);
        if (!doctor) return;

        // In a real app, this would redirect to appointment booking page
        // For now, we'll simulate booking and show success message
        
        // Get existing appointments from localStorage
        let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        
        // Create new appointment
        const appointment = {
            id: Date.now(),
            doctorName: doctor.name,
            appointmentDate: getNextAvailableDate(),
            appointmentTime: getNextAvailableTime(),
            appointmentType: 'Consultation',
            notes: `Appointment with ${doctor.name} (${doctor.specialty})`
        };

        // Add to appointments
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));

        // Show success message
        showSuccessMessage(`Appointment request sent to ${doctor.name}!`);
    }

    // Helper functions for appointment booking
    function getNextAvailableDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }

    function getNextAvailableTime() {
        return '10:00';
    }

    // Show success message
    function showSuccessMessage(message) {
        successMessage.textContent = message;
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    }

    // Attach event listeners
    function attachEventListeners() {
        // Search input
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            applyFilters();
        });

        // Clear search
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            currentFilters.search = '';
            applyFilters();
        });

        // Filter dropdowns
        specialtyFilter.addEventListener('change', (e) => {
            currentFilters.specialty = e.target.value;
            applyFilters();
        });

        locationFilter.addEventListener('change', (e) => {
            currentFilters.location = e.target.value;
            applyFilters();
        });

        ratingFilter.addEventListener('change', (e) => {
            currentFilters.rating = e.target.value;
            applyFilters();
        });

        availabilityFilter.addEventListener('change', (e) => {
            currentFilters.availability = e.target.value;
            applyFilters();
        });

        // Pagination
        prevPageBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderDoctors();
            }
        });

        nextPageBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderDoctors();
            }
        });

        // Modal
        closeModalBtn.addEventListener('click', () => {
            doctorModal.classList.remove('active');
        });

        doctorModal.addEventListener('click', (e) => {
            if (e.target === doctorModal) {
                doctorModal.classList.remove('active');
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && doctorModal.classList.contains('active')) {
                doctorModal.classList.remove('active');
            }
        });
    }

    // Initialize the application
    init();
});