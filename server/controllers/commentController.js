const fs = require('fs');
const path = require('path');
const commentsFilePath = path.join(__dirname, '../comments.json');

// Delete a comment
exports.deleteComment = (req, res) => {
    const index = parseInt(req.params.index, 10);

    // Check if the index is valid
    if (isNaN(index) || index < 0) {
        return res.status(400).send('Invalid index');  // Return 400 if the index is invalid
    }

    fs.readFile(commentsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error loading comments');  // Return 500 if there is an error reading the file

        let comments = JSON.parse(data || '[]');
        // Check if the comment exists at the given index
        if (index >= comments.length) return res.status(404).send('Comment not found');  // Return 404 if the comment is not found

        comments.splice(index, 1);  // Remove the comment from the array

        // Write the updated comments back to the file
        fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 4), (writeErr) => {
            if (writeErr) return res.status(500).send('Error deleting comment');  // Return 500 if there is an error writing the file
            res.status(200).send('Comment deleted');  // Return 200 if the comment is successfully deleted
        });
    });
};
