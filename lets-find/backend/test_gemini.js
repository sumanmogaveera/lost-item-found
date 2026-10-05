const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
    console.log('--- Testing Requested Model: gemini-1.5-flash-latest ---');
    const key = process.env.GEMINI_API_KEY;

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        
        console.log('Sending test prompt...');
        const result = await model.generateContent("Say 'System Online'");
        console.log('✅ SUCCESS!');
        console.log('Response:', (await result.response).text());
    } catch (error) {
        console.error('❌ FAILED:', error.message);
    }
}

test();
