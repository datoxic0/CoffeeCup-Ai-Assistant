// Simple OpenRouter test script
import dotenv from 'dotenv';
dotenv.config();

async function testOpenRouter() {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        const baseUrl = process.env.OPENROUTER_BASE || 'https://openrouter.ai/api/v1';
        
        console.log('Testing OpenRouter connection...');
        console.log('API Key:', apiKey ? 'SET' : 'NOT SET');
        console.log('Base URL:', baseUrl);
        
        if (!apiKey) {
            console.log('❌ No API key found');
            return;
        }
        
        const response = await fetch(`${baseUrl}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'http://localhost:3690',
                'X-Title': 'CoffeeCup AI Assistant Test',
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ OpenRouter connection successful!');
            console.log('Available models:', data.data?.length || 0);
        } else {
            const errorText = await response.text();
            console.log('❌ OpenRouter connection failed');
            console.log('Status:', response.status);
            console.log('Error:', errorText);
        }
    } catch (error) {
        console.log('❌ OpenRouter connection error:', error.message);
        console.log('Error name:', error.name);
        if (error.cause) {
            console.log('Cause:', error.cause);
        }
    }
}

testOpenRouter();
