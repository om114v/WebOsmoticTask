// (function() {
    // Configuration object for form validation
    const VALIDATION_CONFIG = {
        name: {
            regex: /^[a-zA-Z0-9]{4,20}$/,
            errorMessage: 'Name must be 4-20 alphanumeric characters.'
        },
        email: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: 'Enter a valid email address.'
        },
        phone: {
            regex: /^\d{10}$/,
            errorMessage: 'Phone must be a 10-digit number.'
        }
    };

    // Local storage key
    const STORAGE_KEY = 'employees';

    /**
     * Validate form input
     * @param {HTMLInputElement} input - Input element to validate
     * @param {Object} config - Validation configuration
     * @returns {boolean} - Whether the input is valid
     */
    function validateInput(input, config) {
        const value = input.value.trim();
        const errorElement = document.getElementById(`${input.id}Error`);
        
        // Special handling for date of birth
        if (input.type === 'date') {
            const dobValue = new Date(value);
            const today = new Date();
            
            if (dobValue >= today || isNaN(dobValue.getTime())) {
                errorElement.textContent = 'Date of birth must be a valid past date.';
                return false;
            }
            
            errorElement.textContent = '';
            return true;
        }

        // Validate using regex if config exists
        if (config && config.regex) {
            if (!config.regex.test(value)) {
                errorElement.textContent = config.errorMessage;
                return false;
            }
        }

        // Optional field handling (like phone)
        if (input.hasAttribute('optional') && value === '') {
            errorElement.textContent = '';
            return true;
        }

        errorElement.textContent = '';
        return true;
    }

    /**
     * Get employees from local storage
     * @returns {Array} - Array of employee objects
     */
    function getEmployees() {
        try {
            const employees = localStorage.getItem(STORAGE_KEY);
            return employees ? JSON.parse(employees) : [];
        } catch (error) {
            console.error('Error retrieving employees:', error);
            return [];
        }
    }

    /**
     * Save employees to local storage
     * @param {Array} employees - Array of employee objects
     */
    function saveEmployees(employees) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
        } catch (error) {
            console.error('Error saving employees:', error);
            alert('Unable to save employee data. Local storage may be full.');
        }
    }

    /**
     * Display employees in the table
     */
    function displayEmployees() {
        const tableBody = document.getElementById('basic-employee');
        
        // Ensure table body exists before manipulation
        if (!tableBody) return;

        // Clear existing rows
        tableBody.innerHTML = '';

        // Get and display employees
        const employees = getEmployees();
        employees.forEach((employee, index) => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${escapeHTML(employee.name)}</td>
                <td>${escapeHTML(employee.gender)}</td>
                <td>${escapeHTML(employee.dob)}</td>
                <td>${escapeHTML(employee.email)}</td>
                <td>${escapeHTML(employee.phone || 'N/A')}</td>
                <td>${escapeHTML(employee.hobbies)}</td>
                <td>
                    <button 
                        onclick="window.deleteEmployee(${index})" 
                        aria-label="Delete employee">
                        Delete
                    </button>
                </td>
            `;
        });
    }

    /**
     * Safely escape HTML to prevent XSS
     * @param {string} str - String to escape
     * @returns {string} - Escaped string
     */
    function escapeHTML(str) {
        if (typeof str !== 'string') return str;
        return str.replace(/[&<>"'/]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;'
            }[tag] || tag)
        );
    }

    /**
     * Delete an employee by index
     * @param {number} index - Index of employee to delete
     */
    function deleteEmployee(index) {
        const employees = getEmployees();
        
        // Validate index
        if (index < 0 || index >= employees.length) {
            console.error('Invalid employee index');
            return;
        }

        // Remove employee and update
        employees.splice(index, 1);
        saveEmployees(employees);
        displayEmployees();
    }

    /**
     * Handle form submission
     * @param {Event} event - Form submission event
     */
    function handleFormSubmit(event) {
        event.preventDefault();
        
        let isValid = true;
        const form = event.target;

        // Validate inputs
        Object.keys(VALIDATION_CONFIG).forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input && !validateInput(input, VALIDATION_CONFIG[inputId])) {
                isValid = false;
            }
        });

        // Validate date of birth
        const dobInput = document.getElementById('dob');
        if (!validateInput(dobInput)) {
            isValid = false;
        }

        // Validate checkbox selection
        const hobbiesInputs = document.querySelectorAll('input[name="hobbies"]:checked');
        const hobbiesError = document.getElementById('hobbiesError');
        if (hobbiesInputs.length === 0) {
            hobbiesError.textContent = 'Please select at least one hobby.';
            isValid = false;
        } else {
            hobbiesError.textContent = '';
        }

        // If not valid, stop submission
        if (!isValid) return;

        // Collect form data
        const formData = {
            name: form.name.value,
            gender: form.querySelector('input[name="gender"]:checked').value,
            dob: form.dob.value,
            email: form.email.value,
            phone: form.phone.value || 'N/A',
            hobbies: Array.from(hobbiesInputs)
                .map(input => input.value)
                .join(', ')
        };

        // Save and display
        const employees = getEmployees();
        employees.push(formData);
        saveEmployees(employees);
        displayEmployees();

        // Reset form
        form.reset();
        
        // Show success message
        alert('Employee added successfully!');
    }

    /**
     * Add mobile navigation toggle
     */
    function setupMobileNavigation() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        const toggleButton = document.createElement('div');
        toggleButton.className = 'toggle';
        toggleButton.innerHTML = '&#9776;';
        toggleButton.setAttribute('aria-label', 'Toggle navigation menu');
        navbar.appendChild(toggleButton);

        toggleButton.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.toggle('active');
            }
        });
    }

    /**
     * Initialize the application
     */
    function init() {
        // Add global delete method
        window.deleteEmployee = deleteEmployee;

        // Event listeners
        const form = document.getElementById('employeeForm');
        if (form) {
            form.addEventListener('submit', handleFormSubmit);

            // Add real-time validation
            ['name', 'email', 'phone', 'dob'].forEach(inputId => {
                const input = document.getElementById(inputId);
                if (input) {
                    input.addEventListener('blur', () => {
                        validateInput(
                            input, 
                            VALIDATION_CONFIG[inputId]
                        );
                    });
                }
            });
        }

        // Display employees on page load
        displayEmployees();

        // Setup mobile navigation
        setupMobileNavigation();
    }

    // Run initialization when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
// })();