const express = require('express');
const Replicate = require('replicate');
require('dotenv').config();

const router = express.Router();

// POST /blendsublime
router.post('/blendsublime', async (req, res) => {
  try {
    const { userImageUrl } = req.body;

    if (!userImageUrl) {
      return res.status(400).json({ error: "Missing userImageUrl" });
    }

    // Hardcoded reference image (the “sublime” style)
    const hardcodedImageUrl =
      "https://res.cloudinary.com/dlmkmswvp/image/upload/v1759516075/Screenshot_2025-10-03_at_2.27.43_PM_ggmbb8.png";

    // Instantiate Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Use the correct model: lambdal/image-mixer
    const model =
      "lambdal/image-mixer:23d37d119ed3149e1135564d1cb5551c16dac1026e9deb972df42810a0f68c2f";

    // Configure the model input
    const input = {
      image1: userImageUrl,
      image2: hardcodedImageUrl,
      seed: 0,
      cfg_scale: 3.5,
      num_steps: 30,
      num_samples: 3,
      image1_strength: 1.75,
      image2_strength: 1,
    };

    // Run the model
    const output = await replicate.run(model, { input });
    console.log("Replicate blend output:", output);

    // Replicate usually returns an array of URLs
    // Handle SDK differences
    let blendedImageUrl;
    if (output && output[0]) {
    blendedImageUrl =
        typeof output[0].url === "function" ? output[0].url() : output[0];
    } else {
    blendedImageUrl = null;
    }

    console.log("Replicate blend url:", blendedImageUrl);
    res.status(200).json({ blendedImageUrl });
  } catch (error) {
    console.error("Replicate blend error:", error);
    res.status(500).json({ error: "Failed to blend images with Replicate" });
  }
});

module.exports = router;
