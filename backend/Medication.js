document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const medicationForm = document.getElementById('medicationForm');
    const medicationsList = document.getElementById('medicationsList');
    const addTimeBtn = document.getElementById('addTimeBtn');
    const scheduleTimes = document.getElementById('scheduleTimes');
    const successMessage = document.getElementById('success-message');
    const searchInput = document.getElementById('searchMedication');

    // State Management
    const state = {
        medications: JSON.parse(localStorage.getItem('medications')) || [],
        editingIndex: null,
        notificationQueue: new Set(),
        lastNotificationTime: {}
    };

    // Utility Functions
    const utilities = {
        generateId: () => '_' + Math.random().toString(36).substr(2, 9),
        formatTime: (date) => {
            return date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
        },
        calculateNextDose: (times) => {
            const now = new Date();
            const currentTime = now.getTime();
            
            const nextTimes = times.map(time => {
                const [hours, minutes] = time.split(':');
                const nextTime = new Date();
                nextTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                
                if (nextTime.getTime() < currentTime) {
                    nextTime.setDate(nextTime.getDate() + 1);
                }
                
                return nextTime;
            });
            
            return new Date(Math.min(...nextTimes.map(t => t.getTime())));
        }
    };

    // Notification Management
    class NotificationManager {
        constructor() {
            this.checkPermission();
            this.notificationBuffer = new Map();
            this.cooldownPeriod = 5 * 60 * 1000; // 5 minutes
        }

        async checkPermission() {
            if (Notification.permission !== 'granted') {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission !== 'granted') {
                        console.warn('Notification permission denied');
                    }
                } catch (error) {
                    console.error('Error requesting notification permission:', error);
                }
            }
        }

        sendNotification(medication) {
            const now = Date.now();
            const lastNotification = this.notificationBuffer.get(medication.id);
            
            if (!lastNotification || (now - lastNotification) > this.cooldownPeriod) {
                const notification = new Notification('Medication Reminder', {
                    body: `Time to take ${medication.name} - ${medication.dosage}`,
                    icon: '/api/placeholder/40/40',
                    badge: '/api/placeholder/20/20',
                    tag: medication.id,
                    renotify: true,
                    requireInteraction: true
                });

                notification.addEventListener('click', () => {
                    this.markAsTaken(medication);
                    notification.close();
                });

                this.notificationBuffer.set(medication.id, now);
            }
        }

        markAsTaken(medication) {
            const now = new Date();
            medication.lastTaken = now.toISOString();
            medication.nextDue = utilities.calculateNextDose(medication.times);
            
            // Update adherence rate
            const expectedDoses = calculateExpectedDoses(medication);
            const actualDoses = calculateActualDoses(medication);
            medication.adherenceRate = Math.round((actualDoses / expectedDoses) * 100);
            
            updateMedication(medication);
            renderMedications();
            showMessage(`Marked ${medication.name} as taken`);
        }
    }

    const notificationManager = new NotificationManager();

    // UI Functions
    function showMessage(message, type = 'success') {
        successMessage.textContent = message;
        successMessage.className = `message ${type}-message`;
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }

    function addTimeSlot(existingTime = '') {
        const timeInput = document.createElement('div');
        timeInput.className = 'time-slot';
        timeInput.innerHTML = `
            <input type="time" value="${existingTime}" required>
            <button type="button" class="remove-time">
                <i class="fas fa-times"></i>
            </button>
        `;

        timeInput.querySelector('.remove-time').addEventListener('click', function() {
            timeInput.remove();
        });

        scheduleTimes.appendChild(timeInput);
    }

    // Medication CRUD Operations
    function addMedication(medicationData) {
        const newMedication = {
            id: utilities.generateId(),
            ...medicationData,
            dateAdded: new Date().toISOString(),
            lastTaken: null,
            adherenceRate: 100,
            missedDoses: 0,
            nextDue: utilities.calculateNextDose(medicationData.times)
        };

        state.medications.push(newMedication);
        saveMedications();
        return newMedication;
    }

    function updateMedication(updatedMedication) {
        const index = state.medications.findIndex(med => med.id === updatedMedication.id);
        if (index !== -1) {
            state.medications[index] = {
                ...state.medications[index],
                ...updatedMedication,
                nextDue: utilities.calculateNextDose(updatedMedication.times)
            };
            saveMedications();
            return true;
        }
        return false;
    }

    function deleteMedication(id) {
        if (confirm('Are you sure you want to delete this medication?')) {
            const index = state.medications.findIndex(med => med.id === id);
            if (index !== -1) {
                state.medications.splice(index, 1);
                saveMedications();
                showMessage('Medication deleted');
                renderMedications();
                return true;
            }
        }
        return false;
    }

    function saveMedications() {
        localStorage.setItem('medications', JSON.stringify(state.medications));
        updateNextReminder();
    }

    // Helper Functions for Adherence Tracking
    function calculateExpectedDoses(medication) {
        const startDate = new Date(medication.dateAdded);
        const now = new Date();
        const daysDiff = Math.floor((now - startDate) / (24 * 60 * 60 * 1000));
        return daysDiff * medication.times.length;
    }

    function calculateActualDoses(medication) {
        // This is a simplified version - you might want to implement more sophisticated tracking
        return medication.lastTaken ? 1 : 0;
    }

    // Rendering Functions
    function renderMedications(medsToRender = state.medications) {
        if (medsToRender.length === 0) {
            medicationsList.innerHTML = '<p class="no-meds">No medications added yet.</p>';
            return;
        }

        medicationsList.innerHTML = medsToRender.map(med => `
            <div class="medication-card" data-id="${med.id}">
                <div class="medication-header">
                    <h3>${med.name}</h3>
                    <div class="medication-status">
                        ${getStatusBadge(med)}
                    </div>
                    <div class="medication-actions">
                        <button class="action-btn edit-med" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn take-med" title="Mark as Taken">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="action-btn delete-med" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="medication-details">
                    <p><i class="fas fa-tablets"></i> Dosage: ${med.dosage}</p>
                    <p><i class="fas fa-clock"></i> Frequency: ${med.frequency}</p>
                    <p><i class="fas fa-calendar-alt"></i> Times: ${med.times.join(', ')}</p>
                    ${med.notes ? `<p><i class="fas fa-sticky-note"></i> Notes: ${med.notes}</p>` : ''}
                    <p><i class="fas fa-chart-line"></i> Adherence Rate: ${med.adherenceRate}%</p>
                    <p><i class="fas fa-history"></i> Last Taken: ${med.lastTaken ? new Date(med.lastTaken).toLocaleString() : 'Never'}</p>
                </div>
            </div>
        `).join('');

        attachMedicationCardListeners();
    }

    function getStatusBadge(medication) {
        const now = new Date();
        const nextDue = new Date(medication.nextDue);
        const timeDiff = nextDue - now;

        if (timeDiff < 0) {
            return `<span class="status-badge overdue">Overdue</span>`;
        } else if (timeDiff < 30 * 60 * 1000) { // 30 minutes
            return `<span class="status-badge due-soon">Due Soon</span>`;
        }
        return `<span class="status-badge upcoming">Upcoming</span>`;
    }

    // Event Listeners
    function attachMedicationCardListeners() {
        document.querySelectorAll('.medication-card').forEach(card => {
            const id = card.dataset.id;

            card.querySelector('.edit-med').addEventListener('click', () => {
                const medication = state.medications.find(med => med.id === id);
                if (medication) {
                    populateEditForm(medication);
                }
            });

            card.querySelector('.take-med').addEventListener('click', () => {
                const medication = state.medications.find(med => med.id === id);
                if (medication) {
                    notificationManager.markAsTaken(medication);
                }
            });

            card.querySelector('.delete-med').addEventListener('click', () => {
                deleteMedication(id);
            });
        });
    }

    function populateEditForm(medication) {
        state.editingIndex = state.medications.findIndex(med => med.id === medication.id);
        
        document.getElementById('medName').value = medication.name;
        document.getElementById('dosage').value = medication.dosage;
        document.getElementById('frequency').value = medication.frequency;
        document.getElementById('notes').value = medication.notes;

        scheduleTimes.innerHTML = '';
        medication.times.forEach(time => addTimeSlot(time));

        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Update Medication';
        submitBtn.dataset.editing = 'true';

        medicationForm.scrollIntoView({ behavior: 'smooth' });
    }

    // Form Handling
    medicationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const medicationData = {
            name: document.getElementById('medName').value,
            dosage: document.getElementById('dosage').value,
            frequency: document.getElementById('frequency').value,
            times: Array.from(scheduleTimes.querySelectorAll('input[type="time"]'))
                       .map(input => input.value),
            notes: document.getElementById('notes').value
        };

        if (this.querySelector('.submit-btn').dataset.editing) {
            const updatedMedication = {
                ...state.medications[state.editingIndex],
                ...medicationData
            };
            
            updateMedication(updatedMedication);
            showMessage('Medication updated successfully');
            this.querySelector('.submit-btn').innerHTML = '<i class="fas fa-plus"></i> Add Medication';
            delete this.querySelector('.submit-btn').dataset.editing;
            state.editingIndex = null;
        } else {
            addMedication(medicationData);
            showMessage('Medication added successfully');
        }

        this.reset();
        scheduleTimes.innerHTML = '';
        renderMedications();
    });

    addTimeBtn.addEventListener('click', () => addTimeSlot());

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = state.medications.filter(med => 
            med.name.toLowerCase().includes(query) ||
            med.notes.toLowerCase().includes(query) ||
            med.dosage.toLowerCase().includes(query)
        );
        renderMedications(filtered);
    });

    // Medication Monitoring
    function updateNextReminder() {
        const now = new Date();
        const upcomingMeds = state.medications
            .filter(med => new Date(med.nextDue) > now)
            .sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue));

        if (upcomingMeds.length > 0) {
            const nextMed = upcomingMeds[0];
            const timeDiff = new Date(nextMed.nextDue) - now;
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            
            document.querySelector('.reminder-badge').textContent = 
                `Next: ${nextMed.name} in ${hours}h ${minutes}m`;
        }
    }

    function checkDueMedications() {
        const now = new Date();
        
        state.medications.forEach(med => {
            if (new Date(med.nextDue) <= now && !state.notificationQueue.has(med.id)) {
                notificationManager.sendNotification(med);
                state.notificationQueue.add(med.id);
                
                setTimeout(() => {
                    state.notificationQueue.delete(med.id);
                }, 5 * 60 * 1000); // 5 minutes cooldown
            }
        });
    }

    // Initialize
    renderMedications();
    setInterval(updateNextReminder, 30000); // Update every 30 seconds
    setInterval(checkDueMedications, 60000); // Check every minute
    updateNextReminder();
    checkDueMedications();
});