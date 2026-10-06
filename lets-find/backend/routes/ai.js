const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

router.post('/visual-search', async (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({ msg: 'No image data provided' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ msg: 'AI service not configured. Please add GEMINI_API_KEY to .env' });
    }

    try {
        // Use gemini-1.5-flash-latest as requested by the user
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // Clean base64 string
        const base64Data = image.includes(',') ? image.split(',')[1] : image;
        const mimeType = image.includes(';') ? image.split(';')[0].split(':')[1] : "image/jpeg";

        const prompt = "Identify the object in this image. Provide a precise, concise search query (3-6 words) that includes the object name, color, and any visible brand or distinguishing marks. Return ONLY the search query string, no other text.";

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType
                }
            }
        ]);

        const keywords = result.response.text().trim().replace(/[".]/g, '');
        
        console.log(`AI Visual Scan: Generated keywords -> "${keywords}"`);

        res.json({ 
            success: true, 
            keywords,
            message: 'AI visual analysis complete'
        });
    } catch (error) {
        console.error('Gemini Vision Error:', error);
        res.status(500).json({ 
            success: false, 
            msg: 'Failed to process image with AI',
            error: error.message 
        });
    }
});

module.exports = router;
