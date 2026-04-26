const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to handle JSON data and serve static files
app.use(express.json({ limit: '10mb' })); // Higher limit for Base64 images
app.use(express.static('./')); 

const JSON_PATH = path.join(__dirname, 'movies.json');

// Route to get all movies
app.get('/api/movies', (req, res) => {
    const data = fs.readFileSync(JSON_PATH, 'utf8');
    res.json(JSON.parse(data));
});

// Route to save the entire movie list (replacing the old logic)
app.post('/api/movies', (req, res) => {
    try {
        const newData = { movies: req.body };
        fs.writeFileSync(JSON_PATH, JSON.stringify(newData, null, 2));
        res.status(200).send("Vault updated successfully!");
    } catch (err) {
        res.status(500).send("Error writing to file");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});