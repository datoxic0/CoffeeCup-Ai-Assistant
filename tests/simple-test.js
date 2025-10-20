// Simple test for CoffeeCup AI Assistant core functionality
import dotenv from 'dotenv';
dotenv.config();

console.log('=== CoffeeCup AI Assistant Simple Test ===\n');

async function testCoreFunctionality() {
    try {
        console.log('Testing core functionality...\n');
        
        // Test 1: Basic server connection
        console.log('1. Testing basic server connection...');
        const healthResponse = await fetch('http://localhost:3690/', {
            method: 'GET'
        });

        if (healthResponse.ok) {
            console.log('✅ Server Health Check: SUCCESS');
            console.log('   Server is running and serving files');
        } else {
            console.log('❌ Server Health Check: FAILED - Status', healthResponse.status);
            return false;
        }

        // Test 2: Static file serving
        console.log('\n2. Testing static file serving...');
        const staticResponse = await fetch('http://localhost:3690/public/assistant.html', {
            method: 'GET'
        });

        if (staticResponse.ok) {
            const contentType = staticResponse.headers.get('content-type');
            console.log('✅ Static File Serving: SUCCESS');
            console.log('   Content-Type:', contentType);
        } else {
            console.log('❌ Static File Serving: FAILED - Status', staticResponse.status);
            return false;
        }

        // Test 3: API models endpoint
        console.log('\n3. Testing API models endpoint...');
        const modelsResponse = await fetch('http://localhost:3690/api/models', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            console.log('✅ API Models Endpoint: SUCCESS');
            console.log('   Ollama models available:', modelsData.ollama?.length || 0);
            console.log('   OpenRouter models available:', modelsData.openrouter?.length || 0);
            console.log('   Ollama models:', modelsData.ollama?.join(', ') || 'None');
        } else {
            console.log('❌ API Models Endpoint: FAILED - Status', modelsResponse.status);
            return false;
        }

        console.log('\n=== Core Functionality Test Complete ===');
        console.log('\n🎉 CoffeeCup AI Assistant core functionality is working!');
        console.log('\n📝 Next Steps:');
        console.log('1. Open your browser to http://localhost:3690/');
        console.log('2. Use the assistant interface to interact with AI models');
        console.log('3. The Ollama models are ready: gemma3, deepseek-r1, qwen2.5-coder');
        console.log('4. For OpenRouter, add your API key to .env file');
        console.log('5. Enjoy your enhanced coding workflow!');
        
        return true;

    } catch (error) {
        console.log('❌ Core Functionality Test Error:', error.message);
        return false;
    }
}

testCoreFunctionality();
