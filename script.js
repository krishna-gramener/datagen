let token = null;

async function callLLM(systemPrompt, userMessage) {
  try {
    const response = await fetch("https://llmfoundry.straive.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}:data-generator-app`,
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
    // Get API token
    const response = await fetch("https://llmfoundry.straive.com/token", { credentials: "include" });
    const data = await response.json();
    token = data.token;
  } catch (error) {
    console.error('Initialization error:', error);
    alert('Failed to initialize application: ' + error.message);
  }
}

// Global variable to store CSV data
let csvData = '';

function initializeEventListeners() {
    document.getElementById('generateBtn').addEventListener('click', generateData);
    document.getElementById('downloadBtn').addEventListener('click', downloadCSV);
    
    // Auto-save inputs
    ['systemPrompt', 'rowHeaders', 'columnHeaders'].forEach(id => {
        document.getElementById(id).addEventListener('input', saveInputs);
    });
}

function saveInputs() {
    const inputs = {
        systemPrompt: document.getElementById('systemPrompt').value,
        rowHeaders: document.getElementById('rowHeaders').value,
        columnHeaders: document.getElementById('columnHeaders').value
    };
    localStorage.setItem('dataGeneratorInputs', JSON.stringify(inputs));
}

function loadSavedData() {
    const saved = localStorage.getItem('dataGeneratorInputs');
    if (saved) {
        const inputs = JSON.parse(saved);
        document.getElementById('systemPrompt').value = inputs.systemPrompt || document.getElementById('systemPrompt').value;
        document.getElementById('rowHeaders').value = inputs.rowHeaders || '';
        document.getElementById('columnHeaders').value = inputs.columnHeaders || '';
    }
}

function validateInputs() {
    const rowHeaders = document.getElementById('rowHeaders').value.trim();
    const columnHeaders = document.getElementById('columnHeaders').value.trim();

    if (!rowHeaders) {
        showAlert('Please enter row headers', 'warning');
        return false;
    }

    if (!columnHeaders) {
        showAlert('Please enter column headers', 'warning');
        return false;
    }

    if (!token) {
        showAlert('API token not initialized', 'warning');
        return false;
    }

    return true;
}

async function generateData() {
    if (!validateInputs()) return;

    const generateBtn = document.getElementById('generateBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    // Show loading state
    generateBtn.disabled = true;
    loadingIndicator.style.display = 'block';

    try {
        const systemPrompt = document.getElementById('systemPrompt').value;
        const rowHeadersInput = document.getElementById('rowHeaders').value.trim();
        const columnHeadersInput = document.getElementById('columnHeaders').value.trim();

        const userMessage = buildUserMessage(rowHeadersInput, columnHeadersInput);
        
        const csvContent = await callLLM(systemPrompt, userMessage);
        
        // Clean up the CSV content (remove code blocks if present)
        csvData = csvContent.replace(/```csv\n?/g, '').replace(/```\n?/g, '').trim();
        
        displayPreview(csvData);
        document.getElementById('downloadBtn').disabled = false;
        showAlert('Data generated successfully!', 'success');

    } catch (error) {
        showAlert(`Error: ${error.message}`, 'danger');
    } finally {
        generateBtn.disabled = false;
        loadingIndicator.style.display = 'none';
    }
}

function buildUserMessage(rowHeadersInput, columnHeadersInput) {
    // Check if input looks like specific headers (multiple lines) or description (single concept)
    const rowLines = rowHeadersInput.split('\n').filter(h => h.trim());
    const columnLines = columnHeadersInput.split('\n').filter(h => h.trim());
    
    const isRowSpecific = rowLines.length > 1 || rowLines[0]?.includes(',');
    const isColumnSpecific = columnLines.length > 1 || columnLines[0]?.includes(',');
    
    let message = '';
    
    if (isRowSpecific) {
        message += `Row Headers (use these exactly): ${rowLines.join(', ')}\n`;
    } else {
        message += `Row Requirements: ${rowHeadersInput}\n`;
    }
    
    if (isColumnSpecific) {
        message += `Column Headers (use these exactly): ${columnLines.join(', ')}\n`;
    } else {
        message += `Column Requirements: ${columnHeadersInput}\n`;
    }
    
    message += `\nGenerate a CSV with appropriate headers and realistic data. If specific headers were provided, use them exactly. If requirements were given, create suitable headers that fulfill those requirements. The first row should contain the column headers, followed by data rows.`;
    
    return message;
}



function displayPreview(data) {
    const previewDiv = document.getElementById('csvPreview');
    
    try {
        const rows = data.split('\n').filter(row => row.trim());
        
        if (rows.length === 0) {
            previewDiv.innerHTML = '<p class="text-muted">No data to display</p>';
            return;
        }

        let tableHTML = '<div class="table-responsive"><table class="table table-striped table-hover">';
        
        rows.forEach((row, index) => {
            const cells = parseCSVRow(row);
            
            if (index === 0) {
                // Header row
                tableHTML += '<thead class="table-dark"><tr>';
                cells.forEach(cell => {
                    tableHTML += `<th scope="col">${escapeHtml(cell)}</th>`;
                });
                tableHTML += '</tr></thead><tbody>';
            } else {
                // Data rows
                tableHTML += '<tr>';
                cells.forEach(cell => {
                    tableHTML += `<td>${escapeHtml(cell)}</td>`;
                });
                tableHTML += '</tr>';
            }
        });
        
        tableHTML += '</tbody></table></div>';
        previewDiv.innerHTML = tableHTML;

    } catch (error) {
        previewDiv.innerHTML = `<div class="alert alert-warning">
            <strong>Preview Error:</strong> Could not parse CSV data properly. You can still download the raw data.
            <details class="mt-2">
                <summary>Raw Data</summary>
                <pre class="mt-2">${escapeHtml(data)}</pre>
            </details>
        </div>`;
    }
}

function parseCSVRow(row) {
    const cells = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        
        if (char === '"') {
            if (inQuotes && row[i + 1] === '"') {
                current += '"';
                i++; // Skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            cells.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    cells.push(current.trim());
    return cells;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function downloadCSV() {
    if (!csvData) {
        showAlert('No data to download', 'warning');
        return;
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `generated_data_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showAlert('CSV file downloaded successfully!', 'success');
    } else {
        showAlert('Download not supported in this browser', 'danger');
    }
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert-custom');
    existingAlerts.forEach(alert => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show alert-custom`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    await init();
    initializeEventListeners();
});

// Add some example data on page load for demonstration
window.addEventListener('load', () => {
    const rowHeaders = document.getElementById('rowHeaders');
    const columnHeaders = document.getElementById('columnHeaders');
    
    if (!rowHeaders.value) {
        rowHeaders.value = `Product A
Product B
Product C
Product D
Product E`;
    }
    
    if (!columnHeaders.value) {
        columnHeaders.value = `Category
Price
Rating
Stock Quantity
`;
    }
});
