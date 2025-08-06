const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// list to hold previously viewed images
let previousImages = [];
let presentImageIndex = 0;

const imagesDir = path.join(__dirname, '../../Pictures/validated_images');

app.use(express.static('public'));

app.get('/random-image', (req, res) => {
  fs.readdir(imagesDir, (err, files) => {
    if (presentImageIndex > 0) {
      return res.send(`/images/${previousImages[presentImageIndex--]}`); 
    }
    else {
      if (err) return res.status(500).send('Error reading directory');

      const imageFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      );

      if (imageFiles.length === 0) return res.status(404).send('No images found');

      const randomImage = imageFiles[Math.floor(Math.random() * imageFiles.length)];

      if (previousImages.length === 0) {
        previousImages.push(randomImage);
      } else {
        previousImages.splice(0, 0, randomImage);
      }

      if (previousImages.length > 5) {
        previousImages.pop();;
      }
      
      res.send(`/images/${randomImage}`);
    }

    console.log(`ALL : ${previousImages}`);
  });
});



// get previous image
app.get('/previous-image', (_, res) => {
  // No need to read directory, just use previousImages array
  if (previousImages.length <= 1 || presentImageIndex === 4) {
    return res.status(404).send('No previous images found');
  }
  else{
    presentImageIndex++;
    res.send(`/images/${previousImages[presentImageIndex]}`);
  }
});

app.use('/images', express.static(imagesDir));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});