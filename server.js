const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const imagesDir = path.join(__dirname, '../../Pictures/dataset');

app.use(express.static('public'));

app.get('/random-image', (req, res) => {
  fs.readdir(imagesDir, (err, files) => {
    if (err) return res.status(500).send('Error reading directory');

    const imageFiles = files.filter(file =>
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );

    if (imageFiles.length === 0) return res.status(404).send('No images found');

    const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    res.send(`/images/${randomImage}`);
  });
});

app.use('/images', express.static(imagesDir));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
