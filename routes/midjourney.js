const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const path = require('path');
const { Midjourney } = require('midjourney');
require('dotenv').config();

const upload = multer({ dest: 'uploads/' });

const client = new Midjourney({
  ServerId: process.env.SERVER_ID,
  ChannelId: process.env.CHANNEL_ID,
  SalaiToken: process.env.SALAI_TOKEN,
  Debug: true,
  Ws: true,
});

router.post('/blend', async (req, res) => {
  try {
    const { userImageUrl } = req.body;

    if (!userImageUrl) {
      return res.status(400).json({ error: 'Missing userImageUrl' });
    }

    const hardcodedImageUrl = 'https://res.cloudinary.com/dlmkmswvp/image/upload/v1744833414/untitled_butt_apvbue.jpg';

    await client.Connect();

    const prompt = `${userImageUrl} ${hardcodedImageUrl}`;
    const blendMsg = await client.Imagine(prompt, (uri, progress) => {
      console.log('blending...', uri, 'progress:', progress);
    });

    res.json({ result: blendMsg });
  } catch (error) {
    console.error('Midjourney blend error:', error);
    res.status(500).json({ error: 'Failed to blend images' });
  }
});

module.exports = router;
