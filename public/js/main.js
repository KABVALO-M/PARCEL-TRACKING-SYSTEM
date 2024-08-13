window.onload = function() {
    setTimeout(function() {
        var messagesDiv = document.getElementById('messages');
        if (messagesDiv) {
            messagesDiv.style.display = 'none';
        }
    }, 3000); // 3000 milliseconds = 3 seconds
};


async function loadBranches() {
    try {
        alert('Loading branches...');
        const response = await fetch('/api/branches'); // Endpoint to fetch branches
        const branches = await response.json();
        const sourceSelect = document.getElementById('source');
        const destinationSelect = document.getElementById('destination');

        // Clear existing options
        sourceSelect.innerHTML = '';
        destinationSelect.innerHTML = '';

        // Populate the select fields with branch data
        branches.forEach(branch => {
            const option = document.createElement('option');
            option.value = branch.branch_id;
            option.textContent = branch.branch_name;
            sourceSelect.appendChild(option);
            destinationSelect.appendChild(option.cloneNode(true));
        });
    } catch (error) {
        console.error('Error loading branches:', error);
    }
}

// Handle form submission
// document.getElementById('new-parcel-form').addEventListener('submit', function(event) {
//     event.preventDefault();
//     // Add your form submission logic here
//     alert('Parcel added successfully!');
//     document.getElementById('parcel-modal').classList.remove('open');
// });