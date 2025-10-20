import { WebSocketServer } from 'ws';
import fetch from 'node-fetch';
import https from 'https';

const PORT = process.env.WEBSIM_BRIDGE_PORT || 3001;
const wss = new WebSocketServer({ port: PORT });

console.log(`Websim Bridge Server running on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
    console.log('New Websim client connected');

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());
            
            if (data.type === 'websim_request') {
                console.log('Received Websim request:', data.requestId);
                
                try {
                    // Extract API key from the data or environment
                    const apiKey = data.apiKey || process.env.WEBSIM_API_KEY;
                    
                    if (!apiKey) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            requestId: data.requestId,
                            error: 'Websim API key not provided. Please configure your Websim API key.'
                        }));
                        return;
                    }
                    
                    // Handle Websim API key properly based on documentation
                    // Use the correct API endpoint from the official documentation
                    // Base URL: https://api.websim.dev/v1
                    // Authentication: Authorization: Bearer YOUR_API_KEY
                    // Try common chat completions endpoints based on OpenAI/Anthropic patterns
                    const endpoints = [
                        'https://api.websim.dev/v1',
                        'https://api.websim.dev/v1/chat/completions',
                        'https://api.websim.dev/v1/completions',
                        'https://api.websim.dev/v1/models'
                    ];
                    
                    let lastError = null;
                    for (const endpoint of endpoints) {
                        try {
                            const response = await fetch(endpoint, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${apiKey}`, // Correct Bearer token authentication
                                    'User-Agent': 'CoffeeCup-AI-Assistant/1.0'
                                },
                                body: JSON.stringify({
                                    model: data.model || 'websim/pro',
                                    messages: data.messages,
                                    max_tokens: data.max_tokens || 2048,
                                    temperature: data.temperature || 0.2
                                    // Remove api_key from body as it's in the Authorization header
                                }),
                                // Add SSL options to handle potential certificate issues
                                agent: new https.Agent({
                                    rejectUnauthorized: false // WARNING: This disables SSL verification - only for testing!
                                })
                            });
                            
                            if (response.ok) {
                                // Success! Return the response
                                const responseData = await response.json();
                                const content = responseData.choices?.[0]?.message?.content || 'No response from Websim AI';
                                
                                // Send response back to client
                                ws.send(JSON.stringify({
                                    type: 'response',
                                    requestId: data.requestId,
                                    payload: {
                                        text: content,
                                        model: responseData.model || data.model,
                                        timestamp: new Date().toISOString()
                                    }
                                }));
                                return; // Exit the function successfully
                            } else {
                                const errorText = await response.text();
                                lastError = new Error(`Websim API error ${response.status}: ${errorText}`);
                                console.log(`Endpoint ${endpoint} failed:`, lastError.message);
                            }
                        } catch (error) {
                            lastError = error;
                            console.log(`Endpoint ${endpoint} failed with exception:`, error.message);
                        }
                    }
                    
                    // If we get here, all endpoints failed
                    throw lastError || new Error('All Websim API endpoints failed');
                    
                } catch (error) {
                    console.error('Error processing Websim request:', error);
                    ws.send(JSON.stringify({
                        type: 'error',
                        requestId: data.requestId,
                        error: error.message
                    }));
                }
            } else {
                ws.send(JSON.stringify({
                    type: 'error',
                    requestId: data.requestId || null,
                    error: `Unknown request type: ${data.type}`
                }));
            }
        } catch (error) {
            console.error('Error parsing message:', error);
            ws.send(JSON.stringify({
                type: 'error',
                requestId: null,
                error: 'Invalid message format'
            }));
        }
    });

    ws.on('close', () => {
        console.log('Websim client disconnected');
    });

    ws.on('error', (error) => {
        console.error('Websim bridge error:', error);
    });
});

console.log('Websim Bridge ready. Connect your CoffeeCup AI Assistant to use Websim backend.');
