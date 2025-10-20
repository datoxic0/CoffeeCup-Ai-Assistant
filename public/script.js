import { marked } from 'marked';
import hljs from 'highlight.js';

class AIAssistantApp {
    constructor() {
        this.cacheDOMElements();
        this.initEventListeners();
        this.initSidebar();
        this.initTheme();
        this.initSettings();
        this.conversationHistory = [];
        this.commandHistory = [];
        this.historyIndex = -1;
        this.terminalHistory = [];
        this.terminalHistoryIndex = -1;
        
        this.updateServerUrl(false); // Initial setup without alert
        this.initStatusCheck();
    }

    cacheDOMElements() {
        this.els = {
            appContainer: document.getElementById('app-container'),
            settingsPanel: document.getElementById('settings-panel'),
            resizeHandle: document.getElementById('resize-handle'),
            sidebarToggle: document.getElementById('sidebar-toggle'),
            sidebarToggleMain: document.getElementById('sidebar-toggle-main'),
            themeToggle: document.getElementById('theme-toggle'),
            backendSelect: document.getElementById('backend-select'),
            modelSelect: document.getElementById('model-select'),
            modelInputContainer: document.getElementById('model-input-container'),
            filepathSelect: document.getElementById('filepath-select'),
            serverUrlInput: document.getElementById('server-url-input'),
            websimKeyContainer: document.getElementById('websim-key-container'),
            websimKeyInput: document.getElementById('websim-key-input'),
            promptInput: document.getElementById('prompt-input'),
            actionButtons: document.getElementById('action-buttons'),
            messageList: document.getElementById('message-list'),
            btnSend: document.getElementById('btn-send'),
            refreshModels: document.getElementById('refresh-models'),
            refreshFiles: document.getElementById('refresh-files'),
            viewToggle: document.getElementById('view-toggle'),
            chatContainer: document.getElementById('chat-container'),
            terminalContainer: document.getElementById('terminal-container'),
            terminalOutput: document.getElementById('terminal-output'),
            terminalInput: document.getElementById('terminal-input'),
            statusServer: document.getElementById('status-server'),
            statusOllama: document.getElementById('status-ollama'),
            statusOpenRouter: document.getElementById('status-openrouter'),
        };
    }

