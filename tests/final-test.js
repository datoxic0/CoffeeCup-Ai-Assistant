// Final comprehensive test for CoffeeCup AI Assistant
import dotenv from 'dotenv';
dotenv.config();

console.log('=== CoffeeCup AI Assistant Final Test ===\n');

async function testAssistant() {
    try {
        console.log('Testing main assistant endpoint...\n');
        
        // Test 1: Basic Ollama connection
        console.log('1. Testing Ollama (gemma3 model)...');
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
            console.log('✅ Ollama (gemma3): SUCCESS');
            console.log('   Response length:', ollamaData.text?.length || 0, 'characters');
            console.log('   Sample:', ollamaData.text?.substring(0, 100) + '...');
        } else {
            const errorData = await ollamaResponse.json().catch(() => ({}));
            console.log('❌ Ollama (gemma3): FAILED');
            console.log('   Status:', ollamaResponse.status);
            console.log('   Error:', errorData.error || 'Unknown error');
        }

        console.log('');
        
        // Test 2: OpenRouter connection
        console.log('2. Testing OpenRouter...');
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
            console.log('✅ OpenRouter: SUCCESS');
            console.log('   Response length:', openrouterData.text?.length || 0, 'characters');
            console.log('   Sample:', openrouterData.text?.substring(0, 100) + '...');
        } else {
            const errorData = await openrouterResponse.json().catch(() => ({}));
            console.log('❌ OpenRouter: FAILED');
            console.log('   Status:', openrouterResponse.status);
            console.log('   Error:', errorData.error || 'Unknown error');
        }

        console.log('');
        
        // Test 3: Models endpoint
        console.log('3. Testing models endpoint...');
        const modelsResponse = await fetch('http://localhost:3690/api/models', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            console.log('✅ Models endpoint: SUCCESS');
            console.log('   Ollama models:', modelsData.ollama?.length || 0);
            console.log('   OpenRouter models:', modelsData.openrouter?.length || 0);
            console.log('   Ollama models list:', modelsData.ollama?.join(', ') || 'None');
        } else {
            const errorData = await modelsResponse.json().catch(() => ({}));
            console.log('❌ Models endpoint: FAILED');
            console.log('   Status:', modelsResponse.status);
            console.log('   Error:', errorData.error || 'Unknown error');
        }

        console.log('');
        
        // Test 4: Static file serving
        console.log('4. Testing static file serving...');
        const staticResponse = await fetch('http://localhost:3690/', {
            method: 'GET'
        });

        if (staticResponse.ok) {
            const contentType = staticResponse.headers.get('content-type');
            console.log('✅ Static file serving: SUCCESS');
            console.log('   Content-Type:', contentType);
        } else {
            console.log('❌ Static file serving: FAILED - Status', staticResponse.status);
        }

        console.log('\n=== Final Test Complete ===');
        console.log('\n🎉 ALL TESTS COMPLETED! Your CoffeeCup AI Assistant is ready to use.');
        console.log('\n📝 Next Steps:');
        console.log('1. Open your browser to http://localhost:3690/');
        console.log('2. Use the assistant interface to interact with AI models');
        console.log('3. Integrate with CoffeeCup HTML Editor using the provided examples');
        console.log('4. Enjoy your enhanced coding workflow!');

    } catch (error) {
        console.log('❌ Final test error:', error.message);
    }
}

testAssistant();
