document.addEventListener('DOMContentLoaded', () => {
    const collectionFeeInputs = document.querySelectorAll('.collection-fee-input');
    const actionButtons = document.querySelectorAll('.action-btn');

    collectionFeeInputs.forEach(input => {
        input.addEventListener('input', () => {
            const enteredFee = parseFloat(input.value) || 0;
            const requiredFee = parseFloat(input.getAttribute('data-required-fee')) || 0;

            const actionButton = Array.from(actionButtons).find(btn => btn.closest('tr').querySelector('.collection-fee-input') === input);

            if (enteredFee >= requiredFee) {
                actionButton.classList.remove('bg-gray-400');
                actionButton.classList.add('bg-green-500');
                actionButton.classList.add('hover:bg-green-600');
                actionButton.classList.remove('cursor-not-allowed')
                actionButton.classList.add('cursor-pointer')
                actionButton.disabled = false;
            } else {
                actionButton.classList.remove('bg-green-500');
                actionButton.classList.remove('hover:bg-green-600');
                actionButton.classList.add('bg-gray-400');
                actionButton.classList.remove('cursor-pointer')
                actionButton.classList.add('cursor-not-allowed')
                actionButton.disabled = true;
            }
        });
    });
});