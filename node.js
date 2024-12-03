const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.post('/save-recipe', (req, res) => {
    const { recipe } = req.body;
    fs.appendFile('list.txt', `${recipe}\n`, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving recipe');
        }
        res.status(200).send('Recipe saved');
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});