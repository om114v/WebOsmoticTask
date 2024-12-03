
document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.createElement('div');
    toggleButton.className = 'toggle';
    toggleButton.innerHTML = '&#9776;';
    document.querySelector('.navbar').appendChild(toggleButton);

    toggleButton.addEventListener('click', function () {
        document.querySelector('.nav-links').classList.toggle('active');
    });
});

document.getElementById("employeeForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let isValid = true;

    // Name validation
    const nameInput = document.getElementById("name");
    const nameError = document.getElementById("nameError");
    const nameValue = nameInput.value.trim();
    if (!/^[a-zA-Z0-9]{4,20}$/.test(nameValue)) {
        isValid = false;
        nameError.textContent = "Name must be 4-20 alphanumeric characters.";
    } else {
        nameError.textContent = "";
    }

    // Date of birth validation
    const dobInput = document.getElementById("dob");
    const dobError = document.getElementById("dobError");
    const dobValue = new Date(dobInput.value);
    const today = new Date();
    if (dobValue >= today || isNaN(dobValue.getTime())) {
        isValid = false;
        dobError.textContent = "Date of birth must be a valid past date.";
    } else {
        dobError.textContent = "";
    }

    // Email validation
    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const emailValue = emailInput.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        isValid = false;
        emailError.textContent = "Enter a valid email address.";
    } else {
        emailError.textContent = "";
    }

    // Phone validation
    const phoneInput = document.getElementById("phone");
    const phoneError = document.getElementById("phoneError");
    const phoneValue = phoneInput.value.trim();
    if (phoneValue && !/^\d{10}$/.test(phoneValue)) {
        isValid = false;
        phoneError.textContent = "Phone must be a 10-digit number.";
    } else {
        phoneError.textContent = "";
    }

    // Get form values
    const name = document.getElementById('name').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const hobbies = document.getElementById('hobbies').value;

    // Create a new employee object
    const newEmployee = { name, gender, dob, email, phone, hobbies };

    // Save the new employee to local storage
    const employees = getEmployees();
    employees.push(newEmployee);
    saveEmployees(employees);

    // Display the updated list
    displayEmployees();

    // Final validation
    if (isValid) {
        alert("Form submitted successfully!");
    }

    // Reset the form
    document.getElementById('employeeForm').reset();
});

// Function to get employees from local storage
function getEmployees() {
    const employees = localStorage.getItem('employees');
    return employees ? JSON.parse(employees) : [];
}

// Function to save employees to local storage
function saveEmployees(employees) {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Function to display employees in the table
function displayEmployees() {
    const employees = getEmployees();
    const tableBody = document.getElementById('basic-employee').getElementsByTagName('tbody')[0];

    // Clear the current rows in the table
    tableBody.innerHTML = '';

    // Loop through each employee and create a new row
    employees.forEach((employee, index) => {
        const row = tableBody.insertRow();  // Create a new row

        // Insert the employee data into the row
        row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.gender}</td>
            <td>${employee.dob}</td>
            <td>${employee.email}</td>
            <td>${employee.phone}</td>
            <td>${employee.hobbies}</td>
            <td><button onclick="deleteEmployee(${index})">Delete</button></td>
        `;
    });
}

// Function to delete an employee
function deleteEmployee(index) {
    const employees = getEmployees();
    employees.splice(index, 1);  // Remove employee at index
    saveEmployees(employees);    // Save updated employee list to local storage
    displayEmployees();          // Re-display the updated table
}

// Display employees on page load
document.addEventListener('DOMContentLoaded', displayEmployees);