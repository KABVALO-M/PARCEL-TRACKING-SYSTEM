document.addEventListener('DOMContentLoaded', () => {
    const openModalBtn = document.getElementById('open-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const parcelModal = document.getElementById('parcel-modal');
    const detailsRows = document.querySelectorAll('.details-row');

    openModalBtn.addEventListener('click', () => {
        parcelModal.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => {
        parcelModal.classList.remove('open');
    });

    // Toggle details rows
    document.querySelectorAll('.view-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const row = button.closest('tr').nextElementSibling;
            row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const openModalButton = document.getElementById('open-modal');
    const closeModalButton = document.getElementById('close-modal');
    const modal = document.getElementById('parcel-modal');

    openModalButton.addEventListener('click', () => {
        modal.classList.add('open');
    });

    closeModalButton.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    document.getElementById('new-parcel-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle form submission
        const formData = new FormData(e.target);
        const data = new URLSearchParams(formData);
        fetch('/parcel/add-parcel', {
            method: 'POST',
            body: data,
            
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Success logic here (e.g., show a success message, refresh data)
                location.reload(); // Refresh the page or update the table
            } else {
                // Error logic here
                alert('Failed to add parcel: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        modal.classList.remove('open');
    });
});


// Event listener for edit buttons
document.querySelectorAll('.edit-icon').forEach(button => {
    button.addEventListener('click', function() {
        // Parse the parcel data from the data attribute
        const parcelData = JSON.parse(this.dataset.parcel);
        
        // Populate the modal fields with the parcel data
        document.getElementById('edit_sender_name').value = parcelData.sender_name;
        document.getElementById('edit_sender_phone').value = parcelData.sender_phone; 
        document.getElementById('edit_recipient_name').value = parcelData.recipient_name;
        document.getElementById('edit_recipient_phone').value = parcelData.recipient_phone; 
        document.getElementById('edit_parcel_weight').value = parcelData.parcel_weight;
        document.getElementById('edit_source').value = parcelData.source_branch; // Assuming this field corresponds to the branch_id
        document.getElementById('edit_destination').value = parcelData.destination_branch; // Assuming this field corresponds to the branch_id
        document.getElementById('edit_parcel_name').value = parcelData.parcel_name;
        document.getElementById('edit_parcel_value').value = parcelData.parcel_value; 
        document.getElementById('edit_collection_fee').value = parcelData.collection_fee; 
        document.getElementById('edit_date').value = parcelData.date; 
        
        // Remove existing hidden input if it exists
        const existingHiddenInput = document.getElementById('edit_parcel_id');
        if (existingHiddenInput) {
            existingHiddenInput.remove();
        }

        // Store the parcel ID in a hidden input field for later use in the update
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'edit_parcel_id';
        hiddenInput.value = parcelData.id;
        document.getElementById('edit-parcel-form').appendChild(hiddenInput);

        // Display the modal
        document.getElementById('edit-parcel-modal').style.display = 'block';
    });
});


// Close modal functionality
document.getElementById('close-edit-modal').addEventListener('click', function() {
    document.getElementById('edit-parcel-modal').style.display = 'none';
});

// Handle form submission for updating the parcel
document.getElementById('edit-parcel-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Gather data from the form
    const parcelId = document.getElementById('edit_parcel_id').value; // Retrieve the parcel ID
    console.log(parcelId);
     // Capture values from the form fields
     const senderName = document.getElementById('edit_sender_name').value;
     const senderPhone = document.getElementById('edit_sender_phone').value;
     const recipientName = document.getElementById('edit_recipient_name').value;
     const recipientPhone = document.getElementById('edit_recipient_phone').value;
     const parcelWeight = document.getElementById('edit_parcel_weight').value;
     const sourceBranch = document.getElementById('edit_source').value;
     const destinationBranch = document.getElementById('edit_destination').value;
     const parcelName = document.getElementById('edit_parcel_name').value;
     const parcelValue = document.getElementById('edit_parcel_value').value;
     const collectionFee = document.getElementById('edit_collection_fee').value;
     const date = document.getElementById('edit_date').value;

     const dataToSend = {
        parcelId: parcelId,
        sender_name: senderName,
        sender_phone: senderPhone,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
        parcel_weight: parcelWeight,
        source: sourceBranch,
        destination: destinationBranch,
        parcel_name: parcelName,
        parcel_value: parcelValue,
        collection_fee: collectionFee,
        date: date,
    };
    
    // Send the updated data to the server
    fetch(`/parcel/update-parcel/${parcelId}`, {
        method: 'PUT', // Assuming you're using PUT for updates
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            alert('Parcel updated successfully!');
            document.getElementById('edit-parcel-modal').style.display = 'none';
            window.location.reload();
        } else {
            alert('Error updating parcel: ' + result.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the parcel.');
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const deleteIcons = document.querySelectorAll(".delete-icon");
    const deleteModal = document.getElementById("deleteModal");
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const cancelDeleteBtn = document.getElementById("cancelDelete");
    let parcelIdToDelete = null; // Store the ID of the parcel to delete
  
    // Open the modal when a delete icon is clicked
    deleteIcons.forEach(icon => {
      icon.addEventListener("click", (event) => {
        parcelIdToDelete = event.target.getAttribute("data-id");
        deleteModal.classList.remove("hidden");
      });
    });
  
    // Close the modal if the cancel button is clicked
    cancelDeleteBtn.addEventListener("click", () => {
      deleteModal.classList.add("hidden");
      parcelIdToDelete = null; // Clear the ID
    });
  
    // Perform the delete action when the confirm button is clicked
    confirmDeleteBtn.addEventListener("click", () => {
      if (parcelIdToDelete) {
        // Make a request to your server to delete the parcel
        fetch(`/parcel/delete/${parcelIdToDelete}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              // Hide the modal and refresh the page or remove the row
              deleteModal.classList.add("hidden");
              location.reload(); // Reload the page to reflect changes
            } else {
              alert("Error deleting parcel");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  });
  