import { handleSendMessage } from './chat-controller.js';
import { addMessageToChat } from './ui.js';
import { initializeFileUpload } from './file-upload.js';

document.addEventListener('DOMContentLoaded', () => {
  const sendButton = document.getElementById('send-button');
  const userInput = document.getElementById('user-input');

  sendButton?.addEventListener('click', handleSendMessage);
  userInput?.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') handleSendMessage();
  });

  initializeFileUpload();
  addMessageToChat('Hello! Ask your health question. I provide cautious guidance with source-backed context.', 'bot-message');
});
