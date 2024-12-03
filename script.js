
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

    // Final validation
    if (isValid) {
        alert("Form submitted successfully!");
    }
});