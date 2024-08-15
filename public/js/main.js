window.onload = function() {
    setTimeout(function() {
        var messagesDiv = document.getElementById('messages');
        if (messagesDiv) {
            messagesDiv.style.display = 'none';
        }
    }, 3000); // 3000 milliseconds = 3 seconds
};
