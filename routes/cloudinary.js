require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const upload = multer({ dest: 'uploads/' });
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post('/', upload.single('image'), async (req, res) => {
    try {
      const path = req.file.path;
  
      const result = await cloudinary.uploader.upload(path, {
        folder: 'drawings',
      });
  
      fs.unlinkSync(path); // cleanup tmp file
  
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      res.status(500).json({ error: 'Image upload failed' });
    }
  });  

module.exports = router;
