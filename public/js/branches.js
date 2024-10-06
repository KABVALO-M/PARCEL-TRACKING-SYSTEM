document.addEventListener('DOMContentLoaded', () => {
    // Add Branch Functionality
    document.getElementById('addBranchBtn').addEventListener('click', function() {
        document.getElementById('popupOverlay').classList.remove('hidden');
        document.getElementById('popup').classList.remove('hidden');
    });

    document.getElementById('closePopup').addEventListener('click', function() {
        document.getElementById('popupOverlay').classList.add('hidden');
        document.getElementById('popup').classList.add('hidden');
    });

    // Posting Data
    const form = document.getElementById('branchForm');
    const popupOverlay = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            location: formData.get('location'),
            contact: formData.get('contact'),
        };
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            const result = await response.json();

            // Display success or error message
            const messageDiv = document.getElementById('messages');
            if (result.success) {
                messageDiv.innerHTML = `<div class="text-green-600 bg-green-300 p-4 text-center rounded-md">${result.message}</div>`;
                branchForm.reset(); // Reset form fields
            } else {
                messageDiv.innerHTML = `<div class="text-red-600 bg-red-300 p-4 text-center rounded-md">${result.message}</div>`;
            }
            location.reload(); // Refresh the page to display the updated data

            // Optionally close the popup
            popup.classList.add('hidden');
            popupOverlay.classList.add('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the branch.');
        }
    });

    // Editing Branch Functionality
    const editPopup = document.getElementById('editPopup');
    const editPopupOverlay = document.getElementById('editPopupOverlay');
    const closeEditPopupBtn = document.getElementById('closeEditPopup');

    // Add event listener to all edit icons
    document.querySelectorAll('.edit-icon').forEach(icon => {
        icon.addEventListener('click', function () {
            // Get the branch data from data-* attributes
            const branchId = this.getAttribute('data-id');
            const branchName = this.getAttribute('data-name');
            const branchLocation = this.getAttribute('data-location');
            const branchContact = this.getAttribute('data-contact');
            
            // Populate the modal fields with the branch data
            document.getElementById('editBranchId').value = branchId;
            document.getElementById('editName').value = branchName;
            document.getElementById('editLocation').value = branchLocation;
            document.getElementById('editContact').value = branchContact;

            // Display the modal
            editPopup.classList.remove('hidden');
            editPopupOverlay.classList.remove('hidden');
        });
    });

    // Close edit modal
    closeEditPopupBtn.addEventListener('click', () => {
        editPopup.classList.add('hidden');
        editPopupOverlay.classList.add('hidden');
    });

    // Handle form submission for updating the branch
    document.getElementById('editBranchForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        // Gather form data
        const formData = new FormData(editBranchForm);
        const branchId = formData.get('branch_id');
        const name = formData.get('name');
        const location = formData.get('location');
        const contact = formData.get('contact');

        // Perform the AJAX request to update the branch
        fetch(`/branches/edit/${branchId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                branch_id: branchId,
                name: name,
                location: location,
                contact: contact
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                editPopup.classList.add('hidden');
                editPopupOverlay.classList.add('hidden');
                window.location.reload(); 
            } else {
                alert('Error updating branch: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the branch.');
        });
    });

   // Get the delete modal elements
   const deleteModal = document.getElementById('deleteModal');
   const cancelDelete = document.getElementById('cancelDelete');
   const confirmDelete = document.getElementById('confirmDelete');

   // Add event listener to all delete icons
   document.querySelectorAll('.fa-trash-can').forEach(icon => {
       icon.addEventListener('click', function () {
           // Get the branch ID from the data attribute
           const branchId = this.getAttribute('data-id');

           // Show the delete confirmation modal
           deleteModal.classList.remove('hidden');

           // Confirm delete action
           confirmDelete.onclick = function () {
               // Make the fetch request to delete the branch
               fetch(`/branches/delete/${branchId}`, {
                   method: 'DELETE'
               })
               .then(response => response.json())
               .then(data => {
                   if (data.success) {
                       // Hide the modal
                       deleteModal.classList.add('hidden');
                       // Optionally reload the page or remove the branch from the DOM
                       window.location.reload(); 
                   } else {
                       alert('Error deleting branch: ' + data.message);
                   }
               })
               .catch(error => {
                   console.error('Error:', error);
                   alert('An error occurred while deleting the branch.');
               });
           };
       });
   });

   // Close delete modal when cancel button is clicked
   cancelDelete.addEventListener('click', () => {
       deleteModal.classList.add('hidden');
   });
});
