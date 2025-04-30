
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initializeAppointmentForm();
    initializeSettings();
    initializeNotifications();
    
    // Add smooth scrolling for sidebar navigation
    const navLinks = document.querySelectorAll('.sidebar a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Update active nav item
                document.querySelectorAll('.sidebar li').forEach(item => {
                    item.classList.remove('active');
                });
                
                this.parentElement.classList.add('active');
            }
        });
    });
});

// Initialize the appointment form
function initializeAppointmentForm() {
    const form = document.getElementById('appointment-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const patientName = document.getElementById('patient-name').value;
            const phoneNumber = document.getElementById('phone-number').value;
            const procedureId = document.getElementById('procedure').value;
            const appointmentDate = document.getElementById('appointment-date').value;
            const appointmentTime = document.getElementById('appointment-time').value;
            
            // Validate form
            if (!patientName || !phoneNumber || !procedureId || !appointmentDate || !appointmentTime) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Format date and time for ISO string
            const startTime = new Date(appointmentDate + 'T' + appointmentTime);
            
            // Create appointment data
            const appointmentData = {
                patient_name: patientName,
                phone_number: phoneNumber,
                procedure_id: parseInt(procedureId),
                start_time: startTime.toISOString()
            };
            
            // Send API request
            fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(appointmentData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                showNotification('Appointment scheduled successfully!', 'success');
                
                // Reset form
                form.reset();
                
                // Notify about modified appointments
                if (data.modified_appointments > 0) {
                    showNotification(`${data.modified_appointments} other appointment(s) were rescheduled`, 'info');
                }
                
                // Reload the page after a short delay
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Failed to schedule appointment. Please try again.', 'error');
            });
        });
    }
}

// Initialize settings
function initializeSettings() {
    const saveButton = document.getElementById('save-settings');
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            const breakEnabled = document.getElementById('break-toggle').checked;
            const breakDuration = parseInt(document.getElementById('break-duration').value);
            
            // Create settings data
            const settingsData = {
                break_enabled: breakEnabled,
                break_duration: breakDuration
            };
            
            // Send API request
            fetch('/api/break-time', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settingsData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                showNotification('Settings saved successfully!', 'success');
                
                // Notify about modified appointments
                if (data.modified_appointments > 0) {
                    showNotification(`${data.modified_appointments} appointment(s) were rescheduled`, 'info');
                    
                    // Reload the page after a short delay
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Failed to save settings. Please try again.', 'error');
            });
        });
    }
}

// Initialize notifications
function initializeNotifications() {
    const notificationBadge = document.getElementById('notification-badge');
    const notificationPanel = document.getElementById('notification-panel');
    const closeButton = document.getElementById('close-notifications');
    
    if (notificationBadge && notificationPanel && closeButton) {
        // When badge is clicked, show notification panel
        notificationBadge.addEventListener('click', function() {
            notificationPanel.classList.toggle('hidden');
        });
        
        // When close button is clicked, hide notification panel
        closeButton.addEventListener('click', function() {
            notificationPanel.classList.add('hidden');
        });
    }
}

// Function to extend appointment time
function extendAppointment(appointmentId) {
    // Create appointment data
    const appointmentData = {
        additional_time: 5 // Add 5 minutes
    };
    
    // Send API request
    fetch(`/api/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        showNotification('Appointment extended by 5 minutes', 'success');
        
        // Notify about modified appointments
        if (data.modified_appointments > 0) {
            showNotification(`${data.modified_appointments} following appointment(s) were rescheduled`, 'info');
            
            // Reload the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            window.location.reload();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Failed to extend appointment. Please try again.', 'error');
    });
}

// Function to delete appointment
function deleteAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        // Send API request
        fetch(`/api/appointments/${appointmentId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showNotification('Appointment cancelled successfully', 'success');
            
            // Notify about modified appointments
            if (data.modified_appointments > 0) {
                showNotification(`${data.modified_appointments} following appointment(s) were rescheduled`, 'info');
            }
            
            // Reload the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Failed to cancel appointment. Please try again.', 'error');
        });
    }
}

// Function to show notifications
function showNotification(message, type = 'info') {
    // Increment notification badge count
    const badge = document.getElementById('notification-badge');
    if (badge) {
        badge.textContent = parseInt(badge.textContent) + 1;
    }
    
    // Add notification to panel
    const notificationList = document.getElementById('notification-list');
    if (notificationList) {
        const notificationItem = document.createElement('div');
        notificationItem.classList.add('notification-item');
        
        const time = document.createElement('div');
        time.classList.add('notification-time');
        time.textContent = new Date().toLocaleTimeString();
        
        const content = document.createElement('div');
        content.classList.add('notification-content');
        content.textContent = message;
        
        // Add color based on type
        if (type === 'error') {
            content.style.color = 'var(--error)';
        } else if (type === 'success') {
            content.style.color = 'var(--success)';
        }
        
        notificationItem.appendChild(time);
        notificationItem.appendChild(content);
        
        // Add to beginning of list
        notificationList.insertBefore(notificationItem, notificationList.firstChild);
    }
    
    // Create and show toast notification
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast-${type}`);
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Add animation classes
    setTimeout(() => {
        toast.classList.add('toast-visible');
    }, 100);
    
    // Remove toast after timeout
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add toast styles
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        left: 20px;
        padding: 12px 20px;
        background: var(--bg-card);
        border-left: 4px solid var(--primary);
        color: var(--text);
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.3s, transform 0.3s;
    }
    
    .toast-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .toast-success {
        border-left-color: var(--success);
    }
    
    .toast-error {
        border-left-color: var(--error);
    }
    
    .toast-info {
        border-left-color: var(--primary);
    }
`;
document.head.appendChild(toastStyles);
