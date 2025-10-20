# CoffeeCup AI Assistant

A Cline-like AI coding assistant that integrates with CoffeeCup HTML Editor, supporting multiple AI backends (Ollama, OpenRouter, and Websim) with modern UI interfaces and comprehensive CoffeeCup-specific features.

## Features

- **Multi-Backend Support**: Choose between local Ollama models, OpenRouter cloud models, or Websim AI
- **Code Assistance**: Suggest fixes, explain code, and apply patches directly to files
- **Safe File Operations**: Backup creation before file modifications with path validation
- **Modern UI**: Four interface options with consistent design and CoffeeCup-specific features
- **Error Handling**: Robust error handling with user-friendly messages
- **CoffeeCup Integration**: Specialized features for CoffeeCup HTML Editor workflows
- **CoffeeCup Features**: Components Library integration, Live Preview hooks, S-Drive publishing
- **Tag Highlighting**: Support for quick find/open/close tags in CoffeeCup Editor

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
   - Set `OLLAMA_BASE` (default: <http://127.0.0.1:11434>)
   - Set `OLLAMA_MODEL` (default: gemma3, e.g., gemma3, deepseek-r1, qwen2.5-coder)

3. For OpenRouter (cloud models):
   - Get an API key from [OpenRouter](https://openrouter.ai)
   - Set `OPENROUTER_API_KEY` in your `.env` file
   - Set `OPENROUTER_MODEL` (default: openai/gpt-oss-20b:free, qwen/qwen3-coder:free)

4. For Websim (cloud models):
   - Get a Websim API key from [Websim](https://www.websim.com)
   - Set `WEBSIM_API_KEY` in your `.env` file

## Usage

1. Start the AI assistant server:

   ```bash
   npm start
   # or
   node server.js
   ```

2. The server will start on `http://localhost:3690`

3. Access the interfaces:
   - **Main Interface**: `http://localhost:3690/` - Full-featured chat interface with CoffeeCup features
   - **CoffeeCup Integration**: `http://localhost:3690/coffee-cup-integration-example.html` - Uniform integration interface
   - **Deep Integration Console**: `http://localhost:3690/coffee-cup-deep-integration.html` - Console-style interface with CoffeeCup features
   - **CoffeeCup HTML Editor Integration**: `http://localhost:3690/coffee-cup-html-editor-integration.html` - Specialized CoffeeCup Editor interface

4. In the interface:
   - Select your preferred backend (Ollama, OpenRouter, or Websim)
   - Optionally specify a model name
   - Paste code or ask questions in the text area
   - Use buttons to:
     - **Suggest**: Get code improvements
     - **Explain**: Get code explanations
     - **Apply**: Write changes to a file (with backup)
   - Use CoffeeCup-specific buttons for Components Library, Live Preview, and S-Drive publishing

## Interface Options

### Main Interface (`index.html`)

- Modern chat-style interface with message bubbles
- Real-time status indicators for all backends
- CoffeeCup-specific feature buttons (Components, Live Preview, Publish)
- Conversation history tracking
- Responsive design for all devices
- Terminal view mode available

### CoffeeCup Integration (`coffee-cup-integration-example.html`)

- Uniform interface design with main interface
- Dedicated CoffeeCup workflow optimization
- Side panel with settings and instructions
- CoffeeCup-specific feature buttons
- Enhanced error handling and status feedback

### Deep Integration Console (`coffee-cup-deep-integration.html`)

- Console-style interface with command-line functionality
- Same design consistency as main interface
- CoffeeCup-specific feature buttons
- Terminal view with command history

### CoffeeCup HTML Editor Integration (`coffee-cup-html-editor-integration.html`)

- Specialized interface for CoffeeCup HTML Editor workflows
- Components Library integration
- Live Preview functionality
- S-Drive publishing capabilities
- CoffeeCup HTML Editor best practices guidance

## CoffeeCup HTML Editor Integration

To integrate with CoffeeCup HTML Editor:

1. Copy any HTML file into your CoffeeCup project directory
2. Open the file in CoffeeCup HTML Editor for customization
3. Connect to the running server at `http://localhost:3690`
4. The assistant will be available within your CoffeeCup workflow with specialized features

## CoffeeCup-Specific Features

- **Components Library**: Special button and functionality to generate reusable HTML components
- **Live Preview**: Integration hooks for real-time preview functionality
- **S-Drive Publishing**: S-Drive publishing integration with FTP capabilities
- **Tag Highlighting**: Support for quick find/open/close tags in CoffeeCup Editor
- **Best Practices**: AI guidance following CoffeeCup HTML Editor standards

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
- **Components**: Generate reusable HTML components for CoffeeCup workflows

## Environment Variables

- `OLLAMA_BASE`: Base URL for Ollama API (default: <http://127.0.0.1:11434>)
- `OLLAMA_MODEL`: Default Ollama model to use (default: gemma3)
- `OPENROUTER_API_KEY`: OpenRouter API key (required for cloud models)
- `OPENROUTER_MODEL`: Default OpenRouter model to use (default: openai/gpt-oss-20b:free)
- `OPENROUTER_BASE`: Base URL for OpenRouter API (default: <https://openrouter.ai/api/v1>)
- `WEBSIM_API_KEY`: Websim API key (required for Websim models)
- `PORT`: Server port (default: 3690)

## OpenRouter API Integration

The OpenRouter integration includes:

- Proper authentication headers (`Authorization`, `HTTP-Referer`, `X-Title`)
- Support for all OpenRouter models and features
- Rate limit awareness and error handling
- Model fallback capabilities

## Websim AI Integration

The Websim integration includes:

- WebSocket communication for real-time interaction
- Proper API key handling for secure communication
- Model selection and configuration
- Error handling for connection issues

## Error Handling

- **Server Connection**: Clear messages when server is unavailable
- **API Keys**: Helpful guidance when keys are missing or invalid
- **Model Issues**: Specific error messages for model-related problems
- **Network Issues**: Graceful handling of connection failures
- **File Operations**: Safe path validation and backup creation
- **Websim Bridge**: Error handling for WebSocket connections

## Troubleshooting

- **Server not starting**: Ensure Node.js is installed and run `npm install`
- **Ollama connection**: Verify Ollama is running and correct model names are used
- **OpenRouter issues**: Check API key validity and internet connectivity
- **Websim connection**: Verify WebSocket bridge is accessible and API key is valid
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

- **server.js**: Node.js/Express backend with multi-model support
- **index.html**: Main interface with CoffeeCup features
- **coffee-cup-integration-example.html**: CoffeeCup-optimized interface
- **coffee-cup-deep-integration.html**: Console-style interface with CoffeeCup features
- **coffee-cup-html-editor-integration.html**: Specialized CoffeeCup Editor interface
- **script.js**: Frontend JavaScript with CoffeeCup feature integration
- **package.json**: Dependencies and scripts
- **.env**: Configuration settings
- **README.md**: Complete documentation

## API Endpoints

- `POST /api/assistant`: Main AI assistant endpoint
- `POST /api/models`: Get available models list
- `POST /api/files`: Get project files list
- `GET /api/health`: Health check endpoint
- `GET /api/status`: Status check for all backends
- `GET /`: Serves the main chat interface
- `GET /*`: Serves static files

## CoffeeCup Integration

This assistant is specifically designed to work with CoffeeCup Software's HTML Editor, featuring:

- Components Library integration for reusable elements
- Live Preview functionality hooks
- S-Drive publishing capabilities
- Tag Highlighting support for quick navigation
- Best practices guidance for CoffeeCup workflows

## Documentation

For comprehensive documentation about this project, please see the following files in the Documentation folder and other project directories:

### Main Documentation

- [CoffeeCup AI Assistant Guide](Documentation/CoffeeCup-AI-Assistant-Guide.md) - Complete guide to the CoffeeCup AI Assistant features and usage
- [CoffeeCup Website Integration](Documentation/CoffeeCupWebsiteIntoDocs.md) - Documentation about CoffeeCup Software and product integration
- [OpenRouter Documentation](Documentation/OpenRouterDocumentation.md) - Specific guidance on OpenRouter API integration

### Licensing and Legal

- [LICENSE](Documentation/LICENSE) - Voice & Eye Source-Available NonCommercial + Commercial-License (VEO-SA-NC-1.0)
- [Commercial License Summary](Documentation/COMMERCIAL.md) - Plain-English summary of commercial licensing requirements
- [Contributor License Agreement (CLA)](Documentation/CLA.md) - CLA for contributors with pool participation rights

### Contributing and Development

- [Contributing Guidelines](Documentation/CONTRIBUTING.md) - How to contribute to the project and participate in the contributor pool

### Universal Vibe Coding Guardrails

- [MarkdownRules](Universal Vibe Coding Guardrails/MarkdownRules.md) - Guidelines for Markdown documentation
- [MyFooter](Universal Vibe Coding Guardrails/MyFooter.md) - Footer attribution guidelines
- [Read This First - Limits to Follow](Universal Vibe Coding Guardrails/Read this File First - Limits to follow.md) - Important guidelines and limitations
- [VIBE_Coding_Manifest](Universal Vibe Coding Guardrails/VIBE_CODING_MANIFEST.md) - Core philosophy and development principles
- [APK_Build_Documentation](Universal Vibe Coding Guardrails/Context and Inspiration/APK_BUILD_DOCUMENTATION.md) - Build documentation for mobile applications
- [Professional_Step-by-Step_Guide_-_Building_EXE_and_APK](Universal Vibe Coding Guardrails/Context and Inspiration/Professional_Step-by-Step_Guide_-_Building_EXE_and_APK.md) - Guide for building executables and mobile apps
- [Transformation_Documentation](Universal Vibe Coding Guardrails/Context and Inspiration/TRANSFORMATION_DOCUMENTATION.md) - Documentation about project transformations
- [Ultimate_Guide_to_Free_AI_APIs](Universal Vibe Coding Guardrails/Context and Inspiration/Ultimate_Guide_to_Free_AI_APIs.md) - Comprehensive guide to free AI APIs

## Additional Resources

This CoffeeCup AI Assistant project provides comprehensive documentation to help users and contributors understand all aspects of the software, from basic usage to advanced development and commercial licensing. The documentation covers integration with CoffeeCup HTML Editor, multiple AI backends (Ollama, OpenRouter, Websim), licensing models, and development best practices.
