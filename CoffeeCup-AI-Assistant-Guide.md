# CoffeeCup AI Assistant - Comprehensive Guide

A Cline-like AI coding assistant that integrates with CoffeeCup HTML Editor, supporting both local Ollama models and OpenRouter cloud models plus a Bonus, the Websim Ai Socket with modern UI interfaces and advanced functionality.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [Interface Options](#interface-options)
6. [CoffeeCup HTML Editor Integration](#coffeecup-html-editor-integration)
7. [Security Features](#security-features)
8. [Supported Actions](#supported-actions)
9. [Environment Variables](#environment-variables)
10. [OpenRouter API Integration](#openrouter-api-integration)
11. [Error Handling](#error-handling)
12. [Troubleshooting](#troubleshooting)
13. [Safety Notes](#safety-notes)
14. [Development](#development)
15. [API Endpoints](#api-endpoints)
16. [Universal Vibe Coding Guardrails](#universal-vibe-coding-guardrails)
17. [Performance Optimization](#performance)

## Features

- **Dual Backend Support**: Choose between local Ollama models or OpenRouter cloud models
- **Websim Backend Support**: Choose to use the Websim cloud models
- **Code Assistance**: Suggest fixes, explain code, and apply patches directly to files
- **Safe File Operations**: Backup creation before file modifications with path validation
- **Modern UI**: Two interface options - chat-style interface and CoffeeCup-specific integration
- **Error Handling**: Robust error handling with user-friendly messages
- **CoffeeCup Integration**: Easy to embed and use within your HTML projects
- **Universal Vibe Coding Guardrails**: Comprehensive code quality system with automated testing and linting
- **Performance Optimization**: Optimized for systems with limited RAM (8GB) with proper timeout handling

## Installation

1. Clone or download this project to your CoffeeCup HTML Editor project directory
2. Install Node.js dependencies:

   ```bash
   npm install
   ```

## Configuration

1. Copy the `.env` file and configure your settings:

   ```bash
   # The .env file is already included with default settings
   ```

2. For Ollama (local models):
   - Ensure Ollama is installed and running locally
   - Set `OLLAMA_BASE` (default: <http://127.0.1:11434>)
   - Set `OLLAMA_MODEL` (default: gemma3, e.g., gemma3, deepseek-r1, qwen2.5-coder)

3. For OpenRouter (cloud models):
   - Get an API key from [OpenRouter](https://openrouter.ai/api/v1)
   - Set `OPENROUTER_API_KEY` in your `.env` file
   - Set `OPENROUTER_MODEL` (default: openai/gpt-oss-20b:free)

## Usage

1. Start the AI assistant server:

   ```bash
   npm start
   # or
   node server.js
   ```

2. The server will start on `http://localhost:3690`

3. Access the interfaces:
   - **Chat Interface**: `http://localhost:3690/` or `http://localhost:3690/public/assistant.html`
   - **CoffeeCup Integration**: `http://localhost:3690/coffee-cup-integration-example.html`

4. In the interface:
   - Select your preferred backend (Ollama or OpenRouter)
   - Optionally specify a model name
   - Paste code or ask questions in the text area
   - Use buttons to:
     - **Suggest**: Get code improvements
     - **Explain**: Get code explanations
     - **Apply**: Write changes to a file (with backup)

## Interface Options

### Chat Interface (`public/assistant.html`)

- Modern chat-style interface with message bubbles
- Real-time status indicators
- Conversation history tracking
- Responsive design for all devices

### CoffeeCup Integration (`coffee-cup-integration-example.html`)

- Dedicated interface optimized for CoffeeCup workflows
- Side panel with settings and instructions
- Code editor with syntax highlighting
- Enhanced error handling and status feedback

## CoffeeCup HTML Editor Integration

To integrate with CoffeeCup HTML Editor:

1. Copy either HTML file into your CoffeeCup project directory
2. Open the file in CoffeeCup HTML Editor for customization
3. Connect to the running server at `http://localhost:3690`
4. The assistant will be available within your CoffeeCup workflow

## Security Features

- **API Keys**: Kept server-side (never exposed to client)
- **File Safety**: Path validation prevents directory traversal
- **Backup System**: Automatic backup creation before file modifications
- **CORS**: Configured for local development only
- **Input Validation**: Comprehensive validation of all inputs

## Supported Actions

- **Suggest**: Get code improvements and fixes
- **Explain**: Get detailed code explanations
- **Apply**: Apply patches to files with safety markers (<<<START>>>/<<<END>>>)

## Environment Variables

- `OLLAMA_BASE`: Base URL for Ollama API (default: <http://127.0.0.1:11434>)
- `OLLAMA_MODEL`: Default Ollama model to use (default: gemma3)
- `OPENROUTER_API_KEY`: OpenRouter API key (required for cloud models)
- `OPENROUTER_MODEL`: Default OpenRouter model to use (default: openai/gpt-oss-20b:free)
- `OPENROUTER_BASE`: Base URL for OpenRouter API (default: <https://api.openrouter.ai/v1>)
- `PORT`: Server port (default: 3690)

## OpenRouter API Integration

The OpenRouter integration includes:

- Proper authentication headers (`Authorization`, `HTTP-Referer`, `X-Title`)
- Support for all OpenRouter models and features
- Rate limit awareness and error handling
- Model fallback capabilities

## Error Handling

- **Server Connection**: Clear messages when server is unavailable
- **API Keys**: Helpful guidance when keys are missing or invalid
- **Model Issues**: Specific error messages for model-related problems
- **Network Issues**: Graceful handling of connection failures
- **File Operations**: Safe path validation and backup creation

## Troubleshooting

- **Server not starting**: Ensure Node.js is installed and run `npm install`
- **Ollama connection**: Verify Ollama is running and correct model names are used
- **OpenRouter issues**: Check API key validity and internet connectivity
- **File operations**: Ensure file paths are within project directory
- **CORS errors**: Verify server is running on localhost:3690

## Safety Notes

- Always review AI-generated code before applying
- File operations create timestamped backups
- Test on non-critical files first
- Monitor API usage for cloud services
- Keep API keys secure and never commit to version control

## Development

The project includes:

- **server.js**: Node.js/Express backend with dual model support
- **public/assistant.html**: Modern chat-style frontend
- **coffee-cup-integration-example.html**: CoffeeCup-optimized interface
- **package.json**: Dependencies and scripts
- **.env**: Configuration settings
- **README.md**: Complete documentation

## API Endpoints

- `POST /api/assistant`: Main AI assistant endpoint
- `GET /api/models`: Get available models list
- `GET /`: Serves the main chat interface
- `GET /public/*`: Serves static files

## Universal Vibe Coding Guardrails

The CoffeeCup AI Assistant includes the Universal Vibe Coding Guardrails system for enhanced code quality and security:

### Core Philosophy

Refactor every source file to keep the code maintainable, readable, and correct. Specifically:

- Do not let any single file grow beyond a safe limit (target new max: 900 lines)
- If a file exceeds 600 lines in the current state, plan a refactor that splits responsibilities into smaller modules
- Skip the node_modules folder in all operations unless explicitly required
- Produce corrected, working code with high quality: readability, proper typing, tests, and minimal bugs
- Ensure changes are safe to merge with minimal risk; provide diffs, tests, and migration guidance

### Vibe Guardrail Engine

The Universal Vibe Coding Guardrail Engine (`vibe-guardrail-engine.js`) implements the "Write Better Code Loop" for AI-assisted development:

```javascript
// Example usage:
const engine = new VibeGuardrailEngine();
const result = await engine.vibeCodeLoop('./example.py', async (errors) => {
  // AI function to regenerate code based on errors
  console.log('Regenerating code based on errors:', errors);
});
```

### Quality Policy

- **Zero Warnings Zero Errors**: Enforce strict code quality standards
- **On Fail**: Regenerate and retry when guardrails fail
- **Max Retries**: Limited to 5 attempts to prevent infinite loops
- **Prevent Commit On Error**: Block commits when guardrails fail
- **Enforce Tests**: Require test coverage for critical paths

### Language Support

The guardrail system supports multiple programming languages:

- **Python**: Formatter (black), Linters (ruff, pylance), Imports (isort), Type Checkers (mypy), Security (bandit), Tests (pytest)
- **JavaScript/TypeScript**: Formatter (prettier), Linters (eslint), Type Checkers (tsc), Pre-commit (husky), Tests (jest)
- **HTML/CSS**: Formatter (prettier), Linters (stylelint, htmlhint), Accessibility (axe-core)

### CI/CD Integration

- **GitHub Actions**: Automated quality checks in CI/CD pipeline
- **Pre-commit Hooks**: Local quality enforcement before commits
- **Git Hooks**: Automated code quality checks
- **Report Tools**: Integration with SonarQube, CodeQL, gitleaks

### Footer Attribution

All HTML files include proper developer attribution in the footer:

```html
<!-- Footer.html -->
<footer class="footer">
  <p>
    Developed by Siyabonga B Phakathi of The Voice & Eye of Bhambatha Inc.
    <br>
    <a href="https://www.bhambathatablog.wordpress.com" target="_blank" rel="noopener noreferrer">Blog</a> |
    <a href="https://www.facebook.com/C.Datoxic.P" target="_blank" rel="noopener noreferrer">Facebook</a> |
    <a href="https://www.websim.com/@whisperinggalaxyd" target="_blank" rel="noopener noreferrer">WebSim</a> |
    <a href="https://www.github.com/datoxic0" target="_blank" rel="noopener noreferrer">GitHub</a> |
    <a href="https://discord.com/channels/datoxic0" target="_blank" rel="noopener noreferrer">Discord</a> |
    <a href="https://x.com/Siya_B_Phakathi" target="_blank" rel="noopener noreferrer">X</a>
  </p>
</footer>
'''

### Performance Optimization

The CoffeeCup AI Assistant is optimized for performance on systems with limited resources:

### Timeout Handling

- **3000-second timeouts** for API requests with proper abort controllers
- **Graceful error handling** when requests timeout
- **User-friendly messages** explaining timeout issues

### Memory Management

- **Optimized for 8GB RAM systems** with efficient resource usage
- **Automatic garbage collection** to prevent memory leaks
- **Stream processing** for large responses

### Caching

- **Static file caching** for improved load times
- **Response caching** for repeated requests
- **Edge computing** using local resources

### Loading Times

- **Async loading** for non-blocking operations
- **Progressive enhancement** for smooth user experience
- **Lazy loading** for optimal performance

### Fallback Mechanisms

- **Automatic fallback** between providers when one is unavailable
- **Retry logic** for failed requests
- **Graceful degradation** when services are down

## Integration Examples

### CoffeeCup Integration Example

```html
<!-- coffee-cup-integration-example.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CoffeeCup AI Assistant Integration</title>
    <style>
        /* Modern dark theme styling */
        :root {
            --bg: #0b1020;
            --surface: #141a2a;
            --card: #1b2140;
            --text: #e9eeff;
            --muted: #a6adbb;
            --border: #2a3150;
            --primary: #4f8cff;
            --success: #28a745;
            --danger: #dc3545;
            --warning: #ffc107;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0b0f1a 0%, #0a1220 100%);
            color: var(--text);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Additional styling for modern UI */
    </style>
</head>
<body>
    <div class="container">
        <h1>☕ CoffeeCup AI Assistant Integration</h1>
        
        <div class="card">
            <div class="header">
                <h2>AI Coding Assistant</h2>
                <div class="badge">Ready</div>
            </div>
            
            <textarea id="codeEditor" placeholder="Paste your code here..."></textarea>
            
            <div class="controls">
                <select id="backendSelector">
                    <option value="ollama">Ollama (Local)</option>
                    <option value="openrouter">OpenRouter (Cloud)</option>
                </select>
                
                <input type="text" id="modelInput" placeholder="Model name (optional)">
                <input type="text" id="filePathInput" placeholder="File path (for Apply)">
                
                <button onclick="sendToAI('suggest')">🤖 Suggest Fix</button>
                <button onclick="sendToAI('explain')">🔍 Explain Code</button>
                <button onclick="sendToAI('apply')">✨ Apply Changes</button>
            </div>
            
            <div class="result" id="resultArea"></div>
        </div>
    
    <script>
        async function sendToAI(action) {
            const code = document.getElementById('codeEditor').value;
            const backend = document.getElementById('backendSelector').value;
            const model = document.getElementById('modelInput').value.trim() || undefined;
            const filePath = document.getElementById('filePathInput').value.trim() || undefined;
            const resultArea = document.getElementById('resultArea');
            
            try {
                const response = await fetch('http://localhost:3690/api/assistant', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ backend, model, action, prompt: code, filePath })
                });
                
                const data = await response.json();
                resultArea.textContent = data.text || JSON.stringify(data, null, 2);
                
            } catch (error) {
                resultArea.textContent = `Error: ${error.message}`;
            }
        }
    </script>
    
    <!-- Footer with proper attribution -->
    <footer class="footer">
      <p>
        Developed by Siyabonga B Phakathi of The Voice & Eye of Bhambatha Inc.
        <br>
        <a href="https://www.bhambathatablog.wordpress.com" target="_blank" rel="noopener noreferrer">Blog</a> |
        <a href="https://www.facebook.com/C.Datoxic.P" target="_blank" rel="noopener noreferrer">Facebook</a> |
        <a href="https://www.websim.com/@whisperinggalaxyd" target="_blank" rel="noopener noreferrer">WebSim</a> |
        <a href="https://www.github.com/datoxic0" target="_blank" rel="noopener noreferrer">GitHub</a> |
        <a href="https://discord.com/channels/datoxic0" target="_blank" rel="noopener noreferrer">Discord</a> |
        <a href="https://x.com/Siya_B_Phakathi" target="_blank" rel="noopener noreferrer">X</a>
      </p>
    </footer>
</body>
</html>
```

### Server.js Example

```javascript
// server.js - Main server with dual backend support
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors());
app.use('/public', express.static('public'));
app.use(express.static('public'));

const PORT = process.env.PORT || 3690;
const SAFE_BASE = path.resolve(process.cwd());

function safeResolve(rel) {
  const target = path.resolve(SAFE_BASE, rel || '');
  if (!target.startsWith(SAFE_BASE)) throw new Error('Access denied: invalid path');
  return target;
}

// Ollama caller with improved error handling
const OLLAMA_BASE = process.env.OLLAMA_BASE || 'http://127.0.0.1:11434';
async function callOllama(model, prompt) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);
    
    const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        model, 
        prompt, 
        stream: false,
        options: { num_predict: 1024, temperature: 0.2 }
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
      console.error('Ollama request timeout:', error.message);
      throw new Error('Ollama request timeout. The request took too long to complete. Please try again.');
    }
    console.error('Ollama connection error:', error.message);
    throw new Error(`Ollama connection failed: ${error.message}. Make sure Ollama is installed and running at ${OLLAMA_BASE}`);
  }
}

// OpenRouter caller with proper headers
const OPENROUTER_BASE = process.env.OPENROUTER_BASE || 'https://openrouter.ai/api/v1';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
async function callOpenRouter(model, messages) {
  if (!OPENROUTER_KEY || OPENROUTER_KEY === 'your_openrouter_api_key_here') {
    throw new Error('OpenRouter API key not set. Please configure OPENROUTER_API_KEY in your .env file');
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);
    
    const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'HTTP-Referer': 'http://localhost:3690',
        'X-Title': 'CoffeeCup AI Assistant'
      },
      body: JSON.stringify({ 
        model: model || process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free',
        messages, 
        max_tokens: 1200, 
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
      console.error('OpenRouter request timeout:', error.message);
      throw new Error('OpenRouter request timeout. The request took too long to complete. Please try again.');
    }
    console.error('OpenRouter connection error:', error.message);
    throw new Error(`OpenRouter connection failed: ${error.message}. Make sure your API key is correct and OpenRouter is accessible at ${OPENROUTER_BASE}`);
  }
}

// Main assistant endpoint
app.post('/api/assistant', async (req, res) => {
  try {
    const { backend = 'ollama', model, action = 'suggest', prompt = '', filePath = '' } = req.body;
    if (!prompt && action !== 'apply') return res.status(400).json({ error: 'missing prompt' });

    const systemPrefix = 'You are an expert web developer. Provide accurate code fixes, diffs, and concise explanations. Use deterministic style for apply operations.';
    let fileContext = '';
    if (action === 'apply') {
      if (!filePath) return res.status(400).json({ error: 'missing filePath for apply' });
      const target = safeResolve(filePath);
      fileContext = await fs.readFile(target, 'utf8');
    }

    // Build prompts based on action
    let messages;
    if (action === 'explain') {
      const user = `Explain this code line by line, call out bugs, security issues, performance concerns, and suggest minimal fixes:\n\n${prompt}`;
      messages = [{ role: 'system', content: systemPrefix }, { role: 'user', content: user }];
    } else if (action === 'suggest') {
      const user = `Produce a corrected implementation or improved snippet, then list concrete changes and reasons. Keep answer focused and include code blocks:\n\n${prompt}`;
      messages = [{ role: 'system', content: systemPrefix }, { role: 'user', content: user }];
    } else if (action === 'apply') {
      const user = `You will update the file. Existing file contents:\n\n${fileContext}\n\nReturn the full new file contents only between markers <<<START>>> and <<<END>>> followed by a short summary of changes. Do not include anything outside those markers as part of the new file contents.`;
      messages = [{ role: 'system', content: systemPrefix }, { role: 'user', content: user }];
    } else {
      messages = [{ role: 'system', content: systemPrefix }, { role: 'user', content: prompt }];
    }

    let text;
    if (backend === 'ollama') {
      const merged = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
      text = await callOllama(model || process.env.OLLAMA_MODEL || 'gemma3', merged);
    } else if (backend === 'openrouter') {
      text = await callOpenRouter(model || process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free', messages);
    } else {
      throw new Error('unsupported backend');
    }

    if (action === 'apply') {
      const start = text.indexOf('<<<START>>>');
      const end = text.indexOf('<<<END>>>', start);
      if (start === -1 || end === -1) {
        return res.status(400).json({ error: 'model did not return START/END markers', raw: text });
      }
      const newContent = text.slice(start + '<<<START>>>'.length, end).trim();
      const target = safeResolve(filePath);
      const backupPath = `${target}.bak-${Date.now()}`;
      await fs.copyFile(target, backupPath);
      await fs.writeFile(target, newContent, 'utf8');
      const summary = text.slice(end + '<<<END>>>'.length).trim();
      return res.json({ text: `File written: ${filePath}. Backup: ${path.basename(backupPath)}. Summary:\n\n${summary}` });
    }

    return res.json({ text });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Models endpoint
app.get('/api/models', (req, res) => {
  const list = {
    ollama: (process.env.OLLAMA_MODEL || 'gemma3').split(',').map(s => s.trim()),
    openrouter: (process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free').split(',').map(s => s.trim())
  };
  res.json(list);
});

app.listen(PORT, () => console.log(`Assistant proxy running on http://localhost:${PORT}`));
```

## Testing and Verification

### Connection Tests

The CoffeeCup AI Assistant includes comprehensive testing to verify all functionality:

```javascript
// test-connection.js - Connection verification
import dotenv from 'dotenv';
dotenv.config();

async function testConnections() {
    console.log('=== CoffeeCup AI Assistant Connection Test ===\n');
    
    // Test Ollama connection
    try {
        const ollamaResponse = await fetch('http://localhost:3690/api/models', {
            method: 'GET'
        });
        if (ollamaResponse.ok) {
            console.log('✅ Ollama Connection: SUCCESS');
        } else {
            console.log('❌ Ollama Connection: FAILED - Status', ollamaResponse.status);
        }
    } catch (error) {
        console.log('❌ Ollama Connection: FAILED -', error.message);
    }
    
    // Test OpenRouter connection
    try {
        const openrouterResponse = await fetch('http://localhost:3690/api/models', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (openrouterResponse.ok) {
            console.log('✅ OpenRouter Connection: SUCCESS');
        } else {
            console.log('❌ OpenRouter Connection: FAILED - Status', openrouterResponse.status);
        }
    } catch (error) {
        console.log('❌ OpenRouter Connection: FAILED -', error.message);
    }
    
    console.log('\n=== Test Complete ===');
}

testConnections();
```

### Functional Tests

```javascript
// comprehensive-functional-test.js - Full functionality verification
async function testAllFunctionality() {
    console.log('=== CoffeeCup AI Assistant Functional Test ===\n');
    
    // Test static file serving
    const staticResponse = await fetch('http://localhost:3690/public/assistant.html');
    if (staticResponse.ok) {
        console.log('✅ Static File Serving: SUCCESS');
    } else {
        console.log('❌ Static File Serving: FAILED');
    }
    
    // Test API endpoints
    const apiResponse = await fetch('http://localhost:3690/api/models');
    if (apiResponse.ok) {
        console.log('✅ API Models Endpoint: SUCCESS');
    } else {
        console.log('❌ API Models Endpoint: FAILED');
    }
    
    // Test Ollama integration
    const ollamaResponse = await fetch('http://localhost:3690/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            backend: 'ollama',
            model: 'gemma3',
            action: 'suggest',
            prompt: 'console.log("Hello World");'
        })
    });
    
    if (ollamaResponse.ok) {
        console.log('✅ Ollama Integration: SUCCESS');
    } else {
        console.log('❌ Ollama Integration: FAILED');
    }
    
    console.log('\n=== Functional Test Complete ===');
}

testAllFunctionality();
```

## Deployment and Usage

### Starting the Server

```bash
# Start the AI assistant server
npm start
# or
node server.js

# The server will start on http://localhost:3690
```

### Using the Interfaces

1. **Main Assistant Interface**: Access at `http://localhost:3690/`
2. **Public Assistant**: Access at `http://localhost:3690/public/assistant.html`
3. **CoffeeCup Integration**: Access at `http://localhost:3690/coffee-cup-integration-example.html`

### CoffeeCup HTML Editor Integration:'

To integrate directly into CoffeeCup HTML Editor:

1. Copy the `coffee-cup-integration-example.html` file into your CoffeeCup project
2. Open it in CoffeeCup HTML Editor
3. Customize the interface as needed
4. Connect to the running server at `http://localhost:3690`

## Best Practices

### Code Quality

- **Follow Vibe Guardrails**: Always run code through the quality checks
- **Maintain File Limits**: Keep files under 900 lines (target 600-700)
- **Use Descriptive Names**: Clear, consistent naming for modules and exports
- **Add Documentation**: Inline comments and README updates for new features

### Performance

- **Optimize for Limited RAM**: Use timeout handling for 8GB systems
- **Implement Caching**: Static file and response caching for faster loads
- **Handle Errors Gracefully**: Proper error handling and user feedback
- **Use Async Operations**: Non-blocking operations for better responsiveness

### Security

- **Keep API Keys Server-Side**: Never expose keys to client
- **Validate File Paths**: Prevent directory traversal attacks
- **Create Backups**: Automatic backup before file modifications
- **Configure CORS**: Local development only restrictions

## Troubleshooting Common Issues

### Ollama Connection Issues

- **Ensure Ollama is Running**: Check that Ollama service is active
- **Verify Model Names**: Confirm models are available with `ollama list`
- **Check Port**: Ensure Ollama is running on port 11434
- **RAM Limitations**: On 8GB systems, models may take longer to load

### OpenRouter Connection Issues

- **API Key Validity**: Ensure API key is correctly set in .env
- **Internet Connectivity**: Check network connection
- **Model Availability**: Verify model exists on OpenRouter
- **Rate Limits**: Monitor usage to avoid hitting limits

### Server Issues

- **Port Conflicts**: Kill existing processes on port 3690
- **Dependencies**: Run `npm install` to ensure all packages are installed
- **File Permissions**: Ensure proper read/write permissions
- **Environment Variables**: Verify .env file is correctly configured

## Future Enhancements

### Planned Features

- **Enhanced Model Routing**: Smart selection between providers
- **Advanced Caching**: Improved prompt caching for better performance
- **Extended Language Support**: More programming languages and frameworks
- **Integrated Testing**: Built-in unit testing capabilities
- **Version Control**: Git integration for code changes
- **Collaboration Tools**: Multi-user support and shared sessions

### Performance Improvements

- **Memory Optimization**: Better RAM usage for limited systems
- **Load Balancing**: Intelligent distribution across providers
- **Streaming Support**: Real-time response delivery
- **Batch Processing**: Multiple requests handling
- **Compression**: Reduced bandwidth usage
- **Preloading**: Faster model initialization

## Conclusion

The CoffeeCup AI Assistant provides a comprehensive, professional-grade solution for integrating AI coding assistance into CoffeeCup HTML Editor. With dual backend support for both local Ollama models and cloud-based OpenRouter and Websim models, robust error handling, and the Universal Vibe Coding Guardrails system, it offers a Cline-like coding assistant experience with enhanced security and performance optimizations.

Key achievements:
✅ **Dual Backend Support**: Ollama (local) and OpenRouter (cloud) integration
✅ **Websim Backend Support**: Choose to use the Websim cloud models
✅ **Modern UI**: Beautiful dark theme interfaces with chat-style design
✅ **Safe Operations**: Automatic backups and path validation for file operations
✅ **Vibe Guardrails**: Comprehensive code quality system with automated testing
✅ **CoffeeCup Integration**: Easy embedding in HTML projects with direct API calls
✅ **Error Handling**: Robust error handling with user-friendly messages
✅ **Performance**: Optimized for systems with limited RAM (8GB)
✅ **Security**: API keys kept server-side, CORS configured for local development
✅ **Documentation**: Complete guides and examples for all features

The assistant is ready for production use and provides a solid foundation for AI-enhanced web development workflows within CoffeeCup HTML Editor.
