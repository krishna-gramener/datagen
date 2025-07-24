import { openaiConfig } from "https://cdn.jsdelivr.net/npm/bootstrap-llm-provider@1";

let currentConfig = null;
let chatSessions = {};
let currentUseCaseId = null;
let configData = null;
let isUseCaseMode = false;

const { baseURL, apiKey, models } = await openaiConfig({
    defaultBaseUrls: ["https://llmfoundry.straive.com/openai/v1","https://llmfoundry.straivedemo.com/openai/v1","https://aipipe.org/api/v1","https://api.openai.com/v1", "https://openrouter.com/api/v1"],
  });

async function callLLM(systemPrompt, userMessage) {
  try {
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}:llm-use-case-explorer`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || "API error occurred");
    }
    return data.choices?.[0]?.message?.content || "No response received";
  } catch (error) {
    console.error(error);
    throw new Error(`API call failed: ${error.message}`);
  }
}

async function init() {
  try {
    // Check if we're in use case mode by looking for specific elements
    isUseCaseMode = document.getElementById('industrySelect') !== null;
    
    // Always hide loading spinner first
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }

    if (isUseCaseMode) {
      await loadConfigData();
    }
  } catch (error) {
    console.error('Initialization error:', error);
    // Hide loading spinner even on error
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
    showAlert('Failed to initialize application: ' + error.message, 'danger');
  }
}


function initializeEventListeners() {
    if (isUseCaseMode) {
        setupUseCaseEventListeners();
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Ensure loading spinner is hidden immediately
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
    
    await init();
    initializeEventListeners();
    
    // Double-check loading spinner is hidden after init
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
});

// Load configuration data
async function loadConfigData() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        configData = await response.json();
    } catch (error) {
        console.error('Error loading config data:', error);
        // Set empty config data as fallback
        configData = {};
        console.log('Using empty config data as fallback');
    }
}

// Setup event listeners for use case mode
function setupUseCaseEventListeners() {
    // Generate button
    document.getElementById('generateBtn').addEventListener('click', generateValueChain);
    
    // Back button
    document.getElementById('backBtn').addEventListener('click', goBack);
    
    // Export/Import buttons
    document.getElementById('exportBtn').addEventListener('click', exportConfiguration);
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importConfiguration);
    
    // Modal chat functionality
    document.getElementById('sendChatBtn').addEventListener('click', sendChatMessage);
    
    // Dropdown selection
    document.getElementById('industrySelect').addEventListener('change', function() {
        if (this.value) {
            document.getElementById('customInput').value = '';
        }
    });
    
    // Custom input clearing dropdown
    document.getElementById('customInput').addEventListener('input', function() {
        if (this.value) {
            document.getElementById('industrySelect').value = '';
        }
    });
}

// Generate value chain
async function generateValueChain() {
    const selectedValue = document.getElementById('industrySelect').value;
    const customInput = document.getElementById('customInput').value.trim();
    
    if (!selectedValue && !customInput) {
        showAlert('Please select an industry/function or enter a custom one.', 'warning');
        return;
    }
    
    // Show loading
    document.getElementById('selectionSection').style.display = 'none';
    document.getElementById('loadingSpinner').style.display = 'block';
    
    try {
        if (selectedValue && configData[selectedValue]) {
            // Load from predefined config
            currentConfig = configData[selectedValue];
        } else {
            // Generate using LLM for custom input
            const industryName = customInput || selectedValue;
            currentConfig = await generateCustomValueChain(industryName);
        }
        
        displayValueChain();
        
    } catch (error) {
        console.error('Error generating value chain:', error);
        showAlert('Error generating value chain. Please try again.', 'danger');
        goBack();
    } finally {
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

// Generate custom value chain using LLM
async function generateCustomValueChain(industryName) {
    const systemPrompt = `You are an expert business analyst. Generate a value chain for the "${industryName}" industry or function. 
    
    Return ONLY a JSON object with this exact structure:
    {
      "name": "${industryName}",
      "type": "custom",
      "valueChain": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5", "Step 6"],
      "useCases": {
        "Step 1": ["Use Case 1", "Use Case 2", "Use Case 3", "Use Case 4"],
        "Step 2": ["Use Case 1", "Use Case 2", "Use Case 3", "Use Case 4"]
      }
    }
    
    - Generate 4-8 value chain steps that are typical for this industry/function
    - For each step, generate 3-6 LLM use cases (3-6 words each)
    - Use cases should leverage AI/LLM capabilities like text generation, analysis, automation, etc.
    - Return only valid JSON, no explanations`;
    
    const userMessage = `Generate value chain and LLM use cases for: ${industryName}`;
    
    try {
        const response = await callLLM(systemPrompt, userMessage);
        // Clean up response and parse JSON
        const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return JSON.parse(cleanResponse);
    } catch (error) {
        console.error('Error generating custom value chain:', error);
    }
}

// Display value chain
function displayValueChain() {
    document.getElementById('valueChainTitle').textContent = `${currentConfig.name} Value Chain`;
    
    const stepsContainer = document.getElementById('valueChainSteps');
    stepsContainer.innerHTML = '';
    
    // Create rows of chevrons (4 per row)
    const steps = currentConfig.valueChain;
    for (let i = 0; i < steps.length; i += 4) {
        const row = document.createElement('div');
        row.className = 'row mb-4';
        
        const rowSteps = steps.slice(i, i + 4);
        rowSteps.forEach((step, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-3';
            
            // Create chevron
            const chevron = document.createElement('div');
            chevron.className = 'chevron';
            chevron.textContent = step;
            
            col.appendChild(chevron);
            
            // Create use case boxes
            const useCases = currentConfig.useCases[step] || [];
            useCases.forEach((useCase, useCaseIndex) => {
                const useCaseBox = document.createElement('div');
                useCaseBox.className = 'use-case-box';
                useCaseBox.textContent = 'Click to reveal';
                useCaseBox.dataset.step = step;
                useCaseBox.dataset.useCase = useCase;
                useCaseBox.dataset.id = `${i + index}-${useCaseIndex}`;
                
                useCaseBox.addEventListener('click', function() {
                    revealUseCase(this);
                });

                useCaseBox.addEventListener('dblclick', function() {
                    openUseCaseModal(this.dataset.id, this.dataset.step, this.dataset.useCase);
                });
                
                col.appendChild(useCaseBox);
            });
            
            row.appendChild(col);
        });
        
        stepsContainer.appendChild(row);
    }
    
    document.getElementById('valueChainContainer').style.display = 'block';
}

// Reveal use case
function revealUseCase(box) {
    if (!box.classList.contains('revealed')) {
        box.classList.add('revealed');
        box.textContent = box.dataset.useCase;
    }
}

// Open use case modal
function openUseCaseModal(useCaseId, step, useCase) {
    currentUseCaseId = useCaseId;
    
    document.getElementById('useCaseTitle').textContent = useCase;
    
    // Initialize chat session if not exists
    if (!chatSessions[useCaseId]) {
        chatSessions[useCaseId] = [
            {
                role: 'assistant',
                content: `This is the "${useCase}" use case for ${step}. I can help you understand how this LLM use case works, provide implementation details, or help you modify it for your specific needs. What would you like to know?`
            }
        ];
    }
    displayChatMessages(useCaseId);
    const modal = new bootstrap.Modal(document.getElementById('useCaseModal'));
    modal.show();
}

// Display chat messages
function displayChatMessages(useCaseId) {
    const chatContainer = document.getElementById('chatMessages');
    chatContainer.innerHTML = '';
    
    const messages = chatSessions[useCaseId] || [];
    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}`;
        
        // Use marked.parse for assistant messages, plain text for user messages
        if (message.role === 'assistant') {
            messageDiv.innerHTML = marked.parse(message.content);
        } else {
            messageDiv.textContent = message.content;
        }
        
        chatContainer.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Send chat message
async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    const chatLoader = document.getElementById('chatLoader');
    const sendBtn = document.getElementById('sendChatBtn');
    
    if (!message || !currentUseCaseId) return;
    
    // Add user message
    chatSessions[currentUseCaseId].push({
        role: 'user',
        content: message
    });
    
    input.value = '';
    displayChatMessages(currentUseCaseId);
    
    // Show loader and disable input
    chatLoader.style.display = 'block';
    input.disabled = true;
    sendBtn.disabled = true;
    
    // Get AI response using the existing callLLM function
    try {
        const currentUseCase = chatSessions[currentUseCaseId].find(msg => msg.role === 'assistant');
        const systemPrompt = `You are an AI expert helping users understand and implement LLM use cases. The current use case being discussed is related to the conversation context. Provide helpful, practical advice about LLM implementation, benefits, challenges, and modifications. Keep responses concise but informative.`;
        
        // Build context from chat history
        const chatHistory = chatSessions[currentUseCaseId].slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n');
        const userMessage = `Context: ${chatHistory}\n\nUser question: ${message}`;
        
        const response = await callLLM(systemPrompt, userMessage);
        
        chatSessions[currentUseCaseId].push({
            role: 'assistant',
            content: response
        });
        
        displayChatMessages(currentUseCaseId);
    } catch (error) {
        console.error('Error getting AI response:', error);
        chatSessions[currentUseCaseId].push({
            role: 'assistant',
            content: 'I apologize, but I encountered an error processing your request. Please try again.'
        });
        displayChatMessages(currentUseCaseId);
    } finally {
        // Hide loader and re-enable input
        chatLoader.style.display = 'none';
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    }
}

// Go back to selection
function goBack() {
    document.getElementById('valueChainContainer').style.display = 'none';
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('selectionSection').style.display = 'block';
    
    // Reset selections
    document.getElementById('industrySelect').value = '';
    document.getElementById('customInput').value = '';
    currentConfig = null;
}

// Export configuration
function exportConfiguration() {
    if (!currentConfig) {
        showAlert('No configuration to export', 'warning');
        return;
    }
    
    const exportData = {
        ...currentConfig,
        chatSessions: chatSessions
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentConfig.name.toLowerCase().replace(/\s+/g, '-')}-use-cases.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('Configuration exported successfully!', 'success');
}

// Import configuration
function importConfiguration(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            currentConfig = importedData;
            chatSessions = importedData.chatSessions || {};
            
            displayValueChain();
            document.getElementById('selectionSection').style.display = 'none';
            
            showAlert('Configuration imported successfully!', 'success');
        } catch (error) {
            showAlert('Error importing configuration file', 'danger');
        }
    };
    reader.readAsText(file);
}

// Show alert function (reuse existing or add if not present)
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv && alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}
