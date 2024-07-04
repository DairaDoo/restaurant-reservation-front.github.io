$(document).ready(function() {
    // Initialize the timepicker
    $('.timepicker').timepicker({
        showMeridian: true,
        defaultTime: false
    });

    // Handle form submission
    $('#reservation-form').on('submit', function(e) {
        e.preventDefault();

        // Gather form data
        const date = $('#date').val();
        const timeInput = $('#time').val();
        const peopleQuantity = $('#people').val();

        // Formatear la hora con moment.js
        const formattedTime = moment(timeInput, 'hh:mm A').format('HH:mm');

        // First, fetch available tables for the given people quantity
        fetch(`https://restaurant-reservation-backend-ocpy.onrender.com/tables/available/${peopleQuantity}`)
        .then(response => {
            if (!response.ok) {
                console.error('Error fetching tables:', response.statusText);
                throw new Error('Unable to fetch available tables at the moment. Please try again later.');
            }
            return response.json();
        })
        .then(tables => {
            if (tables.length === 0) {
                console.warn('No available tables for the given number of people:', peopleQuantity);
                throw new Error('No tables available for the selected number of people. Please try a different number.');
            }
            const tableId = tables[0].id;  // Use the first available table
            
            // Now make the reservation with the found table_id
            return fetch('https://restaurant-reservation-backend-ocpy.onrender.com/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    table_id: tableId,
                    date: date,
                    time: formattedTime,
                    people_quantity: peopleQuantity
                })
            });
        })
        .then(response => {
            if (!response.ok) {
                console.error('Error creating reservation:', response.statusText);
                throw new Error('Unable to create reservation at the moment. Please try again later.');
            }
            return response.json();
        })
        .then(data => {
            showAlert('Your reservation was created successfully! Please provide your details to confirm.', 'success');
            // Optionally redirect to a confirmation page or show a modal to get user details
            window.location.href = `./confirm_page/confirm.html?reservation_id=${data.id}`;
        })
        .catch(error => {
            console.error('Reservation process failed:', error);
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
});
