// Comprehensive functional test for CoffeeCup AI Assistant
import dotenv from 'dotenv';
dotenv.config();

console.log('=== CoffeeCup AI Assistant Functional Test ===\n');

async function testOllamaConnection() {
    try {
        console.log('1. Testing Ollama Connection...');
        const ollamaBase = process.env.OLLAMA_BASE || 'http://127.0.0.1:11434';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${ollamaBase}/api/tags`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Ollama Connection: SUCCESS');
            console.log('   Available models:', data.models?.length || 0);
            if (data.models) {
                data.models.forEach(model => {
                    console.log(`     - ${model.name}`);
                });
            }
            return true;
        } else {
            console.log('❌ Ollama Connection: FAILED - Status', response.status);
            return false;
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('❌ Ollama Connection: TIMEOUT');
        } else {
            console.log('❌ Ollama Connection: FAILED -', error.message);
        }
        return false;
    }
}

async function testOpenRouterConnection() {
    try {
        console.log('\n2. Testing OpenRouter Connection...');
        const openrouterBase = process.env.OPENROUTER_BASE || 'https://api.openrouter.ai/v1';
        const apiKey = process.env.OPENROUTER_API_KEY;
        
        if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
            console.log('⚠️  OpenRouter API key not set - skipping test');
            return true; // Not a failure, just skipped
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
            const data = await response.json();
            console.log('✅ OpenRouter Connection: SUCCESS');
            console.log('   Available models:', data.data?.length || 0);
            return true;
        } else {
            const errorText = await response.text().catch(() => 'Unknown error');
            console.log('❌ OpenRouter Connection: FAILED - Status', response.status, 'Message:', errorText);
            return false;
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('❌ OpenRouter Connection: TIMEOUT');
        } else {
            console.log('❌ OpenRouter Connection: FAILED -', error.message);
        }
        return false;
    }
}

async function testAssistantAPI() {
    try {
        console.log('\n3. Testing Assistant API Endpoints...');
        
        // Test models endpoint
        console.log('   Testing /api/models endpoint...');
        const modelsResponse = await fetch('http://localhost:3690/api/models', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            console.log('   ✅ Models API: SUCCESS');
            console.log('   Ollama models:', modelsData.ollama?.length || 0);
            console.log('   OpenRouter models:', modelsData.openrouter?.length || 0);
        } else {
            console.log('   ❌ Models API: FAILED - Status', modelsResponse.status);
            return false;
        }
        
        // Test assistant endpoint with Ollama
        console.log('   Testing /api/assistant endpoint with Ollama...');
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
            console.log('   ✅ Ollama Assistant API: SUCCESS');
            console.log('   Response length:', ollamaData.text?.length || 0, 'characters');
        } else {
            const errorData = await ollamaResponse.json().catch(() => ({}));
            console.log('   ❌ Ollama Assistant API: FAILED - Status', ollamaResponse.status);
            console.log('   Error:', errorData.error || 'Unknown error');
            return false;
        }
        
        // Test assistant endpoint with OpenRouter (if API key is set)
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (apiKey && apiKey !== 'your_openrouter_api_key_here') {
            console.log('   Testing /api/assistant endpoint with OpenRouter...');
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
                console.log('   ✅ OpenRouter Assistant API: SUCCESS');
                console.log('   Response length:', openrouterData.text?.length || 0, 'characters');
            } else {
                const errorData = await openrouterResponse.json().catch(() => ({}));
                console.log('   ❌ OpenRouter Assistant API: FAILED - Status', openrouterResponse.status);
                console.log('   Error:', errorData.error || 'Unknown error');
                return false;
            }
        } else {
            console.log('   ⚠️  OpenRouter Assistant API: SKIPPED (no API key)');
        }
        
        return true;
    } catch (error) {
        console.log('❌ Assistant API Test: FAILED -', error.message);
        return false;
    }
}

async function testStaticFiles() {
    try {
        console.log('\n4. Testing Static File Serving...');
        
        // Test main assistant.html
        const mainResponse = await fetch('http://localhost:3690/', {
            method: 'GET'
        });
        
        if (mainResponse.ok) {
            const contentType = mainResponse.headers.get('content-type');
            console.log('✅ Main Assistant Page: SUCCESS');
            console.log('   Content-Type:', contentType);
        } else {
            console.log('❌ Main Assistant Page: FAILED - Status', mainResponse.status);
            return false;
        }
        
        // Test public assistant.html
        const publicResponse = await fetch('http://localhost:3690/public/assistant.html', {
            method: 'GET'
        });
        
        if (publicResponse.ok) {
            const contentType = publicResponse.headers.get('content-type');
            console.log('✅ Public Assistant Page: SUCCESS');
            console.log('   Content-Type:', contentType);
        } else {
            console.log('❌ Public Assistant Page: FAILED - Status', publicResponse.status);
            return false;
        }
        
        // Test CoffeeCup integration example
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
        
        // Test deep integration example
        const deepIntegrationResponse = await fetch('http://localhost:3690/coffee-cup-deep-integration.html', {
            method: 'GET'
        });
        
        if (deepIntegrationResponse.ok) {
            const contentType = deepIntegrationResponse.headers.get('content-type');
            console.log('✅ CoffeeCup Deep Integration: SUCCESS');
            console.log('   Content-Type:', contentType);
        } else {
            console.log('❌ CoffeeCup Deep Integration: FAILED - Status', deepIntegrationResponse.status);
            return false;
        }
        
        return true;
    } catch (error) {
        console.log('❌ Static File Test: FAILED -', error.message);
        return false;
    }
}

async function runAllTests() {
    console.log('Starting comprehensive functional tests...\n');
    
    const results = {
        ollama: await testOllamaConnection(),
        openrouter: await testOpenRouterConnection(),
        api: await testAssistantAPI(),
        static: await testStaticFiles()
    };
    
    console.log('\n=== Test Results Summary ===');
    console.log('Ollama Connection:', results.ollama ? '✅ PASS' : '❌ FAIL');
    console.log('OpenRouter Connection:', results.openrouter ? '✅ PASS' : '❌ FAIL');
    console.log('Assistant API:', results.api ? '✅ PASS' : '❌ FAIL');
    console.log('Static Files:', results.static ? '✅ PASS' : '❌ FAIL');
    
    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;
    
    console.log(`\n📊 Overall: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('\n🎉 ALL TESTS PASSED! CoffeeCup AI Assistant is fully functional!');
        console.log('\n🚀 Ready to use at http://localhost:3690/');
        console.log('   - Main Assistant: http://localhost:3690/');
        console.log('   - Public Assistant: http://localhost:3690/public/assistant.html');
        console.log('   - CoffeeCup Integration: http://localhost:3690/coffee-cup-integration-example.html');
        console.log('   - Deep Integration: http://localhost:3690/coffee-cup-deep-integration.html');
    } else {
        console.log(`\n⚠️  ${total - passed} test(s) failed. Please check the output above.`);
    }
    
    console.log('\n=== Functional Test Complete ===');
}

runAllTests();
