const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const folderPath = './textfiles'; // Folder to store text files

// Create the folder if it doesn't exist
if (!fs.existsSync(folderPath)){
    fs.mkdirSync(folderPath);
}

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to create a text file
app.post('/create-file', (req, res) => {
    const { filename, content } = req.body;

    if (!filename || !content) {
        return res.status(400).json({ error: 'Filename and content are required' });
    }

    const filePath = path.join(folderPath, `${filename}.txt`);

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to create file' });
        }
        res.status(201).json({ message: 'File created successfully' });
    });
});

// API endpoint to retrieve all text files
app.get('/files', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve files' });
        }

        const textFiles = files.filter(file => path.extname(file) === '.txt');
        res.status(200).json({ files: textFiles });
    });
});
app.get('/list-files', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading directory', error: err });
        }
        const fileList = files.map(file => {
            const filePath = path.join(folderPath, file);
            const stats = fs.statSync(filePath);
            return {
                filename: file,
                createdAt: stats.birthtime,
                updatedAt: stats.mtime
            };
        });
        res.status(200).json(fileList);
    });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
