$(document).ready(function() {
    // Get the reservation ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const reservationId = urlParams.get('reservation_id');

    $('#confirm-form').on('submit', function(e) {
        e.preventDefault();

        // Gather form data
        const firstName = $('#first-name').val();
        const lastName = $('#last-name').val();
        let phoneNumber = $('#phone-number').val();
        const email = $('#email').val();

        // Formatear número de teléfono
        phoneNumber = formatPhoneNumber(phoneNumber);

        // Validate form data
        if (!validatePhoneNumber(phoneNumber)) {
            showAlert('Invalid phone number. Please enter a valid phone number in the format xxx-xxx-xxxx.', 'danger');
            return;
        }

        if (!validateEmail(email)) {
            showAlert('Invalid email address. Please enter a valid email address.', 'danger');
            return;
        }

        // Send confirmation request
        fetch(`https://restaurant-reservation-backend-ocpy.onrender.com/reservations/${reservationId}/confirm`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                email: email
            })
        })
        .then(response => {
            if (!response.ok) {
                console.error('Error confirming reservation:', response.statusText);
                throw new Error('Unable to confirm reservation at the moment. Please try again later.');
            }
            return response.json();
        })
        .then(data => {
            showAlert('Your reservation has been confirmed successfully!', 'success');
        })
        .catch(error => {
            console.error('Confirmation process failed:', error);
            showAlert(error.message, 'danger');
        });
    });

    function showAlert(message, type) {
        const alertContainer = $('#alert-container');
        const alert = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
        alertContainer.html(alert);
    }

    function formatPhoneNumber(phoneNumber) {
        // Remove all non-numeric characters
        phoneNumber = phoneNumber.replace(/\D/g, '');

        // Format the number as xxx-xxx-xxxx
        if (phoneNumber.length === 10) {
            return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        } else {
            return phoneNumber;
        }
    }

    function validatePhoneNumber(phoneNumber) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/; // Adjust the regex to match your phone number format
        return phoneRegex.test(phoneNumber);
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