    initEventListeners() {
        this.els.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.els.promptInput.addEventListener('input', this.autoResizeTextarea);
        
        this.els.btnSend.addEventListener('click', () => this.handlePromptSubmit());
        this.els.promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handlePromptSubmit();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateCommandHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateCommandHistory('down');
            }
        });

        this.els.actionButtons.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (button && button.dataset.action) {
                const action = button.dataset.action;
                const prompt = this.els.promptInput.value.trim();
                
                if (action !== 'apply' && !prompt) {
                    this.addMessage('Please enter some code or a question to use this action.', 'error');
                    return;
                }
                if (action === 'apply' && !this.els.filepathSelect.value) {
                    this.addMessage('Please select a target file in settings to use the "Apply" action.', 'error');
                    return;
                }

                const command = `/${action} ${prompt}`;
                this.handleCommand(command, true);
                this.els.promptInput.value = '';
                this.els.promptInput.focus();
            }
        });

        this.els.viewToggle.addEventListener('click', () => this.toggleView());

        this.els.terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleTerminalSubmit();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateTerminalHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateTerminalHistory('down');
            }
        });

        this.els.backendSelect.addEventListener('change', () => this.handleBackendChange());
        this.els.refreshModels.addEventListener('click', () => this.fetchDynamicData('models', true));
        this.els.refreshFiles.addEventListener('click', () => this.fetchDynamicData('files', true));

        this.els.modelSelect.addEventListener('change', () => this.saveSetting('model', this.els.modelSelect.value));
        this.els.filepathSelect.addEventListener('change', () => this.saveSetting('filepath', this.els.filepathSelect.value));
        this.els.serverUrlInput.addEventListener('change', () => this.updateServerUrl());
        this.els.websimKeyInput.addEventListener('input', () => this.saveSetting('websimKey', this.els.websimKeyInput.value));
    }
    
    initSidebar() {
        this.els.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        this.els.sidebarToggleMain.addEventListener('click', () => this.toggleSidebar());

        const handleDrag = (e) => {
            const newWidth = e.clientX;
            const minWidth = parseInt(getComputedStyle(this.els.settingsPanel).minWidth);
            const maxWidth = parseInt(getComputedStyle(this.els.settingsPanel).maxWidth);
            if (newWidth > minWidth && newWidth < maxWidth) {
                this.els.settingsPanel.style.width = `${newWidth}px`;
                document.documentElement.style.setProperty('--settings-panel-width', `${newWidth}px`);
            }
        };

        const stopDrag = () => {
            document.body.style.cursor = 'default';
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', stopDrag);
        };
        
        this.els.resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            document.body.style.cursor = 'col-resize';
            window.addEventListener('mousemove', handleDrag);
            window.addEventListener('mouseup', stopDrag);
        });
    }

    toggleSidebar() {
        this.els.appContainer.classList.toggle('sidebar-collapsed');
        const isCollapsed = this.els.appContainer.classList.contains('sidebar-collapsed');
        if (isCollapsed) {
            this.els.settingsPanel.style.width = '0';
        } else {
            this.els.settingsPanel.style.width = getComputedStyle(document.documentElement).getPropertyValue('--settings-panel-width');
        }
    }

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark-theme';
        document.body.className = savedTheme;
        this.updateThemeIcon(savedTheme);
    }
    
    initSettings() {
        const savedBackend = localStorage.getItem('backend');
        const savedModel = localStorage.getItem('model');
        const savedFilepath = localStorage.getItem('filepath');
        const savedServerUrl = localStorage.getItem('serverUrl');
        const savedWebsimKey = localStorage.getItem('websimKey');

        if (savedBackend) this.els.backendSelect.value = savedBackend;
        if (savedServerUrl) this.els.serverUrlInput.value = savedServerUrl;
        if (savedWebsimKey) this.els.websimKeyInput.value = savedWebsimKey;

        this.handleBackendChange(false);

        this.fetchDynamicData('models').then(() => {
            if (savedModel) this.els.modelSelect.value = savedModel;
        });
        this.fetchDynamicData('files').then(() => {
             if (savedFilepath) this.els.filepathSelect.value = savedFilepath;
        });
    }
    
    saveSetting(key, value) {
        localStorage.setItem(key, value);
    }
    
    updateServerUrl(showAlert = true) {
        const newUrl = this.els.serverUrlInput.value.trim() || 'http://localhost:3690';
        this.saveSetting('serverUrl', newUrl);
        this.API_BASE_URL = newUrl;
        
        if (showAlert) {
            this.addMessage(`Server URL updated to: \`${newUrl}\`. Reconnecting...`, 'assistant');
        }
        
        this.checkServerStatus();
    }

    handleBackendChange(withConfirm = true) {
        const newBackend = this.els.backendSelect.value;
        
        const applyChanges = () => {
            this.saveSetting('backend', newBackend);
            this.toggleBackendSettings();
            this.fetchDynamicData('models', true);
            this.clearChat();
        };

        if (withConfirm) {
            const confirmed = confirm("Changing the backend will clear the current conversation and start a new session. Do you want to continue?");
            if (confirmed) {
                applyChanges();
            } else {
                this.els.backendSelect.value = localStorage.getItem('backend') || 'websim';
            }
        } else {
             this.toggleBackendSettings();
        }
    }

    clearChat() {
        this.els.messageList.innerHTML = '';
        this.conversationHistory = [];
        this.addMessage('Hello! How can I help you today?', 'assistant');
    }

    toggleTheme() {
        const newTheme = document.body.classList.contains('dark-theme') ? 'light-theme' : 'dark-theme';
        document.body.className = newTheme;
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = this.els.themeToggle.querySelector('i');
        icon.className = theme === 'dark-theme' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    toggleBackendSettings() {
        const backend = this.els.backendSelect.value;
        this.els.modelInputContainer.style.display = (backend === 'ollama' || backend === 'openrouter') ? 'block' : 'none';
        this.els.websimKeyContainer.style.display = (backend === 'websim') ? 'block' : 'none';
    }
    
    autoResizeTextarea(event) {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight + 2}px`;
    }

    handlePromptSubmit() {
        const input = this.els.promptInput.value.trim();
        if (!input) return;

        if (!this.commandHistory.length || this.commandHistory[this.commandHistory.length - 1] !== input) {
            this.commandHistory.push(input);
        }
        this.historyIndex = -1;

        this.addMessage(input, 'user');
        this.els.promptInput.value = '';
        this.els.promptInput.focus();
        this.els.promptInput.style.height = 'auto';

        if (input.startsWith('/')) {
            this.handleCommand(input, false);
        } else {
            this.handleChat(input);
        }
    }
    
    async handleCommand(fullCommand, isFromActionButton) {
        const [command, ...args] = fullCommand.slice(1).split(' ');
        const prompt = args.join(' ');

        if (isFromActionButton) {
            const messageText = command === 'apply' ? `Applying changes to ${this.els.filepathSelect.value} with prompt: "${prompt}"` : prompt;
            this.addMessage(messageText || `/${command}`, 'user');
        }

        switch (command.toLowerCase()) {
            case 'suggest':
            case 'explain':
            case 'apply':
                await this.performAIAction(command, prompt);
                break;
            case 'help':
                const helpText = `**Available Commands:**\n- \`/suggest [code]\` - Suggest improvements for the code.\n- \`/explain [code]\` - Explain the provided code.\n- \`/apply [instructions]\` - Apply changes to the selected file based on instructions.\n- \`/models\` - List available models for the selected backend.\n- \`/clear\` - Clear the chat history.\n- \`/help\` - Show this help message.`;
                this.addMessage(helpText, 'assistant');
                break;
            case 'clear':
                this.clearChat();
                 this.addMessage('Chat history cleared.', 'assistant');
                break;
            case 'models':
                await this.displayAvailableModels();
                break;
            default:
                this.addMessage(`Unknown command: \`/${command}\`. Type \`/help\` for a list of commands.`, 'error');
        }
    }

    async handleChat(prompt) {
         this.conversationHistory.push({ role: 'user', content: prompt });
         await this.performAIAction('send', prompt);
    }

    async performAIAction(action, prompt, terminalOutputCallback = null) {
        const loadingIndicator = terminalOutputCallback ? null : this.addMessage('', 'loading');
        
        const callback = terminalOutputCallback || ((msg, type) => this.addMessage(msg, type));

        try {
            const response = await fetch(`${this.API_BASE_URL}/api/assistant`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    backend: this.els.backendSelect.value,
                    model: this.els.modelSelect.value.trim(),
                    action,
                    prompt,
                    filePath: this.els.filepathSelect.value.trim(),
                    keys: {
                        websim: this.els.websimKeyInput.value.trim()
                    }
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! Status: ${response.status}`);
            }
            
            this.conversationHistory.push({ role: 'assistant', content: data.text });
            callback(data.text, 'assistant');

        } catch (error) {
            console.error('Request Error:', error);
            const errorMessage = `Error: ${error.message}`;
            callback(errorMessage, 'error');
        } finally {
            if (loadingIndicator && loadingIndicator.parentNode) {
                loadingIndicator.parentNode.removeChild(loadingIndicator);
            }
        }
    }

    async fetchDynamicData(type, forceRefresh = false) {
        const backend = this.els.backendSelect.value;
        const cacheKey = `${backend}-${type}`;

        if (!forceRefresh) {
            const cachedData = sessionStorage.getItem(cacheKey);
            if (cachedData) {
                this.populateSelect(type === 'models' ? this.els.modelSelect : this.els.filepathSelect, JSON.parse(cachedData));
                return;
            }
        }

        if (backend === 'websim' && type === 'models') {
            this.populateSelect(this.els.modelSelect, []);
            return;
        }
        
        let selectElement, endpoint;
        if (type === 'models') {
            selectElement = this.els.modelSelect;
            endpoint = 'models';
        } else {
            selectElement = this.els.filepathSelect;
            endpoint = 'files';
        }

        this.setLoadingState(selectElement, true);
        try {
            const response = await fetch(`${this.API_BASE_URL}/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ backend })
            });
            if (!response.ok) throw new Error(`Failed to fetch ${type}`);
            
            const data = await response.json();
            const items = data.items || [];
            sessionStorage.setItem(cacheKey, JSON.stringify(items));
            this.populateSelect(selectElement, items);
        } catch (error) {
            this.addMessage(`Could not fetch ${type} from the server.`, 'error');
            this.populateSelect(selectElement, []);
        } finally {
            this.setLoadingState(selectElement, false);
        }
    }

    populateSelect(selectElement, items) {
        const currentValue = selectElement.value;
        selectElement.innerHTML = '';
        if (items.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No items found';
            option.disabled = true;
            selectElement.appendChild(option);
        } else {
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                selectElement.appendChild(option);
            });
        }
        selectElement.value = currentValue;
    }

    setLoadingState(selectElement, isLoading) {
        selectElement.disabled = isLoading;
        const parent = selectElement.parentElement;
        const refreshBtn = parent.querySelector('.refresh-btn i');
        if (refreshBtn) {
            refreshBtn.classList.toggle('fa-spin', isLoading);
        }
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        if (type === 'loading') {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            const img = document.createElement('img');
            img.src = '/loading.svg';
            img.alt = 'Loading...';
            img.className = 'loading-gif';
            contentDiv.appendChild(img);
            messageDiv.appendChild(contentDiv);
            this.els.messageList.appendChild(messageDiv);
            this.els.messageList.scrollTop = this.els.messageList.scrollHeight;
            return messageDiv;
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        contentDiv.innerHTML = marked.parse(text, {
            highlight: (code, lang) => {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
            gfm: true,
        });
        
        messageDiv.appendChild(contentDiv);

        this.els.messageList.appendChild(messageDiv);
        this.els.messageList.scrollTop = this.els.messageList.scrollHeight;
        return messageDiv;
    }

    navigateCommandHistory(direction) {
        if (this.commandHistory.length === 0) return;
        const lastIndex = this.commandHistory.length;

        if (direction === 'up') {
            if (this.historyIndex === -1) {
                this.historyIndex = lastIndex - 1;
            } else if (this.historyIndex > 0) {
                this.historyIndex--;
            }
        } else {
            if (this.historyIndex !== -1 && this.historyIndex < lastIndex - 1) {
                this.historyIndex++;
            } else {
                this.historyIndex = -1;
                this.els.promptInput.value = '';
                return;
            }
        }

        if (this.historyIndex !== -1) {
            this.els.promptInput.value = this.commandHistory[this.historyIndex];
        }
    }
    
    async displayAvailableModels() {
        const backend = this.els.backendSelect.value;
        if (backend === 'websim') {
            this.addMessage("Websim AI uses a general model and does not require model selection.", 'assistant');
            return;
        }

        const cacheKey = `${backend}-models`;
        let models = sessionStorage.getItem(cacheKey);

        if (models) {
            models = JSON.parse(models);
        } else {
            await this.fetchDynamicData('models', true);
            models = JSON.parse(sessionStorage.getItem(cacheKey) || '[]');
        }

        if (models && models.length > 0) {
            const modelList = models.map(m => `- \`${m}\``).join('\n');
            this.addMessage(`**Available models for ${backend}:**\n${modelList}`, 'assistant');
        } else {
            this.addMessage(`Could not retrieve models for ${backend}.`, 'error');
        }
    }

    initStatusCheck() {
        this.checkServerStatus();
        setInterval(() => this.checkServerStatus(), 300000);
    }

    async checkServerStatus() {
        try {
            const healthResponse = await fetch(`${this.API_BASE_URL}/api/health`);
            if (!healthResponse.ok) throw new Error('Server not reachable');
            
            this.updateStatusDot('server', 'ok');

            const statusResponse = await fetch(`${this.API_BASE_URL}/api/status`);
            if (!statusResponse.ok) throw new Error('Could not fetch detailed statuses');
            
            const statuses = await statusResponse.json();
            this.updateStatusDot('ollama', statuses.ollama);
            this.updateStatusDot('openrouter', statuses.openrouter);

        } catch (error) {
            this.updateStatusDot('server', 'error');
            this.updateStatusDot('ollama', 'error');
            this.updateStatusDot('openrouter', 'error');
        }
    }

    updateStatusDot(service, status) {
        const dot = this.els[`status${service.charAt(0).toUpperCase() + service.slice(1)}`];
        if (!dot) return;
        
        dot.classList.remove('green', 'red', 'orange');
        let statusClass = 'red';
        if (status === 'ok') statusClass = 'green';
        else if (status === 'misconfigured') statusClass = 'orange';
        dot.classList.add(statusClass);
        dot.title = `Status: ${status}`;
    }

    toggleView() {
        const isChatView = !this.els.chatContainer.classList.contains('hidden');
        const icon = this.els.viewToggle.querySelector('i');

        if (isChatView) {
            this.els.chatContainer.classList.add('hidden');
            this.els.terminalContainer.classList.remove('hidden');
            this.els.viewToggle.title = "Switch to Chat View";
            icon.className = "fas fa-comment-alt";
            this.els.terminalInput.focus();
        } else {
            this.els.chatContainer.classList.remove('hidden');
            this.els.terminalContainer.classList.add('hidden');
            this.els.viewToggle.title = "Switch to Terminal View";
            icon.className = "fas fa-terminal";
            this.els.promptInput.focus();
        }
    }

    async handleTerminalSubmit() {
        const command = this.els.terminalInput.value.trim();
        if (!command) return;

        this.addTerminalLine(`> ${command}`, 'user-input');
        
        if (!this.terminalHistory.length || this.terminalHistory[this.terminalHistory.length - 1] !== command) {
            this.terminalHistory.push(command);
        }
        this.terminalHistoryIndex = -1;
        this.els.terminalInput.value = '';

        if (command.startsWith('/')) {
            await this.handleTerminalCommand(command);
        } else {
            this.addTerminalLine("Invalid command. All commands must start with a forward slash (/). Type /help for options.", 'error');
        }
    }

    async handleTerminalCommand(fullCommand) {
        const [command, ...args] = fullCommand.slice(1).split(' ');
        const prompt = args.join(' ');
        const terminalCallback = (text, type) => this.addTerminalLine(text, type);

        switch (command.toLowerCase()) {
            case 'suggest':
            case 'explain':
            case 'apply':
                 if (command !== 'apply' && !prompt) {
                   this.addTerminalLine(`Usage: /${command} [code snippet]`, 'error');
                   return;
                }
                await this.performAIAction(command, prompt, terminalCallback);
                break;
            case 'send':
                 if (!prompt) {
                   this.addTerminalLine(`Usage: /send [your message]`, 'error');
                   return;
                }
                await this.performAIAction('send', prompt, terminalCallback);
                break;
            case 'help':
                const helpText = `Available Commands:\n- /suggest [code]     - Suggest improvements for the code.\n- /explain [code]     - Explain the provided code.\n- /apply [instructions] - Apply changes to the selected file.\n- /send [message]       - Send a general message to the AI.\n- /models             - List available models.\n- /clear              - Clear the terminal screen.`;
                this.addTerminalLine(helpText, 'info');
                break;
            case 'clear':
                this.els.terminalOutput.innerHTML = '';
                break;
            case 'models':
                const originalAddMessage = this.addMessage;
                let modelText = '';
                this.addMessage = (text, type) => { modelText = text; };
                await this.displayAvailableModels();
                this.addMessage = originalAddMessage;
                this.addTerminalLine(modelText.replace(/\`/g, ''), 'info');
                break;
            default:
                this.addTerminalLine(`Unknown command: \`/${command}\`.`, 'error');
        }
    }
    
    addTerminalLine(text, type) {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;

        line.innerHTML = marked.parse(text, {
            highlight: (code, lang) => {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            },
            gfm: true,
        });

        this.els.terminalOutput.appendChild(line);
        this.els.terminalOutput.scrollTop = this.els.terminalOutput.scrollHeight;
    }

    navigateTerminalHistory(direction) {
        if (this.terminalHistory.length === 0) return;
        const lastIndex = this.terminalHistory.length;

        if (direction === 'up') {
            if (this.terminalHistoryIndex === -1) {
                this.terminalHistoryIndex = lastIndex - 1;
            } else if (this.terminalHistoryIndex > 0) {
                this.terminalHistoryIndex--;
            }
        } else {
            if (this.terminalHistoryIndex !== -1 && this.terminalHistoryIndex < lastIndex - 1) {
                this.terminalHistoryIndex++;
            } else {
                this.terminalHistoryIndex = -1;
                this.els.terminalInput.value = '';
                return;
            }
        }

        if (this.terminalHistoryIndex !== -1) {
            this.els.terminalInput.value = this.terminalHistory[this.terminalHistoryIndex];
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new AIAssistantApp());