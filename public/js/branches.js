document.getElementById('addBranchBtn').addEventListener('click', function() {
    document.getElementById('popupOverlay').classList.remove('hidden');
    document.getElementById('popup').classList.remove('hidden');
});

document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('popupOverlay').classList.add('hidden');
    document.getElementById('popup').classList.add('hidden');
});



// Posting Data
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('branchForm');
    const popupOverlay = document.getElementById('popupOverlay');
    const popup = document.getElementById('popup');
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

    // Close the popup when the cancel button is clicked
    closePopup.addEventListener('click', () => {
        popupOverlay.classList.add('hidden');
        popup.classList.add('hidden');
    });
});
