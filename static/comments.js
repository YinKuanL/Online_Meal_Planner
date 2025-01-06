$(document).ready(function () {
    // Function to load all comments from the backend
    function loadComments() {
        $('#loading-indicator').show(); // Show loading indicator
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
        }).fail(function (jqXHR, textStatus, errorThrown) {
            alert('Failed to load comments. Please try again later. Error: ' + textStatus);
            console.error('Error loading comments:', errorThrown);
        }).always(function () {
            $('#loading-indicator').hide(); // Hide loading indicator
        });
    }

    // Handle comment submission
    $('#comment-form').submit(function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const name = $('#name').val().trim();
        const comment = $('#comment').val().trim();
        let isValid = true;

        // Validate name
        if (name.length < 3) {
            $('#name-error').show();
            isValid = false;
        } else {
            $('#name-error').hide();
        }

        // Validate comment
        if (comment.length < 10) {
            $('#comment-error').show();
            isValid = false;
        } else {
            $('#comment-error').hide();
        }

        if (isValid) {
            $('#submit-btn').prop('disabled', true); // Disable submit button to prevent multiple submissions
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
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Unable to post comment. Please try again later. Error: ' + textStatus);
                    console.error('Error posting comment:', errorThrown);
                },
                complete: function () {
                    $('#submit-btn').prop('disabled', false); // Re-enable submit button after request is complete
                }
            });
        } else {
            alert('Please fill in both fields before submitting.');
        }
    });

    // Load comments on page load
    loadComments();
});
