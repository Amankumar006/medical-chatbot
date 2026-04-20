import { analyzeUpload } from './api-client.js';
import { addMessageToChat, showTypingIndicator, hideTypingIndicator } from './ui.js';

const ALLOWED_FILE_TYPES = new Set(['text/plain', 'image/jpeg', 'image/png', 'application/pdf']);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function initializeFileUpload() {
  const chatBox = document.getElementById('chat-box');
  const attachButton = document.querySelector('.action-btn');
  if (!chatBox || !attachButton) return;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = Array.from(ALLOWED_FILE_TYPES).join(',');
  input.style.display = 'none';
  document.body.appendChild(input);

  attachButton.addEventListener('click', () => input.click());

  input.addEventListener('change', async (event) => {
    const files = Array.from(event.target.files || []);
    for (const file of files) {
      if (!ALLOWED_FILE_TYPES.has(file.type)) {
        addMessageToChat(`Unsupported file type: ${file.name}`, 'bot-message');
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        addMessageToChat(`File too large: ${file.name}`, 'bot-message');
        continue;
      }

      showTypingIndicator();
      try {
        const content = await readFile(file);
        const result = await analyzeUpload(content, file.name);
        addMessageToChat(result.answer || 'No analysis response', 'bot-message');
      } catch (error) {
        addMessageToChat(`Upload analysis failed: ${error.message}`, 'bot-message');
      } finally {
        hideTypingIndicator();
      }
    }
  });
}
