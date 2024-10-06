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
    fetch('/tracking-devices/add', {
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

// Edit Modal
// Function to handle the opening of the "Edit Device" modal
document.addEventListener('DOMContentLoaded', () => {
    const editButtons = document.querySelectorAll('.fa-edit'); // Select all edit icons
    
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retrieve data from the button's data attributes
            const deviceId = button.getAttribute('data-id');
            const deviceName = button.getAttribute('data-name');
            const deviceType = button.getAttribute('data-type');
            const deviceStatus = button.getAttribute('data-status');

            // Open the edit modal by adding the 'open' class
            const modal = document.getElementById('edit-device-modal');
            modal.classList.add('open'); // Show the modal by adding the 'open' class
            
            // Prefill the form in the modal with the retrieved data
            document.getElementById('edit_device_id').value = deviceId;
            document.getElementById('edit_device_name').value = deviceName;
            document.getElementById('edit_device_type').value = deviceType;
            document.getElementById('edit_status').value = deviceStatus;

            // Get the form element for editing
            const form = document.getElementById('edit-device-form');
            form.action = `/tracking-devices/edit/${deviceId}`; // Update form action with the correct device ID
        });
    });

    // Close modal handler for editing
    document.getElementById('close-edit-modal').addEventListener('click', () => {
        document.getElementById('edit-device-modal').classList.remove('open'); // Hide the modal
    });

    // Handle form submission for editing a device
    const form = document.getElementById('edit-device-form'); // Get the form element here
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        // Create FormData object
        const formData = new FormData(form); // Use the form variable

        // Convert FormData to URLSearchParams
        const data = new URLSearchParams(formData);

        // Send data to server
        fetch(form.action, { // Use the form action URL for editing
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
                alert('Failed to update device: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

        // Close the modal
        document.getElementById('edit-device-modal').classList.remove('open');
    });
});



// Delete Functionality
document.addEventListener('DOMContentLoaded', () => {
    const deleteDeviceIcons = document.querySelectorAll('.fa-trash-can'); // Change to more descriptive variable name
    const deleteDeviceModal = document.getElementById('deleteDeviceModal');
    const confirmDeleteDeviceButton = document.getElementById('confirmDeleteDevice');
    const cancelDeleteDeviceButton = document.getElementById('cancelDeleteDevice');

    let selectedDeviceId = null; // Variable to store the device ID to delete

    // Open delete modal for tracking device
    deleteDeviceIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            selectedDeviceId = e.target.getAttribute('data-id'); // Get the device ID from the clicked icon
            deleteDeviceModal.classList.remove('hidden'); // Show the delete modal
        });
    });

    // Cancel deletion
    cancelDeleteDeviceButton.addEventListener('click', () => {
        deleteDeviceModal.classList.add('hidden'); // Hide the modal when cancel is clicked
        selectedDeviceId = null; // Reset the device ID
    });

    // Confirm deletion
    confirmDeleteDeviceButton.addEventListener('click', async () => {
        if (selectedDeviceId) {
            try {
                // Make a POST request to delete the tracking device
                const response = await fetch(`/tracking-devices/delete/${selectedDeviceId}`, {
                    method: 'POST', // Change to POST
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    // Remove the row from the table
                    const rowToRemove = document.querySelector(`i[data-id="${selectedDeviceId}"]`).closest('tr');
                    rowToRemove.remove();
                    // alert('Tracking device deleted successfully');
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (error) {
                alert('An error occurred while deleting the tracking device.');
                console.error(error);
            } finally {
                deleteDeviceModal.classList.add('hidden'); // Hide the modal after action
                selectedDeviceId = null; // Reset the device ID
            }
        }
    });
});
