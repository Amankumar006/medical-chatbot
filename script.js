// GROQ API Configuration
const GROQ_API_KEY = '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'; // Replace with your actual API key
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Disease Cures Object (can be expanded)
const diseaseCures = {
    // You can populate this with more diseases and their information
};

// Enhanced generateBotResponse function to use GROQ API
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

// Function to fetch response from GROQ API
async function fetchGroqResponse(userInput) {
    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "llama3-8b-8192", // You can change this to other available models
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
    console.log('User Input:', userInput);
    if (userInput.trim() === "") return;

    addMessageToChat(userInput, 'user-message');
    document.getElementById('user-input').value = '';

    // Show typing indicator
    showTypingIndicator();
    console.log('Typing Indicator Shown');

    try {
        // Await the bot response
        const botResponse = await generateBotResponse(userInput);
        hideTypingIndicator();
        console.log('Bot Response:', botResponse);
        addMessageToChat(botResponse, 'bot-message');
    } catch (error) {
        hideTypingIndicator();
        console.error('Error generating bot response:', error);
        addMessageToChat("I'm sorry, I'm having trouble processing your request right now.", 'bot-message');
    }
}

// Existing helper functions remain the same
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

    // Play sound (Optional)
    if (className === 'user-message' || className === 'bot-message') {
        playSound('message-sound.mp3');
    }
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
    audio.play();
}

// Event listener setup
document.addEventListener("DOMContentLoaded", function () {
    // Existing appointment slide functionality (unchanged)
    const openSlide = document.getElementById('openSlide');
    const closeSlide = document.getElementById('closeSlide');
    const appointmentSlide = document.getElementById('appointmentSlide');
    const appointmentForm = document.getElementById('appointmentForm');
    const appointmentList = document.getElementById('appointmentList');

    // [Rest of the existing DOM event listeners remain the same]
});

// Event listener for the "Enter" key to send a message
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initial greeting from the bot when the page loads
window.onload = function() {
    addMessageToChat("Hello! I'm your AI health assistant powered by Groq. How can I help you today?", 'bot-message');
};