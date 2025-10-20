// Comprehensive test for CoffeeCup AI Assistant functionality
import dotenv from 'dotenv';
dotenv.config();

console.log('=== CoffeeCup AI Assistant Comprehensive Test ===\n');

// Test the main assistant endpoint
async function testAssistantEndpoint() {
    try {
        console.log('Testing main assistant endpoint...');
        
        // Test Ollama backend with gemma3 model
        console.log('\n1. Testing Ollama (gemma3 model)...');
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

        // Test OpenRouter backend
        console.log('\n2. Testing OpenRouter...');
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

        // Test models endpoint
        console.log('\n3. Testing models endpoint...');
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

        console.log('\n=== Comprehensive Test Complete ===');

    } catch (error) {
        console.log('❌ Comprehensive test error:', error.message);
    }
}

testAssistantEndpoint();
