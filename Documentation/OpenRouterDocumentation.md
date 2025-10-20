# OpenRouter API Integration for CoffeeCup AI Assistant

This document provides specific guidance on how OpenRouter API is integrated into the CoffeeCup AI Assistant project. The CoffeeCup AI Assistant leverages OpenRouter's unified API to provide access to hundreds of AI models through a single endpoint, with automatic fallbacks and cost-effective options for CoffeeCup HTML Editor workflows.

## Integration Overview

The CoffeeCup AI Assistant integrates with OpenRouter through the backend server (`server.js`) to provide cloud-based AI model access alongside local Ollama models and Websim AI. The integration handles authentication, request routing, and response processing for CoffeeCup-specific workflows like HTML/CSS/JavaScript code assistance and web development tasks.

## Configuration

OpenRouter integration is configured through environment variables in the `.env` file:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-oss-20b:free
OPENROUTER_BASE=https://openrouter.ai/api/v1
```

### Required Setup

1. Get an API key from [OpenRouter](https://openrouter.ai)
2. Add the API key to your `.env` file
3. The assistant will automatically use OpenRouter when selected as the backend

## API Usage in CoffeeCup AI Assistant

The OpenRouter integration in the CoffeeCup AI Assistant includes the following features specifically tailored for web development workflows with CoffeeCup HTML Editor users in mind:

### Supported Actions

- **Code Suggestions**: Get improvements for HTML, CSS, and JavaScript code
- **Code Explanations**: Detailed breakdowns of web development code
- **File Modifications**: Apply changes to web project files with safety markers
- **Web Development Best Practices**: CoffeeCup-specific coding recommendations

### Request Format

The CoffeeCup AI Assistant formats OpenRouter requests with these key elements optimized for web development tasks:
- **System Prompt**: "You are an expert web developer. Provide accurate code fixes, diffs, and concise explanations."
- **Message Format**: Properly structured for web development context
- **Response Handling**: Optimized for code output with syntax highlighting support

## Authentication and Headers

The CoffeeCup AI Assistant automatically includes the following headers for OpenRouter API requests to enable app attribution and analytics within the OpenRouter ecosystem (while maintaining privacy for CoffeeCup users):

- `Authorization: Bearer <OPENROUTER_API_KEY>` - Required API key authentication
- `HTTP-Referer: http://localhost:3690` - Identifies the CoffeeCup AI Assistant application
- `X-Title: CoffeeCup AI Assistant` - Application name for OpenRouter rankings

## Error Handling

The CoffeeCup AI Assistant provides robust error handling for OpenRouter integration including:
- **API Key Validation**: Clear guidance when OpenRouter API key is missing or invalid
- **Connection Issues**: Graceful handling of network failures and timeouts
- **Rate Limits**: User-friendly messages when rate limits are reached
- **Model Availability**: Fallback handling when requested models are unavailable

## Model Selection

The CoffeeCup AI Assistant automatically selects from available OpenRouter models with preferences set for web development tasks. Users can specify models through the UI, with common options including free models like `openai/gpt-oss-20b:free` and other web development-optimized models available on OpenRouter. The system will automatically fall back to other available models if the preferred model is unavailable, ensuring continuous service for CoffeeCup users' web development workflows.
