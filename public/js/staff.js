document.getElementById('openPopup').addEventListener('click', function() {
    document.getElementById('popup').classList.remove('hidden');
    document.getElementById('popupOverlay').classList.remove('hidden');
});

document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('popup').classList.add('hidden');
    document.getElementById('popupOverlay').classList.add('hidden');
});

document.getElementById('popupOverlay').addEventListener('click', function() {
    document.getElementById('popup').classList.add('hidden');
    document.getElementById('popupOverlay').classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', () => {
    const staffForm = document.getElementById('staffForm');
    const popupOverlay = document.getElementById('popupOverlay');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');

    staffForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Get form data
        const formData = new FormData(staffForm);
        const data = {
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            department: formData.get('department'),
            branch: formData.get('branch'),
            username: formData.get('username'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validate password
        if (data.password !== data.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch(staffForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            // Display success or error message
            const messageDiv = document.getElementById('messages');
            if (response.ok) {
                messageDiv.innerHTML = `<div class="text-green-600 bg-green-300 p-4 text-center rounded-md">${result.message}</div>`;
                staffForm.reset(); // Reset form fields
            } else {
                messageDiv.innerHTML = `<div class="text-red-600 bg-red-300 p-4 text-center rounded-md">${result.message}</div>`;
            }

            // Close the popup
            popup.classList.add('hidden');
            popupOverlay.classList.add('hidden');

            // Optionally refresh the page to display the updated data
            location.reload();
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the staff member.');
        }
    });

    // Close the popup when the cancel button is clicked
    closePopup.addEventListener('click', () => {
        popupOverlay.classList.add('hidden');
        popup.classList.add('hidden');
    });
});



// Edit Staff Member
document.addEventListener('DOMContentLoaded', () => {
    const editPopup = document.getElementById('editPopup');
    const editPopupOverlay = document.getElementById('editPopupOverlay');
    const closeEditPopup = document.getElementById('closeEditPopup');
    const editStaffForm = document.getElementById('editStaffForm');
    
    // Function to open the Edit modal and populate it with data
    const editIcons = document.querySelectorAll('.fa-edit');
    editIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const staffId = this.getAttribute('data-id');
            const firstName = this.getAttribute('data-firstname');
            const lastName = this.getAttribute('data-lastname');
            const department = this.getAttribute('data-department');
            const branchId = this.getAttribute('data-branch');
            const username = this.getAttribute('data-username');

            // Set form fields
            document.getElementById('edit_staff_id').value = staffId;
            document.getElementById('edit_first_name').value = firstName;
            document.getElementById('edit_last_name').value = lastName;
            document.getElementById('edit_department').value = department;
            document.getElementById('edit_branch').value = branchId;
            document.getElementById('edit_username').value = username;

            // Show the edit modal
            editPopupOverlay.classList.remove('hidden');
            editPopup.classList.remove('hidden');
        });
    });

    // Function to close the Edit modal
    closeEditPopup.addEventListener('click', function() {
        editPopupOverlay.classList.add('hidden');
        editPopup.classList.add('hidden');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const deleteIcons = document.querySelectorAll('.fa-trash-can');
    const deleteModal = document.getElementById('deleteModal');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');

    let staffIdToDelete = null; // Variable to store the staff ID to delete

    deleteIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            staffIdToDelete = e.target.getAttribute('data-id'); // Get the staff ID from the clicked icon
            deleteModal.classList.remove('hidden'); // Show the delete modal
        });
    });

    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.classList.add('hidden'); // Hide the modal when cancel is clicked
        staffIdToDelete = null; // Reset the staff ID
    });

    confirmDeleteButton.addEventListener('click', async () => {
        if (staffIdToDelete) {
            try {
                // Make a POST request to delete the staff member
                const response = await fetch(`/staff/delete`, {
                    method: 'POST',  // Change to POST
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ staff_id: staffIdToDelete }),  // Send staff_id in the body
                });

                if (response.ok) {
                    // Remove the row from the table
                    const rowToRemove = document.querySelector(`i[data-id="${staffIdToDelete}"]`).closest('tr');
                    rowToRemove.remove();
                    // alert('Staff member deleted successfully');
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (error) {
                alert('An error occurred while deleting the staff member.');
                console.error(error);
            } finally {
                deleteModal.classList.add('hidden'); // Hide the modal after action
                staffIdToDelete = null; // Reset the staff ID
            }
        }
    });
});

