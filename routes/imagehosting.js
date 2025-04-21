const express = require('express');
const router = express.Router();

let recentImageUrl = null;

// POST route to save the image URL (most recent)
router.post('/save', (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: 'imageUrl is required' });
  }

  recentImageUrl = imageUrl;
  return res.status(200).json({ message: 'Image URL saved successfully' });
});

// GET route to retrieve the most recent image URL
router.get('/get', (req, res) => {
  if (recentImageUrl) {
    return res.status(200).json({ imageUrl: recentImageUrl });
  } else {
    return res.status(404).json({ message: 'No image URL found' });
  }
});

module.exports = router;
