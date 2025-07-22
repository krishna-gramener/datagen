# DataGen

A simple, powerful web application that generates structured CSV data using AI. Perfect for creating sample datasets, testing data, or generating realistic data for your projects.

## 🚀 Features

- **AI-Powered Data Generation** - Uses advanced language models to create realistic, structured data
- **Flexible Input Options** - Provide specific headers OR describe what you want
- **Live Preview** - See your generated data in a formatted table before downloading
- **CSV Export** - Download your data as a properly formatted CSV file
- **Clean Interface** - Simple, intuitive design built with Bootstrap
- **No Setup Required** - Just open and use in any modern web browser

## 📋 Quick Start

### For Users

1. **Open the App**
   - Simply open `index.html` in your web browser
   - No installation or setup required

2. **Configure Your Data**
   - **System Prompt**: Customize how the AI generates data (optional)
   - **Row Headers**: Enter specific product names OR describe what rows you want
   - **Column Headers**: Enter specific column names OR describe what data you need

3. **Generate & Download**
   - Click "Generate Data" to create your CSV
   - Preview the results in the table
   - Click "Download CSV" to save the file

### Example Usage

**Specific Headers:**
```
Row Headers:
iPhone 15
Samsung Galaxy S24
Google Pixel 8

Column Headers:
Category
Price
Rating
Storage
```

**Descriptive Input:**
```
Row Headers:
5 popular smartphone models from 2023

Column Headers:
Product specifications including pricing and technical details
```

## 🛠️ For Developers

### Project Structure

```
data-generator-app/
├── index.html          # Main HTML interface
├── script.js           # JavaScript functionality
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

### Technical Details

- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Styling**: Bootstrap 5.3.0
- **API**: Custom LLM endpoint (llmfoundry.straive.com)
- **Model**: GPT-4.1-mini
- **Authentication**: Token-based with credentials

### Key Functions

```javascript
// Core API functions
callLLM(systemPrompt, userMessage)    // Makes API calls to LLM
init()                                // Initializes token authentication

// UI Functions
generateData()                        // Main data generation workflow
displayPreview(data)                  // Shows CSV in table format
downloadCSV()                         // Handles file download
buildUserMessage()                    // Constructs prompts for LLM
```

### API Integration

The app uses a custom LLM API endpoint:
- **Endpoint**: `https://llmfoundry.straive.com/openai/v1/chat/completions`
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

### Business & Marketing
- Generate sample customer data
- Create product catalogs
- Build test datasets for analytics

### Development & Testing
- Generate test data for applications
- Create mock APIs responses
- Build sample databases

### Research & Education
- Create datasets for analysis
- Generate examples for tutorials
- Build sample data for presentations

## 🔧 Customization

### System Prompts
Modify the default system prompt to change how data is generated:

```javascript
// Example custom prompts:
"Generate financial data with realistic market trends"
"Create educational content with proper academic formatting"
"Generate e-commerce data with seasonal variations"
```

### Adding New Features

The modular function-based architecture makes it easy to extend:

```javascript
// Add new validation
function validateCustomInput() { /* ... */ }

// Add new export formats
function downloadJSON() { /* ... */ }

// Add new data processing
function processSpecialFormat(data) { /* ... */ }
```

## 📊 Data Quality

The AI generates:
- **Realistic values** based on context
- **Consistent formatting** across rows
- **Logical relationships** between columns
- **Diverse data** to avoid repetition

## 🔒 Privacy & Security

- **No data storage** - All processing happens client-side
- **Secure API calls** - Uses HTTPS and token authentication
- **Local processing** - CSV generation and preview happen in browser
- **No tracking** - No analytics or user tracking

## 🐛 Troubleshooting

### Common Issues

**"API token not initialized"**
- Ensure you have proper authentication with the LLM service
- Check browser console for network errors

**"No data to download"**
- Make sure data generation completed successfully
- Check that both row and column headers are provided

**Preview not showing**
- Verify the generated CSV format is valid
- Check browser console for parsing errors

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

**Made with ❤️ for developers and data enthusiasts**
