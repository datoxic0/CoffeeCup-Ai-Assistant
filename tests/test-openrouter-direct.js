// Direct OpenRouter API test
import dotenv from 'dotenv';
dotenv.config();

async function testOpenRouterDirect() {
    try {
        console.log('=== Direct OpenRouter API Test ===\n');
        
        const apiKey = process.env.OPENROUTER_API_KEY;
        const openrouterBase = process.env.OPENROUTER_BASE || 'https://api.openrouter.ai/v1';
        
        console.log('Testing OpenRouter connection...');
        console.log('API Key:', apiKey ? 'SET' : 'NOT SET');
        console.log('Base URL:', openrouterBase);
        console.log('');
        
        if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
            console.log('❌ OpenRouter API key not configured');
            return;
        }
        
        // Test models endpoint
        console.log('Fetching available models...');
        const modelsResponse = await fetch(`${openrouterBase}/models`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'http://localhost:3690',
                'X-Title': 'CoffeeCup AI Assistant Test'
            }
        });
        
        if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            console.log('✅ OpenRouter Models API: SUCCESS');
            console.log('   Available models:', modelsData.data?.length || 0);
            
            // Show first 5 models as examples
            if (modelsData.data && modelsData.data.length > 0) {
                console.log('   Sample models:');
                modelsData.data.slice(0, 5).forEach(model => {
                    console.log(`     - ${model.id}: ${model.name}`);
                });
            }
        } else {
            const errorText = await modelsResponse.text().catch(() => 'Unknown error');
            console.log('❌ OpenRouter Models API: FAILED');
            console.log('   Status:', modelsResponse.status);
            console.log('   Error:', errorText);
        }
        
        console.log('');
        
        // Test chat completions endpoint with a simple request
        console.log('Testing chat completions...');
        const chatResponse = await fetch(`${openrouterBase}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'http://localhost:3690',
                'X-Title': 'CoffeeCup AI Assistant Test'
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-20b:free',
                messages: [
                    { role: 'user', content: 'Say hello in one word' }
                ],
                max_tokens: 100,
                temperature: 0.7
            })
        });
        
        if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            console.log('✅ OpenRouter Chat API: SUCCESS');
            console.log('   Response:', chatData.choices?.[0]?.message?.content || 'No content');
        } else {
            const errorText = await chatResponse.text().catch(() => 'Unknown error');
            console.log('❌ OpenRouter Chat API: FAILED');
            console.log('   Status:', chatResponse.status);
            console.log('   Error:', errorText);
        }
        
        console.log('\n=== OpenRouter Test Complete ===');
        
    } catch (error) {
        console.log('❌ OpenRouter Test Error:', error.message);
    }
}

testOpenRouterDirect();
