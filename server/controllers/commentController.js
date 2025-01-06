// commentController.js
const fs = require('fs');
const path = require('path');
const commentsFilePath = path.join(__dirname, '../comments.json');

// 刪除評論
exports.deleteComment = (req, res) => {
    const index = parseInt(req.params.index, 10);

    fs.readFile(commentsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error loading comments');

        let comments = JSON.parse(data || '[]');
        if (index < 0 || index >= comments.length) return res.status(404).send('Comment not found');

        comments.splice(index, 1);

        fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 4), (writeErr) => {
            if (writeErr) return res.status(500).send('Error deleting comment');
            res.status(200).send('Comment deleted');
        });
    });
};
