require('dotenv').config();

console.log('🔐 Checking API Key Configuration...\n');

// Check if .env file is loaded
console.log('1. Environment Variables Loaded:');
console.log('   PORT:', process.env.PORT);
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');
console.log('   GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ MISSING!');

if (process.env.GEMINI_API_KEY) {
  console.log('   API Key Length:', process.env.GEMINI_API_KEY.length);
  console.log('   API Key Starts with:', process.env.GEMINI_API_KEY.substring(0, 6));
  
  // Validate API key format
  if (process.env.GEMINI_API_KEY.startsWith('AIza')) {
    console.log('   ✅ API Key format looks correct');
  } else {
    console.log('   ❌ API Key format may be incorrect (should start with "AIza")');
  }
}

console.log('\n2. Testing Gemini API Connectivity...');