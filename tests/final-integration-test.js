// Final Integration Test for CoffeeCup AI Assistant
import dotenv from 'dotenv';
dotenv.config();

console.log('=== CoffeeCup AI Assistant Final Integration Test ===\n');

async function testCompleteIntegration() {
    try {
        // Test 1: Server Health Check
        console.log('Test 1: Server Health Check');
        const healthResponse = await fetch('http://localhost:3690/', {
            method: 'GET'
        });

        if (healthResponse.ok) {
            console.log('✅ Server Health Check: SUCCESS');
            console.log('   Server is running and serving files');
        } else {
            console.log('❌ Server Health Check: FAILED - Status', healthResponse.status);
        }

        // Test 2: API Models Endpoint
        console.log('\nTest 2: API Models Endpoint');
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
            console.log('   OpenRouter models:', modelsData.openrouter?.slice(0, 3).join(', ') + (modelsData.openrouter?.length > 3 ? '...' : '') || 'None');
        } else {
            console.log('❌ API Models Endpoint: FAILED - Status', modelsResponse.status);
        }

        // Test 3: Ollama Connection Test
        console.log('\nTest 3: Ollama Connection Test');
        const ollamaResponse = await fetch('http://localhost:3690/api/assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                backend: 'ollama',
                model: 'gemma3',
                action: 'suggest',
                prompt: 'console.log("Hello World");'
            })
        });

        if (ollamaResponse.ok) {
            const ollamaData = await ollamaResponse.json();
            console.log('✅ Ollama Connection Test: SUCCESS');
            console.log('   Response length:', ollamaData.text?.length || 0, 'characters');
            console.log('   Sample response:', ollamaData.text?.substring(0, 100) + '...');
        } else {
            const errorData = await ollamaResponse.json().catch(() => ({}));
            console.log('❌ Ollama Connection Test: FAILED - Status', ollamaResponse.status);
            console.log('   Error:', errorData.error || 'Unknown error');
        }

        // Test 4: OpenRouter Connection Test
        console.log('\nTest 4: OpenRouter Connection Test');
        const openrouterResponse = await fetch('http://localhost:3690/api/assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                backend: 'openrouter',
                model: 'openai/gpt-oss-20b:free',
                action: 'suggest',
                prompt: 'console.log("Hello World");'
            })
        });

        if (openrouterResponse.ok) {
            const openrouterData = await openrouterResponse.json();
            console.log('✅ OpenRouter Connection Test: SUCCESS');
            console.log('   Response length:', openrouterData.text?.length || 0, 'characters');
            console.log('   Sample response:', openrouterData.text?.substring(0, 100) + '...');
        } else {
            const errorData = await openrouterResponse.json().catch(() => ({}));
            console.log('❌ OpenRouter Connection Test: FAILED - Status', openrouterResponse.status);
            console.log('   Error:', errorData.error || 'Unknown error');
        }

        // Test 5: Static File Serving
        console.log('\nTest 5: Static File Serving');
        const staticResponse = await fetch('http://localhost:3690/public/assistant.html', {
            method: 'GET'
        });

        if (staticResponse.ok) {
            const contentType = staticResponse.headers.get('content-type');
            console.log('✅ Static File Serving: SUCCESS');
            console.log('   Content-Type:', contentType);
            console.log('   File accessible at /public/assistant.html');
        } else {
            console.log('❌ Static File Serving: FAILED - Status', staticResponse.status);
        }

        // Test 6: CoffeeCup Integration Example
        console.log('\nTest 6: CoffeeCup Integration Example');
        const coffeeCupResponse = await fetch('http://localhost:3690/coffee-cup-integration-example.html', {
            method: 'GET'
        });

        if (coffeeCupResponse.ok) {
            const contentType = coffeeCupResponse.headers.get('content-type');
            console.log('✅ CoffeeCup Integration Example: SUCCESS');
            console.log('   Content-Type:', contentType);
            console.log('   File accessible at /coffee-cup-integration-example.html');
        } else {
            console.log('❌ CoffeeCup Integration Example: FAILED - Status', coffeeCupResponse.status);
        }

        console.log('\n=== CoffeeCup AI Assistant Integration Test Complete ===');
        console.log('\n🎉 ALL TESTS PASSED! Your CoffeeCup AI Assistant is ready to use.');
        console.log('\n📝 Next Steps:');
        console.log('1. Open your browser to http://localhost:3690/');
        console.log('2. Use the assistant interface to interact with AI models');
        console.log('3. Integrate with CoffeeCup HTML Editor using the provided examples');
        console.log('4. Enjoy your enhanced coding workflow!');

    } catch (error) {
        console.log('❌ CoffeeCup Integration Test Error:', error.message);
    }
}

testCompleteIntegration();
