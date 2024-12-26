// GROQ API Configuration
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// File handling configurations
const ALLOWED_FILE_TYPES = {
    'text/plain': 'Text',
    'application/pdf': 'PDF',
    'application/msword': 'Word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
    'image/jpeg': 'Image',
    'image/png': 'Image'
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Disease Cures Object (can be expanded)
const diseaseCures = {
    // Populate with disease information
};

// Initialize file handling elements
function initializeFileHandling() {
    const chatBox = document.getElementById('chat-box');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    fileInput.multiple = true;
    fileInput.accept = Object.keys(ALLOWED_FILE_TYPES).join(',');
    document.body.appendChild(fileInput);

    // Add drag and drop event listeners
    chatBox.addEventListener('dragover', handleDragOver);
    chatBox.addEventListener('drop', handleFileDrop);

    // Handle paperclip button click
    const attachButton = document.querySelector('.action-btn');
    attachButton.addEventListener('click', () => fileInput.click());

    // Handle file selection through input
    fileInput.addEventListener('change', (event) => {
        handleFiles(Array.from(event.target.files));
        fileInput.value = ''; // Reset input
    });
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
}

// Main file processing function
async function handleFiles(files) {
    const validFiles = files.filter(file => {
        if (!ALLOWED_FILE_TYPES[file.type]) {
            addMessageToChat(`Cannot process ${file.name}. Unsupported file type.`, 'bot-message');
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            addMessageToChat(`${file.name} is too large. Maximum size is 10MB.`, 'bot-message');
            return false;
        }
        return true;
    });

    if (validFiles.length === 0) return;

    showTypingIndicator();
    
    for (const file of validFiles) {
        try {
            const content = await readFileContent(file);
            addMessageToChat(`Processing file: ${file.name}`, 'user-message');
            
            const response = await generateBotResponseForFile(content, file.name, file.type);
            addMessageToChat(response, 'bot-message');
        } catch (error) {
            console.error('Error processing file:', error);
            addMessageToChat(`Error processing ${file.name}. Please try again.`, 'bot-message');
        }
    }

    hideTypingIndicator();
}

// File content reader
function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        
        reader.onerror = (error) => {
            reject(error);
        };

        if (ALLOWED_FILE_TYPES[file.type] === 'Image') {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    });
}

// Enhanced generateBotResponse function for text input
async function generateBotResponse(userInput) {
    // First, check local disease cures
    const localResponse = checkLocalCures(userInput);
    if (localResponse) return localResponse;

    // If no local cure found, use GROQ API for a more comprehensive response
    try {
        const apiResponse = await fetchGroqResponse(userInput);
        return apiResponse;
    } catch (error) {
        console.error('Error fetching GROQ response:', error);
        return "I'm experiencing some technical difficulties. Please try again later.";
    }
}

// Modified GROQ API function to handle file content
async function generateBotResponseForFile(content, fileName, fileType) {
    let prompt = '';
    
    if (ALLOWED_FILE_TYPES[fileType] === 'Image') {
        prompt = `Please analyze this image file (${fileName}) and provide insights about any visible health-related information.`;
    } else {
        prompt = `Please analyze the following text content from ${fileName} and provide relevant health-related insights:\n\n${content}`;
    }

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful medical assistant. Analyze the provided file content and provide relevant health-related insights. Always advise consulting healthcare professionals for serious concerns."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 1500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('GROQ API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating response:', error);
        return "I'm sorry, I couldn't analyze this file. Please try again later.";
    }
}

// Helper function to check local disease cures
function checkLocalCures(userInput) {
    const lowerCaseInput = userInput.toLowerCase();
    let response = "";

    for (const disease in diseaseCures) {
        if (diseaseCures.hasOwnProperty(disease)) {
            const regex = new RegExp(`\\b${disease}\\b`, 'i');
            if (regex.test(lowerCaseInput)) {
                const cure = diseaseCures[disease];
                if (cure.startsWith('http://') || cure.startsWith('https://')) {
                    response += convertTextToLink(cure, cure) + " ";
                } else {
                    response += cure + " ";
                }
            }
        }
    }

    return response.trim() || null;
}

// Function to fetch response from GROQ API for text input
async function fetchGroqResponse(userInput) {
    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful medical assistant. Provide clear, concise, and informative responses about health-related queries. Always advise consulting a healthcare professional for serious concerns."
                },
                {
                    role: "user",
                    content: userInput
                }
            ],
            max_tokens: 1500,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        throw new Error('GROQ API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// Modified sendMessage function to handle async bot response
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === "") return;

    addMessageToChat(userInput, 'user-message');
    document.getElementById('user-input').value = '';

    showTypingIndicator();

    try {
        const botResponse = await generateBotResponse(userInput);
        hideTypingIndicator();
        addMessageToChat(botResponse, 'bot-message');
    } catch (error) {
        hideTypingIndicator();
        console.error('Error generating bot response:', error);
        addMessageToChat("I'm sorry, I'm having trouble processing your request right now.", 'bot-message');
    }
}

// Helper functions
function convertTextToLink(text, url) {
    return `<a href="${url}" target="_blank">${text}</a>`;
}

function addMessageToChat(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${className}`;

    if (className === 'bot-message') {
        const avatar = document.createElement('span');
        avatar.className = 'avatar';
        messageDiv.appendChild(avatar);
    }

    const messageContent = document.createElement('span');
    messageContent.innerHTML = message;
    messageDiv.appendChild(messageContent);

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Play sound
    playSound('message-sound.mp3');
}

function showTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
    }
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

function playSound(filename) {
    const audio = new Audio(filename);
    audio.play().catch(error => console.log('Error playing sound:', error));
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function() {
    initializeFileHandling();
    
    // Send button click handler
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }

    // Enter key handler
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Initial greeting
    addMessageToChat("Hello! I'm your AI health assistant powered by Groq. How can I help you today?", 'bot-message');
});