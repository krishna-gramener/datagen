# LLM Use Case Explorer

A powerful web application that helps business users identify and explore LLM (Large Language Model) use cases based on their industry or function. Discover AI opportunities through interactive value chain visualization and detailed use case exploration.

## 🚀 Features

- **Industry/Function Selection** - Choose from predefined options or enter custom industries
- **AI-Powered Value Chain Generation** - Automatically generates 4-8 step value chains
- **Interactive Chevron Visualization** - Beautiful visual representation with 4 chevrons per row
- **Hidden Use Case Discovery** - 3-6 use cases per value chain step, revealed on click
- **Modal Chat Interface** - Interactive discussions about each use case with LLM
- **Export/Import Configuration** - Save and resume sessions as JSON files
- **Independent Chat Sessions** - Each use case maintains its own conversation history
- **Clean Bootstrap Interface** - Modern, responsive design with FontAwesome icons

## 📋 Quick Start

### For Business Users

1. **Open the App**
   - Simply open `index.html` in your web browser
   - No installation or setup required

2. **Select Your Context**
   - **Predefined Options**: Choose from dropdown (Retail, Manufacturing, HR, IT, etc.)
   - **Custom Input**: Enter your specific industry or business function
   - Click "Generate Value Chain" to proceed

3. **Explore Value Chain**
   - View your industry's value chain as interactive chevrons
   - Each chevron represents a key business process step
   - Maximum of 4 chevrons displayed per row

4. **Discover Use Cases**
   - Click on hidden use case boxes below each chevron
   - Each box reveals a specific LLM use case for that process
   - 3-6 use cases available per value chain step

5. **Interactive Chat**
   - Click any revealed use case to open a modal dialog
   - Chat with the LLM about implementation details
   - Ask for clarifications, modifications, or deeper insights
   - Each use case maintains its own conversation history

6. **Save & Resume**
   - Export your configuration and chat sessions as JSON
   - Import previously saved sessions to continue exploration

### Example Workflows

**Retail Industry:**
1. Select "Retail" from dropdown
2. Explore value chain: Sourcing → Inventory → Sales → Customer Service
3. Discover use cases like "Demand Forecasting" or "Personalized Recommendations"
4. Chat about implementation strategies

**Custom Function:**
1. Enter "Supply Chain Management" in custom input
2. AI generates relevant value chain steps
3. Explore AI opportunities in logistics and procurement
4. Export findings for team discussion

## 🛠️ For Developers

### Project Structure

```
data-generator-app/
├── index.html          # Main HTML interface with LLM Use Case Explorer UI
├── script.js           # JavaScript functionality for value chains and chat
├── config.json         # Predefined industries/functions and use cases
├── .gitignore         # Git ignore rules
└── README.md          # This documentation
```

### Technical Details

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: Bootstrap 5.3.0 + FontAwesome 6.0.0
- **API**: Custom LLM endpoint (llmfoundry.straive.com)
- **Model**: GPT-4.1-mini
- **Authentication**: Token-based with credentials
- **Data Storage**: Local JSON configuration + client-side session management
- **UI Components**: Modal dialogs, chevron visualization, interactive chat

### Key Functions

```javascript
// Core API functions
callLLM(systemPrompt, userMessage)    // Makes API calls to LLM
init()                                // Initializes app and loads config

// Value Chain Functions
generateValueChain()                  // Main workflow for generating value chains
loadConfigData()                      // Loads predefined industry/function data
displayValueChain()                   // Renders chevrons and use case boxes

// Use Case Interaction
revealUseCase(element)                // Shows hidden use case text
openUseCaseModal(step, useCase)       // Opens chat modal for use case
sendChatMessage()                     // Handles chat interactions

// Data Management
exportConfig()                        // Exports current session as JSON
importConfig(file)                    // Imports saved configuration
showAlert(message, type)              // User feedback system
```

### API Integration

