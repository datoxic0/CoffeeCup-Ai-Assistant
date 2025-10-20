// Test AI functionality for CoffeeCup AI Assistant
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

console.log('=== CoffeeCup AI Assistant Functionality Test ===\n');

async function testAIEndpoints() {
    try {
        console.log('Testing AI Assistant endpoints...\n');
        
        // Test 1: Basic connection test
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

        // Test 2: API models endpoint
        console.log('\n2. Testing API models endpoint...');
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

        // Test 3: Ollama connection test with simple prompt
        console.log('\n3. Testing Ollama connection with simple prompt...');
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
            return false;
        }

        // Test 4: OpenRouter connection test (if API key is set)
        console.log('\n4. Testing OpenRouter connection with simple prompt...');
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
            if (errorData.error?.includes('API key not set') || errorData.error?.includes('your_openrouter_api_key_here')) {
                console.log('⚠️  OpenRouter Connection Test: SKIPPED - API key not configured');
                console.log('   To enable OpenRouter, set OPENROUTER_API_KEY in your .env file');
            } else {
                console.log('❌ OpenRouter Connection Test: FAILED - Status', openrouterResponse.status);
                console.log('   Error:', errorData.error || 'Unknown error');
                return false;
            }
        }

        // Test 5: Static file serving
        console.log('\n5. Testing static file serving...');
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
            return false;
        }

        // Test 6: CoffeeCup integration example
        console.log('\n6. Testing CoffeeCup integration example...');
        const coffeeCupResponse = await fetch('http://localhost:3690/coffee-cup-integration-example.html', {
            method: 'GET'
        });

        if (coffeeCupResponse.ok) {
            const contentType = coffeeCupResponse.headers.get('content-type');
            console.log('✅ CoffeeCup Integration Example: SUCCESS');
            console.log('   Content-Type:', contentType);
        } else {
            console.log('❌ CoffeeCup Integration Example: FAILED - Status', coffeeCupResponse.status);
            return false;
        }

        // Test 7: Deep integration example
        console.log('\n7. Testing CoffeeCup deep integration example...');
        const deepIntegrationResponse = await fetch('http://localhost:3690/coffee-cup-deep-integration.html', {
            method: 'GET'
        });

        if (deepIntegrationResponse.ok) {
            const contentType = deepIntegrationResponse.headers.get('content-type');
            console.log('✅ CoffeeCup Deep Integration Example: SUCCESS');
            console.log('   Content-Type:', contentType);
        } else {
            console.log('❌ CoffeeCup Deep Integration Example: FAILED - Status', deepIntegrationResponse.status);
            return false;
        }

        console.log('\n=== All AI Functionality Tests Passed! ===');
        console.log('\n🎉 CoffeeCup AI Assistant is fully functional!');
        console.log('\n📝 Next Steps:');
        console.log('1. Open your browser to http://localhost:3690/');
        console.log('2. Use the assistant interface to interact with AI models');
        console.log('3. Integrate with CoffeeCup HTML Editor using the provided examples');
        console.log('4. Enjoy your enhanced coding workflow!');
        
        return true;

    } catch (error) {
        console.log('❌ AI Functionality Test Error:', error.message);
        return false;
    }
}

// Run the tests
testAIEndpoints().then(success => {
    if (success) {
        console.log('\n✅ ALL TESTS PASSED! Your CoffeeCup AI Assistant is ready to use.');
    } else {
        console.log('\n❌ SOME TESTS FAILED. Please check the output above and fix the issues.');
    }
});
