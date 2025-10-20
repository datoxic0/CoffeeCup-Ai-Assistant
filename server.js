// server.js
import express from 'express';
import { createServer } from 'http';
import { promises as fs, existsSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';
import WebSocket from 'ws';

dotenv.config();
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors());

// Serve static files from 'public' directory
app.use(express.static('.'));

// Add a root route to serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});

const PORT = process.env.PORT || 3690;
const SAFE_BASE = path.resolve(process.cwd()); // project root safe base

// ────────────────────────────────────────
// 1️⃣  Correct default OLLAMA_BASE (127.0.0.1, not 127.0.1)
// ────────────────────────────────────────────────────────────────────────
const OLLAMA_BASE = process.env.OLLAMA_BASE || 'http://127.0.0.1:11434';
const OPENROUTER_BASE = process.env.OPENROUTER_BASE || 'https://openrouter.ai/api/v1';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const WEBSIM_API_BASE = 'https://api.websim.dev/v1'; // use .dev domain like in documentation
const WEBSIM_API_KEY = process.env.WEBSIM_API_KEY || '';
const WEBSIM_BRIDGE_PORT = process.env.WEBSIM_BRIDGE_PORT || 3001; // Websim bridge WebSocket port

const server = createServer(app);

function safeResolve(rel) {
  const target = path.resolve(SAFE_BASE, rel || '');
  if (!target.startsWith(SAFE_BASE)) throw new Error('Access denied: invalid path');
  return target;
}

/* ------ Status and File Endpoints ------ */
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/api/status', async (req, res) => {
    const status = {};
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20);
        const ollamaRes = await fetch(OLLAMA_BASE, { signal: controller.signal });
        clearTimeout(timeoutId);
        status.ollama = ollamaRes.ok ? 'ok' : 'error';
    } catch (e) {
        status.ollama = 'error';
    }

    try {
        const key = OPENROUTER_KEY || (req.headers['x-openrouter-key']);
        if (!key) {
            status.openrouter = 'misconfigured';
        } else {
             const controller = new AbortController();
             const timeoutId = setTimeout(() => controller.abort(), 5000); // Increased timeout to 5 seconds
             const openrouterRes = await fetch(`${OPENROUTER_BASE}/models`, {
                headers: { 'Authorization': `Bearer ${key}` },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            status.openrouter = openrouterRes.ok ? 'ok' : 'error';
        }
    } catch (e) {
        status.openrouter = 'error';
    }
    
    // Websim status - check if the WebSocket bridge is accessible
    try {
        const ws = new WebSocket(`ws://localhost:${WEBSIM_BRIDGE_PORT}`);
        await new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                ws.close();
                reject(new Error('timeout'));
            }, 1000);
            
            ws.on('open', () => {
                clearTimeout(timer);
                ws.close();
                resolve();
            });
            
            ws.on('error', (err) => {
                clearTimeout(timer);
                reject(err);
            });
        });
        status.websim = 'ok';
    } catch (e) {
        status.websim = 'error'; // Bridge not accessible
    }
    
    res.json(status);
});

async function getProjectFiles(dir = '.') {
    const items = [];
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.name === 'node_modules' || file.name.startsWith('.')) continue;

        if (file.isDirectory()) {
             items.push(...await getProjectFiles(fullPath)); 
        } else {
            items.push(fullPath.replace(/\\/g, '/'));
        }
    }
    return items;
}

