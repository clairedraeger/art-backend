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
      // change blend image here
      // d: https://res.cloudinary.com/dlmkmswvp/image/upload/v1759516075/Screenshot_2025-10-03_at_2.27.43_PM_ggmbb8.png
      // j: https://res.cloudinary.com/dlmkmswvp/image/upload/v1757965813/Screenshot_2025-09-15_at_3.48.13_PM_btcjc3.png
      const hardcodedImagePath = "https://res.cloudinary.com/dlmkmswvp/image/upload/v1759516075/Screenshot_2025-10-03_at_2.27.43_PM_ggmbb8.png";
  
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
      data.body = JSON.stringify({ 
        blendUrls, discord, channel 
      });

      const response = await fetch(apiUrl, data);
      const result = await response.json();
      console.log("response", {response, result});
      console.log("jobid ", result.jobid)
      res.status(200).json(result.jobid);
    } catch (error) {
      console.error('Midjourney blend error:', error);
      res.status(500).json({ error: 'Failed to blend images' });
    }
  });

  router.post("/blend/get", async (req, res) => {
    const { jobId } = req.body;
    console.log("jobId ", {jobId});
  
    if (!jobId || jobId == 'undefined') {
      return res.status(400).json({ error: "Missing jobId" });
    }
  
    const token = process.env.USEAPI_TOKEN;
    const apiUrl = `https://api.useapi.net/v2/jobs/?jobid=${jobId}`;
  
    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
      console.log(result);
      return res.json(result);
    } catch (error) {
      console.error("Error fetching job status:", error);
      return res.status(500).json({ error: "Failed to fetch job status" });
    }
  });
  

module.exports = router;
