document.getElementById('open-modal').addEventListener('click', () => {
    document.getElementById('device-modal').classList.add('open');
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('device-modal').classList.remove('open');
});

// Handle form submission
document.getElementById('new-device-form').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    // Create FormData object
    const formData = new FormData(e.target);

    // Convert FormData to URLSearchParams
    const data = new URLSearchParams(formData);

    // Send data to server
    fetch('/parcel/add-device', {
        method: 'POST',
        body: data
    })
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        if (data.success) {
            // On success, reload the page or update the table
            location.reload();
        } else {
            // Show error message
            alert('Failed to add device: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Close the modal
    document.getElementById('device-modal').classList.remove('open');
});