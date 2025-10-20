// Simple test to verify the API is working
async function testApi() {
    try {
        console.log('Testing CoffeeCup AI Assistant API...');
        
        const response = await fetch('http://localhost:3690/api/assistant', {
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

        console.log('Response Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Test Successful!');
            console.log('Response:', data.text.substring(0, 200) + '...');
        } else {
            const errorData = await response.json().catch(() => ({}));
            console.log('❌ API Test Failed');
            console.log('Status:', response.status);
            console.log('Error:', errorData.error || 'Unknown error');
        }
    } catch (error) {
        console.log('❌ API Test Error:', error.message);
    }
}

testApi();
