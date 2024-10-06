// Open New Vehicle Modal
document.getElementById('open-modal').addEventListener('click', () => {
    document.getElementById('vehicle-modal').classList.add('open');
});

// Close New Vehicle Modal
document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('vehicle-modal').classList.remove('open');
});




// Edit Vehicles
// Open Edit Vehicle Modal
const editButtons = document.querySelectorAll('.edit-button'); // Select all the edit buttons for vehicles

editButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Retrieve data from the button's data attributes
        const vehicleId = button.dataset.id;
        const vehicleName = button.dataset.name;
        const vehicleRegistration = button.dataset.registration;
        const trackingDeviceId = button.dataset.device;

        // Open the edit modal by adding the 'open' class
        const modal = document.getElementById('edit-vehicle-modal');
        modal.classList.add('open');

        // Prefill the form in the modal with the retrieved data
        document.getElementById('edit_vehicle_id').value = vehicleId;
        document.getElementById('edit_vehicle_name').value = vehicleName;
        document.getElementById('edit_vehicle_registration_number').value = vehicleRegistration;
        document.getElementById('edit_tracking_device_id').value = trackingDeviceId;

        // Set form action for the specific vehicle being edited
        const form = document.getElementById('edit-vehicle-form');
        form.action = `/vehicles/edit/${vehicleId}`; // Update the form action with the correct vehicle ID
    });
});

// Close Edit Vehicle Modal
document.getElementById('close-edit-modal').addEventListener('click', () => {
    document.getElementById('edit-vehicle-modal').classList.remove('open');
});

// Handle form submission for editing a vehicle
const form = document.getElementById('edit-vehicle-form'); // Get the edit vehicle form

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission

    // Create FormData object
    const formData = new FormData(form);

    // Convert FormData to URLSearchParams
    const data = new URLSearchParams(formData);

    // Send data to server using fetch API
    fetch(form.action, { // Use the form's action URL for editing
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
            alert('Failed to update vehicle: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

    // Close the modal after submission
    document.getElementById('edit-vehicle-modal').classList.remove('open');
});

// Delete Vehicle Functionality
document.addEventListener('DOMContentLoaded', () => {
    const deleteVehicleIcons = document.querySelectorAll('.fa-trash-can'); 
    const deleteVehicleModal = document.getElementById('deleteVehicleModal'); 
    const confirmDeleteVehicleButton = document.getElementById('confirmDeleteVehicle'); 
    const cancelDeleteVehicleButton = document.getElementById('cancelDeleteVehicle'); 

    let selectedVehicleId = null; 

    deleteVehicleIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            selectedVehicleId = e.target.getAttribute('data-id'); 
            deleteVehicleModal.classList.remove('hidden'); 
        });
    });

    cancelDeleteVehicleButton.addEventListener('click', () => {
        deleteVehicleModal.classList.add('hidden'); 
        selectedVehicleId = null;  
    });

    confirmDeleteVehicleButton.addEventListener('click', async () => {
        if (selectedVehicleId) {
            try {
                const response = await fetch(`/vehicles/delete/${selectedVehicleId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const rowToRemove = document.querySelector(`i[data-id="${selectedVehicleId}"]`).closest('tr');
                    rowToRemove.remove();
                    // alert('Vehicle deleted successfully');
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (error) {
                alert('An error occurred while deleting the vehicle.');
                console.error(error);
            } finally {
                deleteVehicleModal.classList.add('hidden'); 
                selectedVehicleId = null; 
            }
        }
        else {
            alert("Please select a vehicle to delete")
        }
    });
});

