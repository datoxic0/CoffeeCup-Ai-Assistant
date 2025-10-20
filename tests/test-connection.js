// Simple test script to verify connections
import dotenv from 'dotenv';
dotenv.config();

console.log('=== CoffeeCup AI Assistant Connection Test ===\n');

// Test environment variables
console.log('Environment Variables:');
console.log('- PORT:', process.env.PORT || 3690);
console.log('- OLLAMA_BASE:', process.env.OLLAMA_BASE || 'http://127.0.0.1:11434');
console.log('- OLLAMA_MODEL:', process.env.OLLAMA_MODEL || 'gemma3');
console.log('- OPENROUTER_BASE:', process.env.OPENROUTER_BASE || 'https://api.openrouter.ai/v1');
console.log('- OPENROUTER_MODEL:', process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free');
console.log('- OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'SET' : 'NOT SET');
console.log('');

// Test Ollama connection
async function testOllama() {
    try {
        const ollamaBase = process.env.OLLAMA_BASE || 'http://127.0.0.1:11434';
        console.log('Testing Ollama connection to:', ollamaBase);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${ollamaBase}/api/tags`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            console.log('✅ Ollama connection: SUCCESS');
            const data = await response.json();
            console.log('   Available models:', data.models?.length || 0);
            if (data.models) {
                data.models.forEach(model => {
                    console.log(`     - ${model.name} (${model.digest})`);
                });
            }
        } else {
            console.log('❌ Ollama connection: FAILED - Status', response.status);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('❌ Ollama connection: TIMEOUT - Request took too long');
        } else {
            console.log('❌ Ollama connection: FAILED -', error.message);
        }
    }
}

// Test OpenRouter connection
async function testOpenRouter() {
    try {
        const openrouterBase = process.env.OPENROUTER_BASE || 'https://openrouter.ai/api/v1';
        const apiKey = process.env.OPENROUTER_API_KEY;
        
        console.log('Testing OpenRouter connection to:', openrouterBase);
        
        if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
            console.log('⚠️  OpenRouter API key not set - skipping connection test');
            return;
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(`${openrouterBase}/models`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'http://localhost:3690',
                'X-Title': 'CoffeeCup AI Assistant Test'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            console.log('✅ OpenRouter connection: SUCCESS');
            const data = await response.json();
            console.log('   Available models:', data.data?.length || 0);
        } else {
            const errorText = await response.text();
            console.log('❌ OpenRouter connection: FAILED - Status', response.status, 'Message:', errorText);
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('❌ OpenRouter connection: TIMEOUT - Request took too long');
        } else {
            console.log('❌ OpenRouter connection: FAILED -', error.message);
        }
    }
}

// Run tests
async function runTests() {
    console.log('Starting connection tests...\n');
    await testOllama();
    console.log('');
    await testOpenRouter();
    console.log('\n=== Test Complete ===');
}

runTests();
