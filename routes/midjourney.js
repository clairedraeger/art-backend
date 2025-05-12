const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { Midjourney } = require('midjourney');
require('dotenv').config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/blend', async (req, res) => {
    try {
      const { userImageUrl } = req.body;
      if (!userImageUrl) {
        return res.status(400).json({ error: "Missing userImageUrl" });
      }
      const hardcodedImagePath = "https://res.cloudinary.com/dlmkmswvp/image/upload/v1744833414/untitled_butt_apvbue.jpg";
  
      const apiUrl = 'https://api.useapi.net/v2/jobs/blend';
      const token = process.env.USEAPI_TOKEN;
      const discord = process.env.DISCORD_TOKEN;
      const channel = process.env.CHANNEL_ID;

      const data = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      };
      const blendUrls = [userImageUrl, hardcodedImagePath];
      const replyUrl = "https://art-backend-6mu2.onrender.com/api/blend-callback"; //CALLABCK URL
      data.body = JSON.stringify({ 
        blendUrls, discord, channel, replyUrl 
      });

      const response = await fetch(apiUrl, data);
      const result = await response.json();
      console.log("response", {response, result});
      return res.status(200).json({ message: "Blend started" });
    } catch (error) {
      console.error('Midjourney blend error:', error);
      res.status(500).json({ error: 'Failed to blend images' });
    }
  });

  // Server-Sent Events (SSE)
  let sseClients = [];

  router.get('/blend/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    sseClients.push(res);

    req.on('close', () => {
      sseClients = sseClients.filter(client => client !== res);
    });
  });


  //call back url
  router.post('/blend-callback', express.json(), async (req, res) => {
    try {
      const { status, result, error } = req.body;
  
      if (status === 'completed' && result?.imageUrl) {
        console.log('Blend completed:', result.imageUrl);
  
        // Notify all connected SSE clients
        sseClients.forEach(client => {
          client.write(`data: ${JSON.stringify({ imageUrl: result.imageUrl })}\n\n`);
        });
      } else if (status === 'failed') {
        console.error('Blend failed:', error);
      }
  
      res.status(200).json({ message: 'Callback received' });
    } catch (err) {
      console.error('Callback processing error:', err);
      res.status(500).json({ error: 'Callback error' });
    }
  });
  

module.exports = router;