app.post('/api/files', async (req, res) => {
    try {
        const files = await getProjectFiles();
        res.json({ items: files });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

/* ------ Model List Endpoint ------ */
app.post('/api/models', async (req, res) => {
    const { backend } = req.body;
    let models = [];
    try {
        if (backend === 'ollama') {
            const response = await fetch(`${OLLAMA_BASE}/api/tags`);
            const data = await response.json();
            models = (data.models || []).map(m => m.name);
        } else if (backend === 'openrouter') {
            const defaults = ["mistralai/mistral-7b-instruct", "google/gemini-pro", "openai/gpt-3.5-turbo"];
            const fromEnv = (process.env.OPENROUTER_MODELS || '').split(',').map(s => s.trim()).filter(Boolean);
            models = [...new Set([...defaults, ...fromEnv])];
        }
        res.json({ items: models });
    } catch (error) {
        res.json({ items: [] });
    }
});

/* ------ Ollama caller ------ */
async function callOllama(model, prompt) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 30s

    const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model, 
        prompt, 
        stream: false,
        options: { num_predict: 2048, temperature: 0.2 }
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Ollama error ${res.status}: ${txt}`);
    }
    const j = await res.json();
    return j?.response || JSON.stringify(j);
 } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Ollama request timed out. The model took too long to respond.');
    }
    throw new Error(`Ollama connection failed: ${error.message}. Make sure Ollama is installed and running at ${OLLAMA_BASE}`);
  }
}

/* ------ OpenRouter caller ------ */
async function callOpenRouter(model, messages, apiKey) {
 const key = apiKey || OPENROUTER_KEY;
  if (!key || key === 'your_openrouter_api_key_here') {
    throw new Error('OpenRouter API key not set. Please configure OPENROUTER_API_KEY in your .env file or provide it in the request.');
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);

    const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': 'http://localhost:3690',
        'X-Title': 'CoffeeCup AI Assistant'
      },
      body: JSON.stringify({ 
        model: model || process.env.OPENROUTER_MODEL || 'mistralai/mistral-7b-instruct',
        messages, 
        max_tokens: 2048, 
        temperature: 0.2 
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`OpenRouter error ${res.status}: ${txt}`);
    }
    const j = await res.json();
    return j?.choices?.[0]?.message?.content ?? JSON.stringify(j);
 } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('OpenRouter request timed out. The model took too long to respond.');
    }
    throw new Error(`OpenRouter connection failed: ${error.message}.`);
 }
}

/* ------ Websim caller ------ */
async function callWebsim(messages, apiKey) {
    const key = apiKey || WEBSIM_API_KEY;
    if (!key) {
        throw new Error('Websim API key not set. Please provide it in the settings.');
    }

    try {
        // Create a WebSocket connection to the Websim bridge
        const ws = new WebSocket(`ws://localhost:${WEBSIM_BRIDGE_PORT}`);
        
        // Set a timeout for the request
        const timeout = setTimeout(() => {
            ws.close();
            throw new Error('Websim bridge request timed out');
        }, 30000); // 30 second timeout

        // Generate a unique request ID
        const requestId = Date.now() + Math.random();
        
        // Set up error handling
        ws.on('error', (error) => {
            clearTimeout(timeout);
            throw new Error(`Websim bridge connection error: ${error.message}`);
        });

        ws.on('open', () => {
            // Send the request to the Websim bridge
            const requestData = {
                type: 'websim_request',
                requestId,
                messages,
                model: 'websim/pro', // Use Websim pro model
                apiKey: key, // Pass the API key to the bridge
                max_tokens: 2048,
                temperature: 0.2
            };
            ws.send(JSON.stringify(requestData));
        });

        // Wait for response from the bridge
        return new Promise((resolve, reject) => {
            ws.on('message', (data) => {
                try {
                    const response = JSON.parse(data);
                    
                    // Check if this is a response to our request
                    if (response.requestId === requestId) {
                        clearTimeout(timeout);
                        
                        if (response.type === 'response') {
                            ws.close();
                            resolve(response.payload?.text || response.payload || 'No response from Websim');
                        } else if (response.type === 'error') {
                            ws.close();
                            reject(new Error(`Websim bridge error: ${response.error}`));
                        } else {
                            // Unexpected response type
                            ws.close();
                            reject(new Error(`Unexpected response from Websim bridge: ${JSON.stringify(response)}`));
                        }
                    }
                } catch (error) {
                    clearTimeout(timeout);
                    ws.close();
                    reject(new Error(`Invalid response from Websim bridge: ${error.message}`));
                }
            });
        });

    } catch (error) {
        if (error.name === 'AbortError') throw new Error('Websim bridge request timed out.');
        throw new Error(`Websim connection failed: ${error.message}`);
    }
}

/* ------ Main endpoint ------ */
app.post('/api/assistant', async (req, res) => {
  try {
    const { backend = 'ollama', model, action = 'send', prompt = '', filePath = '', keys = {} } = req.body;
    if (!prompt && action !== 'apply') return res.status(400).json({ error: 'Missing prompt' });

    const systemPrefix = 'You are an expert web developer. Provide accurate code fixes, diffs, and concise explanations.';
    let messages;

    if (action === 'explain') {
        const user = `Explain this code line by line, call out bugs, security issues, performance concerns, and suggest minimal fixes:\n\n${prompt}`;
        messages = [{ role: 'system', content: systemPrefix }, { role: 'user', content: user }];
    } else if (action === 'suggest') {
        const user = `Produce a corrected implementation or improved snippet, then list concrete changes and reasons. Keep answer focused and include code blocks:\n\n${prompt}`;
        messages = [{ role: 'system', content: systemPrefix }, { role: 'user', content: user }];
    } else if (action === 'apply') {
        if (!filePath) return res.status(400).json({ error: 'Missing file path to apply changes.' });
        const target = safeResolve(filePath);
        const fileContext = await fs.readFile(target, 'utf8');
        const user = `You will update the following file. The user's request is: "${prompt}".\n\nExisting file contents:\n\n${fileContext}\n\nReturn the full new file contents only, wrapped between <<<START>>> and <<<END>>> markers. After the <<<END>>> marker, provide a short summary of the changes you made.`;
        messages = [{ role: 'system', content: systemPrefix }, { role: 'user', content: user }];
    } else {
        messages = [{ role: 'system', content: systemPrefix }, { role: 'user', content: prompt }];
    }

    let text;
    if (backend === 'ollama') {
      const merged = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
      text = await callOllama(model || process.env.OLLAMA_MODEL || 'gemma:2b', merged);
    } else if (backend === 'openrouter') {
      text = await callOpenRouter(model || process.env.OPENROUTER_MODEL, messages, keys.openrouter);
    } else if (backend === 'websim') {
      text = await callWebsim(messages, keys.websim);
    } else {
      throw new Error(`Unsupported backend: ${backend}`);
    }

    if (action === 'apply') {
        const startMarker = '<<<START>>>';
        const endMarker = '<<<END>>>';
        const startIndex = text.indexOf(startMarker);
        const endIndex = text.indexOf(endMarker, startIndex);

        if (startIndex === -1 || endIndex === -1) {
            return res.status(500).json({ error: "Model did not return valid START/END markers for file update.", raw: text });
        }

        const newContent = text.substring(startIndex + startMarker.length, endIndex).trim();
        const summary = text.substring(endIndex + endMarker.length).trim();
        
        const target = safeResolve(filePath);
        const backupPath = `${target}.bak-${Date.now()}`;
        
        if (existsSync(target)) {
            await fs.copyFile(target, backupPath);
        }
        
        await fs.writeFile(target, newContent, 'utf8');
        return res.json({ text: `File updated: ${filePath}.\nBackup created: ${path.basename(backupPath)}.\n\nSummary:\n${summary}` });
    }

    return res.json({ text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

server.listen(PORT, () => console.log(`Assistant proxy running on http://localhost:${PORT}`));
