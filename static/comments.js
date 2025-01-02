$(document).ready(function () {
    // Function to load all comments from the backend
    function loadComments() {
        $.get('/comments', function (comments) {
            const commentsList = $('#comments-list');
            commentsList.empty(); // Clear the list before updating
            if (comments.length === 0) {
                commentsList.append('<li class="list-group-item">No comments yet. Be the first to comment!</li>');
            } else {
                comments.forEach(comment => {
                    commentsList.append(`
                        <li class="list-group-item">
                            <strong>${comment.name}</strong>: ${comment.comment}
                            <small class="text-muted">(${new Date(comment.timestamp).toLocaleString()})</small>
                        </li>
                    `);
                });
            }
        }).fail(function () {
            alert('Failed to load comments. Please try again later.');
        });
    }

    // Handle comment submission
    $('#comment-form').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const name = $('#name').val().trim();
        const comment = $('#comment').val().trim();

        if (name && comment) {
            // Post the comment to the server
            $.ajax({
                url: '/comments',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ name, comment }),
                success: function () {
                    $('#name').val(''); // Clear the name field
                    $('#comment').val(''); // Clear the comment field
                    loadComments(); // Refresh the comments list
                },
                error: function () {
                    alert('Unable to post comment. Please try again later.');
                }
            });
        } else {
            alert('Please fill in both fields before submitting.');
        }
    });

    // Load comments on page load
    loadComments();
});