The app uses a custom LLM API endpoint:
- **Authentication**: Bearer token with app identifier
- **Model**: `gpt-4.1-mini`
- **Token Management**: Automatic token retrieval from `/token` endpoint

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd data-generator-app
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server:
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Make changes**
   - Edit `index.html` for UI changes
   - Edit `script.js` for functionality changes
   - No build process required

## 🎯 Use Cases

### Business Strategy & Planning
- **Digital Transformation**: Identify AI opportunities across business processes
- **Innovation Workshops**: Facilitate brainstorming sessions with structured use case exploration
- **Technology Roadmapping**: Plan AI implementation priorities by business function

### Consulting & Advisory
- **Client Assessments**: Quickly demonstrate AI potential in client industries
- **Proposal Development**: Generate specific use cases for project proposals
- **Industry Analysis**: Compare AI opportunities across different sectors

### Training & Education
- **AI Literacy Programs**: Teach business users about practical AI applications
- **Executive Briefings**: Present concrete examples of AI value in specific contexts
- **Workshop Facilitation**: Guide teams through systematic use case identification

### Product & Solution Development
- **Feature Ideation**: Discover new AI-powered features for existing products
- **Market Research**: Understand AI needs in target industries
- **Competitive Analysis**: Map AI capabilities against market opportunities

## 🔧 Customization

### Adding New Industries/Functions
Extend the predefined options by editing `config.json`:

```json
{
  "new-industry": {
    "name": "Your Industry Name",
    "type": "industry",
    "valueChain": ["Step 1", "Step 2", "Step 3", "Step 4"],
    "useCases": {
      "Step 1": ["Use Case 1", "Use Case 2", "Use Case 3"]
    }
  }
}
```

### Customizing LLM Prompts
Modify value chain generation prompts in `script.js`:

```javascript
// Customize the system prompt for value chain generation
const systemPrompt = `You are an expert business analyst...
// Add your specific requirements here`;
```

### Adding New Features

The modular architecture supports easy extensions:

```javascript
// Add new visualization types
function displayKanbanView() { /* ... */ }

// Add new export formats
function exportToPowerPoint() { /* ... */ }

// Add new chat capabilities
function addUseCaseToFavorites() { /* ... */ }
```

## 📊 Value Chain Quality

The AI generates:
- **Industry-Relevant Steps** - Value chains tailored to specific business contexts
- **Logical Flow** - Sequential steps that reflect real business processes
- **Comprehensive Coverage** - 4-8 steps covering end-to-end operations
- **Actionable Use Cases** - 3-6 practical LLM applications per step

## 🔒 Privacy & Security

- **No persistent storage** - All data remains client-side during sessions
- **Secure API calls** - Uses HTTPS and token authentication
- **Local chat sessions** - Conversation history stored in browser memory
- **Export control** - Users control what data is saved via JSON export
- **No tracking** - No analytics or user behavior tracking

## 🐛 Troubleshooting

### Common Issues

**"API token not initialized"**
- Ensure you have proper authentication with the LLM service
- Check browser console for network errors
- Verify the token endpoint is accessible

**"Loading spinner won't disappear"**
- Check browser console for JavaScript errors
- Ensure config.json is properly formatted
- Verify all required DOM elements exist

**"Value chain not displaying"**
- Confirm the industry/function selection was successful
- Check that currentConfig is properly populated
- Verify the displayValueChain function completed

**"Use case modal not opening"**
- Ensure Bootstrap JavaScript is loaded
- Check for JavaScript errors in console
- Verify modal HTML structure is intact

**"Chat not working"**
- Confirm API token is valid and not expired
- Check network connectivity to LLM endpoint
- Verify chat input and send button event listeners

### Browser Compatibility

- **Chrome**: ✅ Fully supported
- **Firefox**: ✅ Fully supported  
- **Safari**: ✅ Fully supported
- **Edge**: ✅ Fully supported

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Support

- **Issues**: Report bugs or request features via GitHub Issues
- **Documentation**: Check this README for comprehensive guidance
- **Community**: Contribute to discussions and improvements

---
