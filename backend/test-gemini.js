require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = "Hello, are you working? Respond with 'Yes, Gemini API is working!'";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("✅ Gemini API is working!");
    console.log("Response:", text);
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    console.log("Please check your API key and internet connection");
  }
}

testGeminiAPI();