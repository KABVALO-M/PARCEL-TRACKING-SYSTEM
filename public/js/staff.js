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
