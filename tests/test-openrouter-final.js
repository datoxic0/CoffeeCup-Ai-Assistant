// Final test for OpenRouter API integration
async function testOpenRouterFinal() {
    try {
        console.log('=== Final OpenRouter API Integration Test ===\n');
        
        // Test the models endpoint
        console.log('Testing OpenRouter Models API...');
        const modelsResponse = await fetch('http://localhost:3690/api/models', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            console.log('✅ OpenRouter Models API: SUCCESS');
            console.log('   Ollama models:', modelsData.ollama?.length || 0);
            console.log('   OpenRouter models:', modelsData.openrouter?.length || 0);
        } else {
            console.log('❌ OpenRouter Models API: FAILED - Status', modelsResponse.status);
        }

        // Test the main assistant endpoint with a simple request
        console.log('\nTesting OpenRouter Assistant API...');
        const assistantResponse = await fetch('http://localhost:3690/api/assistant', {
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

        if (assistantResponse.ok) {
            const assistantData = await assistantResponse.json();
            console.log('✅ OpenRouter Assistant API: SUCCESS');
            console.log('   Response length:', assistantData.text?.length || 0, 'characters');
            console.log('   Sample:', assistantData.text?.substring(0, 100) + '...');
        } else {
            const errorText = await assistantResponse.text().catch(() => 'Unknown error');
            console.log('❌ OpenRouter Assistant API: FAILED - Status', assistantResponse.status);
            console.log('   Error:', errorText);
        }

        console.log('\n=== OpenRouter API Test Complete ===');

    } catch (error) {
        console.log('❌ OpenRouter Final Test Error:', error.message);
    }
}

testOpenRouterFinal();
