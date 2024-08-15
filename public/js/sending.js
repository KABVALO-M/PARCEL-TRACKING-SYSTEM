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
        console.log(data);
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